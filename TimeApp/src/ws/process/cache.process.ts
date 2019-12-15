import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {CA} from "../model/ws.enum";
import {CachePara} from "../model/cache.para";
import * as moment from "moment";
import {ScdData} from "../../data.mapping";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";

/**
 * 语音数据缓存
 *
 * create by xilj on 2019/12/15.
 */
@Injectable()
export class CacheProcess extends BaseProcess implements MQProcess {
  constructor() {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,contextRetMap);
      }catch (e){
        rf = false;
      }

      if (!rf){
        return contextRetMap;
      }
    }

    //处理所需要参数
    let cacheData: CachePara = content.parameters;

    //上下文内获取日程语音输入缓存数据
    let scd: Array<ScdData> = new Array<ScdData>();
    scd = this.input(content, contextRetMap, "agendas", WsDataConfig.SCD, scd) || new Array<ScdData>();

    //处理区分
    if (content.option == CA.AD) {
      if (scd.length <= 0) {
        let agendadata: ScdData = new ScdData();
        Object.assign(agendadata, cacheData.scd);

        scd.push(agendadata);
      } else {
        let agendadata: ScdData = scd.pop();

        agendadata.sd = cacheData.scd.ds || agendadata.sd;
        agendadata.st = cacheData.scd.ts || agendadata.st;
        agendadata.ed = cacheData.scd.de || agendadata.ed;
        agendadata.et = cacheData.scd.te || agendadata.et;

        agendadata.sn = cacheData.scd.ti || agendadata.sn;
        agendadata.adr = cacheData.scd.adr || agendadata.adr;

        scd.push(agendadata);
      }
    }

    //服务器要求上下文内放置日程查询结果
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, scd);

    return contextRetMap;
  }

}
