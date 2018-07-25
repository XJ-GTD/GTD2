import {Injectable} from "@angular/core";
import {SockJS} from 'sockjs-client';
import Stomp from "@stomp/stompjs";
import {AppConfig} from "../app/app.config";

/**
 * WebSocket连接Rabbitmq服务器
 */
@Injectable()
export class WebsocketService {

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

    // 连接成功回调 on_connect
    let on_connect = function(x) {
      console.log(client);
      client.subscribe("/queue" + queueName, function(data) {
        console.log("on_connect回调成功:" + data);
        if (data == null) {
          alert("暂无新消息");
        }
        alert(data);
      });
    };

    //连接失败回调
    let on_error = function() {
      console.log('error!');
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
