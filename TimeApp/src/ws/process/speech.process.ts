import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {AssistantService} from "../../service/cordova/assistant.service";
import {SpeechPara} from "../model/speech.para";
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {ProcesRs} from "../model/proces.rs";
import {S} from "../model/ws.enum";
import {EmitService, SpeechEmData} from "../../service/util-service/emit.service";

/**
 * 播报类型处理
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SpeechProcess implements MQProcess {

  constructor(private assistant: AssistantService,
              private sqliteExec: SqliteExec,
              private utilService: UtilService, private emitService: EmitService) {
  }

  go(content: WsContent,processRs:ProcesRs): Promise<ProcesRs> {

    return new Promise<ProcesRs>(async resolve => {

      //处理所需要参数
      let spData: SpeechPara = content.parameters;
      //默认语音
      let speakText = spData.an;
      //处理区分
      if (spData.t) {

        speakText = await this.assistant.getSpeakText(spData.t);

        //替换参数变量
        let count = processRs.scd.length;
        content.parameters.forEach((value, key) => {
          speakText = speakText.replace("{" + key + "}", value);
        });
        speakText = speakText.replace("{" + count + "}", count.toString());

      }

      this.assistant.speakText(speakText, (data) => {
        //处理结果
        processRs.sucess = true;
        resolve(processRs);

      });

      //通知页面显示播报文本
      let emspeech:SpeechEmData = new SpeechEmData();
      emspeech.an = speakText;
      emspeech.org = content.thisContent.original;
      this.emitService.emitSpeech(emspeech);
    })
  }
}

