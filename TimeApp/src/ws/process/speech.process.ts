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

/**
 * 播报类型处理
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SpeechProcess implements MQProcess {

  constructor(private assistant: AssistantService,
              private sqliteExec: SqliteExec,
              private utilService: UtilService) {
  }

  go(content: WsContent,processRs:ProcesRs): Promise<ProcesRs> {

    return new Promise<ProcesRs>(async resolve => {

      //处理所需要参数
      let spData: SpeechPara = content.parmeter;
      //默认语音
      let speakText = spData.an;
      //处理区分
      if (content.option == S.AN) {
        let stbl: STbl = new STbl();
        stbl.st = "SPEECH";
        stbl.yk = spData.t;

        //获取本地回答语音文本
        let datas = await this.sqliteExec.getList<STbl>(stbl);
        //回答语音list
        let len = datas.length;
        //随机选取一条
        let rand = this.utilService.randInt(0, len - 1);
        let anO: STbl = datas[rand];
        speakText = anO.yk;
      }

      //替换参数变量
      // let prvrs: Map<string, any> = content.prvData.processRs;
      // content.parmeter.forEach((value, key) => {
      //   speakText = speakText.replace("{key}", value);
      // });
      // prvrs.forEach((value, key) => {
      //   speakText = speakText.replace("{key}", value);
      // });

      this.assistant.speakText(speakText, (data) => {
        //处理结果
        processRs.sucess = true;
        resolve(processRs);

      });
    })
  }
}

