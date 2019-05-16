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

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun()){
        return contextRetMap;
      }
    }

    return contextRetMap
  }

  async go(content: WsContent,processRs:ProcesRs){
      console.log("测试消息content******************************"+ JSON.stringify(content));
      console.log("测试消息processRs******************************"+ JSON.stringify(content));
      console.log("测试消息processRs******************************"+ JSON.stringify(content));
      processRs.sucess = true;
      return processRs;
  }

}
