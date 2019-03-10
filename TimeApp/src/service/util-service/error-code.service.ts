import { Injectable } from "@angular/core";
import { EmitSpeechService } from "./emit-speech.service";
import { WsModel } from "../../model/ws/ws.model";
import { AiuiModel } from "../../model/aiui.model";
import { DataConfig } from "../config/data.config";
import { WsEnumModel } from "../../model/ws/ws.enum.model";

/**
 * 错误码统一处理
 */
@Injectable()
export class ErrorCodeService {

  constructor(private emitSend: EmitSpeechService){

  }
  public errorHanding(mqDate: WsModel) {
    if (mqDate.ss == 50201 || mqDate.ss == 50200) {//语音无对应技能
      console.log("错误处理：无对应技能 | 解析失败");
      let aiui = new AiuiModel();
      aiui.tt = DataConfig.S1;
      //WsEnumModel["E01"] + UtilService.randInt(0,10);
      aiui.at = DataConfig.TEXT_CONTENT.get(WsEnumModel["E01"] + "1");
      this.emitSend.send(aiui, null);
    }
  }

}
