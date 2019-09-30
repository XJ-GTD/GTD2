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
import {CycleType, IsWholeday, OverType, PlanItemType, PlanType, ToDoListStatus} from "../../data.enum";
import {AgendaData, EventService, MiniTaskData, RtJson, TaskData} from "../../service/business/event.service";
import {MemoData, MemoService} from "../../service/business/memo.service";
import {CalendarService, PlanData, PlanItemData, PlanMember} from "../../service/business/calendar.service";
import {EmitService} from "../../service/util-service/emit.service";
import {JhaTbl} from "../../service/sqlite/tbl/jha.tbl";

@Injectable()
export class AlService {

  constructor(private permissionsService: PermissionsService,
              private sqlLiteConfig: SqliteConfig,
              private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private restfulConfig: RestFulConfig,
              private wsserivce: WebsocketService,
              private userConfig: UserConfig,
              private agdRestful: AgdRestful,
              private contactsService: ContactsService,
              private notificationsService: NotificationsService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private memoService: MemoService) {
  }

//权限申请
  checkAllPermissions(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.permissionsService.checkAllPermissions().then(data => {

        alData.text = "权限申请完成"
        resolve(alData);
      }).catch(err => {
        alData.text = "权限申请失败"
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
      }).catch(err => {
        alData.text = "数据库初始化失败"
        resolve(alData);
      });
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
    let alData: AlData = new AlData();
    return new Promise(async (resolve, reject) => {
      try {

        //创建表结构
        if (this.version == -1) {
          await this.sqlLiteInit.createTables();

          //每次都先导入联系人
          if (this.util.isMobile()) {
            await this.contactsService.asyncPhoneContacts();
            //异步获取联系人信息
            this.contactsService.updateFs();


            await this.createcal();
          } else {
            // 在浏览器测试时使用测试数据
            // await this.createTestData();
            await this.createcal();
          }

          // 设置客户端初始化版本号
          let verTbl: YTbl = new YTbl();
          verTbl.yi = this.util.getUuid();
          verTbl.yt = "FI";
          verTbl.yk = "FI";
          verTbl.yv = "0";
          await this.sqlExce.save(verTbl);

          this.version = 0;

          await this.sqlLiteInit.initData();

          this.notificationsService.badgeClear();

        }


        //patch 修改DataConfig的version版本，只能改大，然后方法中例如createTablespath追加patch
        let fromversion = this.version;

        while (DataConfig.version > this.version) {

          await this.sqlLiteInit.createTablespath(this.version + 1, fromversion);
          let yTbl: YTbl = new YTbl();
          yTbl.yt = "FI";
          yTbl.yk = "FI";
          let stbls: Array<YTbl> = await this.sqlExce.getList<YTbl>(yTbl);
          if (stbls.length > 0) yTbl.yi = stbls[0].yi; else yTbl.yi = this.util.getUuid();
          yTbl.yv = (++this.version).toString();
          await this.sqlExce.replaceT(yTbl);

        }


        alData.text = "系统数据初始化完成";

        resolve(alData);
      } catch (e) {
        alData.text = "系统数据初始化失败";

        resolve(alData);
      }
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

    return new Promise(async (resolve, reject) => {


      try {

        //重新获取服务器数据
        await this.sqlLiteInit.initDataSub();

        // TODO 系统设置 restHttps设置 用户偏好设置 用户信息 。。。
        await this.restfulConfig.init();


        // 下载公共日历
        await this.calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);


        //提醒定时
        this.notificationsService.schedule();
        //保持后台运行
        //this.notificationsService.keeplive();

        //用户设置信息初始化
        await this.userConfig.init();

        alData.text = "系统设置完成";
        resolve(alData)
      } catch (e) {
        alData.text = "系统设置失败";
        resolve(alData)
      }

    })
  }

//判断用户是否登陆
  checkUserInfo(): Promise<AlData> {
    return new Promise((resolve, reject) => {
      // TODO 判断用户是否登陆
      let aTbl: ATbl = new ATbl();
      let alData: AlData = new AlData();

      this.sqlExce.getList<ATbl>(aTbl).then(async (data) => {
        UserConfig.privateplans = await this.calendarService.fetchPrivatePlans();

        this.emitService.destroy("mwxing.calendar.plans.changed");
        this.emitService.register("mwxing.calendar.plans.changed", (data) => {
          if (!data) {
            return;
          }

          // 多条数据同时更新/单条数据更新
          if (data instanceof Array) {
            for (let single of data) {
              UserConfig.privateplans = this.calendarService.mergePlans(UserConfig.privateplans, single);
            }
          } else {
            UserConfig.privateplans = this.calendarService.mergePlans(UserConfig.privateplans, data);
          }
        });

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

  // 联系人用于测试
  xiaopangzi: BTbl;
  xiaohaizi: BTbl;
  xiaolenzi: BTbl;
  caoping: BTbl;
  luojianfei: BTbl;
  huitailang: BTbl;
  xuezhenyang: BTbl;

  async prepareContacts() {
    let sqls: Array<string> = new Array<string>();

    // 删除已存在数据
    let b: BTbl = new BTbl();
    await this.sqlExce.drop(b);
    await this.sqlExce.create(b);

    let bh: BhTbl = new BhTbl();
    await this.sqlExce.drop(bh);
    await this.sqlExce.create(bh);

    let g: GTbl = new GTbl();
    await this.sqlExce.drop(g);
    await this.sqlExce.create(g);

    let bx: BxTbl = new BxTbl();
    await this.sqlExce.drop(bx);
    await this.sqlExce.create(bx);

    //参与人
    let btbls: Array<BTbl> = [];
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
    btbls.push(btbl);

    this.xiaopangzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.xiaohaizi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.xiaolenzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.caoping = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.luojianfei = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.huitailang = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = this.util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    this.xuezhenyang = btbl;

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

    await this.sqlExce.batExecSql(sqls);

    return btbls;
  };

  async createcal() {

    let day: string = "2018/09/01";
    let end: string = "2022/01/18";
    let timeranges: Array<Array<string>> = [
      ["08:20", "09:00"],
      ["09:30", "10:15"],
      ["10:25", "11:05"],
      ["14:00", "14:40"],
      ["14:50", "15:35"],
      ["15:45", "16:25"]
    ];


    let btbls: Array<BTbl> = await this.prepareContacts();

    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evn = "结婚纪念日前给太太买礼物";

    await this.eventService.saveMiniTask(minitask);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";
    task.todolist = ToDoListStatus.On;

    await this.eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await this.memoService.saveMemo(memo);

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = moment().format("YYYY/MM/DD");
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await this.calendarService.savePlanItem(planitem1);

    // 自定义日历

    let plans: Array<PlanData> = new Array<PlanData>();
    let plan: PlanData = {} as PlanData;

    plan.jn = '2018年第一学期 课程表';
    plan.jc = '#ababab';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<PlanMember>();

    for (let contact of [this.xiaopangzi, this.xiaohaizi, this.xuezhenyang]) {
      let member: PlanMember = {} as PlanMember;

      member.pwi = contact.pwi;
      member.ui = contact.ui;

      plan.members.push(member);
    }

    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    let math1: AgendaData = {} as AgendaData;

    let math1rt: RtJson = new RtJson();
    math1rt.cycletype = CycleType.week;
    math1rt.openway.push(1);
    math1rt.openway.push(5);
    math1rt.over.type = OverType.limitdate;
    math1rt.over.value = end;

    math1.ji = plan.ji;
    math1.sd = day;
    math1.al = IsWholeday.NonWhole;
    math1.st = timeranges[0][0];
//math1.et = timeranges[0][1];
    math1.ct = 40;  // 持续40分钟
    math1.evn = "数学";
    math1.rtjson = math1rt;
    math1.todolist = ToDoListStatus.On;

    await this.eventService.saveAgenda(math1);


    //计划
    plan = {} as PlanData;
    plan.jn = '2018年第一学期 课程表';
    plan.jc = '#ababab';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '冥王星计划';
    plan.jc = '#735e46';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '白沙计划';
    plan.jc = '#876a29';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '戒烟计划';
    plan.jc = '#cf4425';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);

    plan = {} as PlanData;
    plan.jn = '老大养成计划';
    plan.jc = '#af2b24';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '西班牙旅游';
    plan.jc = '#ad837d';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '职场进级';
    plan.jc = '#c077db';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '大学4年';
    plan.jc = '#453b93';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '你是我的初恋';
    plan.jc = '#51aaf2';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '做过的那些傻事';
    plan.jc = '#35919c';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '被你虐待的日子，幸福着痛苦着';
    plan.jc = '#308158';
    plan.jt = PlanType.PrivatePlan;
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    plan = {} as PlanData;
    plan.jn = '长AAABBBBVVVVDDDDDDDAAABBBBVVVVDDDDDDD';
    plan.jc = '#308158';
    plan = await this.calendarService.savePlan(plan);
    plans.push(plan);


    let ss: Array<string> = [];
    ss.push("跑步");
    ss.push("一起吃饭");
    ss.push("关于日程的讨论会，没有什么事情的话，都必须要参加的");
    ss.push("赶飞机");
    ss.push("未来过去和现在，都可以预测的");
    ss.push("你希望你是一个人，其实你的前生已近出卖了你的今天，你还是一个人吗");
    ss.push("节前5000元");
    ss.push("thanks ");

    for (let i = 0; i < 100; i++) {
      let start = moment('2019/01/01');
      let r = this.util.randInt(-100, 100);
      let t = this.util.randInt(0, 24);
      let jh_i = this.util.randInt(0, 20);
      let jh_id = "";
      let r_i = this.util.randInt(0,7);
      let c_r3 = this.util.randInt(-10, 4);

      if (jh_i < 10) {
        jh_id = plans[jh_i].ji;
      }

      let d = start.add(r, 'd').add(t, 'h');


      let agendaData: AgendaData = {} as AgendaData;

      let repert: RtJson = new RtJson();
      if (c_r3 == 1) {
        repert.cycletype = CycleType.day;
        repert.over.type = OverType.fornever;
      } else if (c_r3 == 2) {

        repert.cycletype = CycleType.week;
        repert.over.type = OverType.fornever;
      } else if (c_r3 == 3) {
        repert.cycletype = CycleType.month;
        repert.over.type = OverType.fornever;

      } else if (c_r3 == 4) {
        repert.cycletype = CycleType.year;
        repert.over.type = OverType.fornever;
      } else {
        repert.cycletype = CycleType.close;
      }


      agendaData.ji = jh_id;
      agendaData.sd = d.format('YYYY/MM/DD');
      ;
      agendaData.al = IsWholeday.NonWhole;
      agendaData.st = d.format('HH:mm');
      agendaData.ct = 40;  // 持续40分钟
      agendaData.evn = ss[r_i];
      agendaData.rtjson = repert;
      agendaData.todolist = ToDoListStatus.On;

      await this.eventService.saveAgenda(agendaData);

    }


  }


//   async createcal() {
//
//     let day: string = "2018/09/01";
//     let end: string = "2022/01/18";
//     let timeranges: Array<Array<string>> = [
//       ["08:20", "09:00"],
//       ["09:30", "10:15"],
//       ["10:25", "11:05"],
//       ["14:00", "14:40"],
//       ["14:50", "15:35"],
//       ["15:45", "16:25"]
//     ];
//
//
//     await this.prepareContacts();
//     // 小任务
//     let minitask: MiniTaskData = {} as MiniTaskData;
//
//     minitask.evn = "结婚纪念日前给太太买礼物";
//
//     await this.eventService.saveMiniTask(minitask);
//
//     // 任务
//     let task: TaskData = {} as TaskData;
//
//     task.evn = "结婚纪念日前给太太买礼物";
//     task.todolist = ToDoListStatus.On;
//
//     await this.eventService.saveTask(task);
//
//     // 备忘
//     let memo: MemoData = {} as MemoData;
//
//     memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";
//
//     await this.memoService.saveMemo(memo);
//
//     // 日历项
//     let planitem1: PlanItemData = {} as PlanItemData;
//
//     planitem1.sd = moment().format("YYYY/MM/DD");
//     planitem1.jtn = "结婚纪念日";
//     planitem1.jtt = PlanItemType.Activity;
//
//     await this.calendarService.savePlanItem(planitem1);
//
//     // 自定义日历
//     let plan: PlanData = {} as PlanData;
//
//     plan.jn = '2018年第一学期 课程表';
//     plan.jc = '#ababab';
//     plan.jt = PlanType.PrivatePlan;
//
//     plan.members = new Array<PlanMember>();
//
//     for (let contact of [this.xiaopangzi, this.xiaohaizi, this.xuezhenyang]) {
//       let member: PlanMember = {} as PlanMember;
//
//       member.pwi = contact.pwi;
//       member.ui = contact.ui;
//
//       plan.members.push(member);
//     }
//
//     plan = await this.calendarService.savePlan(plan);
//
// // 数学 | 语文 | 语文 | 语文 | 数学   08:20 ~ 09:00
// // 第一节课 星期一、星期五 数学
//     let math1: AgendaData = {} as AgendaData;
//
//     let math1rt: RtJson = new RtJson();
//     math1rt.cycletype = CycleType.week;
//     math1rt.openway.push(1);
//     math1rt.openway.push(5);
//     math1rt.over.type = OverType.limitdate;
//     math1rt.over.value = end;
//
//     math1.ji = plan.ji;
//     math1.sd = day;
//     math1.al = IsWholeday.NonWhole;
//     math1.st = timeranges[0][0];
// //math1.et = timeranges[0][1];
//     math1.ct = 40;  // 持续40分钟
//     math1.evn = "数学";
//     math1.rtjson = math1rt;
//     math1.todolist = ToDoListStatus.On;
//
//     await this.eventService.saveAgenda(math1);
//
// // 第一节课 星期二、星期三、星期四 语文
//     let chinese1: AgendaData = {} as AgendaData;
//
//     let chinese1rt: RtJson = new RtJson();
//     chinese1rt.cycletype = CycleType.week;
//     chinese1rt.openway.push(2);
//     chinese1rt.openway.push(3);
//     chinese1rt.openway.push(4);
//     chinese1rt.over.type = OverType.limitdate;
//     chinese1rt.over.value = end;
//
//     chinese1.ji = plan.ji;
//     chinese1.sd = day;
//     chinese1.al = IsWholeday.NonWhole;
//     chinese1.st = timeranges[0][0];
//     chinese1.et = timeranges[0][1];
//     chinese1.evn = "语文";
//     chinese1.rtjson = chinese1rt;
//
//     await this.eventService.saveAgenda(chinese1);
//
// // 语文 | 数学 | 语文 | 数学 | 语文   09:30 ~ 10:15
// // 第二节课 星期二、星期四 数学
//     let math2: AgendaData = {} as AgendaData;
//
//     let math2rt: RtJson = new RtJson();
//     math2rt.cycletype = CycleType.week;
//     math2rt.openway.push(2);
//     math2rt.openway.push(4);
//     math2rt.over.type = OverType.limitdate;
//     math2rt.over.value = end;
//
//     math2.ji = plan.ji;
//     math2.sd = day;
//     math2.al = IsWholeday.NonWhole;
//     math2.st = timeranges[1][0];
//     math2.et = timeranges[1][1];
//     math2.evn = "数学";
//     math2.rtjson = math2rt;
//
//     await this.eventService.saveAgenda(math2);
//
// // 第二节课 星期一、星期三、星期五 语文
//     let chinese2: AgendaData = {} as AgendaData;
//
//     let chinese2rt: RtJson = new RtJson();
//     chinese2rt.cycletype = CycleType.week;
//     chinese2rt.openway.push(1);
//     chinese2rt.openway.push(3);
//     chinese2rt.openway.push(5);
//     chinese2rt.over.type = OverType.limitdate;
//     chinese2rt.over.value = end;
//
//     chinese2.ji = plan.ji;
//     chinese2.sd = day;
//     chinese2.al = IsWholeday.NonWhole;
//     chinese2.st = timeranges[1][0];
//     chinese2.et = timeranges[1][1];
//     chinese2.evn = "语文";
//     chinese2.rtjson = chinese2rt;
//
//     await this.eventService.saveAgenda(chinese2);
//
// // 品生 | 语文 | 体育 | 体育 | 语文   10:25 ~ 11:05
// // 第三节课 星期一 品生
//     let character3: AgendaData = {} as AgendaData;
//
//     let character3rt: RtJson = new RtJson();
//     character3rt.cycletype = CycleType.week;
//     character3rt.openway.push(1);
//     character3rt.over.type = OverType.limitdate;
//     character3rt.over.value = end;
//
//     character3.ji = plan.ji;
//     character3.sd = day;
//     character3.al = IsWholeday.NonWhole;
//     character3.st = timeranges[2][0];
//     character3.et = timeranges[2][1];
//     character3.evn = "品生";
//     character3.rtjson = character3rt;
//
//     await this.eventService.saveAgenda(character3);
//
// // 第三节课 星期三、星期四 体育
//     let pe3: AgendaData = {} as AgendaData;
//
//     let pe3rt: RtJson = new RtJson();
//     pe3rt.cycletype = CycleType.week;
//     pe3rt.openway.push(3);
//     pe3rt.openway.push(4);
//     pe3rt.over.type = OverType.limitdate;
//     pe3rt.over.value = end;
//
//     pe3.ji = plan.ji;
//     pe3.sd = day;
//     pe3.al = IsWholeday.NonWhole;
//     pe3.st = timeranges[2][0];
//     pe3.et = timeranges[2][1];
//     pe3.evn = "体育";
//     pe3.rtjson = pe3rt;
//
//     await this.eventService.saveAgenda(pe3);
//
// // 第三节课 星期二、星期五 语文
//     let chinese3: AgendaData = {} as AgendaData;
//
//     let chinese3rt: RtJson = new RtJson();
//     chinese3rt.cycletype = CycleType.week;
//     chinese3rt.openway.push(2);
//     chinese3rt.openway.push(5);
//     chinese3rt.over.type = OverType.limitdate;
//     chinese3rt.over.value = end;
//
//     chinese3.ji = plan.ji;
//     chinese3.sd = day;
//     chinese3.al = IsWholeday.NonWhole;
//     chinese3.st = timeranges[2][0];
//     chinese3.et = timeranges[2][1];
//     chinese3.evn = "语文";
//     chinese3.rtjson = chinese3rt;
//
//     await this.eventService.saveAgenda(chinese3);
//
// // 美术 | 品生 | 美术 | 写字 | 体育   14:00 ~ 14:40
// // 第四节课 星期一、星期三 美术
//     let art4: AgendaData = {} as AgendaData;
//
//     let art4rt: RtJson = new RtJson();
//     art4rt.cycletype = CycleType.week;
//     art4rt.openway.push(1);
//     art4rt.openway.push(3);
//     art4rt.over.type = OverType.limitdate;
//     art4rt.over.value = end;
//
//     art4.ji = plan.ji;
//     art4.sd = day;
//     art4.al = IsWholeday.NonWhole;
//     art4.st = timeranges[3][0];
//     art4.et = timeranges[3][1];
//     art4.evn = "美术";
//     art4.rtjson = art4rt;
//
//     await this.eventService.saveAgenda(art4);
//
// // 第四节课 星期二 品生
//     let character4: AgendaData = {} as AgendaData;
//
//     let character4rt: RtJson = new RtJson();
//     character4rt.cycletype = CycleType.week;
//     character4rt.openway.push(2);
//     character4rt.over.type = OverType.limitdate;
//     character4rt.over.value = end;
//
//     character4.ji = plan.ji;
//     character4.sd = day;
//     character4.al = IsWholeday.NonWhole;
//     character4.st = timeranges[3][0];
//     character4.et = timeranges[3][1];
//     character4.evn = "品生";
//     character4.rtjson = character4rt;
//
//     await this.eventService.saveAgenda(character4);
//
// // 第四节课 星期四 写字
//     let writing4: AgendaData = {} as AgendaData;
//
//     let writing4rt: RtJson = new RtJson();
//     writing4rt.cycletype = CycleType.week;
//     writing4rt.openway.push(4);
//     writing4rt.over.type = OverType.limitdate;
//     writing4rt.over.value = end;
//
//     writing4.ji = plan.ji;
//     writing4.sd = day;
//     writing4.al = IsWholeday.NonWhole;
//     writing4.st = timeranges[3][0];
//     writing4.et = timeranges[3][1];
//     writing4.evn = "写字";
//     writing4.rtjson = writing4rt;
//
//     await this.eventService.saveAgenda(writing4);
//
// // 第四节课 星期五 体育
//     let pe4: AgendaData = {} as AgendaData;
//
//     let pe4rt: RtJson = new RtJson();
//     pe4rt.cycletype = CycleType.week;
//     pe4rt.openway.push(5);
//     pe4rt.over.type = OverType.limitdate;
//     pe4rt.over.value = end;
//
//     pe4.ji = plan.ji;
//     pe4.sd = day;
//     pe4.al = IsWholeday.NonWhole;
//     pe4.st = timeranges[3][0];
//     pe4.et = timeranges[3][1];
//     pe4.evn = "体育";
//     pe4.rtjson = pe4rt;
//
//     await this.eventService.saveAgenda(pe4);
//
// // 音乐 | 体育 | 音乐 | 班队 | 品生   14:50 ~ 15:35
// // 第五节课 星期一、星期三 音乐
//     let music5: AgendaData = {} as AgendaData;
//
//     let music5rt: RtJson = new RtJson();
//     music5rt.cycletype = CycleType.week;
//     music5rt.openway.push(1);
//     music5rt.openway.push(3);
//     music5rt.over.type = OverType.limitdate;
//     music5rt.over.value = end;
//
//     music5.ji = plan.ji;
//     music5.sd = day;
//     music5.al = IsWholeday.NonWhole;
//     music5.st = timeranges[4][0];
//     music5.et = timeranges[4][1];
//     music5.evn = "音乐";
//     music5.rtjson = music5rt;
//
//     await this.eventService.saveAgenda(music5);
//
// // 第五节课 星期二 体育
//     let pe5: AgendaData = {} as AgendaData;
//
//     let pe5rt: RtJson = new RtJson();
//     pe5rt.cycletype = CycleType.week;
//     pe5rt.openway.push(2);
//     pe5rt.over.type = OverType.limitdate;
//     pe5rt.over.value = end;
//
//     pe5.ji = plan.ji;
//     pe5.sd = day;
//     pe5.al = IsWholeday.NonWhole;
//     pe5.st = timeranges[4][0];
//     pe5.et = timeranges[4][1];
//     pe5.evn = "体育";
//     pe5.rtjson = pe5rt;
//
//     await this.eventService.saveAgenda(pe5);
//
// // 第五节课 星期四 班队
//     let activity5: AgendaData = {} as AgendaData;
//
//     let activity5rt: RtJson = new RtJson();
//     activity5rt.cycletype = CycleType.week;
//     activity5rt.openway.push(4);
//     activity5rt.over.type = OverType.limitdate;
//     activity5rt.over.value = end;
//
//     activity5.ji = plan.ji;
//     activity5.sd = day;
//     activity5.al = IsWholeday.NonWhole;
//     activity5.st = timeranges[4][0];
//     activity5.et = timeranges[4][1];
//     activity5.evn = "班队";
//     activity5.rtjson = activity5rt;
//
//     await this.eventService.saveAgenda(activity5);
//
// // 第五节课 星期五 品生
//     let character5: AgendaData = {} as AgendaData;
//
//     let character5rt: RtJson = new RtJson();
//     character5rt.cycletype = CycleType.week;
//     character5rt.openway.push(5);
//     character5rt.over.type = OverType.limitdate;
//     character5rt.over.value = end;
//
//     character5.ji = plan.ji;
//     character5.sd = day;
//     character5.al = IsWholeday.NonWhole;
//     character5.st = timeranges[4][0];
//     character5.et = timeranges[4][1];
//     character5.evn = "品生";
//     character5.rtjson = character5rt;
//
//     await this.eventService.saveAgenda(character5);
//
// //  无  | 无  | 兴趣  |  无  | 无    15:45 ~ 16:25
// // 第六节课 星期三 兴趣
//     let interest5: AgendaData = {} as AgendaData;
//
//     let interest5rt: RtJson = new RtJson();
//     interest5rt.cycletype = CycleType.week;
//     interest5rt.openway.push(3);
//     interest5rt.over.type = OverType.limitdate;
//     interest5rt.over.value = end;
//
//     interest5.ji = plan.ji;
//     interest5.sd = day;
//     interest5.al = IsWholeday.NonWhole;
//     interest5.st = timeranges[5][0];
//     interest5.et = timeranges[5][1];
//     interest5.evn = "兴趣";
//     interest5.rtjson = interest5rt;
//
//     await this.eventService.saveAgenda(interest5);
//
//   }

}
