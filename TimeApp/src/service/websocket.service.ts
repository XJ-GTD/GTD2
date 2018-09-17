import { Injectable, ViewChild } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";
import { AppConfig } from "../app/app.config";
import { ParamsService } from "./params.service";
import { Subject } from "rxjs/Subject";
import {NavController, App, AlertController, LoadingController} from "ionic-angular";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";
import {HttpClient} from "@angular/common/http";
import {FindOutModel} from "../model/out/find.out.model";
import {BaseModel} from "../model/base.model";
import {MqOutModel} from "../model/out/mq.out.model";

/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  groupFind:FindOutModel;
  mqData: BaseModel;  //接收mq数据
  mqPushData: MqOutModel; //入参数据

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
      console.log("MQ:" + data.body);
      this.mqData = JSON.parse(data.body)
      console.log("JSON MQ:" + this.mqData);
      if (this.mqData.code == 0) {

        this.xiaojiSpeech.speakText(this.mqData.data.speech);
        this.showConfirm(this.mqData);
      } else if (this.mqData.code == 1) {
        console.log("收到消息" + this.mqData.message);
        this.xiaojiSpeech.speakText(this.mqData.data.speech);
      } else if (this.mqData.code == -1) {

      }


    });

    //连接失败回调
    let on_error = function() {
      console.log('error!:' + ws.readyState);
      client = Stomp.over(new WebSocket(AppConfig.RABBITMQ_WS_URL));
      client.connect(login, password, on_connect, on_error, null,'/');
    }

    //关闭回调
    // let on_close = function() {
    //
    // }

    // 连接消息服务器
    client.connect(login, password, on_connect, on_error, null,'/');

  }

  //弹出消息框
  showConfirm(successData) {

    const confirm = this.alertCtrl.create({
      title: successData.messageName,   //推送群组名称
      message: successData.messageMaster+''+successData.messageContent,   //群主名称+推送内容
      buttons: [
        {
          text: '接受',
          handler: () => {
            console.log('接受');
            //此处填写调用方法
            if (successData.type == 1) {
              //调用日程方法
            }else {
              //调用群组方法
              this.invite(successData.messageId);
            }
          }
        },
        {
          text: '拒绝',
          handler: () => {
            console.log('拒绝');

          }
        }
      ]
    });
    confirm.present();
  }

  //

  //调用修改群成员状态接口
  invite(messageId){
    this.http.post(AppConfig.GROUP_UPD_MEMBER_STATUS_URL,{
      userId:this.groupFind.userId,
      groupId:messageId,
    }).subscribe(data => {
      let subData:any;
      subData = data;
      let loader = this.loadingCtrl.create({
        content: subData.message,
        duration: 1500
      });
      if (subData.code == "0") {
        loader.present();
        // this.navCtrl.push('HomePage');
      } else {
        loader.present();
      }
    })
  }

}
