import {Injectable} from "@angular/core";
import {PermissionsService} from "../../service/cordova/permissions.service";
import {SqliteConfig} from "../../service/config/sqlite.config";
import {SqliteInit} from "../../service/sqlite/sqlite.init";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {RestFulConfig} from "../../service/config/restful.config";
import {WebsocketService} from "../../ws/websocket.service";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {GTbl} from "../../service/sqlite/tbl/g.tbl";
import {BxTbl} from "../../service/sqlite/tbl/bx.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {UserConfig} from "../../service/config/user.config";
import {AgdRestful} from "../../service/restful/agdsev";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {unitOfTime} from "moment";
import {StTbl} from "../../service/sqlite/tbl/st.tbl";
import {ContactsService} from "../../service/cordova/contacts.service";
import {BhTbl} from "../../service/sqlite/tbl/bh.tbl";
import {DataConfig} from "../../service/config/data.config";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {AlData} from "../../data.mapping";

@Injectable()
export class AlService {

  constructor(private permissionsService: PermissionsService,
              private sqlLiteConfig: SqliteConfig,
              private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
              private wsserivce: WebsocketService,
              private userConfig: UserConfig,
              private agdRestful: AgdRestful,
              private contactsService: ContactsService,
              private notificationsService: NotificationsService) {
  }

//权限申请
  checkAllPermissions(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.permissionsService.checkAllPermissions().then(data => {
        alData.text = "权限申请完成"
        resolve(alData);
      });
    });
  }

//创建或连接数据库
  createDB(): Promise<AlData> {
    console.log(moment().add(DataConfig.REINTERVAL, "s").format("YYYY/MM/DD HH:mm"));
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.sqlLiteConfig.generateDb().then(data => {
        alData.text = "数据库初始化完成"
        resolve(alData);
      })
    })
  }

  version: number = -1;

//判断是否初始化完成
  checkSystem(): Promise<AlData> {
    return new Promise(async (resolve, reject) => {

      let alData: AlData = new AlData();
      let yTbl: YTbl = new YTbl();
      yTbl.yt = "FI";
      this.sqlExce.getList<YTbl>(yTbl).then(data => {

        let stbls: Array<YTbl> = data;
        if (stbls.length > 0) {
          this.version = Number(stbls[0].yv);

          alData.text = "系统完成初始化";
          resolve(alData);
        } else {
          alData.text = "系统开始初始化";
          resolve(alData);
        }

      }).catch(err => {
        alData.text = "系统开始初始化";
        resolve(alData);
      })
    })
  }

//创建数据库表,初始化系统数据,初始化数据完成写入
  createSystemData(): Promise<AlData> {

    return new Promise(async (resolve, reject) => {

      let alData: AlData = new AlData();
      //创建表结构
      if (this.version == -1) {
        await this.sqlLiteInit.createTables();

        //每次都先导入联系人
        if (this.util.isMobile()) {
          await this.contactsService.asyncPhoneContacts().then(data => {
            //异步获取联系人信息
            this.contactsService.updateFs();
          })
        }

        let yTbl: YTbl = new YTbl();
        yTbl.yi = this.util.getUuid();
        yTbl.yt = "FI";
        yTbl.yk = "FI";
        yTbl.yv = "0";
        await this.sqlExce.save(yTbl);
        this.version = 0;

        await this.sqlLiteInit.initData();

        this.notificationsService.badgeClear();
      }


      //patch 修改DataConfig的version版本，只能改大，然后方法中例如createTablespath追加patch

      while (DataConfig.version > this.version) {

        await this.sqlLiteInit.createTablespath(this.version);
        let yTbl: YTbl = new YTbl();
        yTbl.yt = "FI";
        let stbls: Array<YTbl> = await this.sqlExce.getList<YTbl>(yTbl);
        yTbl.yi = stbls[0].yi;
        yTbl.yv = (++this.version).toString();
        await this.sqlExce.replaceT(yTbl);

      }


      // 在浏览器测试时使用测试数据
      if (!this.util.isMobile()) {
        await this.createTestData();
      }

      alData.text = "系统初始化完成";

      resolve(alData);
    })
  }


