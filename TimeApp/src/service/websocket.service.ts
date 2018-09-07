import { Injectable, ViewChild } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";
import { AppConfig } from "../app/app.config";
import { ParamsService } from "./params.service";
import { Subject } from "rxjs/Subject";
import { NavController, App } from "ionic-angular";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";

/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  constructor(public appCtrl : App,
              private xiaojiSpeech: XiaojiAssistantService,
              private paramsService?: ParamsService){

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
      console.log(data.body);
      this.paramsService.schedule = JSON.parse(data.body);
      console.log( this.paramsService.schedule);
      if (this.paramsService.schedule.code == 0) {
        alert("收到消息" + this.paramsService.schedule.scheduleName);
        this.xiaojiSpeech.speakText(this.paramsService.schedule.scheduleName);
        let activeNav: NavController = this.appCtrl.getActiveNav();
        activeNav.push('UserMessagePage');
      } else if (this.paramsService.schedule.code == 1) {
        alert("收到消息" + this.paramsService.schedule.scheduleName);
        this.xiaojiSpeech.speakText(this.paramsService.schedule.scheduleName);
      } else if (this.paramsService.schedule.code == -1) {

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

}
