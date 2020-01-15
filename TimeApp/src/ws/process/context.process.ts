import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DataConfig} from "../../service/config/data.config";
import {FsData, ScdData} from "../../data.mapping";
import {Friend} from "../../service/business/grouper.service";

/**
 * 日程修改（获取上下文中） SC
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ContextProcess extends BaseProcess implements MQProcess{
  constructor() {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    DataConfig.wsContext = content.thisContext.context.client.cxt;
    let prv :ProcesRs = new ProcesRs();
    if (DataConfig.wsContext && DataConfig.wsContext.length >0 ){
      prv = DataConfig.wsContext.splice(DataConfig.wsContext.length - 1,1 )[0];
    }

    //获取上下文前动作信息
    let prvOpt: string = "";
    prvOpt = this.input(content, contextRetMap, "prvoption", WsDataConfig.PRVOPTION, prvOpt);

    //获取上下文前动作信息
    let prvprocessor: string = "";
    prvprocessor = this.input(content, contextRetMap, "prvprocessor", WsDataConfig.PRVPROCESSOR, prvprocessor);

    //上下文内获取日程查询结果
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused);

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);

    //上下文内获取日程查询结果
    let memos:Array<ScdData> = new Array<ScdData>();
    memos = this.input(content,contextRetMap,"memos",WsDataConfig.MOD,memos);

    //上下文内获取日程查询结果
    let planitems:Array<ScdData> = new Array<ScdData>();
    planitems = this.input(content,contextRetMap,"planitems",WsDataConfig.PID,planitems);

    //上下文内获取查询条件用日程人员或创建的日程人员
    let fs :Array<Friend> = new Array<Friend>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,prv.scd,prv.fs);
      }catch (e){
        rf = false;
      }
      if (!rf){
        return contextRetMap;
      }
    }

    if (!prvOpt || !prvprocessor) {
      //服务器要求上下文内放置语音上下文前动作标志
      DataConfig.wsWsOpt = content.thisContext.context.client.option;
      if (DataConfig.wsWsOpt && DataConfig.wsWsOpt.length >0 ){
        prvOpt = DataConfig.wsWsOpt.splice(DataConfig.wsWsOpt.length - 1,1 )[0];
      }

      //服务器要求上下文内放置语音上下文前process标志
      DataConfig.wsWsProcessor = content.thisContext.context.client.processor;
      if (DataConfig.wsWsProcessor && DataConfig.wsWsProcessor.length >0 ){
        prvprocessor = DataConfig.wsWsProcessor.splice(DataConfig.wsWsProcessor.length - 1,1 )[0];
      }
    } else {
      prv.scd = scd;
      prv.mod = memos;
      prv.pid = planitems;
      prv.fs = fs;
      prv.paused = paused;
    }

    this.output(content, contextRetMap, 'prvoption', WsDataConfig.PRVOPTION, prvOpt);
    this.output(content, contextRetMap, 'prvprocessor', WsDataConfig.PRVPROCESSOR, prvprocessor);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, prv.paused);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'memos', WsDataConfig.MOD, prv.mod);

    //服务器要求上下文内放置语音上下文日程
    this.output(content, contextRetMap, 'planitems', WsDataConfig.PID, prv.pid);

    //服务器要求上下文内放置日程人员信息
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);

    return contextRetMap
  }
}
