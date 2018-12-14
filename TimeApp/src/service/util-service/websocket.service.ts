import { Injectable } from "@angular/core";
import { SockJS } from 'sockjs-client';
import  Stomp from "@stomp/stompjs";

import { Subject } from "rxjs/Subject";
import { LoadingController } from "ionic-angular";
import { AppConfig } from "../../app/app.config";
import { WsModel } from "../../model/ws.model";
import { DwMqService } from "./dw-mq.service";


/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {

  constructor(public loadingCtrl: LoadingController,
              public dwService: DwMqService){
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
        client.subscribe("/queue/" + queueName, function(data) {
          console.log("on_connect回调成功:" + data);
          subject.next(data); //能够在let变量方法内使用this方法

        });
      };

      //对成功回调数据进行操作,放入全局变量中
      subject.asObservable().subscribe( data=> {
        let ws = new WsModel();
        ws = JSON.parse(data.body);
        console.log("JSON MQ:" + ws);
        this.dwService.dealWithMq(ws);
      });


      //连接失败回调
      let on_error = function() {
        console.log('webSocket error! :' + ws.readyState);
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
