import {SockJS} from 'sockjs-client';
import Stomp, {Message, StompSubscription} from "@stomp/stompjs";
import {DispatchService} from "./dispatch.service";
import {Injectable, NgModule} from "@angular/core";
import {UserConfig} from "../service/config/user.config";


/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
@NgModule()
export class WebsocketService {
  RABBITMQ_WS_URL: string = "wss://www.guobaa.com/ws";

  //登陆账户
  private login: string;
  private password: string;
  private client: Stomp.Client;
  private queue: string;
  private subscription: StompSubscription;
  private failedtimes: number = 0;

  constructor(private dispatchService: DispatchService) {
  }


  private settingWs(): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      this.login = "gtd_mq";
      this.password = "gtd_mq";
      //获取websocte 链接
      this.client = Stomp.client(this.RABBITMQ_WS_URL);
      this.client.reconnect_delay = 1000;

      //获取websocte  queue
      this.queue = UserConfig.account.mq;
      //呼吸
      this.client.heartbeat.outgoing = 1000 * 5;
      this.client.heartbeat.incoming = 1000 * 60;

      resolve();
    })
  }

  /**
   * 监听消息队列
   */
  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let delay = 1000 * ((this.failedtimes > 59 ? 59 : this.failedtimes) + 1);
      
      // 延迟重连动作,防止重连死循环
      setTimeout(()=>{
        this.settingWs().then(data => {
          // 连接消息服务器
          this.client.connect(this.login, this.password, frame => {
            this.failedtimes = 0;
            resolve();
            this.subscription = this.client.subscribe("/queue/" + this.queue, (message: Message) => {
              //message.ack(message.headers);
              this.dispatchService.dispatch(message.body).then(data => {
              })
            });
          }, error => {
            this.failedtimes++;
            this.close();
          }, event => {
            this.close();
          }, '/');

        });
      }, delay);
    })

  }

  public close() {
    // 连接消息服务器
    if (this.client.connected)
    this.client.disconnect(() => {
      this.connect();
    }, {
      login: this.login,
      passcode: this.password
    });
    else
      this.connect();
  }

}
