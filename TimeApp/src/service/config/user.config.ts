import {Injectable} from '@angular/core';
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {UTbl} from "../sqlite/tbl/u.tbl";
import {UtilService} from "../util-service/util.service";
import {FsData} from "../pagecom/pgbusi.service";
import {DataConfig} from "./data.config";
import {PageDcData} from "../../pages/gc/gc.service";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class UserConfig {


  static user = {
    //用户ID
    id: "",
    //账户ID
    aid: "",
    //用户名
    name: "",
    //用户头像
    avatar: "",
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
  };

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
  };


  //系统设置
  static settins: Map<string, Setting> = new Map<string, Setting>();

  //参与人
  static friends: Array<FsData> = new Array<FsData>();

  //群组
  static groups: Array<PageDcData> = new Array<PageDcData>();

  constructor(private sqlliteExec: SqliteExec, private util: UtilService) {
  }

  async init() {
    await this.RefreshYTbl();
    await this.RefreshUTbl();
    await this.RefreshATbl();
    await this.RefreshBTbl();
    await this.RefreshGTbl();
  }

  getSetting(key: string) {
    return UserConfig.settins.get(key).value;
  }

  public async RefreshYTbl() {
    let yTbl: YTbl = new YTbl();
    //获取偏好设置
    let rows: Array<YTbl> = await this.sqlliteExec.getList<YTbl>(yTbl)
    for (let y of rows) {
      let setting: Setting = new Setting();
      setting.yi = y.yi;
      setting.bname = y.ytn;
      setting.typeB = y.yt;
      setting.name = y.yn;
      setting.type = y.yk;
      setting.value = y.yv;
      UserConfig.settins.set(setting.type, setting);
    }
    return;
  }

  public async RefreshUTbl() {
    //获取用户信息
    let uTbl: UTbl = new UTbl();
    let rows: Array<UTbl> = await this.sqlliteExec.getList<UTbl>(uTbl);
    if (rows.length > 0) {
      UserConfig.user.id = rows[0].ui;
      UserConfig.user.aid = rows[0].ai;
      UserConfig.user.name = rows[0].un;
      UserConfig.user.avatar = rows[0].hiu;
      UserConfig.user.bothday = rows[0].biy;
      UserConfig.user.No = rows[0].ic;
      UserConfig.user.realname = rows[0].rn;
      UserConfig.user.sex = rows[0].us;
      UserConfig.user.contact = rows[0].uct;
    }
    ;
    return;
  }

  public async RefreshATbl() {
    //获取账号信息
    let aTbl: ATbl = new ATbl();
    let rows: Array<ATbl> = await this.sqlliteExec.getList<ATbl>(aTbl)
    if (rows.length > 0) {
      UserConfig.account.id = rows[0].ai;
      UserConfig.account.name = rows[0].an;
      UserConfig.account.phone = rows[0].am;
      UserConfig.account.device = rows[0].ae;
      UserConfig.account.token = rows[0].at;
      UserConfig.account.mq = rows[0].aq;
    } else {
      UserConfig.account.name = "";
      UserConfig.account.phone = "";
      UserConfig.account.device = this.util.deviceId();
      UserConfig.account.token = "";
      UserConfig.account.mq = "";
    }
    return;
  }

  public async RefreshFriend() {
    await this.RefreshBTbl();
    await this.RefreshGTbl;
    return;

  }

  //参与人
  private async RefreshBTbl() {
    //获取本地参与人
    let sql = `select gb.*,bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.ui;`;
    UserConfig.friends.splice(0, UserConfig.friends.length - 1);

    let data: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sql);
    for (let fs of data) {
      if (!fs.bhiu || fs.bhiu == null || fs.bhiu == '') {
        fs.hiu = DataConfig.HUIBASE64;
      } else {
        fs.hiu = fs.bhiu;
      }
      UserConfig.friends.push(fs);
    }
    return;
  }

  //群组
  private async RefreshGTbl() {
    //获取本地群列表
    let sql = 'select * from gtd_g;';

    UserConfig.groups.splice(0, UserConfig.groups.length - 1);
    let dcl: Array<PageDcData> = await this.sqlliteExec.getExtList<PageDcData>(sql)
    if (dcl.length > 0) {
      //和单群人数
      for (let dc of dcl) {
        dc.fsl = new Array<FsData>();
        let sqlbx = 'select gb.* from gtd_b_x gbx inner join gtd_b gb on gb.pwi = gbx.bmi where gbx.bi="' + dc.gi + '";';
        let fsl: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sqlbx);
        for (let fs of fsl) {
          let fsd: FsData = this.GetOneBTbl(fs.pwi);
          if (!dc.fsl) {
            dc.fsl = new Array<FsData>(); //群组成员
          }
          if (fsd) {
            dc.fsl.push(fsd);
          }
        }
        dc.gc = dc.fsl.length;
        dc.gm = DataConfig.QZ_HUIBASE64;
        UserConfig.groups.push(dc);
      }
    }
    return;
  }

  RefreshOneBTbl(fsData: FsData): FsData {
    let fs: FsData;
    fs = this.GetOneBTbl(fsData.pwi);
    if (fs) {
      Object.assign(fs, fsData);
    }
    return fs;
  }

  GetOneBTbl(id: string): FsData {
    return UserConfig.friends.find(value => {
      return value.pwi == id;
    })
  }
}

export class Setting {
  // 偏好ID
  yi: string = "";
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
