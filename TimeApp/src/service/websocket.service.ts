import { Injectable, ViewChild } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";
import { AppConfig } from "../app/app.config";
import { ParamsService } from "./params.service";
import { Subject } from "rxjs/Subject";
import {NavController, App,AlertController} from "ionic-angular";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";
import {HttpClient} from "@angular/common/http";
import {FindOutModel} from "../model/out/find.out.model";

/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  groupFind:FindOutModel;
  constructor(public appCtrl : App,
              public alertCtrl: AlertController,
              private http: HttpClient,
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
      let returningData = JSON.parse(data.body)
      // console.log(data.body);
      // this.paramsService.schedule = JSON.parse(data.body);
      // console.log( this.paramsService.schedule);
      // if (this.paramsService.schedule.code == 0) {
      //   alert("收到消息" + this.paramsService.schedule.scheduleName);
      //   this.xiaojiSpeech.speakText(this.paramsService.schedule.scheduleName);
      //   let activeNav: NavController = this.appCtrl.getActiveNav();
      //   activeNav.push('UserMessagePage');
      // } else if (this.paramsService.schedule.code == 1) {
      //   alert("收到消息" + this.paramsService.schedule.scheduleName);
      //   this.xiaojiSpeech.speakText(this.paramsService.schedule.scheduleName);
      // } else if (this.paramsService.schedule.code == -1) {
      //
      // }


      if(returningData.code == 0){
        //接收成功
        let successData = returningData.data
        this.showConfirm(successData);
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
      title: successData.messageName,
      message: successData.messageMaster+''+successData.messageContent,
      buttons: [
        {
          text: '接受',
          handler: () => {
            console.log('接受了');
            //此处填写调用方法
            if (successData.type == 1) {
              //调用日程方法
            }else {
              //调用群组方法
              // this.invite(successData.messageId);
            }
          }
        },
        {
          text: '取消',
          handler: () => {
            console.log('没接受');
          }
        }
      ]
    });
    confirm.present();
  }

  //调用修改群成员状态接口
  // invite(messageId){
  //   this.http.post(AppConfig.GROUP_UPD_MEMBER_STATUS_URL,{
  //     userId:this.groupFind.userId,
  //     groupId:messageId,
  //   }).subscribe(data => {
  //
  //         let subdata = data;
  //         let loader = this.loadingCtrl.create({
  //           content: subdata.message,
  //           duration: 1500
  //         });
  //         if (subdata.code == "0") {
  //           loader.present();
  //           // this.navCtrl.push('HomePage');
  //         } else {
  //           loader.present();
  //         }
  //
  //     })
  // }

}
