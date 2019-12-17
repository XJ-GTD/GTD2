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
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);

    //上下文内获取日程查询结果
    let memos:Array<ScdData> = new Array<ScdData>();
    memos = this.input(content,contextRetMap,"memos",WsDataConfig.MOD,memos);

    //上下文内获取查询条件用日程人员或创建的日程人员
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);


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

    let prv:ProcesRs = new ProcesRs();

    //保存上下文
    prv.scd = scd;
    prv.mod = memos;
    prv.fs = fs;

    DataConfig.putWsContext(prv);
    DataConfig.putWsOpt(option?option:"");
    DataConfig.putWsProcessor(processor?processor:"");

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, prv.scd);

    //上下文内放置创建的或修改的日程
    this.output(content, contextRetMap, 'memos', WsDataConfig.MOD, prv.mod);

    //上下文内放置创建的或修改的日程联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, prv.fs);


    return contextRetMap;
  }

}
