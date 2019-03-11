import {WsContent} from "../model/content.model";
import {MQProcess} from "./interface.process";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
export class SpeechProcess implements MQProcess{
  constructor() {
  }

  go(content: WsContent):Promise<WsContent> {
    return new Promise<WsContent>(resolve => {

      //处理区分
      content.option
      //处理所需要参数
      content.parmeter
      //上次处理参数结果
      content.prvData
      //处理结果
      content.processRs
      //判断后处理处理
      content.post
    })
  }

}
