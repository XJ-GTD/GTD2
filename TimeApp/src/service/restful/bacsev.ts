import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {SpTbl} from "../sqlite/tbl/sp.tbl";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {DTbl} from "../sqlite/tbl/d.tbl";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {JhTbl} from "../sqlite/tbl/jh.tbl";
import {RestFulConfig, UrlEntity} from "../config/restful.config";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";
import {YTbl} from "../sqlite/tbl/y.tbl";


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
  //获取用户偏好
  y: Array<YTbl> = new Array<YTbl>();

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
  rdn: Array<string> = ["c", "sp", "e", "d", "b", "g", "bx", "jh", "y"];
}

//恢复出参
export class OutRecoverPro {

  //本地日历数据
  c: Array<CTbl> = new Array<CTbl>();
  //获取特殊日历
  sp: Array<SpTbl> = new Array<SpTbl>();
  //获取提醒数据
  e: Array<ETbl> = new Array<ETbl>();
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
  //用户偏好
  y: Array<YTbl> = new Array<YTbl>();
}
