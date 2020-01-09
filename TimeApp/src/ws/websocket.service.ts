import {SockJS} from 'sockjs-client';
import Stomp, {Message, StompSubscription} from "@stomp/stompjs";
import {DispatchService} from "./dispatch.service";
import {Injectable, NgModule} from "@angular/core";
import {UserConfig} from "../service/config/user.config";
import * as moment from "moment";
import {RestFulConfig} from "../service/config/restful.config";
import {EmitService} from "../service/util-service/emit.service";
import {UtilService} from "../service/util-service/util.service";
import {AsyncQueue} from "../util/asyncQueue";
import {NotificationsService} from "../service/cordova/notifications.service";
import {TimeOutService} from "../util/timeOutService";

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
  backgroundqueue:AsyncQueue;
  workqueue:AsyncQueue;
  speechqueue:AsyncQueue;
  backgrounds:number = 0;
  works:number = 0;
  speeches:number = 0;
  private disconnecttime: number = 0;

  constructor(private dispatchService: DispatchService, private util: UtilService, private emitService: EmitService, private config: RestFulConfig,
              private timeOutService: TimeOutService,) {

    this.backgroundqueue = new AsyncQueue(({message,index,err},callback) =>{
      console.log("当前任务=====backgroundqueue  process queue:" + this.workqueue.length());
      this.dispatchService.dispatch(message).then(data=>{
        callback();
      }).catch(data=>{
        callback(data);
      })
    },1,1,"background.queue",this.util,this.timeOutService);

    this.workqueue = new AsyncQueue(({message,index,err},callback) =>{
      console.log("当前任务=====workqueue  process queue:" + this.workqueue.length());
      // this.util.toastStart("有一条消息, 处理中", 1000);
      this.util.tellyou("当前在workqueue中还有" + this.workqueue.length() + "个任务没有完成");
      this.dispatchService.dispatch(message).then(data=>{
        callback();
      }).catch(data=>{
        // console.log(data);
        callback(data);
      })
    },1,1,"worker.queue",this.util,this.timeOutService);



    this.speechqueue =  new AsyncQueue( ({message,index,err},callback) =>{
      // console.log("当前任务=====speechqueue  process queue:" + this.workqueue.length());
      this.dispatchService.dispatch(message).then(data=>{
        callback();
      }).catch(data=>{
        callback([data]);
      })
    },1,1,"speech.queue",this.util,this.timeOutService);

  }

  pushMessage(event:any){
    try {
      if (event && event.body) {
        let message:string = event.body;
        let preload = JSON.parse(message);
        let header = preload.header || {};
        let sender = header.sender || "";
        // console.log("******************ws  recv queue:" + message);

        if (sender == "xunfei/aiui") {
          this.speechqueue.push({message:message,index:this.speeches++},(err)=>{
            if (err) {
              // console.log("speech queue process error happenned. ", err, '\r\n', err.stack);
            }
          });
        } else if (sender == "mwxing/datadiff") {
          this.backgroundqueue.push({message:message,index:this.backgrounds++},(err)=>{
            if (err) {
              // console.log("background queue process error happenned. ", err, '\r\n', err.stack);
            }
          });
        } else {
          this.workqueue.push({message:event.body,index:this.works++},(err)=>{
            if (err) {
              // console.log("work queue process error happenned. ", err, '\r\n', err.stack);
            }
          });
        }
      }
    } catch (e) {
      // message异常时捕获并不让程序崩溃
      // console.log("work queue push error : ", e, '\r\n', e.stack);
    }
  }




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

      // 本地发送处理消息
      this.emitService.register('local.message.received', (event) => {
       this.pushMessage(event);
     }, true);

      // 延迟重连动作,防止重连死循环
      if (this.util.isMobile()) {
        this.emitService.register('rabbitmq.message.received', (event) => {
         this.pushMessage(event);
        });

        setTimeout(() => {
          this.emitService.emit("on.websocket.connected");
        }, 5000);

        resolve();
      } else {
        // 真机使用cordova.rabbitmq替代
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
                this.pushMessage(message);
              });

              //解决RabbitMQ同一个Queue队列在前一个断开的连接没有检测到断开信号时仍然保持着连接，
              //导致推送的消息被前一个连接接收，无法分配到最新的连接，导致客户端接收不到消息
              //解决方案，在新的连接创建之后，等待服务器心跳时间之后，发送通知WebSocket连接成功消息
              let waittime = 0;

              if (this.disconnecttime) {
                let passedtime = (moment().unix() - this.disconnecttime) * 1000;

                if (passedtime < this.client.heartbeat.outgoing) {
                  waittime = this.client.heartbeat.outgoing - passedtime;
                }
              }

              setTimeout(() => {
                this.emitService.emit("on.websocket.connected");
              }, waittime);

            }, error => {
              this.connections--;
              this.failedtimes++;
              this.disconnecttime = moment().unix();
              this.close();
            }, event => {
              // console.log('Stomp websocket closed with code ' + event.code + ', reason ' + event.reason);
              this.connections--;
              this.disconnecttime = moment().unix();
              this.close();
            }, '/');

          });
        }, delay);
      }
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
