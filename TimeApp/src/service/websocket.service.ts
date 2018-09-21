import { Injectable } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";
import { AppConfig } from "../app/app.config";
import { ParamsService } from "./params.service";
import { Subject } from "rxjs/Subject";
import { App, AlertController, LoadingController} from "ionic-angular";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";
import { HttpClient } from "@angular/common/http";
import { FindOutModel } from "../model/out/find.out.model";
import { MqOutModel } from "../model/out/mq.out.model";
import { MessageModel } from "../model/message.model";

/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  data: any;
  groupFind:FindOutModel;
  mqData: MqOutModel;  //接收mq数据
  mqPushData: MqOutModel; //入参数据
  messageBack: MessageModel;

  constructor(public appCtrl : App,
              public alertCtrl: AlertController,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private xiaojiSpeech: XiaojiAssistantService,
              private paramsService?: ParamsService){
    this.init();
  }

  init(){
    this.groupFind = new FindOutModel();
    this.groupFind.userId = this.paramsService.user.userId;
    this.messageBack = new MessageModel();
    this.mqData = new MqOutModel();
  }

  /**
   * 监听消息队列
   */
  public connect(queueName: string) {

    let ws = new WebSocket(AppConfig.RABBITMQ_WS_URL);

    //建立连接
    let client = Stomp.over(ws);

    //呼吸
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;

    //登陆账户
    const login = "admin";
    const password = "admin";

    //创建观察者
    let subject = new Subject<any>();

    // 连接成功回调 on_connect
    let on_connect = function(x) {
      console.log(client);
      client.subscribe("/queue/" + queueName, function(data) {
        console.log("on_connect回调成功:" + data);

        subject.next(data); //能够在let变量方法内使用this方法

      });
    };

    //对成功回调数据进行操作,放入全局变量中
    subject.asObservable().subscribe( data=> {
      console.log("MQ:" + data.toString());
      this.mqData = JSON.parse(data.body);
      console.log("JSON MQ:" + this.mqData);

      //新消息提示
      let alert = this.alertCtrl.create();
      alert.setTitle(this.mqData.messageName);
      alert.setMessage(this.mqData.userName + this.mqData.messageContent);
      if (this.mqData.type == 1) {
        alert.addButton({
          text: '接受',
          handler: (() => {
            console.log('接受日程邀请');
            this.messageBack.playersStatus = 1;
            this.messageBack.scheduleId = this.mqData.messageId;
            this.messageBack.userId = this.paramsService.user.userId;

            this.http.post(AppConfig.SCHEDULE_CHOOSE_URL, this.messageBack, {
              headers: {
                "Content-Type": "application/json"
              },
              responseType: 'json'
            })
              .subscribe(data => {
                console.log("choose data：" + data);
                this.data = data;
                let loader = this.loadingCtrl.create({
                  content: this.data.message,
                  duration: 1000
                });
                if (this.data.code != 0) {
                  loader.present();
                }
              })
          })
        });
        alert.addButton({
          text: '拒绝',
          handler: (() => {
            console.log('拒绝日程邀请');
            this.messageBack.playersStatus = -1;
            this.messageBack.scheduleId = this.mqData.messageId;
            this.messageBack.userId = this.paramsService.user.userId;

            this.http.post(AppConfig.SCHEDULE_CHOOSE_URL, this.messageBack, {
              headers: {
                "Content-Type": "application/json"
              },
              responseType: 'json'
            })
              .subscribe(data => {
                console.log("choose data：" + data);
                this.data = data;
                let loader = this.loadingCtrl.create({
                  content: this.data.message,
                  duration: 1000
                });
                if (this.data.code != 0) {
                  loader.present();
                }
              })
          })
        });
      } else if (this.mqData.type == 2) {
        alert.addButton({
          text: '接受',
          handler: (() => {
            console.log('接受日程邀请');
            this.messageBack.resultType = 1;
            this.messageBack.groupId = this.mqData.messageId;
            this.messageBack.userId = this.paramsService.user.userId;

            this.http.post(AppConfig.GROUP_UPD_MEMBER_STATUS_URL, this.messageBack, {
              headers: {
                "Content-Type": "application/json"
              },
              responseType: 'json'
            })
              .subscribe(data => {
                console.log("choose data：" + data);
                this.data = data;
                let loader = this.loadingCtrl.create({
                  content: this.data.message,
                  duration: 1000
                });
                if (this.data.code != 0) {
                  loader.present();
                }
              })
          })
        });
        alert.addButton({
          text: '拒绝',
          handler: (() => {
            console.log('拒绝日程邀请');
            this.messageBack.resultType = 3;
            this.messageBack.groupId = this.mqData.messageId;
            this.messageBack.userId = this.paramsService.user.userId;

            this.http.post(AppConfig.GROUP_UPD_MEMBER_STATUS_URL, this.messageBack, {
              headers: {
                "Content-Type": "application/json"
              },
              responseType: 'json'
            })
              .subscribe(data => {
                console.log("choose data：" + data);
                this.data = data;
                let loader = this.loadingCtrl.create({
                  content: this.data.message,
                  duration: 1000
                });
                if (this.data.code != 0) {
                  loader.present();
                }
              })
          })
        });
      } else if (this.mqData.type == 3) {
        alert.addButton({
          text: '确认'
        });
      }

      alert.present();

    });

    //连接失败回调
    let on_error = function() {
      console.log('socket error!:' + ws.readyState);
      client = Stomp.over(new WebSocket(AppConfig.RABBITMQ_WS_URL));
      client.connect(login, password, on_connect, on_error, null,'/');
    }

    //关闭回调
    let on_close = function() {
      console.log('socket close!');
    }

    // 连接消息服务器
    client.connect(login, password, on_connect, on_error, null,'/');

  }


}
