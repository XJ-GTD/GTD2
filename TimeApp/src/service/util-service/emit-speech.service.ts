import {Injectable} from "@angular/core";
import {DwEmitService} from "./dw-emit.service";
import {AiuiModel} from "../../model/aiui.model";

/**
 * 语音技能对应统一逻辑处理
 *
 * create by wzy on 2018/12/20
 */
@Injectable()
export class EmitSpeechService {

  constructor(private dwEmit: DwEmitService) {}

  public send(aiui: AiuiModel, sk: string) {

  }

  public scheduleFind() {

  }
}
