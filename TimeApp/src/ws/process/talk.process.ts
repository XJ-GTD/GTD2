import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {AssistantService} from "../../service/cordova/assistant.service";
import {TalkPara} from "../model/talk.para";
import {UtilService} from "../../service/util-service/util.service";
import {ProcesRs} from "../model/proces.rs";
import {EmitService, FriendEmData, ScdEmData, ScdLsEmData, SpeechEmData} from "../../service/util-service/emit.service";
import {TK} from "../model/ws.enum";
import {UserConfig} from "../../service/config/user.config";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DataConfig} from "../../service/config/data.config";

/**
 * 显示用户发出的语音指令
 *
 * create by leon_xi on 2020/01/08.
 */
@Injectable()
export class TalkProcess extends BaseProcess implements MQProcess {

  constructor(private assistant: AssistantService,
              private utilService: UtilService,
              private emitService: EmitService) {
    super();
  }

   async gowhen(content: WsContent, contextRetMap: Map<string, any>) {

    // 只有在语音界面对话时才播报语音
    if (mutable(content)) {
      return contextRetMap;
    }

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

    if (content.option == TK.ASK) {
      //处理所需要参数
      let talkPara: TalkPara = content.parameters;

      //通知页面显示播报文本
      let emspeech: SpeechEmData = new SpeechEmData();
      let speakText: string = talkPara.ask;

      emspeech.org = speakText;
      this.emitService.emitSpeech(emspeech);
    }

    //处理结果
    return contextRetMap;
  }
}

export function mutable(content: any): boolean {
  if (content && content.thisContext && content.thisContext.header) {
    if (content.thisContext.header.sender == "xunfei/aiui") {
      return false;
    }
  }

  return true;
}
