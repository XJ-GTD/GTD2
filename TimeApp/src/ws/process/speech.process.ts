import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {AssistantService} from "../../service/cordova/assistant.service";
import {SpeechPara} from "../model/speech.para";
import {SuTbl} from "../../service/sqlite/tbl/su.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {ProcesRs} from "../model/proces.rs";
import {EmitService, FriendEmData, ScdEmData, ScdLsEmData, SpeechEmData} from "../../service/util-service/emit.service";
import {O, F, SS,S} from "../model/ws.enum";
import * as moment from "moment";
import {FsData} from "../../data.mapping";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {UserConfig} from "../../service/config/user.config";

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

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    return new Promise<Map<string,any>>(async resolve => {

      //获取上下文结果

      let user = UserConfig.user;

      //处理所需要参数
      let ti = moment().valueOf() - content.thisContext.context.client.time;
      let spData: SpeechPara = content.parameters;
      let prvOpt:string =  "";
      let openListener: boolean = false;
      //默认语音
      let speakText = spData.an;
      let type = 'NONE';

      let agendas: Array<CTbl> = new Array<CTbl>();
      let showagendas: Array<CTbl> = new Array<CTbl>();
      let contacts: Array<FsData> = new Array<FsData>();

      let sutbl: SuTbl = new SuTbl();

      //日常语音直接播报
      if (content.option != S.AN) {


        //获取上下文内日程创建结果
        if (content.input && (content.input.agendas || content.input.agendas == "")) {
          if (content.input.agendas != "") agendas = contextRetMap.get(content.input.agendas);
        } else {
          agendas = contextRetMap.get("scd");
        }

        //获取上下文内日程查询结果
        if (content.input && (content.input.showagendas || content.input.showagendas == "")) {
          if (content.input.showagendas != "") showagendas = contextRetMap.get(content.input.showagendas);
        } else {
          showagendas = contextRetMap.get("scd");
        }

        //获取上下文内人员信息
        if (content.input && (content.input.contacts || content.input.contacts == "")) {
          if (content.input.contacts != "") contacts = contextRetMap.get(content.input.contacts);
        } else {
          contacts = contextRetMap.get("fs");
        }

        //获取上下文前动作信息
        if (content.input && (content.input.prvoption ||content.input.prvoption =="")){
          if (content.input.prvoption != "") prvOpt = contextRetMap.get(content.input.prvoption );
        } else {
          prvOpt = contextRetMap.get("prvoption");
        }

        if (content.input && (content.input.type || content.input.type == "")) {
          if (content.input.type == "") {
            type = "EMPTY";
          } else {
            if (content.input.type.startsWith("function")) {
              let tfun = eval("(" + content.input.type + ")");
              type = tfun(agendas, showagendas, user);
            } else {
              type = content.input.type;
            }

          }
        } else {
          let count = 0;
          if (agendas){
            count = agendas.length;
          }

          if (count == 0) type = 'NONE';
          if (count == 1) type = 'ONE';
          if (count > 1) type = 'MULTI';
        }
        //处理区分

        if (spData.t) {

          //TODO 0的时候包含了不需要判断0的场合，需要区分出来

          sutbl = await this.assistant.getSpeakTextObject(spData.t, type);

          speakText = sutbl.suc;
          openListener = (sutbl.sus == 'true' ? true : false);

          //TODO 变量替换不全，当前用户UserConfig
          if (content.input && content.input.textvariables) {
            for (let txt of content.input.textvariables) {
              let expvalue: string = "";
              if (txt.value) {
                expvalue = txt.value;
              }
              if (txt.expression) {
                expvalue = eval(txt.expression);
                if (!expvalue) {
                  expvalue = txt.default;
                }
              } else {
                expvalue = txt.default;
              }
              speakText = speakText.replace("{" + txt.name + "}", expvalue);
            }
          }else{
            if (agendas){
              let count = agendas.length;
              speakText = speakText.replace("{count}", count+"");
            }
          }

        }
      }

      //process处理符合条件则执行
      if (content.when && content.when !=""){
        let fun = eval("("+content.when+")");
        if (!fun(agendas,showagendas,contacts)){
          resolve(contextRetMap);
          return;
        }
      }

      //通知页面显示播报文本
      let emspeech:SpeechEmData = new SpeechEmData();
      emspeech.an = speakText + " #" + ti + "#";
      emspeech.org = content.thisContext.original;
      this.emitService.emitSpeech(emspeech);


      this.assistant.speakText(speakText).then((data) => {
        //处理结果

        resolve(contextRetMap);

        // 播报后启动语音监听
        if (openListener) {
          this.assistant.listenAudio();
        }
      });

      // 多个日程操作显示
      if  (showagendas && showagendas.length > 1){
        let cscdLS:ScdLsEmData = new ScdLsEmData();
        cscdLS.desc = speakText;
        for (let scd of showagendas){
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


      // 单个日程操作显示


      if  (showagendas && showagendas.length == 1){
        let scdEm:ScdEmData = new ScdEmData();
        scdEm.id = showagendas[0].si;
        scdEm.d = showagendas[0].sd;
        scdEm.t = showagendas[0].st;
        scdEm.ti = showagendas[0].sn;
        scdEm.gs = showagendas[0].gs;

        scdEm.scdTip = sutbl.sut;


        for (let btbl of contacts){
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


    })
  }


  go(content: WsContent,processRs:ProcesRs): Promise<ProcesRs> {

    return new Promise<ProcesRs>(async resolve => {

      //处理所需要参数
      let ti = moment().valueOf() - content.thisContext.context.client.time;
      let spData: SpeechPara = content.parameters;
      let prvOpt:string =  content.thisContext.context.client.option;
      let openListener: boolean = false;
      //默认语音
      let speakText = spData.an;
      let type = 'NONE';
      //处理区分
      if (spData.t) {

        //替换参数变量
        let count = processRs.scd.length;

        if (processRs.option4Speech == SS.C
          || processRs.option4Speech == SS.U
          || processRs.option4Speech == SS.D
          || processRs.option4Speech == F.C) {
           if (count == 0)  type= 'NONE';
           if (count == 1) type= 'ONE';
           if (count > 1) type= 'MULTI';

        } else if (processRs.option4Speech == O.O) {
          if (prvOpt){
            type = prvOpt;
          }
        }

        // spData.forEach((value, key) => {
        //   speakText = speakText.replace("{" + key + "}", value);
        // });
        //TODO 0的时候包含了不需要判断0的场合，需要区分出来
        let sutbl: SuTbl = new SuTbl();
        sutbl = await this.assistant.getSpeakTextObject(spData.t, type);

        speakText = sutbl.suc;
        openListener = (sutbl.sus == 'true' ? true : false);

        //TODO 变量替换不全，当前用户UserConfig
        speakText = speakText.replace("{count}", count.toString());

      }

      //通知页面显示播报文本
      let emspeech:SpeechEmData = new SpeechEmData();
      emspeech.an = speakText + " #" + ti + "#";
      emspeech.org = content.thisContext.original;
      this.emitService.emitSpeech(emspeech);


      this.assistant.speakText(speakText).then((data) => {
        //处理结果
        processRs.sucess = true;
        resolve(processRs);

        // 播报后启动语音监听
        if (openListener) {
          this.assistant.listenAudio();
        }
      });

      // 多个日程操作显示
      if (processRs.option4Speech == F.C || (processRs.option4Speech == SS.U && type == 'MULTI') || (processRs.option4Speech == SS.D && type == 'MULTI')){
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

      // 单个日程操作显示
      if (processRs.option4Speech == SS.C || (processRs.option4Speech == SS.U && type == 'ONE') || (processRs.option4Speech == SS.D && type == 'ONE')){

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

