import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DefaultProcess implements MQProcess{
  constructor() {
  }

  go(content: WsContent,processRs:ProcesRs):Promise<ProcesRs> {
    return new Promise<ProcesRs>(resolve => {
      console.log("测试消息content******************************"+ JSON.stringify(content));
      console.log("测试消息processRs******************************"+ JSON.stringify(content));
      console.log("测试消息processRs******************************"+ JSON.stringify(content));
      processRs.sucess = true;
      resolve(processRs);
    })
  }

}
