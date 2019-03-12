import {WsContent} from "../model/content.model";
import {MQProcess} from "./interface.process";
import {Injectable} from "@angular/core";
import {AssistantService} from "../../service/cordova/assistant.service";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SpeechProcess implements MQProcess{
  constructor(private assistant:AssistantService) {
  }
  option:{

  }

  go(content: WsContent):Promise<WsContent> {
    return new Promise<WsContent>(resolve => {
      //处理区分
      content.option
      //处理所需要参数
      let spData:string = content.parmeter.get("anwser")
      //上次处理参数结果
      this.assistant.speakText(spData,{})
      content.prvData
      //处理结果
      content.processRs
      //判断后处理处理
      content.post
    })
  }

}

