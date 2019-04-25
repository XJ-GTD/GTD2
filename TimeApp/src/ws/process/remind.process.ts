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

/**
 * 提醒设置
 *
 * create by zhangjy on 2019/03/14.
 */
@Injectable()
export class RemindProcess implements MQProcess {
  constructor(private utitl: UtilService,
              private sqliteExec: SqliteExec) {
  }

  async  go(content: WsContent, processRs: ProcesRs){
      //处理所需要参数
      let rdData: RemindPara = content.parameters;
      processRs.option4Speech = content.option;

      //处理区分
      //闹铃设置无日程
      if (content.option == R.N) {
        await this.saveETbl1(rdData);

      } else if (content.option == R.C) {
        if (processRs == null) return;
        for (let scd of processRs.scd) {
          await this.saveETbl2(rdData, scd);
        }
      }

      // //内部调用process
      // let inner: WsContent = new WsContent();
      // inner.option = S.P;
      // inner.parameters = {
      //   //替换提醒语音Type
      //   t: DataConfig.GG
      // }
      return processRs;
  }

  //保存提醒表无日程管理
  private async saveETbl1(rdData: RemindPara) {
    let etbl: ETbl = new ETbl();
    etbl.wi = this.utitl.getUuid();
    etbl.st = DataConfig.RMNONESCD;
    etbl.wd = rdData.d;
    etbl.wt = rdData.t;

    await this.sqliteExec.save(etbl);
  }

  //保存提醒表管理日程
  private async saveETbl2(rdData: RemindPara, ctbl: CTbl) {

    //需要删除之前的提醒数据
    let etbl: ETbl = new ETbl();
    etbl.wi = this.utitl.getUuid();
    etbl.si = ctbl.si;
    etbl.st =  ctbl.sn;
    etbl.wd = rdData.d;
    etbl.wt = rdData.t;

    await this.sqliteExec.delete(etbl);

    //提前延后时间设置
    if (rdData.s != null) {
      let tmp = moment(ctbl.sd + "T" + ctbl.st).add(parseInt(rdData.s), 'h');
      etbl.wd = tmp.format("YYYY/MM/DD");
      etbl.wt = tmp.format("HH:mm")
    }

    await this.sqliteExec.save(etbl);
  }

}
