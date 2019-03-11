import {Injectable} from "@angular/core";
import {WsModel} from "./model/ws.model";
import {WsContent} from "./model/content.model";
import {ProcessFactory} from "./process.factory";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DispatchService {
  constructor(private factory:ProcessFactory){}
  dispatch(message: string) {
    //消息格式化
    let model: WsModel = JSON.parse(message);
    //循环处理消息
    for (let opt of model.header.describe) {
      let wsContent: WsContent = model.content.get(opt);
      this.factory.findProcess(opt).go(wsContent);
    }
  }
}
