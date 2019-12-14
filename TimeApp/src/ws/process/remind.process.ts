import {WsContent} from "../model/content.model";
import {MQProcess} from "../interface.process";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {R, S} from "../model/ws.enum";
import {RemindPara} from "../model/remind.para";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SpeechProcess} from "./speech.process";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import * as moment from 'moment';
import {DataConfig} from "../../service/config/data.config";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {ScdAiData} from "../../components/ai/answer/ai.service";
import {ScdData} from "../../data.mapping";
import {EventService, MiniTaskData, TxJson} from "../../service/business/event.service";

/**
 * 提醒设置
 *
 * create by zhangjy on 2019/03/14.
 */
@Injectable()
export class RemindProcess extends BaseProcess implements MQProcess {
  constructor(private utitl: UtilService, private eventService: EventService,
              private sqliteExec: SqliteExec) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

    //处理所需要参数
    let rdData: RemindPara = content.parameters;

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);


    //处理区分
    //闹铃设置无日程
    if (content.option == R.N) {
      // await this.saveETbl1(rdData);
      let minitask: MiniTaskData = {} as MiniTaskData;

      minitask.evn = "闹钟";
      minitask.evd = rdData.d;
      minitask.evt = rdData.t;

      let txjson: TxJson = new TxJson();
      txjson.reminds.push(Number(moment(minitask.evd + " " + minitask.evt, "YYYY/MM/DD HH:mm").format("YYYYMMDDHHmm")));

      minitask.txjson = txjson;

      await this.eventService.saveMiniTask(minitask);

    } else if (content.option == R.T) {
      let rightnow = moment();

      if (rdData.h) {
        rightnow.add(rdData.h, "hours");
      }

      if (rdData.m) {
        rightnow.add(rdData.m, "minutes");
      }

      if (rdData.s) {
        rightnow.add(rdData.s, "seconds");
      }

      rdData.d = rightnow.format("YYYY/MM/DD");
      rdData.t = rightnow.format("HH:mm:ss")

      let minitask: MiniTaskData = {} as MiniTaskData;

      minitask.evn = "倒计时";
      minitask.evd = moment().format("YYYY/MM/DD");
      minitask.evt = moment().format("HH:mm");

      let txjson: TxJson = new TxJson();
      txjson.reminds.push(Number(rightnow.format("YYYYMMDDHHmm")));

      minitask.txjson = txjson;

      await this.eventService.saveMiniTask(minitask);

    } else if (content.option == R.C) {
      // 设置日程提醒
      if (scd != null && scd.length > 0) {
        for (let eachscd of scd) {
          await this.saveETbl2(rdData, eachscd);
        }
      }
    }

    return contextRetMap
  }

  //保存提醒表无日程管理
  private async saveETbl1(rdData: RemindPara) {
    let etbl: ETbl = new ETbl();
    etbl.wi = this.utitl.getUuid();
    etbl.st = "闹铃";
    etbl.wd = rdData.d;
    etbl.wt = rdData.t;

    await this.sqliteExec.save(etbl);
  }

  //保存提醒表管理日程
  private async saveETbl2(rdData: RemindPara, c: ScdData) {

    //需要删除之前的提醒数据
    let etbl: ETbl = new ETbl();
    etbl.wi = this.utitl.getUuid();
    etbl.si = c.si;
    etbl.st =  c.sn;
    etbl.wd = rdData.d;
    etbl.wt = rdData.t;

    await this.sqliteExec.delete(etbl);

    //提前延后时间设置
    if (rdData.s != null) {
      let tmp = moment(c.sd + "T" + c.st).add(parseInt(rdData.s), 'h');
      etbl.wd = tmp.format("YYYY/MM/DD");
      etbl.wt = tmp.format("HH:mm")
    }

    await this.sqliteExec.save(etbl);
  }

}
