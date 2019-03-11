import {Injectable} from '@angular/core';
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {UTbl} from "../sqlite/tbl/u.tbl";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class UserConfig {

  private settins: Map<string, Setting> = new Map<string, Setting>();

  constructor(private sqlliteExec: SqliteExec) {
  }

  user = {
    //账户ID
    id: "",
    //用户名
    name: "",
    //用户头像
    aevter: "",
    //出生日期
    bothday: "",
    //真实姓名
    realname: "",
    //身份证
    No: "",
    //性别
    sex: "",
    //联系方式
    contact: "",
  }


  account = {
    // 账户ID
    id: "",
    // 账户名
    name: "",
    // 手机号
    phone: "",
    // 设备号
    device: "",
    // token
    token: "",
    // 账户消息队列
    mq: "",
  }

  getSetting(key: string) {
    return this.settins.get(key);
  }

  init():Promise<any> {
    return new Promise((resolve,reject)=>{
      let yTbl: YTbl = new YTbl();
      //获取偏好设置
      this.sqlliteExec.getList(yTbl).then(data => {
        for (let y of data.rows) {
          let setting:Setting = new Setting();
          setting.bname = y.ytn;
          setting.typeB = y.yt;
          setting.name = y.yn;
          setting.type = y.yk;
          setting.value = y.yv;
          this.settins.set(setting.type,setting);
        }
        //获取账号信息
        let aTbl: ATbl = new ATbl();
        return this.sqlliteExec.getList(aTbl);
      }).then(data=>{
        if (data.rows.length() >0){
          this.account.id = data.rows[0].aI;
          this.account.name = data.rows[0].aN;
          this.account.phone = data.rows[0].aM;
          this.account.device = data.rows[0].aE;
          this.account.token = data.rows[0].aT;
          this.account.mq = data.rows[0].aQ;
        }
        //获取用户信息
        let uTbl: UTbl = new UTbl();
        return this.sqlliteExec.getList(uTbl);
      }).then(data=>{
        if (data.rows.length() >0){
          this.user.id = data.rows[0].aI;
          this.user.name = data.rows[0].uN;
          this.user.aevter = data.rows[0].hIU;
          this.user.bothday = data.rows[0].biy;
          this.user.No = data.rows[0].iC;
          this.user.realname = data.rows[0].rn;
          this.user.sex = data.rows[0].uS;
          this.user.contact = data.rows[0].uCt;
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
