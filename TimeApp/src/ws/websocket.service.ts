import {SockJS} from 'sockjs-client';
import Stomp, {Message, StompSubscription} from "@stomp/stompjs";
import {DispatchService} from "./dispatch.service";
import {Injectable, NgModule} from "@angular/core";
import {UserConfig} from "../service/config/user.config";
import * as async from "async/dist/async.js"
import {RestFulConfig} from "../service/config/restful.config";
import {EmitService} from "../service/util-service/emit.service";

/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
@NgModule()
export class WebsocketService {
  // RABBITMQ_WS_URL: string = "wss://www.guobaa.com/ws";
  RABBITMQ_WS_URL: string = "";
  //登陆账户
  private login: string;
  private password: string;
  private client: Stomp.Client;
  private queue: string;
  private subscription: StompSubscription;
  private failedtimes: number = 0;
  private timer: any;
  private connections: number = 0;
  workqueue:any;
  message:number;

  constructor(private dispatchService: DispatchService, private emitService: EmitService, private config: RestFulConfig) {

    this.workqueue = async.queue( ({message,index},callback) =>{
      console.log("******************ws  queue:");
      this.dispatchService.dispatch(message).then(data=>{
        callback();
      }).catch(data=>{
        console.log(data);
        callback();
      })
    });
    this.messages = 0;
  }

  messages:number = 0;



  private settingWs(): Promise<any> {

    return new Promise<any>((resolve, reject) => {

      this.login = "gtd_mq";
      this.password = "gtd_mq";
      //获取webSocket连接地址
      this.RABBITMQ_WS_URL = this.config.getRestFulUrl("WSA").url;
      //获取websocte 链接
      this.client = Stomp.client(this.RABBITMQ_WS_URL);
      this.client.reconnect_delay = 1000;

      //获取websocte  queue
      this.queue = UserConfig.account.mq;
      //呼吸
      this.client.heartbeat.outgoing = 1000 * 30;
      this.client.heartbeat.incoming = 1000 * 60 * 5;

      resolve();
    })
  }

  /**
   * 监听消息队列
   */
  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let delay = 1000 * Math.pow(2, this.failedtimes);

      // 最长等待5分钟再连接
      delay = (delay > 1000 * 60 * 5) ? (1000 * 60 * 5) : delay;

      if (this.timer) clearTimeout(this.timer);

      // 延迟重连动作,防止重连死循环
      this.timer = setTimeout(()=>{
        this.settingWs().then(data => {
          // 连接消息服务器
          this.client.connect(this.login, this.password, frame => {

            // 连接成功,取消所有重连请求
            if (this.timer) clearTimeout(this.timer);
            this.connections++;
            this.failedtimes = 0;
            resolve();
            this.subscription = this.client.subscribe("/queue/" + this.queue, (message: Message) => {
              //message.ack(message.headers);
              console.log('Received a message from ' + this.queue);
              try {
                this.workqueue.push({message:message.body,index:this.messages++},(err)=>{
                  if (err) {
                    console.log("work queue process error happenned. ", err, '\r\n', err.stack);
                    this.workqueue.kill();
                    this.messages = 0;
                  } else {
                    if (this.messages >9999) this.messages = 0;
                  }
                });
              } catch (e) {
                // message异常时捕获并不让程序崩溃
                console.log("work queue push error : ", e, '\r\n', e.stack);
              }
            });

            this.emitService.emit("on.websocket.connected");

          }, error => {
            this.connections--;
            this.failedtimes++;
            this.close();
          }, event => {
            console.log('Stomp websocket closed with code ' + event.code + ', reason ' + event.reason);
            this.connections--;
            this.close();
          }, '/');

        });
      }, delay);
    })

  }

  public close() {
    // 连接消息服务器
    if (this.client.connected) {
      this.client.disconnect(() => {
        this.emitService.emit("on.websocket.closed");
        this.connect();
      }, {
        login: this.login,
        passcode: this.password
      });
    } else {
      this.emitService.emit("on.websocket.closed");
      this.connect();
    }
  }

}
