import {Injectable} from '@angular/core';
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {UTbl} from "../sqlite/tbl/u.tbl";
import {UtilService} from "../util-service/util.service";
import {EmitService} from "../util-service/emit.service";
import {DataConfig} from "./data.config";
import {FsData, PageDcData} from "../../data.mapping";

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
  static allsettins: Map<string, Setting> = new Map<string, Setting>();

  //参与人
  static friends: Array<FsData> = new Array<FsData>();

  //重复调用防止
  static troublestop: Map<string, any> = new Map<string, any>();

  //群组
  static groups: Array<PageDcData> = new Array<PageDcData>();

  constructor(private sqlliteExec: SqliteExec, private util: UtilService, private emitService: EmitService) {
  }

  async init() {
    await this.RefreshYTbl();
    await this.RefreshUTbl();
    await this.RefreshATbl();
    await this.RefreshBTbl();
    await this.RefreshGTbl();
  }

  static getSetting(key: string):boolean {
    return UserConfig.settins.get(key)? (UserConfig.settins.get(key).value == "1") : false;
  }

  static getSettingWithType(type:string, key: string): Setting {
    let keys = UserConfig.getSettings(type);

    if (keys && keys.length > 0) {
      let matches = keys.filter((element, index, array) => {
        return (element.type == key);
      });

      if (matches && matches.length > 0) {
        return matches[0];
      }
    }

    return null;
  }

  static getSettings(type: string) {
    let a = Array.from(UserConfig.allsettins.values());
    return a.filter((element, index, array) => {
      return (element.typeB == type);
    });
  }

  // 2019/05/10
  // 席理加
  // 设置客户端设备ID,版本更新时不同机型会产生不同的设备ID,需要缓存保证一致
  // 在系统初始化前访问时,无法获得缓存的设备ID,需要直接获取,所产生的差异不会影响后续功能
  static getDeviceId():string {
    return UserConfig.settins.get("DI")? UserConfig.settins.get("DI").value : "No device Id";
  }

  // 2019/05/11
  // 席理加
  // 用于关于页面显示当前客户端版本号
  static getClientVersion():string {
    return UserConfig.settins.get("FI")? UserConfig.settins.get("FI").value : "1";
  }

  static getTroubleStop(key: string) {
    return UserConfig.troublestop.get(key);
  }

  static setTroubleStop(key: string, value: any) {
    UserConfig.troublestop.set(key, value);
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
      UserConfig.allsettins.set(setting.yi, setting);
    }
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.ytbl.refreshed");
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
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.utbl.refreshed");
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
      UserConfig.account.device = UserConfig.getDeviceId();
      UserConfig.account.token = "";
      UserConfig.account.mq = "";
    }
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.atbl.refreshed");
    return;
  }

  public async RefreshFriend() {
    await this.RefreshBTbl();
    await this.RefreshGTbl();
    return;

  }

  static getAvatar(phoneno: string): string {
    let targets = UserConfig.friends.filter((element, index, array) => {
      return (element.rc == phoneno || element.ui == phoneno);
    });

    if (targets && targets.length > 0) {
      return targets[0].bhiu;
    }

    return DataConfig.HUIBASE64;
  }

  static getAvatars(phonenos: Array<string>): Array<any> {
    if (!phonenos || phonenos.length <= 0) {
      return [];
    }

    let targets = UserConfig.friends.filter((element, index, array) => {
      return (phonenos.indexOf(element.rc) > -1 || phonenos.indexOf(element.ui) > -1);
    });

    if (targets && targets.length > 0) {
      let avatars: Array<any> = new Array<any>();

      for (let target of targets) {
        avatars.push({rc: target.rc, name: target.ran || target.rn, bhiu: target.bhiu});
      }

      return avatars;
    }

    return [];
  }

  //参与人
  private async RefreshBTbl() {
    //获取本地参与人
    let sql = `select gb.*,bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;
    UserConfig.friends.splice(0, UserConfig.friends.length);

    let data: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sql);
    for (let fs of data) {
      if (!fs.bhiu || fs.bhiu == '') {
        fs.bhiu = DataConfig.HUIBASE64;
      }
      UserConfig.friends.push(fs);
    }
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.btbl.refreshed");
    return;
  }

  //群组
  private async RefreshGTbl() {
    //获取本地群列表
    let sql = 'select * from gtd_g;';

    UserConfig.groups.splice(0, UserConfig.groups.length);
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
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.gtbl.refreshed");
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
    console.log('GetOneBTbl with id ' + id);
    let fs : FsData = new FsData();
    fs =  UserConfig.friends.find(value => {
      return value.pwi == id || value.ui == id;
    });

    if  (fs){
      if (fs.bhiu == ""){
        fs.bhiu  = DataConfig.HUIBASE64;
      }
    }
    return fs;
  }

  GetMultiBTbls(ids: Array<string>): Array<FsData> {
    console.log('GetMultiBTbls with ids ' + ids.join(","));

    let matches: string = ids.join(",");

    let fss : Array<FsData> = new Array<FsData>();
    fss =  UserConfig.friends.filter(value => {
      return ((matches.indexOf(value.pwi) >= 0) || (matches.indexOf(value.ui) >= 0));
    });

    if  (fss && fss.length > 0) {
      for (let fs of fss) {
        if (fs.bhiu == ""){
          fs.bhiu = DataConfig.HUIBASE64;
        }
      }
    }

    return fss;
  }

  GetOneBhiu(id: string): string {
    let bhiu :string = "";
    let fs : FsData = new FsData();
    fs  = UserConfig.friends.find(value => {
      return value.pwi == id || value.ui == id;
    });
    if  (fs){
      if (fs.bhiu == ""){
        bhiu  = DataConfig.HUIBASE64;
      }else{
        bhiu  = fs.bhiu;
      }

    }else{
      bhiu = DataConfig.HUIBASE64;
    }
    return bhiu;
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