//连接webSocket
  connWebSocket(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      // 连接webSocket成功
      this.wsserivce.connect().then(data => {
        alData.text = "连接webSocket成功";
        resolve(alData);
      })
    });
  }

//系统设置
  setSetting(): Promise<AlData> {
    let alData: AlData = new AlData();

    //重新获取服务器数据
    this.sqlLiteInit.initDataSub()

    return new Promise(async (resolve, reject) => {
      // TODO 系统设置 restHttps设置 用户偏好设置 用户信息 。。。
      await this.restfulConfig.init();


      //提醒定时
      this.notificationsService.schedule();
      //保持后台运行
      //this.notificationsService.keeplive();

      //用户设置信息初始化
      await this.userConfig.init();

      alData.text = "系统设置完成";
      resolve(alData)

    })
  }

//判断用户是否登陆
  checkUserInfo(): Promise<AlData> {
    return new Promise((resolve, reject) => {
      // TODO 判断用户是否登陆
      let aTbl: ATbl = new ATbl();
      let alData: AlData = new AlData();
      this.sqlExce.getList<ATbl>(aTbl).then(data => {
        if (data.length > 0) {
          alData.text = "用户已登录";
          alData.islogin = true;
        } else {
          alData.text = "用户未登录";
          alData.islogin = false;
          resolve(alData);
        }

        resolve(alData);
      }).catch(err => {
        alData.text = "用户未登录";
        alData.islogin = false;
        resolve(alData);

      });
    });
  }

  createTestData(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {

      let start = moment('2019/04/01');
      let sqls = [];
      let stMap: Map<string, StTbl> = new Map<string, StTbl>();

      //计划
      let jhs: Array<JhTbl> = [];
      let jh: JhTbl = new JhTbl();
      jh.ji = this.util.getUuid();
      jh.jn = '冥王星计划';
      jh.jg = '冥王星计划';
      jh.jc = '#735e46';
      jh.jt = '2';
      sqls.push(jh.inT());

      jhs.push(jh);
      jh = new JhTbl();
      jh.jn = '白沙计划';
      jh.jg = '白沙计划';
      jh.jc = '#876a29';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '戒烟计划';
      jh.jg = '戒烟计划';
      jh.jc = '#cf4425';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();


      jh.jn = '老大养成计划';
      jh.jg = '老大养成计划';
      jh.jc = '#af2b24';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '西班牙旅游';
      jh.jg = '西班牙旅游';
      jh.jc = '#ad837d';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '职场进级';
      jh.jg = '职场进级';
      jh.jc = '#c077db';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '大学4年';
      jh.jg = '大学4年';
      jh.jc = '#453b93';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '你是我的初恋';
      jh.jg = '你是我的初恋';
      jh.jc = '#51aaf2';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '做过的那些傻事';
      jh.jg = '做过的那些傻事';
      jh.jc = '#35919c';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);
      jh = new JhTbl();

      jh.jn = '被你虐待的日子，幸福着痛苦着';
      jh.jg = '不能忘记这些';
      jh.jc = '#308158';
      jh.jt = '2';
      jh.ji = this.util.getUuid();
      sqls.push(jh.inT());
      jhs.push(jh);

      //参与人
      let btbls: Array<BTbl> = [];
      let btbl: BTbl = new BTbl();
      let bhtbl = new BhTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '小胖子';
      btbl.ranpy = 'xiaopangzi';
      btbl.hiu = '';
      btbl.rn = '张金洋';
      btbl.rnpy = 'zhangjinyang';
      btbl.rc = '15821947260';
      btbl.rel = '1';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '小孩子';
      btbl.ranpy = 'xiaohaizi';
      btbl.hiu = '';
      btbl.rn = '许赵平';
      btbl.rnpy = 'xuzhaopin';
      btbl.rc = '13661617252';
      btbl.rel = '0';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);


      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '小楞子';
      btbl.ranpy = 'xiaolenzi';
      btbl.hiu = '';
      btbl.rn = '席理加';
      btbl.rnpy = 'xilijia';
      btbl.rc = '13585820972';
      btbl.rel = '1';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '草帽';
      btbl.ranpy = '草帽';
      btbl.hiu = '';
      btbl.rn = '漕屏';
      btbl.rnpy = 'caoping';
      btbl.rc = '16670129762';
      btbl.rel = '0';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '飞飞飞';
      btbl.ranpy = 'feifeifei';
      btbl.hiu = '';
      btbl.rn = '罗建飞';
      btbl.rnpy = 'luojianfei';
      btbl.rc = '13564242673';
      btbl.rel = '1';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '灰太郎';
      btbl.ranpy = 'huitailang';
      btbl.hiu = '';
      btbl.rn = '丁朝辉';
      btbl.rnpy = 'dingchaohui';
      btbl.rc = '15737921611';
      btbl.rel = '1';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      btbl = new BTbl();
      btbl.pwi = this.util.getUuid();
      btbl.ran = '牛牛';
      btbl.ranpy = 'niuniu';
      btbl.hiu = '';
      btbl.rn = '薛震洋';
      btbl.rnpy = 'xuezhenyang';
      btbl.rc = '18602150145';
      btbl.rel = '1';
      btbl.ui = btbl.rc;
      sqls.push(btbl.inT());
      btbls.push(btbl);

      bhtbl = new BhTbl();
      bhtbl.bhi = this.util.getUuid();
      bhtbl.pwi = btbl.pwi;
      bhtbl.hiu = DataConfig.HUIBASE64;
      sqls.push(bhtbl.inT());

      //群组
      let gtbl: GTbl = new GTbl();
      gtbl.gi = this.util.getUuid();
      gtbl.gn = '拼命三郎';
      gtbl.gm = '拼命三郎'
      gtbl.gnpy = 'pinmingsanlang';
      sqls.push(gtbl.inT());

      //群组关系
      let bxtbl: BxTbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[0].pwi;
      sqls.push(bxtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[1].pwi;
      sqls.push(bxtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[3].pwi;
      sqls.push(bxtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[5].pwi;
      sqls.push(bxtbl.inT());

      gtbl = new GTbl();
      gtbl.gi = this.util.getUuid();
      gtbl.gn = '合作二人组合';
      gtbl.gm = '合作二人组合'
      gtbl.gnpy = 'hezuoerrenzuhe';
      sqls.push(gtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[2].pwi;
      sqls.push(bxtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[4].pwi;
      sqls.push(bxtbl.inT());

      bxtbl = new BxTbl();
      bxtbl.bi = gtbl.gi;
      bxtbl.bmi = btbls[5].pwi;
      sqls.push(bxtbl.inT());


      let ss: Array<string> = [];
      ss.push("这是一个测试日程");
      ss.push("跑步");
      ss.push("一起吃饭");
      ss.push("会见xi大大");
      ss.push("关于日程的讨论会，没有什么事情的话，都必须要参加的");
      ss.push("赶飞机");
      ss.push("有一个密码你可知道吗?");
      ss.push("未来过去和现在，都可以预测的");
      ss.push("你希望你是一个人，其实你的前生已近出卖了你的今天，你还是一个人吗");
      ss.push("无语");
      ss.push("节前5000元");
      ss.push("thanks ");
      ss.push("好吧，好的");
      ss.push("冰与火之歌");
      ss.push("看过不良人吗");
      ss.push("周末加班");

      for (let i = 0; i < 1; i++) {
        start = moment('2019/01/01');
        let r = this.util.randInt(-65, 65);
        let t = this.util.randInt(0, 24);
        let jh_i = this.util.randInt(0, 20);
        let jh_id = "";
        let r_i = this.util.randInt(0, 15);
        let r_i2 = this.util.randInt(0, 15);
        let c_r = this.util.randInt(-5, 10);
        let c_r2 = this.util.randInt(0, 5);
        let c_r3 = this.util.randInt(-10, 4);

        if (jh_i < 10) {
          jh_id = jhs[jh_i].ji;
        }

        let d = start.add(r, 'd').add(t, 'h');
        let c: CTbl = new CTbl();

        c.si = this.util.getUuid();
        c.sn = ss[r_i];
        c.sd = d.format('YYYY/MM/DD');
        c.st = d.format('HH:mm');
        if (c_r3 == 1) {
          c.ed = moment(c.sd).add(1, "y").format("YYYY/MM/DD");
          c.rt = "1";
        } else if (c_r3 == 2) {
          c.ed = moment(c.sd).add(1, "y").format("YYYY/MM/DD");
          c.rt = "2";
        } else if (c_r3 == 3) {
          c.ed = moment(c.sd).add(3, "y").format("YYYY/MM/DD");
          c.rt = "3";

        } else if (c_r3 == 4) {
          c.ed = moment(c.sd).add(20, "y").format("YYYY/MM/DD");
          c.rt = "4";
        } else {
          c.ed = c.sd;
          c.rt = "0";
        }
        c.et = '24:00'

        c.sr = c.si;
        c.ji = jh_id;
        c.bz = ss[r_i2];

        if (c_r > 6 && c_r < 0) {
          c.du = "0"
          c.ui = btbls[c_r2].pwi;
          c.gs = "0";
        } else {
          c.du = "1"
          c.ui = 'slef';
          c.gs = "1";
        }

        sqls.push(c.inT());

        let len = 0;
        let add: unitOfTime.DurationConstructor;

        if (c.rt == '1') {
          len = 365;
          add = 'd';

        } else if (c.rt == '2') {
          len = 53;
          add = "w";
        } else if (c.rt == '3') {
          len = 36;
          add = "M"
        } else if (c.rt == '4') {
          len = 30;
          add = "y"
        } else if (c.rt == '0') {
          len = 1;
          add = "d"
        }
        let sql = new Array<string>();
        for (let i = 0; i < len; i++) {
          let sp = new SpTbl();
          let eTbl: ETbl = new ETbl();
          sp.spi = this.util.getUuid();
          eTbl.wi = this.util.getUuid();
          sp.si = c.si;
          eTbl.si = sp.spi;
          eTbl.st = c.sn;
          sp.sd = moment(c.sd).add(i, add).format("YYYY/MM/DD");
          sp.st = c.st;
          let rem = moment(sp.sd + " " + sp.st).add(5, "m");
          eTbl.wd = rem.format("YYYY/MM/DD");
          eTbl.wt = rem.format("HH:mm");
          if (c.rt == '0')
            sp.itx = 1;
          else
            sp.itx = 0;
          sqls.push(sp.inT());
          sqls.push(eTbl.inT());
          // if (!stMap.get(sp.sd)){
          //   let st:StTbl = new StTbl();
          //   st.c = 0;
          //   st.bz = "";
          //   st.n = 0;
          //   if(c.rt=='0'){
          //     st.n = st.n  + 1;
          //   }
          //   st.d = sp.sd;
          //   stMap.set(sp.sd,st);
          // }else{
          //   stMap.get(sp.sd).c = (stMap.get(sp.sd).c + 1);
          // }
        }

        c_r2 = 6;
        if (!(c_r > 6 && c_r < 0)) {
          while (c_r > -1) {

            c_r2 = this.util.randInt(0, c_r2 - 1);
            c_r--;
            if (c_r2 < 1) break;

            let dtbl: DTbl = new DTbl();

            dtbl.pi = this.util.getUuid();
            dtbl.si = c.si;
            dtbl.ai = btbls[c_r2].pwi;
            sqls.push(dtbl.inT());
          }

        }
      }
      // stMap.forEach((v,k,map) =>{
      //   sqls.push(v.inT());
      // })

      this.sqlExce.batExecSql(sqls).then(c => {

        let sql: string = `delete from gtd_e where wd <= '${moment().subtract(1, "d").format("YYYY/MM/DD")}';`
        this.sqlExce.execSql(sql);
        resolve(true);
      });
    })
  }

}
