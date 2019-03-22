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


  static user = {
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

  static account = {
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

  static settins: Map<string, Setting> = new Map<string, Setting>();


  constructor(private sqlliteExec: SqliteExec) {
  }

  async init(){
    await this.RefreshYTbl();
    await this.RefreshUTbl();
    await this.RefreshATbl();
  }

  getSetting(key: string) {
    return UserConfig.settins.get(key).value;
  }

  RefreshYTbl():Promise<any> {
      let yTbl: YTbl = new YTbl();
      //获取偏好设置
      return this.sqlliteExec.getList<YTbl>(yTbl).then(rows => {
        for (let y of rows) {
          let setting:Setting = new Setting();
          setting.bname = y.ytn;
          setting.typeB = y.yt;
          setting.name = y.yn;
          setting.type = y.yk;
          setting.value = y.yv;
          UserConfig.settins.set(setting.type,setting);
        }
    })
  }

  RefreshUTbl():Promise<any> {
      //获取用户信息
      let uTbl: UTbl = new UTbl();
      return this.sqlliteExec.getList<UTbl>(uTbl).then(rows=>{
        if (rows.length >0){
          UserConfig.user.id = rows[0].ai
          UserConfig.user.name = rows[0].un;
          UserConfig.user.aevter = rows[0].hiu;
          UserConfig.user.bothday = rows[0].biy;
          UserConfig.user.No = rows[0].ic;
          UserConfig.user.realname = rows[0].rn;
          UserConfig.user.sex = rows[0].us;
          UserConfig.user.contact = rows[0].uct;
        }
      })
  }

  RefreshATbl():Promise<any> {

    //获取账号信息
    let aTbl: ATbl = new ATbl();
    return this.sqlliteExec.getList<ATbl>(aTbl).then(rows=>{
      if (rows.length >0){
        UserConfig.account.id = rows[0].ai;
        UserConfig.account.name = rows[0].an;
        UserConfig.account.phone = rows[0].am;
        UserConfig.account.device = rows[0].ae;
        UserConfig.account.token = rows[0].at;
        UserConfig.account.mq = rows[0].aq;
      }
    });
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
