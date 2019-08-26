import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {SpTbl} from "../sqlite/tbl/sp.tbl";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {MoTbl} from "../sqlite/tbl/mo.tbl";
import {DTbl} from "../sqlite/tbl/d.tbl";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {JhTbl} from "../sqlite/tbl/jh.tbl";
import {JhaTbl} from "../sqlite/tbl/jha.tbl";
import {JtaTbl} from "../sqlite/tbl/jta.tbl";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";
import {YTbl} from "../sqlite/tbl/y.tbl";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { TTbl } from "../sqlite/tbl/t.tbl";
import { CaTbl } from "../sqlite/tbl/ca.tbl";
import { ParTbl } from "../sqlite/tbl/par.tbl";
import { FjTbl } from "../sqlite/tbl/fj.tbl";


/**
 * 备份
 */
@Injectable()
export class BacRestful {
  constructor(private request: RestfulClient, private config: RestFulConfig) {
  }

  // 备份 B
  backup(backupPro: BackupPro): Promise<OutBackupPro> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("B");
      this.request.post(url, backupPro).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }


  // 恢复 R
  recover(recoverPro: RecoverPro): Promise<OutRecoverPro> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("R");
      this.request.post(url, recoverPro).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }

  // 获取日历备份时间戳 BS
  getlastest(): Promise<OutTimestampPro> {

    return new Promise((resolve, reject) => {
      let url: UrlEntity = this.config.getRestFulUrl("BS");
      this.request.get(url).then(data => {
        //处理返回结果
        resolve(data.d);

      }).catch(error => {
        //处理返回错误
        resolve();

      })
    });
  }
}

//备份入参
export class BackupPro {
  //操作帐户ID
  oai: string = "";
  //操作手机号码
  ompn: string = "";
  //上下文
  c: any = "";
  d: BackupProSub = new BackupProSub();
}

export class BackupProSub {
  //备份时间戳
  bts: Number = 0;
  //本地日历数据
  c: Array<CTbl> = new Array<CTbl>();
  //获取特殊日历
  sp: Array<SpTbl> = new Array<SpTbl>();
  //获取提醒数据
  e: Array<ETbl> = new Array<ETbl>();
  //获取备忘表数据
  mo: Array<MoTbl> = new Array<MoTbl>();
  //获取日程参与人信息
  d: Array<DTbl> = new Array<DTbl>();
  //本地联系人数据
  b: Array<BTbl> = new Array<BTbl>();
  //获取群组信息
  g: Array<GTbl> = new Array<GTbl>();
  //获取群组人员信息
  bx: Array<BxTbl> = new Array<BxTbl>();
  //获取本地计划
  jh: Array<JhTbl> = new Array<JhTbl>();
  //获取本地计划(三期新)
  jha: Array<JhaTbl> = new Array<JhaTbl>();
  //获取本地日历项(三期新)
  jta: Array<JtaTbl> = new Array<JtaTbl>();
  //获取用户偏好
  y: Array<YTbl> = new Array<YTbl>();
  //新版备忘表数据
  mom: Array<MomTbl> = new Array<MomTbl>();
  //事件表数据
  ev: Array<EvTbl> = new Array<EvTbl>();
  //日程表数据
  ca: Array<CaTbl> = new Array<CaTbl>();
  //任务表数据
  tt: Array<TTbl> = new Array<TTbl>();
  //参与人表数据
  par: Array<ParTbl> = new Array<ParTbl>();
  //附件表数据
  fj: Array<FjTbl> = new Array<FjTbl>();
  //分批备份最后一次设为true
  commit: boolean = false;

}

//备份出参
export class OutBackupPro {

  bts: string = "";

}

//获取日历备份时间戳出参
export class OutTimestampPro {

  bts: string = "";

}

//还原入参
export class RecoverPro {
  //操作帐户ID
  oai: string = "";
  //操作手机号码
  ompn: string = "";
  //上下文
  c: any = "";
  d: RecoverProSub = new RecoverProSub();
}

export class RecoverProSub {

  bts: Number = 0;
  //恢复表的名称
  rdn: Array<string> = ["c", "sp", "e", "mo", "d", "b", "g", "bx", "jh", "y","mom","ev","ca","tt"];
}

//恢复出参
export class OutRecoverPro {

  //本地日历数据
  c: Array<CTbl> = new Array<CTbl>();
  //获取特殊日历
  sp: Array<SpTbl> = new Array<SpTbl>();
  //获取提醒数据
  e: Array<ETbl> = new Array<ETbl>();
  //获取备忘数据
  mo: Array<MoTbl> = new Array<MoTbl>();
  //获取日程参与人信息
  d: Array<DTbl> = new Array<DTbl>();
  //本地联系人数据
  b: Array<BTbl> = new Array<BTbl>();
  //获取群组信息
  g: Array<GTbl> = new Array<GTbl>();
  //获取群组人员信息
  bx: Array<BxTbl> = new Array<BxTbl>();
  //获取本地计划
  jh: Array<JhTbl> = new Array<JhTbl>();
  //获取本地计划(三期新)
  jha: Array<JhaTbl> = new Array<JhaTbl>();
  //获取本地日历项(三期新)
  jta: Array<JtaTbl> = new Array<JtaTbl>();
  //用户偏好
  y: Array<YTbl> = new Array<YTbl>();
   //新版备忘表数据
  mom: Array<MomTbl> = new Array<MomTbl>();
  //事件表数据
  ev: Array<EvTbl> = new Array<EvTbl>();
  //日程表数据
  ca: Array<CaTbl> = new Array<CaTbl>();
  //任务表数据
  tt: Array<TTbl> = new Array<TTbl>();
  //参与人表数据
  par: Array<ParTbl> = new Array<ParTbl>();
  //附件表数据
  fj: Array<FjTbl> = new Array<FjTbl>();
}
