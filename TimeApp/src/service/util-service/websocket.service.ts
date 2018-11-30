import { Injectable } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";

import { ParamsService } from "./params.service";
import { Subject } from "rxjs/Subject";
import { App, AlertController, LoadingController} from "ionic-angular";
import { XiaojiAssistantService } from "./xiaoji-assistant.service";
import { HttpClient } from "@angular/common/http";
import {FindOutModel} from "../../model/out/find.out.model";
import {UserService} from "../user.service";
import {MqOutModel} from "../../model/out/mq.out.model";
import {MessageModel} from "../../model/message.model";
import {UEntity} from "../../entity/u.entity";
import {AppConfig} from "../../app/app.config";
import {WsModel} from "../../model/ws.model";
import {SkillConfig} from "../../app/skill.config";


/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  constructor(public loadingCtrl: LoadingController){
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
    const login = "gtd_mq";
    const password = "gtd_mq";

    //创建观察者
    let subject = new Subject<any>();

    // 连接成功回调 on_connect
    let on_connect = function(x) {
      console.log(client);
      client.subscribe("/queue/" + "616818.0952634651", function(data) {
        console.log("on_connect回调成功:" + data);

        subject.next(data); //能够在let变量方法内使用this方法

      });
    };

    //对成功回调数据进行操作,放入全局变量中
    subject.asObservable().subscribe( data=> {
      let ws = new WsModel();
      ws = JSON.parse(data.body);
      console.log("JSON MQ:" + ws);

      if (ws.vs == "1.0" && ws.ss == 0) {


        switch (ws.sk) {
          case SkillConfig.XF_NMT:
            break;
          case SkillConfig.XF_NMC:
            break;
          case SkillConfig.XF_SCC:
            break;
          case SkillConfig.XF_SCD:
            break;
          case SkillConfig.XF_SCF:
            break;
          case SkillConfig.XF_PEC:
            break;
          case SkillConfig.XF_PED:
            break;
          case SkillConfig.XF_PEF:
            break;
          case SkillConfig.XF_PEA:
            break;
          case SkillConfig.XF_SYSH:
            break;
          case SkillConfig.XF_OTWT:
            break;
          case SkillConfig.XF_OTCN:
            break;
          case SkillConfig.XF_OTDT:
            break;
          case SkillConfig.BC_SCC:
            break;
          case SkillConfig.BC_SCD:
            break;
          case SkillConfig.BC_SCU:
            break;
          case SkillConfig.BC_PEC:
            break;
        }
      } else {

      }

    });


    //连接失败回调
    let on_error = function() {
      console.log('socket error!:' + ws.readyState);
      client = Stomp.over(new WebSocket(AppConfig.RABBITMQ_WS_URL));
      client.connect(login, password, on_connect, on_error, on_close,'/');
    };

    //关闭回调
    let on_close = function() {
      console.log('socket close!');
    };

    // 连接消息服务器
    client.connect(login, password, on_connect, on_error, on_close,'/');

  }

}
