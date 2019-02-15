import { Injectable } from "@angular/core";
import { SockJS } from 'sockjs-client';
import Stomp from "@stomp/stompjs";
import { AppConfig } from "../../app/app.config";
import { WsModel } from "../../model/ws/ws.model";
import { DwMqService } from "./dw-mq.service";


/**
 * WebSocket连接Rabbitmq服务器
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class WebsocketService {


  //登陆账户
  private login: string;
  private password: string;
  private client: Stomp.Client;

  constructor(private dwService: DwMqService) {
    this.settingWs();
  }


  private settingWs() {
    this.login = "gtd_mq";
    this.password = "gtd_mq";
    this.client = Stomp.client(AppConfig.RABBITMQ_WS_URL);
    //呼吸
    this.client.heartbeat.outgoing = 0;
    this.client.heartbeat.incoming = 0;
  }

  /**
   * 监听消息队列
   */
  public connect(queueName: string) {

    console.log("-----MQ开始建立连接----");
    console.log("-----MQ QUEUE_NAME: [" + queueName +  "] ----");

    // 连接消息服务器
    this.client.connect(this.login, this.password, frame => {
      console.log(this.client);
      this.client.subscribe("/queue/" + queueName, data => {
        console.log("on_connect回调成功:" + data);
        let wsModel: WsModel = JSON.parse(data.body);
        console.log("JSON MQ:" + wsModel);
        this.dwService.dealWithMq(wsModel);
      });
    }, error => {
      console.log('webSocket error! :' + error);
      this.connect(queueName);

    }, event => {
      console.log('socket close!' + event);
    }, '/');

  }

  public close() {
    // 连接消息服务器
    this.client.disconnect(() => {
      console.log('socket close!' + event);
    },{
      login: "gtd_mq",
      passcode: "gtd_mq"
    });
  }

}
