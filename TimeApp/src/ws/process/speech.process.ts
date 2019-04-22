import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {AssistantService} from "../../service/cordova/assistant.service";
import {SpeechPara} from "../model/speech.para";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {ProcesRs} from "../model/proces.rs";
import {EmitService, FriendEmData, ScdEmData, ScdLsEmData, SpeechEmData} from "../../service/util-service/emit.service";
import {F, SS} from "../model/ws.enum";
import * as moment from "moment";

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
      let ti = moment().valueOf() - content.thisContext.context.client.time;
      let spData: SpeechPara = content.parameters;
      //默认语音
      let speakText = spData.an;
      //处理区分
      if (spData.t) {

        speakText = await this.assistant.getSpeakText(spData.t);

        //替换参数变量
        let count = processRs.scd.length;
        // spData.forEach((value, key) => {
        //   speakText = speakText.replace("{" + key + "}", value);
        // });
        //TODO 变量替换不全
        speakText = speakText.replace("{count}", count.toString());

      }

      //通知页面显示播报文本
      let emspeech:SpeechEmData = new SpeechEmData();
      emspeech.an = speakText + "#" + ti + "#";
      emspeech.org = content.thisContext.original;
      this.emitService.emitSpeech(emspeech);


      this.assistant.speakText(speakText).then((data) => {
        //处理结果
        processRs.sucess = true;
        resolve(processRs);

      });


      if (processRs.option4Speech == F.C){
        if  (processRs.scd.length > 0){
          let cscdLS:ScdLsEmData = new ScdLsEmData();
          cscdLS.desc = speakText;
          for (let scd of processRs.scd){
            let scdEm:ScdEmData = new ScdEmData();
            scdEm.id = scd.si;
            scdEm.d = scd.sd;
            scdEm.t = scd.st;
            scdEm.ti = scd.sn;
            scdEm.gs = scd.gs;
            cscdLS.datas.push(scdEm);
          }
          this.emitService.emitScdLs(cscdLS);
        }
      }

      if (processRs.option4Speech == SS.C || processRs.option4Speech == SS.U || processRs.option4Speech == SS.D){

        if  (processRs.scd.length == 1){
          let scdEm:ScdEmData = new ScdEmData();
          scdEm.id = processRs.scd[0].si;
          scdEm.d = processRs.scd[0].sd;
          scdEm.t = processRs.scd[0].st;
          scdEm.ti = processRs.scd[0].sn;
          scdEm.gs = processRs.scd[0].gs;

          for (let btbl of processRs.fs){
            let fri:FriendEmData = new FriendEmData();
            fri.id = btbl.pwi;
            fri.p = btbl.ranpy;
            fri.m = btbl.rc;
            fri.a = btbl.bhiu;
            fri.n = btbl.ran;
            fri.uid = btbl.ui;

            scdEm.datas.push(fri);
          }
          this.emitService.emitScd(scdEm);
        }

      }
    })
  }
}

