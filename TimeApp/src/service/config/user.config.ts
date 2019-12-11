import {Injectable} from '@angular/core';
import {YTbl} from "../sqlite/tbl/y.tbl";
import {SqliteExec} from "../util-service/sqlite.exec";
import {ATbl} from "../sqlite/tbl/a.tbl";
import {UTbl} from "../sqlite/tbl/u.tbl";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {BhTbl} from "../sqlite/tbl/bh.tbl";
import {UtilService} from "../util-service/util.service";
import {EmitService} from "../util-service/emit.service";
import {DataConfig} from "./data.config";
import {FsData, PageDcData} from "../../data.mapping";
import {PlanData} from "../business/calendar.service";

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
    birthday: "",
    //真实姓名
    realname: "",
    //身份证
    ic: "",
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

  //个人计划
  static privateplans: Array<PlanData> = new Array<PlanData>();
  //内建计划
  static publicplans: Array<PlanData> = new Array<PlanData>();

  //重复调用防止
  static troublestop: Map<string, any> = new Map<string, any>();

  //群组
  static groups: Array<PageDcData> = new Array<PageDcData>();

  constructor(private sqlliteExec: SqliteExec,
              private util: UtilService,
              private emitService: EmitService) {
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
      UserConfig.user.birthday = rows[0].biy;
      UserConfig.user.ic = rows[0].ic;
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

  private async initTesterContacts(): Promise<Array<FsData>> {
    // 联系人用于测试
    let xiaopangzi: BTbl;
    let xiaohaizi: BTbl;
    let xiaolenzi: BTbl;
    let caoping: BTbl;
    let luojianfei: BTbl;
    let huitailang: BTbl;
    let xuezhenyang: BTbl;
    let liqiannan: BTbl;
    let huqiming: BTbl;
    let liying: BTbl;

    let datas: Array<FsData> = new Array<FsData>();
    let sqls: Array<string> = new Array<string>();

    //参与人
    let fsdata: FsData = new FsData();
    let btbl: BTbl = new BTbl();
    let bhtbl = new BhTbl();
    btbl.pwi = "xiaopangzi";
    btbl.ran = '小胖子';
    btbl.ranpy = 'xiaopangzi';
    btbl.hiu = '';
    btbl.rn = '张金洋';
    btbl.rnpy = 'zhangjinyang';
    btbl.rc = '15821947260';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    xiaopangzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = "xiaohaizi";
    btbl.ran = '小孩子';
    btbl.ranpy = 'xiaohaizi';
    btbl.hiu = '';
    btbl.rn = '许赵平';
    btbl.rnpy = 'xuzhaopin';
    btbl.rc = '13661617252';
    btbl.rel = '0';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    xiaohaizi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'liqiannan';
    btbl.ran = '李倩男';
    btbl.ranpy = 'liqiannan';
    btbl.hiu = '';
    btbl.rn = '李倩男';
    btbl.rnpy = 'liqiannan';
    btbl.rc = '18569990239';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    liqiannan = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'huqiming';
    btbl.ran = '胡启明';
    btbl.ranpy = 'huqiming';
    btbl.hiu = '';
    btbl.rn = '胡启明';
    btbl.rnpy = 'huqiming';
    btbl.rc = '15900857417';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    huqiming = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'liying';
    btbl.ran = '李滢';
    btbl.ranpy = 'liying';
    btbl.hiu = '';
    btbl.rn = '李滢';
    btbl.rnpy = 'liying';
    btbl.rc = '13795398627';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    liying = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'xiaolenzi';
    btbl.ran = '小楞子';
    btbl.ranpy = 'xiaolenzi';
    btbl.hiu = '';
    btbl.rn = '席理加';
    btbl.rnpy = 'xilijia';
    btbl.rc = '13585820972';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    xiaolenzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'caoping';
    btbl.ran = '草帽';
    btbl.ranpy = '草帽';
    btbl.hiu = '';
    btbl.rn = '漕屏';
    btbl.rnpy = 'caoping';
    btbl.rc = '16670129762';
    btbl.rel = '0';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    caoping = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'luojianfei';
    btbl.ran = '飞飞飞';
    btbl.ranpy = 'feifeifei';
    btbl.hiu = '';
    btbl.rn = '罗建飞';
    btbl.rnpy = 'luojianfei';
    btbl.rc = '13564242673';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    luojianfei = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'huitailang';
    btbl.ran = '灰太郎';
    btbl.ranpy = 'huitailang';
    btbl.hiu = '';
    btbl.rn = '丁朝辉';
    btbl.rnpy = 'dingchaohui';
    btbl.rc = '15737921611';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    huitailang = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    fsdata = new FsData();
    btbl = new BTbl();
    btbl.pwi = 'xuezhenyang';
    btbl.ran = '牛牛';
    btbl.ranpy = 'niuniu';
    btbl.hiu = '';
    btbl.rn = '薛震洋';
    btbl.rnpy = 'xuezhenyang';
    btbl.rc = '18602150145';
    btbl.rel = '1';
    btbl.ui = btbl.rc;
    sqls.push(btbl.inT());

    xuezhenyang = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    Object.assign(fsdata, btbl, bhtbl);
    datas.push(fsdata);

    await this.sqlliteExec.batExecSql(sqls);

    return datas;
  }

  //参与人
  private async RefreshBTbl() {
    let exists = UserConfig.friends.reduce((target, val) => {
      if (target.indexOf(val.rc) < 0) {
        target.push(val.rc);
      }
      return target;
    }, new Array<string>());

    //获取本地参与人
    let sql = `select gb.*,bh.hiu bhiu
               from gtd_b gb
                      left join gtd_bh bh on bh.pwi = gb.pwi;`;

    let data: Array<FsData> = await this.sqlliteExec.getExtList<FsData>(sql);

    for (let fs of data) {
      fs.bhiu = '';
      let index = exists.indexOf(fs.rc);

      if (index < 0) {
        UserConfig.friends.push(fs);
      } else {
        let pos = UserConfig.friends.findIndex((element) => {
          return (element.rc == fs.rc);
        });

        UserConfig.friends.splice(pos, 1, fs);
      }
    }
    //增加内部事件通知
    this.emitService.emit("mwxing.config.user.btbl.refreshed");
    return;
  }

  //群组
  private async RefreshGTbl() {
    //获取本地群列表
    let sql = `select * from gtd_g where del <> 'del';`;

    UserConfig.groups.splice(0, UserConfig.groups.length);
    let dcl: Array<PageDcData> = await this.sqlliteExec.getExtList<PageDcData>(sql)
    if (dcl.length > 0) {
      //和单群人数
      for (let dc of dcl) {
        dc.fsl = new Array<FsData>();
        let sqlbx = `select gb.* from gtd_b_x gbx inner join gtd_b gb on gb.pwi = gbx.bmi
        where gbx.bi='${dc.gi}' and gbx.del <> 'del';`;
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

    // 更新到缓存中
    let exist = UserConfig.friends.findIndex((element) => {
      return element.rc == fsData.rc;
    });

    if (exist >= 0) {
      UserConfig.friends.splice(exist, 1, fsData);
    } else {
      UserConfig.friends.push(fsData);
    }

    return fs;
  }

  GetOneBTbl(id: string): FsData {
    let fs : FsData = new FsData();
    fs =  UserConfig.friends.find(value => {
      return value.pwi == id || value.ui == id;
    });

    if  (fs){
      /*if (fs.bhiu == ""){
        fs.bhiu  = DataConfig.HUIBASE64;
      }*/
      fs.bhiu  = '';
    }
    return fs;
  }

  GetMultiBTbls(ids: Array<string>): Array<FsData> {
    let matches: string = ids.join(",");

    let fss : Array<FsData> = new Array<FsData>();
    fss =  UserConfig.friends.filter(value => {
      return ((matches.indexOf(value.pwi) >= 0) || (matches.indexOf(value.ui) >= 0));
    });

    if  (fss && fss.length > 0) {
      for (let fs of fss) {
        /*if (fs.bhiu == ""){
          fs.bhiu = DataConfig.HUIBASE64;
        }*/
        fs.bhiu = "";
      }
    }

    return fss;
  }

  GetOneBhiu(id: string): string {
    let bhiu :string = "";
    /*let fs : FsData = new FsData();
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
    }*/
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
