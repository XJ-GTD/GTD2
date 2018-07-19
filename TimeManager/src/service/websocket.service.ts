import {Injectable} from "@angular/core";
import {Observer} from "rxjs/Observer";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

/**
 * WebSocket连接Rabbitmq服务器
 */
@Injectable()
export class WebsocketService {

  public closeWs:any;

  public create(url: string, nodeid:string): Subject<MessageEvent> {
    let ws = new WebSocket(url);
    ws.onopen = function() {
      console.log("已经建立连接");
    };

    ws.onmessage = function (evt) {
      return evt.data;
    }

    // 如果想要断开websocket连接，调用websocket.service.ts的closeWs函数即可。
    // this.closeWs = function() {
    //   ws.close();
    //   console.log("webSocket已经断开连接");
    // };

    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        // ws.onmessage = obs.next.bind(obs);
        ws.onerror   = obs.error.bind(obs);
        ws.onclose   = obs.complete.bind(obs);
        return ws.close.bind(ws);
      });
    let observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.onmessage = function (evt) {
            return evt.data;
          }
        }
      }
    };
    return Subject.create(observer, observable);
  }

}
