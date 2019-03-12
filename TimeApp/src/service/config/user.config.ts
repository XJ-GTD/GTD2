import {Injectable} from '@angular/core';
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {UTbl} from "../sqlite/tbl/u.tbl";
import {DataConfig} from "./data.config";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class UserConfig {


  constructor(private sqlliteExec: SqliteExec) {
  }

  getSetting(key: string) {
    return DataConfig.settins.get(key);
  }

  init():Promise<any> {
    return new Promise((resolve,reject)=>{
      let yTbl: YTbl = new YTbl();
      //获取偏好设置
      this.sqlliteExec.getList(yTbl).then(rows => {
        for (let y of rows) {
          let setting:Setting = new Setting();
          setting.bname = y.ytn;
          setting.typeB = y.yt;
          setting.name = y.yn;
          setting.type = y.yk;
          setting.value = y.yv;
          DataConfig.settins.set(setting.type,setting);
        }
        //获取账号信息
        let aTbl: ATbl = new ATbl();
        return this.sqlliteExec.getList(aTbl);
      }).then(rows=>{
        if (rows.length >0){
          DataConfig.account.id = rows[0].aI;
          DataConfig.account.name = rows[0].aN;
          DataConfig.account.phone = rows[0].aM;
          DataConfig.account.device = rows[0].aE;
          DataConfig.account.token = rows[0].aT;
          DataConfig.account.mq = rows[0].aQ;
        }
        //获取用户信息
        let uTbl: UTbl = new UTbl();
        return this.sqlliteExec.getList(uTbl);
      }).then(rows=>{
        if (rows.length >0){
          DataConfig.user.id = rows[0].aI;
          DataConfig.user.name = rows[0].uN;
          DataConfig.user.aevter = rows[0].hIU;
          DataConfig.user.bothday = rows[0].biy;
          DataConfig.user.No = rows[0].iC;
          DataConfig.user.realname = rows[0].rn;
          DataConfig.user.sex = rows[0].uS;
          DataConfig.user.contact = rows[0].uCt;
        }

        resolve();
      }).catch(err=>{
        reject(err);
      })
    })
  }

}

export class Setting {
  // 偏好设置类型
  typeB: string = "";
  // 偏好设置类型名称
  bname: string = "";
  // 偏好设置名称
  name: string = "";
  // 偏好设置key
  type: string = "";
  // 偏好设置value
  value: string = "";
}
