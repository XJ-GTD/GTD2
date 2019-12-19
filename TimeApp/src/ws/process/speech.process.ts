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
import {FsData, ScdData} from "../../data.mapping";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {UserConfig} from "../../service/config/user.config";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DataConfig} from "../../service/config/data.config";

/**
 * 播报类型处理
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class SpeechProcess extends BaseProcess implements MQProcess {

  constructor(private assistant: AssistantService,
              private sqliteExec: SqliteExec,
              private utilService: UtilService, private emitService: EmitService) {
    super();
  }

   gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    return new Promise<Map<string,any>>(async resolve => {

      //获取上下文结果

      let user = UserConfig.user;

      //处理所需要参数
      let serverratio = (content.thisContext.context && content.thisContext.context.client)? content.thisContext.context.client.serverratio : 0;

      let ratios = "";

      if (content.thisContext.context && content.thisContext.context.client && content.thisContext.context.client.ratios && content.thisContext.context.client.ratios.length > 1) {
        ratios = content.thisContext.context.client.ratios.reduce((accumulator, currentValue) => {

          if (accumulator && typeof accumulator != "object") {
            return accumulator + ", " + currentValue['operation'] + ": " + currentValue['ratio'];
          } else {
            return accumulator['operation'] + ": " + accumulator['ratio'] + ", " + currentValue['operation'] + ": " + currentValue['ratio'];
          }
        });
      }

      if (content.thisContext.context && content.thisContext.context.client && content.thisContext.context.client.ratios && content.thisContext.context.client.ratios.length == 1) {
        let currentratio = content.thisContext.context.client.ratios[0];
        ratios = currentratio['operation'] + ": " + currentratio['ratio'];
      }

      let ti = moment().valueOf() - ((content.thisContext.context && content.thisContext.context.client)? content.thisContext.context.client.time : 0);
      let spData: SpeechPara = content.parameters;
      let prvOpt:string =  "";
      let openListener: boolean = false;
      //默认语音
      let speakText = spData.an;
      let type = WsDataConfig.TYPE_EMPTY;

      let branchcode: string = '';
      let branchtype: string = '';
      let agendas: Array<ScdData> = new Array<ScdData>();
      let memos: Array<ScdData> = new Array<ScdData>();
      let planitems: Array<ScdData> = new Array<ScdData>();
      let showagendas: Array<ScdData> = new Array<ScdData>();
      let contacts: Array<FsData> = new Array<FsData>();

      let sutbl: SuTbl = new SuTbl();

      //获取上下文前处理分支代码 (由各处理自定义)
      branchcode = this.input(content, contextRetMap, "branchcode", WsDataConfig.BRANCHCODE, branchcode);

      //获取上下文前处理分支类型 (由各处理自定义)
      branchtype = this.input(content, contextRetMap, "branchtype", WsDataConfig.BRANCHTYPE, branchtype);

      //日常语音直接播报
      if (content.option != S.AN) {

        //获取上下文内日程创建结果
        agendas = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,agendas);

        //获取上下文内日程创建结果
        memos = this.input(content,contextRetMap,"memos",WsDataConfig.MOD,memos);

        //获取上下文内日程创建结果
        planitems = this.input(content,contextRetMap,"planitems",WsDataConfig.PID,planitems);

        //获取上下文内日程查询结果
        showagendas = this.input(content,contextRetMap,"showagendas",WsDataConfig.SCD,showagendas);

        //获取上下文内人员信息
        contacts = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,contacts);

        //获取上下文前动作信息
        prvOpt = this.input(content,contextRetMap,"prvoption",WsDataConfig.PRVOPTION,prvOpt);

        if (content.input && (content.input.type || content.input.type == "")) {
          if (content.input.type == "") {
            type = WsDataConfig.TYPE_EMPTY;
          } else {
            if (content.input.type.startsWith("function")) {

              try {
                let tfun = eval("(" + content.input.type + ")");
                type = tfun(agendas, showagendas, prvOpt, user, branchtype, branchcode, memos, planitems);
              }catch (e){
                type = WsDataConfig.TYPE_EMPTY;
              };

            } else {
              type = content.input.type;
            }

          }
        } else {
          let count = 0;
          if (agendas && agendas.length > 0){
            count = agendas.length;
          }
          if (memos && memos.length > 0){
            count = memos.length;
          }
          if (planitems && planitems.length > 0){
            count = planitems.length;
          }

          if (count == 0) type = WsDataConfig.TYPE_NONE;
          if (count == 1) type = WsDataConfig.TYPE_ONE;
          if (count > 1) type = WsDataConfig.TYPE_MULTI;
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
              if (txt.value || txt.value == "") {
                expvalue = txt.value;
              }else if (txt.expression) {
                try {
                  expvalue = eval(txt.expression);
                }catch (e){
                  expvalue = txt.default;
                }

                if (!expvalue) {
                  expvalue = txt.default;
                }
              } else {
                expvalue = txt.default;
              }
              speakText = speakText.replace("{" + txt.name + "}", expvalue);
            }
          }else{
            if (agendas && agendas.length > 0){
              let count = agendas.length;
              speakText = speakText.replace("{count}", count+"");
            }
            if (memos && memos.length > 0){
              let count = memos.length;
              speakText = speakText.replace("{count}", count+"");
            }
            if (planitems && planitems.length > 0){
              let count = planitems.length;
              speakText = speakText.replace("{count}", count+"");
            }
          }

        }
      }

      //上下文内获取暂停缓存
      let paused: Array<any> = new Array<any>();
      paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

      //process处理符合条件则暂停
      if (content.pause && content.pause != "") {
        let pause: boolean = false;

        try {
          let isPause = eval("("+content.pause+")");
          pause = isPause(content, agendas, showagendas, contacts, branchtype, branchcode, memos, planitems);
        } catch (e) {
          pause = false;
        }

        if (pause) {
          let pausedContent: any = {};
          Object.assign(pausedContent, content);
          delete pausedContent.thisContext;

          paused.push(pausedContent);

          //设置上下文暂停处理缓存
          this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, paused);

          return contextRetMap;
        }
      }

      //process处理符合条件则执行
      if (content.when && content.when !=""){
        let rf :boolean = false;
        try {
          let fun = eval("("+content.when+")");
          rf = fun(agendas, showagendas, contacts, branchtype, branchcode, memos, planitems);
        }catch (e){
          rf = false;
        };
        if (!rf){
          resolve(contextRetMap);
          return;
        }
      }

      //通知页面显示播报文本
      let emspeech:SpeechEmData = new SpeechEmData();
      if (DataConfig.isdebug) {
        if (ratios)
          emspeech.an = speakText + " #" + serverratio + ", " + ti + "(" + ratios + ")" + "#";
        else
          emspeech.an = speakText + " #" + serverratio + ", " + ti + "#";
      } else {
        emspeech.an = speakText;
      }
      emspeech.org = content.thisContext.original;
      this.emitService.emitSpeech(emspeech);

      //处理结果
      resolve(contextRetMap);

      this.assistant.speakText(speakText).then((data) => {


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
        cscdLS.scdTip = sutbl.sut;
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


        for (let btbl of showagendas[0].fss){
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
}

export function isFuturefulltime(agendas: any): boolean {
	if(agendas && agendas.length >1 )
	{
		 return true;
	}
	else
	{
		 return false;
	}
}


export function isFutureparttime(agendas: any): boolean {
  if (agendas && agendas.length == 1) {
    return true;
  } else {
    return false;
  }
}

export function isfulltime(agendas: any): boolean {
  if (agendas && agendas.length > 1) {
  	let mytime =[];
  	for(let scd of agendas)
  	{
  		let st= scd.st;
  		let st1 = st.split(":");
  		if(mytime.indexOf(st1[0])==-1)
  		{
  			mytime.push(st1[0]);
  		}
  	}
  	if(mytime.length==24)
  	{
  		return true;
  	}
    else
    {
    	return false;
    }
  } else
  {
    return false;
  }
}

export function isparttime(agendas: any): boolean {
  if (agendas && agendas.length == 1) {
    return true;
  } else {
    let mytime =[];
  	for(let scd of agendas)
  	{
  		let st= scd.st;
  		let st1 = st.split(":");
  		if(mytime.indexOf(st1[0])==-1)
  		{
  			mytime.push(st1[0]);
  		}
  	}
  	if(mytime.length==24)
  	{
  		return true;
  	}
    else
    {
    	return false;
    }
  }
}
