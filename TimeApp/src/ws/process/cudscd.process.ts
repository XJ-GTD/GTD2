
import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {FriendEmData, ScdEmData} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {DataConfig} from "../../service/config/data.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {SS} from "../model/ws.enum";
import {FsData, ScdData} from "../../data.mapping";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 日历修改处理 SS
 *
 * create by zhangjy on 2019/03/28.
 */
@Injectable()
export class CudscdProcess extends BaseProcess implements MQProcess{
  constructor() {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    let option = contextRetMap.get(WsDataConfig.OPTION4SPEECH);
    let processor = contextRetMap.get(WsDataConfig.PROCESSOR4SPEECH);

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
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

    //process处理符合条件则暂停
    if (content.pause && content.pause != "") {
      let pause: boolean = false;

      try {
        let isPause = eval("("+content.pause+")");
        pause = isPause(content, scd, fs);
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
        rf = fun(content,scd,fs);
      }catch (e){
        rf = false;
      }
      if (!rf){
        return contextRetMap;
      }
    }

    let prv: ProcesRs = new ProcesRs();

    //保存上下文
    prv.scd = scd;
    prv.mod = memos;
    prv.pid = planitems;
    prv.fs = fs;
    prv.paused = paused;

    DataConfig.putWsContext(prv);
    DataConfig.putWsOpt(option?option:"");
    DataConfig.putWsProcessor(processor?processor:"");

    // 用于当前处理直接执行
    if (option && processor) {
      //服务器要求上下文内放置语音上下文前动作标志
      this.output(content, contextRetMap, 'prvoption', WsDataConfig.PRVOPTION, option);

      //服务器要求上下文内放置语音上下文前process标志
      this.output(content, contextRetMap, 'prvprocessor', WsDataConfig.PRVPROCESSOR, processor);
    }

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, prv.paused);

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'memos', WsDataConfig.MOD, prv.mod);

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'planitems', WsDataConfig.PID, prv.pid);

    //上下文内放置创建的或修改的日程联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);


    return contextRetMap;
  }

}
