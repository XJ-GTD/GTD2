import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import {Device} from "@ionic-native/device";
import {Network} from "@ionic-native/network";
import {HttpClient} from "@angular/common/http";
import { HTTP } from "@ionic-native/http";
import {SQLite} from "@ionic-native/sqlite";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as moment from "moment";
import {
  IonicModule,
  Platform
} from 'ionic-angular';

import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock,
  RestFulConfigMock,
  RestfulClientMock,
  UserConfigMock,
  AssistantServiceMock
} from '../../../test-config/mocks-ionic';

import {MyApp} from '../../app/app.component';
import {SqliteConfig} from "../config/sqlite.config";
import {RestFulConfig} from "../config/restful.config";
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { SqliteInit } from "../sqlite/sqlite.init";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import {SyncRestful} from "../restful/syncsev";
import { AgdRestful } from "../restful/agdsev";
import { BacRestful } from "../restful/bacsev";
import { DataRestful } from "../restful/datasev";
import {JhaTbl} from "../sqlite/tbl/jha.tbl";
import {MomTbl} from "../sqlite/tbl/mom.tbl";
import {JtaTbl} from "../sqlite/tbl/jta.tbl";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import {FjTbl} from "../sqlite/tbl/fj.tbl";
import {MrkTbl} from "../sqlite/tbl/mrk.tbl";
import {ParTbl} from "../sqlite/tbl/par.tbl";
import {BTbl} from "../sqlite/tbl/b.tbl";
import {GTbl} from "../sqlite/tbl/g.tbl";
import {BxTbl} from "../sqlite/tbl/bx.tbl";
import {BhTbl} from "../sqlite/tbl/bh.tbl";

import { CalendarService, PlanData, PlanItemData, ActivitySummaryData, MonthActivityData, MonthActivitySummaryData, DayActivityData, DayActivitySummaryData, PagedActivityData, FindActivityCondition } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, RtJson, TxJson, Member } from "./event.service";
import { MemoService, MemoData } from "./memo.service";
import { ScheduleRemindService } from "./remind.service";
import { GrouperService } from "./grouper.service";
import { PlanType, PlanItemType, CycleType, OverType, RepeatFlag, PageDirection, SyncType, DelType, SyncDataStatus, IsWholeday, OperateType, EventType, RemindTime } from "../../data.enum";
import {File} from '@ionic-native/file';
import {AssistantService} from "../cordova/assistant.service";
import {TimeOutService} from "../../util/timeOutService";
import {NotificationsService} from "../cordova/notifications.service";
import { FindBugRestful } from "../restful/bugsev";
import {DetectorService} from "../util-service/detector.service";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import {ContactsService} from "../cordova/contacts.service";
import {Contacts, Contact} from "@ionic-native/contacts";
import { PersonRestful } from "../restful/personsev";

/**
 * 日历Service 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('CalendarService test suite', () => {
  let config: SqliteConfig;
  let init: SqliteInit;
  let restConfig: RestFulConfig;
  let calendarService: CalendarService;
  let eventService: EventService;
  let memoService: MemoService;
  let grouperService: GrouperService;
  let httpMock: HttpTestingController;
  let sqlExce: SqliteExec;
  let util: UtilService;
  let assistantService: AssistantService;
  let timeOutService: TimeOutService;
  let notificationsService: NotificationsService;

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

  let prepareContacts = async function() {
    let sqls: Array<string> = new Array<string>();

    // 删除已存在数据
    let b: BTbl = new BTbl();
    await sqlExce.drop(b);
    await sqlExce.create(b);

    let bh: BhTbl = new BhTbl();
    await sqlExce.drop(bh);
    await sqlExce.create(bh);

    let g: GTbl = new GTbl();
    await sqlExce.drop(g);
    await sqlExce.create(g);

    let bx: BxTbl = new BxTbl();
    await sqlExce.drop(bx);
    await sqlExce.create(bx);

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

    xiaopangzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    xiaohaizi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    liqiannan = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    huqiming = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

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
    btbls.push(btbl);

    liying = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    xiaolenzi = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    caoping = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    luojianfei = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    huitailang = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
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

    xuezhenyang = btbl;

    bhtbl = new BhTbl();
    bhtbl.bhi = util.getUuid();
    bhtbl.pwi = btbl.pwi;
    bhtbl.hiu = DataConfig.HUIBASE64;
    sqls.push(bhtbl.inT());

    //群组
    let gtbl: GTbl = new GTbl();
    gtbl.gi = util.getUuid();
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
    gtbl.gi = util.getUuid();
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

    await sqlExce.batExecSql(sqls);

    return;
  };

  // 所有测试case执行前, 只执行一次
  beforeAll(async () => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        HttpClientTestingModule
      ],
      providers: [
        CalendarService,
        Device,
        SQLite,
        SQLitePorter,
        SqliteConfig,
        SqliteExec,
        SqliteInit,
        File,
        Badge,
        LocalNotifications,
        { provide: AssistantService, useClass: AssistantServiceMock },
        { provide: UserConfig, useClass: UserConfigMock },
        DataConfig,
        UtilService,
        EmitService,
        ShaeRestful,
        SyncRestful,
        DetectorService,
        FindBugRestful,
        NotificationsService,
        TimeOutService,
        PersonRestful,
        Contacts,
        ContactsService,
        AgdRestful,
        BacRestful,
        DataRestful,
        Network,
        HTTP,
        HttpClient,
        { provide: RestFulConfig, useClass: RestFulConfigMock },
        { provide: RestfulClient, useClass: RestfulClientMock },
        NetworkService,
        EventService,
        GrouperService,
        MemoService,
        ScheduleRemindService,
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });

    config = TestBed.get(SqliteConfig);
    init = TestBed.get(SqliteInit);

    calendarService = TestBed.get(CalendarService);
    eventService = TestBed.get(EventService);
    memoService = TestBed.get(MemoService);
    grouperService = TestBed.get(GrouperService);
    restConfig = TestBed.get(RestFulConfig);
    sqlExce = TestBed.get(SqliteExec);
    util = TestBed.get(UtilService);
    assistantService = TestBed.get(AssistantService);
    notificationsService = TestBed.get(NotificationsService);
    timeOutService = TestBed.get(TimeOutService);

    await config.generateDb();
    await init.createTables();
    let version = -1;
    while (DataConfig.version > version) {
      await init.createTablespath(version + 1, -1);
      version++;
    }
    await init.initData();
    restConfig.init();

    UserConfig.account.id = "13900009004";
    UserConfig.account.name = "测试帐户";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
  });

  beforeEach(async () => {
    // 清空表数据
    let mom: MomTbl = new MomTbl();
    await sqlExce.dropByParam(mom);
    await sqlExce.createByParam(mom);

    let jha: JhaTbl = new JhaTbl();
    await sqlExce.dropByParam(jha);
    await sqlExce.createByParam(jha);

    let jta: JtaTbl = new JtaTbl();
    await sqlExce.dropByParam(jta);
    await sqlExce.createByParam(jta);

    let ev: EvTbl = new EvTbl();
    await sqlExce.dropByParam(ev);
    await sqlExce.createByParam(ev);

    let ca: CaTbl = new CaTbl();
    await sqlExce.dropByParam(ca);
    await sqlExce.createByParam(ca);

    let t: TTbl = new TTbl();
    await sqlExce.dropByParam(t);
    await sqlExce.createByParam(t);

    let wa: WaTbl = new WaTbl();
    await sqlExce.dropByParam(wa);
    await sqlExce.createByParam(wa);

    let fj: FjTbl = new FjTbl();
    await sqlExce.dropByParam(fj);
    await sqlExce.createByParam(fj);

    let mrk: MrkTbl = new MrkTbl();
    await sqlExce.dropByParam(mrk);
    await sqlExce.createByParam(mrk);

    let par: ParTbl = new ParTbl();
    await sqlExce.dropByParam(par);
    await sqlExce.createByParam(par);

  });

  xit(`Case 29 - 1 - 2 refreshCalendarActivitiesToMonth 刷新日历显示列表到指定月份 - 已存在初始化数据(刷新到当前月)`, async () => {
    let month: string = moment().format("YYYY/MM");

    calendarService.clearCalendarActivities();
    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.refreshCalendarActivitiesToMonth(month);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(7);
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(month);
    expect(calendarholdings[4].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
  });

  xit(`Case 29 - 1 - 1 refreshCalendarActivitiesToMonth 刷新日历显示列表到指定月份 - 已存在初始化数据(刷新到往后5个月)`, async () => {
    let month: string = moment().format("YYYY/MM");
    let after5month: string = moment(month,"YYYY/MM").add(5, "months").format("YYYY/MM");

    calendarService.clearCalendarActivities();
    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.refreshCalendarActivitiesToMonth(after5month);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(9);
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(month);
    expect(calendarholdings[4].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
    expect(calendarholdings[5].month).toBe(moment(month,"YYYY/MM").add(2, "months").format("YYYY/MM"));
    expect(calendarholdings[6].month).toBe(moment(month,"YYYY/MM").add(3, "months").format("YYYY/MM"));
    expect(calendarholdings[7].month).toBe(moment(month,"YYYY/MM").add(4, "months").format("YYYY/MM"));
    expect(calendarholdings[8].month).toBe(moment(month,"YYYY/MM").add(5, "months").format("YYYY/MM"));
  });

  xit(`Case 29 - 1 refreshCalendarActivitiesToMonth 刷新日历显示列表到指定月份 - 已存在初始化数据(刷新到往前5个月)`, async () => {
    let month: string = moment().format("YYYY/MM");
    let before5month: string = moment(month,"YYYY/MM").subtract(5, "months").format("YYYY/MM");

    calendarService.clearCalendarActivities();
    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.refreshCalendarActivitiesToMonth(before5month);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(9);
    expect(calendarholdings[0].month).toBe(moment(month,"YYYY/MM").subtract(5, "months").format("YYYY/MM"));
    expect(calendarholdings[1].month).toBe(moment(month,"YYYY/MM").subtract(4, "months").format("YYYY/MM"));
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(3, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(moment(month,"YYYY/MM").subtract(2, "months").format("YYYY/MM"));
    expect(calendarholdings[4].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[5].month).toBe(month);
    expect(calendarholdings[6].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
  });

  // 创建课程表
  // 课程从哪天开始, 到哪天结束? => 9月1日到明年1月18日
  // 上午是否上三节课? => 是的/对的,三节课
  // 上午第一节课从几点开始到几点结束? => 8点20分到9点
  // 第二节课呢? => 9点半到10点一刻
  // 第三节课呢? => 10点25分到11点05分/10点25分开始上40分钟
  // 下午是否上三节课? => 是的/对的,三节课
  // 下午第一节课从几点开始到几点结束? => 2点到2点40分/2点开始上40分钟
  // 第二节课呢? => 2点50分到3点35分
  // 第三节课呢? => 3点45分到4点25分
  // 开始设置课程表, 请说:"周一和周五,第一节课是数学" => 周二到周四, 第一节课是语文
  // 好的, 每周二、周三、周四的第一节课已设置为语文 => 周一、周五是数学
  // 好的, 每周一、周五的第一节课已设置为数学 => 第二节课, 每周一、三和五是语文
  // 好的, 每周一、周三、周五的第二节课已设置为语文 => 周二和周四是数学
  // 好的, 每周二、周四的第二节课已设置为数学 => 周一, 第三节课是品生
  // 好的, 每周一的第三节课已设置为品生 => 周二和周五是语文, 周三和周四是体育
  // 好的, 每周二、周五的第三节课已设置为语文, 每周三、周四的第三节课已设置为体育
  // ...
  // 创建结束

  // 2018/09/01 ~ 2019/01/18
  // 数学 | 语文 | 语文 | 语文 | 数学   08:20 ~ 09:00
  // 语文 | 数学 | 语文 | 数学 | 语文   09:30 ~ 10:15
  // 品生 | 语文 | 体育 | 体育 | 语文   10:25 ~ 11:05
  // =============下午=============
  // 美术 | 品生 | 美术 | 写子 | 体育   14:00 ~ 14:40
  // 音乐 | 体育 | 音乐 | 班队 | 品生   14:50 ~ 15:35
  //  无  | 无  | 兴趣  |  无  | 无    15:45 ~ 16:25
  describe(`Case 28 - 1 重复集成测试 2018年第一学期 小学课程表(2018/09/01 ~ 2019/01/18)`, () => {
    let day: string = "2018/09/01";
    let end: string = "2019/01/18";
    let timeranges: Array<Array<string>> = [
      ["08:20", "09:00"],
      ["09:30", "10:15"],
      ["10:25", "11:05"],
      ["14:00", "14:40"],
      ["14:50", "15:35"],
      ["15:45", "16:25"]
    ];

    beforeAll(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
    });

    beforeEach(async () => {
      await prepareContacts();
      // 下载公共日历
      await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

      // 小任务
      let minitask: MiniTaskData = {} as MiniTaskData;

      minitask.evn = "结婚纪念日前给太太买礼物";

      await eventService.saveMiniTask(minitask);

      // 任务
      let task: TaskData = {} as TaskData;

      task.evn = "结婚纪念日前给太太买礼物";

      await eventService.saveTask(task);

      // 备忘
      let memo: MemoData = {} as MemoData;

      memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

      await memoService.saveMemo(memo);

      // 日历项
      let planitem1: PlanItemData = {} as PlanItemData;

      planitem1.sd = moment().format("YYYY/MM/DD");
      planitem1.jtn = "结婚纪念日";
      planitem1.jtt = PlanItemType.Activity;

      await calendarService.savePlanItem(planitem1);

      // 自定义日历
      let plan: PlanData = {} as PlanData;

      plan.jn = '2018年第一学期 课程表';
      plan.jc = '#ababab';
      plan.jt = PlanType.PrivatePlan;

      plan.members = new Array<Member>();

      for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
        let member: Member = {} as Member;

        member.pwi = contact.pwi;
        member.ui = contact.ui;

        plan.members.push(member);
      }

      plan = await calendarService.savePlan(plan);

      // 数学 | 语文 | 语文 | 语文 | 数学   08:20 ~ 09:00
      // 第一节课 星期一、星期五 数学
      let math1: AgendaData = {} as AgendaData;

      let math1rt: RtJson = new RtJson();
      math1rt.cycletype = CycleType.week;
      math1rt.openway.push(1);
      math1rt.openway.push(5);
      math1rt.over.type = OverType.limitdate;
      math1rt.over.value = end;

      math1.ji = plan.ji;
      math1.sd = day;
      math1.al = IsWholeday.StartSet;
      math1.st = timeranges[0][0];
      //math1.et = timeranges[0][1];
      math1.ct = 40;  // 持续40分钟
      math1.evn = "数学";
      math1.rtjson = math1rt;

      await eventService.saveAgenda(math1);

      // 第一节课 星期二、星期三、星期四 语文
      let chinese1: AgendaData = {} as AgendaData;

      let chinese1rt: RtJson = new RtJson();
      chinese1rt.cycletype = CycleType.week;
      chinese1rt.openway.push(2);
      chinese1rt.openway.push(3);
      chinese1rt.openway.push(4);
      chinese1rt.over.type = OverType.limitdate;
      chinese1rt.over.value = end;

      chinese1.ji = plan.ji;
      chinese1.sd = day;
      chinese1.al = IsWholeday.StartSet;
      chinese1.st = timeranges[0][0];
      chinese1.et = timeranges[0][1];
      chinese1.evn = "语文";
      chinese1.rtjson = chinese1rt;

      await eventService.saveAgenda(chinese1);

      // 语文 | 数学 | 语文 | 数学 | 语文   09:30 ~ 10:15
      // 第二节课 星期二、星期四 数学
      let math2: AgendaData = {} as AgendaData;

      let math2rt: RtJson = new RtJson();
      math2rt.cycletype = CycleType.week;
      math2rt.openway.push(2);
      math2rt.openway.push(4);
      math2rt.over.type = OverType.limitdate;
      math2rt.over.value = end;

      math2.ji = plan.ji;
      math2.sd = day;
      math2.al = IsWholeday.StartSet;
      math2.st = timeranges[1][0];
      math2.et = timeranges[1][1];
      math2.evn = "数学";
      math2.rtjson = math2rt;

      await eventService.saveAgenda(math2);

      // 第二节课 星期一、星期三、星期五 语文
      let chinese2: AgendaData = {} as AgendaData;

      let chinese2rt: RtJson = new RtJson();
      chinese2rt.cycletype = CycleType.week;
      chinese2rt.openway.push(1);
      chinese2rt.openway.push(3);
      chinese2rt.openway.push(5);
      chinese2rt.over.type = OverType.limitdate;
      chinese2rt.over.value = end;

      chinese2.ji = plan.ji;
      chinese2.sd = day;
      chinese2.al = IsWholeday.StartSet;
      chinese2.st = timeranges[1][0];
      chinese2.et = timeranges[1][1];
      chinese2.evn = "语文";
      chinese2.rtjson = chinese2rt;

      await eventService.saveAgenda(chinese2);

      // 品生 | 语文 | 体育 | 体育 | 语文   10:25 ~ 11:05
      // 第三节课 星期一 品生
      let character3: AgendaData = {} as AgendaData;

      let character3rt: RtJson = new RtJson();
      character3rt.cycletype = CycleType.week;
      character3rt.openway.push(1);
      character3rt.over.type = OverType.limitdate;
      character3rt.over.value = end;

      character3.ji = plan.ji;
      character3.sd = day;
      character3.al = IsWholeday.StartSet;
      character3.st = timeranges[2][0];
      character3.et = timeranges[2][1];
      character3.evn = "品生";
      character3.rtjson = character3rt;

      await eventService.saveAgenda(character3);

      // 第三节课 星期三、星期四 体育
      let pe3: AgendaData = {} as AgendaData;

      let pe3rt: RtJson = new RtJson();
      pe3rt.cycletype = CycleType.week;
      pe3rt.openway.push(3);
      pe3rt.openway.push(4);
      pe3rt.over.type = OverType.limitdate;
      pe3rt.over.value = end;

      pe3.ji = plan.ji;
      pe3.sd = day;
      pe3.al = IsWholeday.StartSet;
      pe3.st = timeranges[2][0];
      pe3.et = timeranges[2][1];
      pe3.evn = "体育";
      pe3.rtjson = pe3rt;

      await eventService.saveAgenda(pe3);

      // 第三节课 星期二、星期五 语文
      let chinese3: AgendaData = {} as AgendaData;

      let chinese3rt: RtJson = new RtJson();
      chinese3rt.cycletype = CycleType.week;
      chinese3rt.openway.push(2);
      chinese3rt.openway.push(5);
      chinese3rt.over.type = OverType.limitdate;
      chinese3rt.over.value = end;

      chinese3.ji = plan.ji;
      chinese3.sd = day;
      chinese3.al = IsWholeday.StartSet;
      chinese3.st = timeranges[2][0];
      chinese3.et = timeranges[2][1];
      chinese3.evn = "语文";
      chinese3.rtjson = chinese3rt;

      await eventService.saveAgenda(chinese3);

      // 美术 | 品生 | 美术 | 写字 | 体育   14:00 ~ 14:40
      // 第四节课 星期一、星期三 美术
      let art4: AgendaData = {} as AgendaData;

      let art4rt: RtJson = new RtJson();
      art4rt.cycletype = CycleType.week;
      art4rt.openway.push(1);
      art4rt.openway.push(3);
      art4rt.over.type = OverType.limitdate;
      art4rt.over.value = end;

      art4.ji = plan.ji;
      art4.sd = day;
      art4.al = IsWholeday.StartSet;
      art4.st = timeranges[3][0];
      art4.et = timeranges[3][1];
      art4.evn = "美术";
      art4.rtjson = art4rt;

      await eventService.saveAgenda(art4);

      // 第四节课 星期二 品生
      let character4: AgendaData = {} as AgendaData;

      let character4rt: RtJson = new RtJson();
      character4rt.cycletype = CycleType.week;
      character4rt.openway.push(2);
      character4rt.over.type = OverType.limitdate;
      character4rt.over.value = end;

      character4.ji = plan.ji;
      character4.sd = day;
      character4.al = IsWholeday.StartSet;
      character4.st = timeranges[3][0];
      character4.et = timeranges[3][1];
      character4.evn = "品生";
      character4.rtjson = character4rt;

      await eventService.saveAgenda(character4);

      // 第四节课 星期四 写字
      let writing4: AgendaData = {} as AgendaData;

      let writing4rt: RtJson = new RtJson();
      writing4rt.cycletype = CycleType.week;
      writing4rt.openway.push(4);
      writing4rt.over.type = OverType.limitdate;
      writing4rt.over.value = end;

      writing4.ji = plan.ji;
      writing4.sd = day;
      writing4.al = IsWholeday.StartSet;
      writing4.st = timeranges[3][0];
      writing4.et = timeranges[3][1];
      writing4.evn = "写字";
      writing4.rtjson = writing4rt;

      await eventService.saveAgenda(writing4);

      // 第四节课 星期五 体育
      let pe4: AgendaData = {} as AgendaData;

      let pe4rt: RtJson = new RtJson();
      pe4rt.cycletype = CycleType.week;
      pe4rt.openway.push(5);
      pe4rt.over.type = OverType.limitdate;
      pe4rt.over.value = end;

      pe4.ji = plan.ji;
      pe4.sd = day;
      pe4.al = IsWholeday.StartSet;
      pe4.st = timeranges[3][0];
      pe4.et = timeranges[3][1];
      pe4.evn = "体育";
      pe4.rtjson = pe4rt;

      await eventService.saveAgenda(pe4);

      // 音乐 | 体育 | 音乐 | 班队 | 品生   14:50 ~ 15:35
      // 第五节课 星期一、星期三 音乐
      let music5: AgendaData = {} as AgendaData;

      let music5rt: RtJson = new RtJson();
      music5rt.cycletype = CycleType.week;
      music5rt.openway.push(1);
      music5rt.openway.push(3);
      music5rt.over.type = OverType.limitdate;
      music5rt.over.value = end;

      music5.ji = plan.ji;
      music5.sd = day;
      music5.al = IsWholeday.StartSet;
      music5.st = timeranges[4][0];
      music5.et = timeranges[4][1];
      music5.evn = "音乐";
      music5.rtjson = music5rt;

      await eventService.saveAgenda(music5);

      // 第五节课 星期二 体育
      let pe5: AgendaData = {} as AgendaData;

      let pe5rt: RtJson = new RtJson();
      pe5rt.cycletype = CycleType.week;
      pe5rt.openway.push(2);
      pe5rt.over.type = OverType.limitdate;
      pe5rt.over.value = end;

      pe5.ji = plan.ji;
      pe5.sd = day;
      pe5.al = IsWholeday.StartSet;
      pe5.st = timeranges[4][0];
      pe5.et = timeranges[4][1];
      pe5.evn = "体育";
      pe5.rtjson = pe5rt;

      await eventService.saveAgenda(pe5);

      // 第五节课 星期四 班队
      let activity5: AgendaData = {} as AgendaData;

      let activity5rt: RtJson = new RtJson();
      activity5rt.cycletype = CycleType.week;
      activity5rt.openway.push(4);
      activity5rt.over.type = OverType.limitdate;
      activity5rt.over.value = end;

      activity5.ji = plan.ji;
      activity5.sd = day;
      activity5.al = IsWholeday.StartSet;
      activity5.st = timeranges[4][0];
      activity5.et = timeranges[4][1];
      activity5.evn = "班队";
      activity5.rtjson = activity5rt;

      await eventService.saveAgenda(activity5);

      // 第五节课 星期五 品生
      let character5: AgendaData = {} as AgendaData;

      let character5rt: RtJson = new RtJson();
      character5rt.cycletype = CycleType.week;
      character5rt.openway.push(5);
      character5rt.over.type = OverType.limitdate;
      character5rt.over.value = end;

      character5.ji = plan.ji;
      character5.sd = day;
      character5.al = IsWholeday.StartSet;
      character5.st = timeranges[4][0];
      character5.et = timeranges[4][1];
      character5.evn = "品生";
      character5.rtjson = character5rt;

      await eventService.saveAgenda(character5);

      //  无  | 无  | 兴趣  |  无  | 无    15:45 ~ 16:25
      // 第六节课 星期三 兴趣
      let interest5: AgendaData = {} as AgendaData;

      let interest5rt: RtJson = new RtJson();
      interest5rt.cycletype = CycleType.week;
      interest5rt.openway.push(3);
      interest5rt.over.type = OverType.limitdate;
      interest5rt.over.value = end;

      interest5.ji = plan.ji;
      interest5.sd = day;
      interest5.al = IsWholeday.StartSet;
      interest5.st = timeranges[5][0];
      interest5.et = timeranges[5][1];
      interest5.evn = "兴趣";
      interest5.rtjson = interest5rt;

      await eventService.saveAgenda(interest5);

    });

    it(`Case 1 - 1 2018/08 无活动`, async () => {
      let month1808Summary = await calendarService.fetchMonthActivitiesSummary("2018/08");

      expect(month1808Summary).toBeDefined();

      for (let daySummary of month1808Summary.days) {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        expect(daySummary.activityitemscount).toBe(0);
        expect(daySummary.eventscount).toBe(0);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(0);
        expect(daySummary.memoscount).toBe(0);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      }
    });

    it(`Case 1 - 2 2018/09 有活动`, async () => {
      let month1809Summary = await calendarService.fetchMonthActivitiesSummary("2018/09");

      expect(month1809Summary).toBeDefined();

      for (let daySummary of month1809Summary.days) {
        expect(daySummary.day).toBeDefined();

        let dayOfWeek = Number(moment(daySummary.day,"YYYY/MM/DD").format("d"));
        if (dayOfWeek > 0 && dayOfWeek < 6) {             // 非周末
          if (dayOfWeek == 3) {                           // 星期三
            if (daySummary.day == "2018/09/05") {  // 第三天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(6);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(6);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else {
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(6);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(6);
              expect(daySummary.bookedtimesummary).toBe(0);
            }
          } else {                                        // 星期三以外
            if (daySummary.day == "2018/09/03") {         // 第一天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(5);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else if (daySummary.day == "2018/09/04") {  // 第二天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(5);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else if (daySummary.day == "2018/09/06") {  // 第四天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(5);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else if (daySummary.day == "2018/09/07") {  // 第五天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(5);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else {                                      // 重复天
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(5);
              expect(daySummary.bookedtimesummary).toBe(0);
            }
          }
        } else {                                          // 周末
          if (daySummary.day == "2018/09/01") { // 2019/09/01 sd
            expect(daySummary.calendaritemscount).toBe(0);
            expect(daySummary.activityitemscount).toBe(0);
            expect(daySummary.eventscount).toBe(16);
            expect(daySummary.agendascount).toBe(16);
            expect(daySummary.taskscount).toBe(0);
            expect(daySummary.memoscount).toBe(0);
            expect(daySummary.repeateventscount).toBe(0);
            expect(daySummary.bookedtimesummary).toBe(0);
          } else {
            expect(daySummary.calendaritemscount).toBe(0);
            expect(daySummary.activityitemscount).toBe(0);
            expect(daySummary.eventscount).toBe(0);
            expect(daySummary.agendascount).toBe(0);
            expect(daySummary.taskscount).toBe(0);
            expect(daySummary.memoscount).toBe(0);
            expect(daySummary.repeateventscount).toBe(0);
            expect(daySummary.bookedtimesummary).toBe(0);
          }
        }
      }
    });

    it(`Case 1 - 3 2019/02 无活动`, async () => {
      let month1902Summary = await calendarService.fetchMonthActivitiesSummary("2019/02");

      expect(month1902Summary).toBeDefined();

      for (let daySummary of month1902Summary.days) {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        if (["2019/02/16", "2019/02/17"].indexOf(daySummary.day) >= 0) {
          expect(daySummary.activityitemscount).toBe(1);
        } else {
          expect(daySummary.activityitemscount).toBe(0);
        }
        expect(daySummary.eventscount).toBe(0);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(0);
        expect(daySummary.memoscount).toBe(0);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      }
    });

    it(`Case 1 - 4 backupCalendar 备份日历和所有活动 - 无报错`, async (done: DoneFn) => {
      let bts: number = moment().unix();

      calendarService.backupCalendar(bts)
      .then(() => {
        expect("success").toBe("success");
        done();
      })
      .catch(e => {
        fail("抛出异常, 出错");
        done();
      });
    });

    it(`Case 1 - 5 recoveryCalendar 恢复备份日历和所有活动 - 无报错`, async (done: DoneFn) => {
      let bts: number = moment().unix();

      await calendarService.backupCalendar(bts);

      calendarService.recoveryCalendar(bts, true)
      .then(() => {
        expect("success").toBe("success");
        done();
      })
      .catch(e => {
        fail("抛出异常, 出错");
        done();
      });
    });

    describe(`Case 1 - 6 2018/10/01 国庆节课程调整 (09/29 周六上周一课程, 09/30 周日上周二课程)`, () => {
      beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
      });

      beforeEach(async () => {
        // 取得10月所有活动
        let month1810Activities = await calendarService.fetchMonthActivities("2018/10");

        // 删除10月01日 ~ 10月05日课程
        let day1001Activities = month1810Activities.days.get("2018/10/01");
        let day1002Activities = month1810Activities.days.get("2018/10/02");
        let day1003Activities = month1810Activities.days.get("2018/10/03");
        let day1004Activities = month1810Activities.days.get("2018/10/04");
        let day1005Activities = month1810Activities.days.get("2018/10/05");

        for (let dayActivities of [day1001Activities, day1002Activities, day1003Activities, day1004Activities, day1005Activities]) {
          for (let event of dayActivities.events) {
            if (event.type == EventType.Agenda) {
              let agenda: AgendaData = {} as AgendaData;
              Object.assign(agenda, event);

              await eventService.removeAgenda(agenda, OperateType.OnlySel);
            }
          }
        }

        // 新增09/29, 09/30日课程
        // 数学 | 语文 | 语文 | 语文 | 数学   08:20 ~ 09:00
        // 语文 | 数学 | 语文 | 数学 | 语文   09:30 ~ 10:15
        // 品生 | 语文 | 体育 | 体育 | 语文   10:25 ~ 11:05
        // =============下午=============
        // 美术 | 品生 | 美术 | 写子 | 体育   14:00 ~ 14:40
        // 音乐 | 体育 | 音乐 | 班队 | 品生   14:50 ~ 15:35
        //  无  | 无  | 兴趣  |  无  | 无    15:45 ~ 16:25

        // 数学 | 语文 | 语文 | 语文 | 数学   08:20 ~ 09:00
        // 第一节课 星期一、星期五 数学
        let day29 = "2018/09/29";
        let day30 = "2018/09/30";
        let math1: AgendaData = {} as AgendaData;

        math1.sd = day29;
        math1.al = IsWholeday.StartSet;
        math1.st = timeranges[0][0];
        math1.et = timeranges[0][1];
        math1.evn = "数学";

        await eventService.saveAgenda(math1);

        // 第一节课 星期二、星期三、星期四 语文
        let chinese1: AgendaData = {} as AgendaData;

        chinese1.sd = day30;
        chinese1.al = IsWholeday.StartSet;
        chinese1.st = timeranges[0][0];
        chinese1.et = timeranges[0][1];
        chinese1.evn = "语文";

        await eventService.saveAgenda(chinese1);

        // 语文 | 数学 | 语文 | 数学 | 语文   09:30 ~ 10:15
        // 第二节课 星期二、星期四 数学
        let math2: AgendaData = {} as AgendaData;

        math2.sd = day30;
        math2.al = IsWholeday.StartSet;
        math2.st = timeranges[1][0];
        math2.et = timeranges[1][1];
        math2.evn = "数学";

        await eventService.saveAgenda(math2);

        // 第二节课 星期一、星期三、星期五 语文
        let chinese2: AgendaData = {} as AgendaData;

        chinese2.sd = day29;
        chinese2.al = IsWholeday.StartSet;
        chinese2.st = timeranges[1][0];
        chinese2.et = timeranges[1][1];
        chinese2.evn = "语文";

        await eventService.saveAgenda(chinese2);

        // 品生 | 语文 | 体育 | 体育 | 语文   10:25 ~ 11:05
        // 第三节课 星期一 品生
        let character3: AgendaData = {} as AgendaData;

        character3.sd = day29;
        character3.al = IsWholeday.StartSet;
        character3.st = timeranges[2][0];
        character3.et = timeranges[2][1];
        character3.evn = "品生";

        await eventService.saveAgenda(character3);

        // 第三节课 星期二、星期五 语文
        let chinese3: AgendaData = {} as AgendaData;

        chinese3.sd = day30;
        chinese3.al = IsWholeday.StartSet;
        chinese3.st = timeranges[2][0];
        chinese3.et = timeranges[2][1];
        chinese3.evn = "语文";

        await eventService.saveAgenda(chinese3);

        // 美术 | 品生 | 美术 | 写字 | 体育   14:00 ~ 14:40
        // 第四节课 星期一、星期三 美术
        let art4: AgendaData = {} as AgendaData;

        art4.sd = day29;
        art4.al = IsWholeday.StartSet;
        art4.st = timeranges[3][0];
        art4.et = timeranges[3][1];
        art4.evn = "美术";

        await eventService.saveAgenda(art4);

        // 第四节课 星期二 品生
        let character4: AgendaData = {} as AgendaData;

        character4.sd = day30;
        character4.al = IsWholeday.StartSet;
        character4.st = timeranges[3][0];
        character4.et = timeranges[3][1];
        character4.evn = "品生";

        await eventService.saveAgenda(character4);

        // 音乐 | 体育 | 音乐 | 班队 | 品生   14:50 ~ 15:35
        // 第五节课 星期一、星期三 音乐
        let music5: AgendaData = {} as AgendaData;

        music5.sd = day29;
        music5.al = IsWholeday.StartSet;
        music5.st = timeranges[4][0];
        music5.et = timeranges[4][1];
        music5.evn = "音乐";

        await eventService.saveAgenda(music5);

        // 第五节课 星期二 体育
        let pe5: AgendaData = {} as AgendaData;

        pe5.sd = day30;
        pe5.al = IsWholeday.StartSet;
        pe5.st = timeranges[4][0];
        pe5.et = timeranges[4][1];
        pe5.evn = "体育";

        await eventService.saveAgenda(pe5);

      });

      it(`Case 1 - 1 确认18年09月活动`, async () => {
        let month1809Summary = await calendarService.fetchMonthActivitiesSummary("2018/09");

        expect(month1809Summary).toBeDefined();

        for (let daySummary of month1809Summary.days) {
          expect(daySummary.day).toBeDefined();

          let dayOfWeek = Number(moment(daySummary.day,"YYYY/MM/DD").format("d"));
          if (dayOfWeek > 0 && dayOfWeek < 6) {             // 非周末
            if (dayOfWeek == 3) {                           // 星期三
              if (daySummary.day == "2018/09/05") {  // 第三天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(6);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(6);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else {
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(6);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(6);
                expect(daySummary.bookedtimesummary).toBe(0);
              }
            } else {                                        // 星期三以外
              if (daySummary.day == "2018/09/03") {         // 第一天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else if (daySummary.day == "2018/09/04") {  // 第二天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else if (daySummary.day == "2018/09/06") {  // 第四天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else if (daySummary.day == "2018/09/07") {  // 第五天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else {                                      // 重复天
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              }
            }
          } else {                                          // 周末
            if (daySummary.day == "2018/09/01") {
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(16);
              expect(daySummary.agendascount).toBe(16);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(0);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else if (daySummary.day == "2018/09/29") {
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(5);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(0);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else if (daySummary.day == "2018/09/30") {
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(5);
              expect(daySummary.agendascount).toBe(5);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(0);
              expect(daySummary.bookedtimesummary).toBe(0);
            } else {
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(0);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(0);
              expect(daySummary.bookedtimesummary).toBe(0);
            }
          }
        }
      });

      it(`Case 1 - 2 确认18年10月活动`, async () => {
        let month1810Summary = await calendarService.fetchMonthActivitiesSummary("2018/10");

        expect(month1810Summary).toBeDefined();

        for (let daySummary of month1810Summary.days) {
          expect(daySummary.day).toBeDefined();
          if (["2018/10/01", "2018/10/02", "2018/10/03", "2018/10/04", "2018/10/05"].indexOf(daySummary.day) >= 0) {
            expect(daySummary.calendaritemscount).toBe(0);
            expect(daySummary.activityitemscount).toBe(0);
            expect(daySummary.eventscount).toBe(0);
            expect(daySummary.agendascount).toBe(0);
            expect(daySummary.taskscount).toBe(0);
            expect(daySummary.memoscount).toBe(0);
            expect(daySummary.repeateventscount).toBe(0);
            expect(daySummary.bookedtimesummary).toBe(0);
          } else {
            let dayOfWeek = Number(moment(daySummary.day,"YYYY/MM/DD").format("d"));
            if (dayOfWeek > 0 && dayOfWeek < 6) {             // 非周末
              if (dayOfWeek == 3) {
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(6);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(6);
                expect(daySummary.bookedtimesummary).toBe(0);
              } else {
                expect(daySummary.calendaritemscount).toBe(0);
                expect(daySummary.activityitemscount).toBe(0);
                expect(daySummary.eventscount).toBe(5);
                expect(daySummary.agendascount).toBe(0);
                expect(daySummary.taskscount).toBe(0);
                expect(daySummary.memoscount).toBe(0);
                expect(daySummary.repeateventscount).toBe(5);
                expect(daySummary.bookedtimesummary).toBe(0);
              }
            } else {                                          // 周末
              expect(daySummary.calendaritemscount).toBe(0);
              expect(daySummary.activityitemscount).toBe(0);
              expect(daySummary.eventscount).toBe(0);
              expect(daySummary.agendascount).toBe(0);
              expect(daySummary.taskscount).toBe(0);
              expect(daySummary.memoscount).toBe(0);
              expect(daySummary.repeateventscount).toBe(0);
              expect(daySummary.bookedtimesummary).toBe(0);
            }
          }
        }
      });
    });

    describe(`Case 1 - 7 2018/09/11 星期二 数学课老师请病假 与 星期三的语文课 调课`, () => {
      beforeEach(async () => {
        let day0911Activities = await calendarService.fetchDayActivities("2018/09/11");

        for (let event of day0911Activities.events) {
          if (event.evn == "数学") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.evn = "语文";
            changed.bz = "张老师病假, 与星期三的语文课调课";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
          }
        }

        let day0912Activities = await calendarService.fetchDayActivities("2018/09/12");

        for (let event of day0912Activities.events) {
          if (event.evn == "语文") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.evn = "数学";
            changed.bz = "星期二数学张老师病假, 与星期三的语文课调课";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);

            break;
          }
        }

      });

      it(`Case 1 - 1 确认 2018/09/11 星期二 调整后的课程表`, async () => {
        let day0911Activities = await calendarService.fetchDayActivities("2018/09/11");

        let chinesecount: number = 0;
        for (let event of day0911Activities.events) {
          if (event.evn == "数学") {
            fail("数学课已经调整为语文课");
          }
          if (event.evn == "语文") {
            chinesecount++;
          }
        }

        expect(chinesecount).toBe(3);
      });

      it(`Case 1 - 2 确认 2018/09/12 星期三 调整后的课程表`, async () => {
        let day0912Activities = await calendarService.fetchDayActivities("2018/09/12");

        let mathcount: number = 0;
        let chinesecount: number = 0;
        for (let event of day0912Activities.events) {
          if (event.evn == "语文") {
            chinesecount++;
          }
          if (event.evn == "数学") {
            mathcount++;
          }
        }

        expect(chinesecount).toBe(1);
        expect(mathcount).toBe(1);
      });

      it(`Case 1 - 3 确认个人活动汇总`, async () => {
        let summary: ActivitySummaryData = await calendarService.fetchActivitiesSummary();

        expect(summary).toBeDefined();
        expect(summary.eventscount).toBeGreaterThan(1);
        expect(summary.repeateventscount).toBeGreaterThan(1);
      });
    });

    describe(`Case 1 - 8 2019/01/07 起 美术课 调整为 数学课`, () => {
      beforeEach(async () => {
        let day0107Activities = await calendarService.fetchDayActivities("2019/01/07");

        for (let event of day0107Activities.events) {
          if (event.evn == "美术") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.evn = "数学";
            changed.bz = "期末美术课改上数学课";

            await eventService.saveAgenda(changed, origin, OperateType.FromSel);
          }
        }
      });

      it(`Case 1 - 1 确认 2019/01/07 调整后的课程表`, async () => {
        let day0107Activities = await calendarService.fetchDayActivities("2019/01/07");

        let mathcount: number = 0;
        for (let event of day0107Activities.events) {
          if (event.evn == "美术") {
            fail("美术课已经调整为数学课");
          }
          if (event.evn == "数学") {
            mathcount++;
          }
        }

        expect(mathcount).toBe(2);
      });

      it(`Case 1 - 2 确认 2019/01/09 调整后的课程表`, async () => {
        let day0109Activities = await calendarService.fetchDayActivities("2019/01/09");

        let mathcount: number = 0;
        for (let event of day0109Activities.events) {
          if (event.evn == "美术") {
            fail("美术课已经调整为数学课");
          }
          if (event.evn == "数学") {
            mathcount++;
          }
        }

        expect(mathcount).toBe(1);
      });
    });

    describe(`Case 1 - 9 2018/09/01 起 每月5日 公布 当月家长开放日安排`, () => {
      beforeEach(async () => {
        let openfamily: AgendaData = {} as AgendaData;

        let openfamilyrt: RtJson = new RtJson();
        openfamilyrt.cycletype = CycleType.month;
        openfamilyrt.openway.push(4);
        openfamilyrt.over.type = OverType.limitdate;
        openfamilyrt.over.value = end;

        let openfamilytx: TxJson = new TxJson();
        openfamilytx.reminds.push(60 * 24);       // 提前一天提醒 60分钟 * 24小时

        openfamily.sd = day;
        openfamily.evn = "公布 当月家长开放日安排";
        openfamily.rtjson = openfamilyrt;
        openfamily.txjson = openfamilytx;

        await eventService.saveAgenda(openfamily);

      });

      describe(`Case 1 - 1 2018/09/05 备注 公布 09/15 家长开放日`, () => {
        beforeEach(async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              let origin: AgendaData = await eventService.getAgenda(event.evi);

              let changed: AgendaData = {} as AgendaData;
              Object.assign(changed, origin);

              changed.bz = "09/15 家长开放日";

              await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            }
          }
        });

        it(`Case 1 - 0 确认 2018/09/01 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/09/01");

          let rtevi: string;
          let evi: string;
          let rfg: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              rfg = event.rfg;
              evi = event.evi;
            }
          }

          expect(rtevi).toBe("");
          expect(rfg).toBe(RepeatFlag.Repeat);
          expect(evi).not.toBe("");
        });
        it(`Case 1 - 1 确认 2018/09/05 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

          let rtevi: string;
          let evi: string;
          let rfg: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              rfg = event.rfg;
              evi = event.evi;
            }
          }

          expect(rtevi).not.toBe("");
          expect(rfg).toBe(RepeatFlag.Repeat);
          expect(evi).not.toBe("");
        });
        it(`Case 1 - 2 确认 2018/10/05 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

          let rtevi: string;
          let evi: string;
          let rfg: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              evi = event.evi;
              rfg = event.rfg;
            }
          }

          expect(rtevi).not.toBe("");
          expect(rfg).toBe(RepeatFlag.Repeat);
          expect(evi).not.toBe("");
        });
        it(`Case 1 - 3 确认 2018/11/05 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

          let rtevi: string;
          let evi: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              evi = event.evi;
            }
          }

          expect(rtevi).not.toBe("");
          expect(evi).not.toBe("");
        });
        it(`Case 1 - 4 确认 2018/12/05 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

          let rtevi: string;
          let evi: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              evi = event.evi;
            }
          }

          expect(rtevi).not.toBe("");
          expect(evi).not.toBe("");
        });
        it(`Case 1 - 5 确认 2019/01/05 的 开放日日程为重复日程`, async () => {
          let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

          let rtevi: string;
          let evi: string;
          for (let event of dayActivities.events) {
            if (event.evn == "公布 当月家长开放日安排") {
              rtevi = event.rtevi;
              evi = event.evi;
            }
          }

          expect(rtevi).not.toBe("");
          expect(evi).not.toBe("");
        });

        describe(`Case 1 - 2 2018/10/05 备注 公布 10/16 家长开放日`, () => {
          beforeEach(async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                let origin: AgendaData = await eventService.getAgenda(event.evi);

                let changed: AgendaData = {} as AgendaData;
                Object.assign(changed, origin);

                changed.bz = "10/16 家长开放日";

                await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
              }
            }
          });

          it(`Case 1 - 0 确认 2018/09/01 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/09/01");

            let rtevi: string;
            let evi: string;
            let rfg: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                rfg = event.rfg;
                evi = event.evi;
              }
            }

            expect(rtevi).toBe("");
            expect(rfg).toBe(RepeatFlag.Repeat);
            expect(evi).not.toBe("");
          });
          it(`Case 1 - 1 确认 2018/09/05 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

            let rtevi: string;
            let evi: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                evi = event.evi;
              }
            }

            expect(rtevi).not.toBe("");
            expect(evi).not.toBe("");
          });
          it(`Case 1 - 2 确认 2018/10/05 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

            let rtevi: string;
            let rfg: string;
            let evi: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                evi = event.evi;
                rfg = event.rfg;
              }
            }

            expect(rtevi).not.toBe("");
            expect(rfg).toBe(RepeatFlag.Repeat);
            expect(evi).not.toBe("");
          });
          it(`Case 1 - 3 确认 2018/11/05 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

            let rtevi: string;
            let evi: string;
            let rfg: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                evi = event.evi;
                rfg = event.rfg;
              }
            }

            expect(rtevi).not.toBe("");
            expect(rfg).toBe(RepeatFlag.Repeat);
            expect(evi).not.toBe("");
          });
          it(`Case 1 - 4 确认 2018/12/05 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

            let rtevi: string;
            let evi: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                evi = event.evi;
              }
            }

            expect(rtevi).not.toBe("");
            expect(evi).not.toBe("");
          });
          it(`Case 1 - 5 确认 2019/01/05 的 开放日日程为重复日程`, async () => {
            let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

            let rtevi: string;
            let evi: string;
            for (let event of dayActivities.events) {
              if (event.evn == "公布 当月家长开放日安排") {
                rtevi = event.rtevi;
                evi = event.evi;
              }
            }

            expect(rtevi).not.toBe("");
            expect(evi).not.toBe("");
          });

          describe(`Case 1 - 3 2018/11/05 备注 公布 11/15 家长开放日`, () => {
            beforeEach(async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  let origin: AgendaData = await eventService.getAgenda(event.evi);

                  let changed: AgendaData = {} as AgendaData;
                  Object.assign(changed, origin);

                  changed.bz = "11/15 家长开放日";

                  await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
                }
              }
            });

            it(`Case 1 - 0 确认 2018/09/01 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/09/01");

              let rtevi: string;
              let evi: string;
              let rfg: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  rfg = event.rfg;
                  evi = event.evi;
                }
              }

              expect(rtevi).toBe("");
              expect(rfg).toBe(RepeatFlag.Repeat);
              expect(evi).not.toBe("");
            });
            it(`Case 1 - 1 确认 2018/09/05 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

              let rtevi: string;
              let evi: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  evi = event.evi;
                }
              }

              expect(rtevi).not.toBe("");
              expect(evi).not.toBe("");
            });
            it(`Case 1 - 2 确认 2018/10/05 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

              let rtevi: string;
              let evi: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  evi = event.evi;
                }
              }

              expect(rtevi).not.toBe("");
              expect(evi).not.toBe("");
            });
            it(`Case 1 - 3 确认 2018/11/05 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

              let rtevi: string;
              let evi: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  evi = event.evi;
                }
              }

              expect(rtevi).not.toBe("");
              expect(evi).not.toBe("");
            });
            it(`Case 1 - 4 确认 2018/12/05 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

              let rtevi: string;
              let evi: string;
              let rfg: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  evi = event.evi;
                  rfg = event.rfg;
                }
              }

              expect(rtevi).not.toBe("");
              expect(rfg).toBe(RepeatFlag.Repeat);
              expect(evi).not.toBe("");
            });
            it(`Case 1 - 5 确认 2019/01/05 的 开放日日程为重复日程`, async () => {
              let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

              let rtevi: string;
              let evi: string;
              for (let event of dayActivities.events) {
                if (event.evn == "公布 当月家长开放日安排") {
                  rtevi = event.rtevi;
                  evi = event.evi;
                }
              }

              expect(rtevi).not.toBe("");
              expect(evi).not.toBe("");
            });

            describe(`Case 1 - 4 2018/12/05 备注 公布 12/11 家长开放日`, () => {
              beforeEach(async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    let origin: AgendaData = await eventService.getAgenda(event.evi);

                    let changed: AgendaData = {} as AgendaData;
                    Object.assign(changed, origin);

                    changed.bz = "12/11 家长开放日";

                    await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
                  }
                }
              });

              it(`Case 1 - 0 确认 2018/09/01 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/09/01");

                let rtevi: string;
                let evi: string;
                let rfg: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    rfg = event.rfg;
                    evi = event.evi;
                  }
                }

                expect(rtevi).toBe("");
                expect(rfg).toBe(RepeatFlag.Repeat);
                expect(evi).not.toBe("");
              });
              it(`Case 1 - 1 确认 2018/09/05 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

                let rtevi: string;
                let evi: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    evi = event.evi;
                  }
                }

                expect(rtevi).not.toBe("");
                expect(evi).not.toBe("");
              });
              it(`Case 1 - 2 确认 2018/10/05 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

                let rtevi: string;
                let evi: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    evi = event.evi;
                  }
                }

                expect(rtevi).not.toBe("");
                expect(evi).not.toBe("");
              });
              it(`Case 1 - 3 确认 2018/11/05 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

                let rtevi: string;
                let evi: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    evi = event.evi;
                  }
                }

                expect(rtevi).not.toBe("");
                expect(evi).not.toBe("");
              });
              it(`Case 1 - 4 确认 2018/12/05 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

                let rtevi: string;
                let evi: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    evi = event.evi;
                  }
                }

                expect(rtevi).not.toBe("");
                expect(evi).not.toBe("");
              });
              it(`Case 1 - 5 确认 2019/01/05 的 开放日日程为重复日程`, async () => {
                let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

                let rtevi: string;
                let evi: string;
                let rfg: string;
                for (let event of dayActivities.events) {
                  if (event.evn == "公布 当月家长开放日安排") {
                    rtevi = event.rtevi;
                    evi = event.evi;
                    rfg = event.rfg;
                  }
                }

                expect(rtevi).not.toBe("");
                expect(rfg).toBe(RepeatFlag.Repeat);
                expect(evi).not.toBe("");
              });

              describe(`Case 1 - 5 2019/01/05 备注 公布 取消本月家长开放日`, () => {
                beforeEach(async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      let origin: AgendaData = await eventService.getAgenda(event.evi);

                      let changed: AgendaData = {} as AgendaData;
                      Object.assign(changed, origin);

                      changed.bz = "取消本月家长开放日";

                      await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
                    }
                  }
                });

                it(`Case 1 - 0 确认 2018/09/01 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2018/09/01");

                  let rtevi: string;
                  let evi: string;
                  let rfg: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      rfg = event.rfg;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).toBe("");
                  expect(rfg).toBe(RepeatFlag.Repeat);
                  expect(evi).not.toBe("");
                });
                it(`Case 1 - 1 确认 2018/09/05 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

                  let rtevi: string;
                  let evi: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).not.toBe("");
                  expect(evi).not.toBe("");
                });
                it(`Case 1 - 2 确认 2018/10/05 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

                  let rtevi: string;
                  let evi: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).not.toBe("");
                  expect(evi).not.toBe("");
                });
                it(`Case 1 - 3 确认 2018/11/05 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

                  let rtevi: string;
                  let evi: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).not.toBe("");
                  expect(evi).not.toBe("");
                });
                it(`Case 1 - 4 确认 2018/12/05 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

                  let rtevi: string;
                  let evi: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).not.toBe("");
                  expect(evi).not.toBe("");
                });
                it(`Case 1 - 5 确认 2019/01/05 的 开放日日程为重复日程`, async () => {
                  let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

                  let rtevi: string;
                  let evi: string;
                  for (let event of dayActivities.events) {
                    if (event.evn == "公布 当月家长开放日安排") {
                      rtevi = event.rtevi;
                      evi = event.evi;
                    }
                  }

                  expect(rtevi).not.toBe("");
                  expect(evi).not.toBe("");
                });
              });
            });
          });
        });
      });

      it(`Case 1 - 1 2018/09/05 备注 公布 09/15 家长开放日`, async () => {
        let dayActivities = await calendarService.fetchDayActivities("2018/09/05");

        let count: number = 0;
        for (let event of dayActivities.events) {
          if (event.evn == "公布 当月家长开放日安排") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.bz = "09/15 家长开放日";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            count++;
          }
        }

        expect(count).toBe(1);
      });

      it(`Case 1 - 2 2018/10/05 备注 公布 10/16 家长开放日`, async () => {
        let dayActivities = await calendarService.fetchDayActivities("2018/10/05");

        let count: number = 0;
        for (let event of dayActivities.events) {
          if (event.evn == "公布 当月家长开放日安排") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.bz = "10/16 家长开放日";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            count++;
          }
        }

        expect(count).toBe(1);
      });

      it(`Case 1 - 3 2018/11/05 备注 公布 11/15 家长开放日`, async () => {
        let dayActivities = await calendarService.fetchDayActivities("2018/11/05");

        let count: number = 0;
        for (let event of dayActivities.events) {
          if (event.evn == "公布 当月家长开放日安排") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.bz = "11/15 家长开放日";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            count++;
          }
        }

        expect(count).toBe(1);
      });

      it(`Case 1 - 4 2018/12/05 备注 公布 12/11 家长开放日`, async () => {
        let dayActivities = await calendarService.fetchDayActivities("2018/12/05");

        let count: number = 0;
        for (let event of dayActivities.events) {
          if (event.evn == "公布 当月家长开放日安排") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.bz = "12/11 家长开放日";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            count++;
          }
        }

        expect(count).toBe(1);
      });

      it(`Case 1 - 5 2019/01/05 备注 公布 取消本月家长开放日`, async () => {
        let dayActivities = await calendarService.fetchDayActivities("2019/01/05");

        let count: number = 0;
        for (let event of dayActivities.events) {
          if (event.evn == "公布 当月家长开放日安排") {
            let origin: AgendaData = await eventService.getAgenda(event.evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, origin);

            changed.bz = "取消本月家长开放日";

            await eventService.saveAgenda(changed, origin, OperateType.OnlySel);
            count++;
          }
        }

        expect(count).toBe(1);
      });
    });

    describe(`Case 1 - 10 2018年 每年 10/10 体检`, () => {
      beforeEach(async () => {
        // 每年 10/10 体检
        let healthcare: AgendaData = {} as AgendaData;

        let healthcarert: RtJson = new RtJson();
        healthcarert.cycletype = CycleType.year;
        healthcarert.over.type = OverType.fornever;

        healthcare.sd = "2018/10/10";
        healthcare.evn = "体检";
        healthcare.rtjson = healthcarert;

        await eventService.saveAgenda(healthcare);

      });

      it(`Case 1 - 1 2019/10/10 存在体检日程`, async () => {
        let day1010Activities = await calendarService.fetchDayActivities("2019/10/10");

        let events = day1010Activities.events.filter((element) => {
          return element.evn == "体检";
        });

        expect(day1010Activities).toBeDefined();
        expect(events.length).toBe(1);
      });

      describe(`Case 1 - 2 2019年 改成 每年 08/16 体检`, () => {
        beforeEach(async () => {
          let day1010Activities = await calendarService.fetchDayActivities("2019/10/10");

          let events = day1010Activities.events.filter((element) => {
            return element.evn == "体检";
          });

          let event = events[0];

          // 2019年 改成 每年 08/16 体检
          let origin: AgendaData = await eventService.getAgenda(event.evi);
          let changed: AgendaData = {} as AgendaData;

          Object.assign(changed, origin);

          changed.evd = "2018/08/16";
          changed.evn = "体检 08/16";

          await eventService.saveAgenda(changed, origin, OperateType.FromSel);
        });

        it(`Case 1 - 1 2019/08/16 存在体检日程`, async () => {
          let day0816Activities = await calendarService.fetchDayActivities("2019/08/16");

          let events = day0816Activities.events.filter((element) => {
            return element.evn == "体检 08/16";
          });

          expect(day0816Activities).toBeDefined();
          expect(events.length).toBe(1);
        });

        it(`Case 1 - 2 2019/10/10 不存在体检日程`, async () => {
          let day1010Activities = await calendarService.fetchDayActivities("2019/10/10");

          let events = day1010Activities.events.filter((element) => {
            return element.evn == "体检";
          });

          expect(day1010Activities).toBeDefined();
          expect(events.length).toBe(0);
        });

        it(`Case 1 - 3 2020/08/16 存在体检日程`, async () => {
          let day0816Activities = await calendarService.fetchDayActivities("2020/08/16");

          expect(day0816Activities).toBeDefined();
          expect(day0816Activities.events.length).toBe(1);
        });
      });
    });
  });

  it(`Case 27 - 1 acceptSyncPrivatePlans 更新已同步日历标志 - 本地无数据(无报错)`, (done: DoneFn) => {
    calendarService.acceptSyncPrivatePlans(["planid"])
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  xit(`Case 26 - 1 - 1 syncPrivatePlans 同步所有未同步自定义日历 - 有未同步数据(不报错)`, async (done: DoneFn) => {
    // 自定义日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    calendarService.syncPrivatePlans()
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      console.log(e);
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 26 - 1 syncPrivatePlans 同步所有未同步自定义日历 - 无数据(不报错)`, async (done: DoneFn) => {
    calendarService.syncPrivatePlans()
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  xit(`Case 25 - 2 syncPrivatePlans 同步自定义日历数据 - 冥王星公共日历(报错)`, async (done: DoneFn) => {
    // 下载公共日历
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    // 共享自定义日历
    calendarService.syncPrivatePlans([plan])
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  it(`Case 25 - 1 syncPrivatePlans 同步自定义日历数据(无报错)`, async (done: DoneFn) => {
    // 自定义日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    // 同步自定义日历数据
    calendarService.syncPrivatePlans([plan])
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 24 - 2 receivedPlanData 接收日历数据 - 删除共享日历`, async () => {
    // 准备共享日历
    let plan: PlanData = {} as PlanData;

    plan.ji = util.getUuid();
    plan.jn = "新共享日历";
    plan.jc = "#8f8f8f";
    plan.jt = PlanType.PrivatePlan;
    plan.wtt = moment().unix();
    plan.utt = moment().unix();
    plan.tb = SyncType.unsynch;
    plan.del = DelType.undel;

    // 接收共享数据
    let received = await calendarService.receivedPlanData(plan, SyncDataStatus.Deleted);

    expect(received).toBeDefined();
    expect(received.ji).toBe(plan.ji);
    expect(received.jn).toBe(plan.jn);
    expect(received.jt).toBe(plan.jt);
    expect(received.tb).toBe(SyncType.synch);
    expect(received.del).toBe(DelType.del);

    // 重新查询确认保存的共享数据
    let fetched = await calendarService.getPlan(received.ji);

    expect(fetched).toBeNull();
  });

  it(`Case 24 - 1 receivedPlanData 接收日历数据 - 新共享日历`, async () => {
    // 准备共享日历
    let plan: PlanData = {} as PlanData;

    plan.ji = util.getUuid();
    plan.jn = "新共享日历";
    plan.jc = "#8f8f8f";
    plan.jt = PlanType.PrivatePlan;
    plan.wtt = moment().unix();
    plan.utt = moment().unix();
    plan.tb = SyncType.unsynch;
    plan.del = DelType.undel;

    // 接收共享数据
    let received = await calendarService.receivedPlanData(plan, SyncDataStatus.UnDeleted);

    expect(received).toBeDefined();
    expect(received.ji).toBe(plan.ji);
    expect(received.jn).toBe(plan.jn);
    expect(received.jt).toBe(plan.jt);
    expect(received.tb).toBe(SyncType.synch);
    expect(received.del).toBe(DelType.undel);

    // 重新查询确认保存的共享数据
    let fetched = await calendarService.getPlan(received.ji);

    expect(fetched).toBeDefined();
    expect(fetched.ji).toBe(plan.ji);
    expect(fetched.jn).toBe(plan.jn);
    expect(fetched.jt).toBe(plan.jt);
    expect(fetched.tb).toBe(SyncType.synch);
    expect(fetched.del).toBe(DelType.undel);
  });

  it(`Case 23 - 2 receivedPlan 接收日历共享请求(无日历ID报错)`, (done: DoneFn) => {
    calendarService.receivedPlan("")
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  it(`Case 23 - 1 receivedPlan 接收日历共享请求(无报错)`, (done: DoneFn) => {
    calendarService.receivedPlan("plan id")
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 22 - 4 sendPlan 共享日历 - 自定义日历(3个成员)`, async (done: DoneFn) => {
    // 准备联系人数据
    await prepareContacts();

    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<Member>();

    for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
      let member: Member = {} as Member;

      member.pwi = contact.pwi;
      member.ui = contact.ui;

      plan.members.push(member);
    }

    let savedplan = await calendarService.savePlan(plan);

    // 共享自定义日历
    calendarService.sendPlan(plan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 22 - 3 sendPlan 共享日历 - 自定义日历(1个成员)`, async (done: DoneFn) => {
    // 准备联系人数据
    await prepareContacts();

    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<Member>();

    for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
      let member: Member = {} as Member;

      member.pwi = contact.pwi;
      member.ui = contact.ui;

      plan.members.push(member);
    }

    let savedplan = await calendarService.savePlan(plan);

    // 共享自定义日历
    calendarService.sendPlan(plan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 22 - 2 sendPlan 共享日历 - 冥王星公共日历(报错)`, async (done: DoneFn) => {
    // 下载公共日历
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    // 共享自定义日历
    calendarService.sendPlan(plan)
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  it(`Case 22 - 1 sendPlan 共享日历 - 自定义日历(无报错)`, async (done: DoneFn) => {
    // 自定义日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    // 共享自定义日历
    calendarService.sendPlan(plan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  xit(`Case 21 - 6 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个小任务`, async (done) => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    let mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evd = day;
    minitask.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveMiniTask(minitask);

    setTimeout(() => {
      expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
      // 本月备忘为1
      expect(calendaractivities[3].events.length).toBe(1);
      done();
    }, 1500);
  });

  xit(`Case 21 - 5 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个备忘`, async (done) => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    let mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    setTimeout(() => {
      expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
      // 本月备忘为1
      expect(calendaractivities[3].memos.length).toBe(1);
      done();
    }, 1500);
  });

  xit(`Case 21 - 4 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个日历项`, async (done) => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    let mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    setTimeout(() => {
      expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
      // 本月日历项为1
      expect(calendaractivities[3].calendaritems.length).toBe(1);
      done();
    }, 1500);
  });

  xit(`Case 21 - 3 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个日程`, async (done) => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    let mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    setTimeout(() => {
      expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
      // 本月事件为1
      expect(calendaractivities[3].events.length).toBe(1);
      done();
    }, 1500);
  });

  xit(`Case 21 - 2 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个任务`, async (done) => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    let mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    setTimeout(() => {
      expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
      // 本月事件为1
      expect(calendaractivities[3].events.length).toBe(1);
      done();
    }, 1500);
  });

  it(`Case 21 - 1 mergeCalendarActivity 合并日历显示列表活动数据 - 入参为空(报错)`, () => {
    expect(function() {
      calendarService.mergeCalendarActivity(null);
    }).toThrow();
  });

  it(`Case 20 - 1 fetchPlanMemos 取得指定日历所有备忘 - 无备忘`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    let memos = await calendarService.fetchPlanMemos(plan.ji);

    expect(memos).toBeDefined();
    expect(memos.length).toBe(0);
  });

  it(`Case 19 - 1 fetchPlanEvents 取得指定日历所有事件 - 无事件`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    let events = await calendarService.fetchPlanEvents(plan.ji);

    expect(events).toBeDefined();
    expect(events.length).toBe(0);
  });

  it(`Case 18 - 1 - 5 findActivities 活动查询 - 毕业典礼在什么时候开?(没有毕业典礼)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.text = "毕业典礼";

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 18 - 1 - 4 findActivities 活动查询 - 还有哪些数学课要上?(没有数学课)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.sd = moment().format("YYYY/MM/DD");
    condition.text = "数学课";
    condition.mark.push("数学课");

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 18 - 1 - 3 findActivities 活动查询 - 到今天为止上过了那些数学课?(没有数学课)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.ed = moment().format("YYYY/MM/DD");
    condition.text = "数学课";
    condition.mark.push("数学课");

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 18 - 1 - 2 findActivities 活动查询 - 今天上午有什么会议?(没有会议)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.sd = moment().format("YYYY/MM/DD");
    condition.st = "06:00";
    condition.ed = moment().format("YYYY/MM/DD");
    condition.et = "11:00";
    condition.text = "会议";
    condition.mark.push("会议");

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 18 - 1 - 1 findActivities 活动查询 - 今天上午有什么安排?(没有活动)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.sd = moment().format("YYYY/MM/DD");
    condition.st = "06:00";
    condition.ed = moment().format("YYYY/MM/DD");
    condition.et = "11:00";

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 18 - 1 findActivities 活动查询 - 今天有什么安排?(没有活动)`, async () => {
    let condition: FindActivityCondition = new FindActivityCondition();

    condition.sd = moment().format("YYYY/MM/DD");
    condition.ed = moment().format("YYYY/MM/DD");

    let activities = await calendarService.findActivities(condition);

    expect(activities).toBeDefined();
    expect(activities.calendaritems.length).toBe(0);
    expect(activities.events.length).toBe(0);
    expect(activities.memos.length).toBe(0);
  });

  it(`Case 17 - 3 - 1 getCalendarActivities 取得日历画面显示活动一览 - 向下拉加载(未初始化报错)`, (done: DoneFn) => {
    calendarService.clearCalendarActivities();
    calendarService.getCalendarActivities(PageDirection.PageDown)
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  xit(`Case 17 - 3 getCalendarActivities 取得日历画面显示活动一览 - 向下拉加载`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.getCalendarActivities(PageDirection.PageUp);
    await calendarService.getCalendarActivities(PageDirection.PageDown);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(9);
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(2, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[4].month).toBe(month);
    expect(calendarholdings[5].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
    expect(calendarholdings[6].month).toBe(moment(month,"YYYY/MM").add(2, "months").format("YYYY/MM"));
  });

  it(`Case 17 - 2 - 1 getCalendarActivities 取得日历画面显示活动一览 - 向上拉加载(未初始化报错)`, (done: DoneFn) => {
    calendarService.clearCalendarActivities();
    calendarService.getCalendarActivities(PageDirection.PageUp)
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  xit(`Case 17 - 2 getCalendarActivities 取得日历画面显示活动一览 - 向上拉加载`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.getCalendarActivities(PageDirection.PageUp);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(8);
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(month);
    expect(calendarholdings[4].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
    expect(calendarholdings[5].month).toBe(moment(month,"YYYY/MM").add(2, "months").format("YYYY/MM"));
    expect(calendarholdings[6].month).toBe(moment(month,"YYYY/MM").add(3, "months").format("YYYY/MM"));
    expect(calendarholdings[7].month).toBe(moment(month,"YYYY/MM").add(4, "months").format("YYYY/MM"));
  });

  xit(`Case 17 - 1 getCalendarActivities 取得日历画面显示活动一览 - 默认当前月份以及前后各一个月`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(7);
    expect(calendarholdings[2].month).toBe(moment(month,"YYYY/MM").subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(month);
    expect(calendarholdings[4].month).toBe(moment(month,"YYYY/MM").add(1, "months").format("YYYY/MM"));
  });

  it(`Case 16 - 1 - 1 sharePlan 分享日历/计划 - 公共日历(没有日历项)`, async () => {
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    let shareurl = await calendarService.sharePlan(plan, false);

    expect(shareurl).toBeDefined();
  });

  it(`Case 16 - 1 sharePlan 分享日历/计划 - 公共日历`, async () => {
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    let shareurl = await calendarService.sharePlan(plan, true);

    expect(shareurl).toBeDefined();
  });

  it(`Case 15 - 2 - 1 downloadPublicPlan 下载日历 - 存在日历项(活动日历项)`, async () => {
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    expect(plan).toBeDefined();
    expect(plan.ji).toBe("shanghai_animation_exhibition_2019");
    expect(plan.items).toBeDefined();
    expect(plan.items.length).toBe(28);

    let monthSummary = await calendarService.fetchMonthActivitiesSummary("2019/08");

    expect(monthSummary).toBeDefined();
    // 08/03 ~ 08/06 ActivityPlan
    expect(monthSummary.days[1].activityitemscount).toBe(0);
    expect(monthSummary.days[2].activityitemscount).toBe(1);
    expect(monthSummary.days[3].activityitemscount).toBe(1);
    expect(monthSummary.days[4].activityitemscount).toBe(1);
    expect(monthSummary.days[5].activityitemscount).toBe(1);
    expect(monthSummary.days[6].activityitemscount).toBe(0);
  });

  it(`Case 15 - 2 downloadPublicPlan 下载日历 - 存在日历项(普通日历项)`, async () => {
    await calendarService.downloadPublicPlan("chinese_famous_2019", PlanType.CalendarPlan);

    let plan = await calendarService.getPlan("chinese_famous_2019");

    expect(plan).toBeDefined();
    expect(plan.ji).toBe("chinese_famous_2019");
    expect(plan.items).toBeDefined();
    expect(plan.items.length).toBe(24);

    let monthSummary = await calendarService.fetchMonthActivitiesSummary("2019/08");

    expect(monthSummary).toBeDefined();
    // 08/08 08/23 CalendarPlan
    expect(monthSummary.days[6].calendaritemscount).toBe(0);
    expect(monthSummary.days[7].calendaritemscount).toBe(1);
    expect(monthSummary.days[8].calendaritemscount).toBe(0);
    expect(monthSummary.days[21].calendaritemscount).toBe(0);
    expect(monthSummary.days[22].calendaritemscount).toBe(1);
    expect(monthSummary.days[23].calendaritemscount).toBe(0);

  });

  it(`Case 15 - 1 downloadPublicPlan 下载日历 - 无报错`, (done: DoneFn) => {
    calendarService.downloadPublicPlan("chinese_famous_2019", PlanType.CalendarPlan)
    .then(() => {
      expect("").toBe("");
      done();
    })
    .catch(e => {
      fail("预期无报错");
      done();
    });
  });

  it(`Case 14 - 1 removePlan 删除日历 - 不包含子项目(没有子项目)`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    await calendarService.removePlan(plan);

    let fetchedPlan = await calendarService.getPlan(plan.ji);

    expect(fetchedPlan).toBeNull();
  });

  it(`Case 13 - 2 getPlan 取得日历数据 - 包含子项目(1个日程)`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.ji = plan.ji;
    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    let fetchedPlan = await calendarService.getPlan(plan.ji);

    expect(fetchedPlan).toBeDefined();
    expect(fetchedPlan.jn).toBe("冥王星服务类 自动测试");
    expect(fetchedPlan.items).toBeDefined();
    expect(fetchedPlan.items.length).toBe(1);

    let item: AgendaData = {} as AgendaData;
    Object.assign(item, fetchedPlan.items[0]);

    expect(item.sd).toBe(day);
    expect(item.evn).toBe("结婚纪念日买礼物给太太");

  });

  it(`Case 13 - 1 getPlan 取得日历数据 - 不含子项目`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    let fetchedPlan = await calendarService.getPlan(plan.ji, false);

    expect(fetchedPlan).toBeDefined();
    expect(fetchedPlan.jn).toBe("冥王星服务类 自动测试");
    expect(fetchedPlan.jc).toBe("#f1f1f1");
    expect(fetchedPlan.jt).toBe(PlanType.PrivatePlan);
  });

  it(`Case 11 - 1 updatePlanColor 更新日历颜色`, async () => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    await calendarService.updatePlanColor(plan.ji, "#1a1a1a");

    let updatedPlan = await calendarService.getPlan(plan.ji, false);

    expect(updatedPlan).toBeDefined();
    expect(updatedPlan.jc).toBe("#1a1a1a");
  });

  it(`Case 10 - 1 - 2 fetchMonthActivitiesSummary 取得指定月概要 - 1个小任务`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evd = day;
    minitask.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveMiniTask(minitask);

    let month: string = moment().format("YYYY/MM");
    let days: number = moment(month,"YYYY/MM").daysInMonth();

    let monthSummary: MonthActivitySummaryData = await calendarService.fetchMonthActivitiesSummary(month);

    expect(monthSummary).toBeDefined();
    expect(monthSummary.month).toBe(month);
    expect(monthSummary.days).toBeDefined();
    expect(monthSummary.days.length).toBe(days);

    for (let daySummary of monthSummary.days) {
      if (daySummary.day == day) {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        expect(daySummary.activityitemscount).toBe(0);
        expect(daySummary.eventscount).toBe(1);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(0);
        expect(daySummary.memoscount).toBe(0);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      } else {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        expect(daySummary.activityitemscount).toBe(0);
        expect(daySummary.eventscount).toBe(0);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(0);
        expect(daySummary.memoscount).toBe(0);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      }
    }
  });

  it(`Case 10 - 1 - 1 fetchMonthActivitiesSummary 取得指定月概要 - 1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    let month: string = moment().format("YYYY/MM");
    let days: number = moment(month,"YYYY/MM").daysInMonth();

    let monthSummary: MonthActivitySummaryData = await calendarService.fetchMonthActivitiesSummary(month);

    expect(monthSummary).toBeDefined();
    expect(monthSummary.month).toBe(month);
    expect(monthSummary.days).toBeDefined();
    expect(monthSummary.days.length).toBe(days);

    for (let daySummary of monthSummary.days) {
      if (day == daySummary.day) {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        expect(daySummary.activityitemscount).toBe(1);
        expect(daySummary.eventscount).toBe(1);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(1);
        expect(daySummary.memoscount).toBe(1);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      } else {
        expect(daySummary.day).toBeDefined();
        expect(daySummary.calendaritemscount).toBe(0);
        expect(daySummary.activityitemscount).toBe(0);
        expect(daySummary.eventscount).toBe(0);
        expect(daySummary.agendascount).toBe(0);
        expect(daySummary.taskscount).toBe(0);
        expect(daySummary.memoscount).toBe(0);
        expect(daySummary.repeateventscount).toBe(0);
        expect(daySummary.bookedtimesummary).toBe(0);
      }
    }
  });

  it(`Case 10 - 1 fetchMonthActivitiesSummary 取得指定月概要 - 空值(没有任何活动)`, async () => {
    let month: string = moment().format("YYYY/MM");
    let days: number = moment(month,"YYYY/MM").daysInMonth();

    let monthSummary: MonthActivitySummaryData = await calendarService.fetchMonthActivitiesSummary(month);

    expect(monthSummary).toBeDefined();
    expect(monthSummary.month).toBe(month);
    expect(monthSummary.days).toBeDefined();
    expect(monthSummary.days.length).toBe(days);

    for (let daySummary of monthSummary.days) {
      expect(daySummary.day).toBeDefined();
      expect(daySummary.calendaritemscount).toBe(0);
      expect(daySummary.activityitemscount).toBe(0);
      expect(daySummary.eventscount).toBe(0);
      expect(daySummary.agendascount).toBe(0);
      expect(daySummary.taskscount).toBe(0);
      expect(daySummary.memoscount).toBe(0);
      expect(daySummary.repeateventscount).toBe(0);
      expect(daySummary.bookedtimesummary).toBe(0);
    }
  });

  it(`Case 9 - 1 - 5 mergePagedActivities 合并翻页活动数据 - 存在活动(不增加)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    // 增加空疏组
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, []);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(2);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(2);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(1);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 9 - 1 - 4 mergePagedActivities 合并翻页活动数据 - 没有活动(增加1个日程（不重复）、1个任务、1个备忘、1个日历项)`, async () => {

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    let activities: Array<any> = new Array<any>();
    activities = activities.concat(savedagenda);   // 合并后返回新数组，原数组不改变
    activities.push(task);
    activities.push(memo);
    activities.push(planitem1);

    // 增加1个日程、1个任务、1个备忘、1个日历项
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, activities);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(2);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(2);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(1);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 9 - 1 - 3 mergePagedActivities 合并翻页活动数据 - 没有活动(增加1个任务)`, async () => {

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    // 增加1个任务
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, [task]);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(1);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(1);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(0);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 9 - 1 - 2 mergePagedActivities 合并翻页活动数据 - 没有活动(增加1个日历项)`, async () => {

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 增加1个日历项
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, [planitem1]);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(0);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(0);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 9 - 1 - 1 mergePagedActivities 合并翻页活动数据 - 没有活动(增加1个备忘)`, async () => {

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 增加1个备忘
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, [memo]);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(0);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(1);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 9 - 1 mergePagedActivities 合并翻页活动数据 - 没有活动(增加1个日程（不重复）)`, async () => {

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 增加1个日程
    pagedActivities = calendarService.mergePagedActivities(pagedActivities, savedagenda);

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(1);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(1);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(0);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 3 - 2 fetchPagedActivities 取得第二页7天的活动（PageDown下拉） - 当天和往前第7天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let days: Array<string> = new Array<string>();

    days.push(moment().format("YYYY/MM/DD"));
    days.push(moment().subtract(7, "days").format("YYYY/MM/DD"));

    for (let subday of days) {
      // 日历项
      let planitem1: PlanItemData = {} as PlanItemData;

      planitem1.sd = subday;
      planitem1.jtn = "结婚纪念日";
      planitem1.jtt = PlanItemType.Activity;

      await calendarService.savePlanItem(planitem1);

      // 任务
      let task: TaskData = {} as TaskData;

      task.evd = subday;
      task.evn = "结婚纪念日前给太太买礼物";

      await eventService.saveTask(task);

      // 备忘
      let memo: MemoData = {} as MemoData;

      memo.sd = subday;
      memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

      memo = await memoService.saveMemo(memo);
    }

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageDown);

    let endday: string = moment(day,"YYYY/MM/DD").subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day,"YYYY/MM/DD").subtract(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(1);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(1);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(1);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 3 - 1 fetchPagedActivities 取得第二页7天的活动（PageDown下拉） - 当天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageDown);

    let endday: string = moment(day,"YYYY/MM/DD").subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day,"YYYY/MM/DD").subtract(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 3 fetchPagedActivities 取得第二页7天的活动（PageDown下拉） - 没有任何活动`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageDown);

    let endday: string = moment(day,"YYYY/MM/DD").subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day,"YYYY/MM/DD").subtract(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 2 - 2 fetchPagedActivities 取得第二页7天的活动（PageUp上拉） - 当天和往后第7天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let days: Array<string> = new Array<string>();

    days.push(moment().format("YYYY/MM/DD"));
    days.push(moment().add(7, "days").format("YYYY/MM/DD"));

    for (let subday of days) {
      // 日历项
      let planitem1: PlanItemData = {} as PlanItemData;

      planitem1.sd = subday;
      planitem1.jtn = "结婚纪念日";
      planitem1.jtt = PlanItemType.Activity;

      await calendarService.savePlanItem(planitem1);

      // 任务
      let task: TaskData = {} as TaskData;

      task.evd = subday;
      task.evn = "结婚纪念日前给太太买礼物";

      await eventService.saveTask(task);

      // 备忘
      let memo: MemoData = {} as MemoData;

      memo.sd = subday;
      memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

      memo = await memoService.saveMemo(memo);
    }

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageUp);

    let startday: string = moment(day,"YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day,"YYYY/MM/DD").add(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(1);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(1);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(1);

  });

  it(`Case 8 - 2 - 1 fetchPagedActivities 取得第二页7天的活动（PageUp上拉） - 当天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageUp);

    let startday: string = moment(day,"YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day,"YYYY/MM/DD").add(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 2 fetchPagedActivities 取得第二页7天的活动（PageUp上拉） - 没有任何活动`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities(day, PageDirection.PageUp);

    let startday: string = moment(day,"YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day,"YYYY/MM/DD").add(7, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 1 - 1 fetchPagedActivities 取得第一页7天的活动 - 当天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 获取活动
    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(1);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(1);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(1);

    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);

    expect(pagedActivities.days.get(day)).toBeDefined();
    expect(pagedActivities.days.get(day).day).toBe(day);
    expect(pagedActivities.days.get(day).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(day).calendaritems.length).toBe(1);
    expect(pagedActivities.days.get(day).events).toBeDefined();
    expect(pagedActivities.days.get(day).events.length).toBe(1);
    expect(pagedActivities.days.get(day).memos).toBeDefined();
    expect(pagedActivities.days.get(day).memos.length).toBe(1);

    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 8 - 1 fetchPagedActivities 取得第一页7天的活动 - 没有任何活动`, async () => {
    let pagedActivities: PagedActivityData = await calendarService.fetchPagedActivities();

    let startday: string = moment().subtract(3, "days").format("YYYY/MM/DD");
    let endday: string = moment().add(3, "days").format("YYYY/MM/DD");

    expect(pagedActivities.startday).toBe(startday);
    expect(pagedActivities.endday).toBe(endday);
    expect(pagedActivities.calendaritems).toBeDefined();
    expect(pagedActivities.calendaritems.length).toBe(0);
    expect(pagedActivities.events).toBeDefined();
    expect(pagedActivities.events.length).toBe(0);
    expect(pagedActivities.memos).toBeDefined();
    expect(pagedActivities.memos.length).toBe(0);
    expect(pagedActivities.days).toBeDefined();
    expect(pagedActivities.days.get(startday)).toBeDefined();
    expect(pagedActivities.days.get(startday).day).toBe(startday);
    expect(pagedActivities.days.get(startday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(startday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(startday).events).toBeDefined();
    expect(pagedActivities.days.get(startday).events.length).toBe(0);
    expect(pagedActivities.days.get(startday).memos).toBeDefined();
    expect(pagedActivities.days.get(startday).memos.length).toBe(0);
    expect(pagedActivities.days.get(endday)).toBeDefined();
    expect(pagedActivities.days.get(endday).day).toBe(endday);
    expect(pagedActivities.days.get(endday).calendaritems).toBeDefined();
    expect(pagedActivities.days.get(endday).calendaritems.length).toBe(0);
    expect(pagedActivities.days.get(endday).events).toBeDefined();
    expect(pagedActivities.days.get(endday).events.length).toBe(0);
    expect(pagedActivities.days.get(endday).memos).toBeDefined();
    expect(pagedActivities.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 7 - 3 mergeDayActivities 合并指定日期的活动 - 存在活动(更新1个日历项、1个任务、1个备忘)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let savedplanitems = await calendarService.savePlanItem(planitem1);

    if (savedplanitems && savedplanitems.length > 0) {
      planitem1 = savedplanitems[0];
    }

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    // 更新日历项、任务和备忘
    let changed: PlanItemData = {} as PlanItemData;
    Object.assign(changed, planitem1);

    changed.jtn = "结婚";
    let saved = await calendarService.savePlanItem(changed, planitem1);

    if (saved && saved.length > 0) {
      changed = saved[0];
    }

    task.evn = "结婚纪念日礼物";
    task = await eventService.saveTask(task);

    memo.mon = "结婚纪念日买了一块定制巧克力";
    memo = await memoService.saveMemo(memo);

    dayActivities = await calendarService.mergeDayActivities(dayActivities, [changed, task, memo]);

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(1);
    expect(dayActivities.calendaritems[0].jtn).toBe("结婚");
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(1);
    expect(dayActivities.events[0].evn).toBe("结婚纪念日礼物");
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(1);
    expect(dayActivities.memos[0].mon).toBe("结婚纪念日买了一块定制巧克力");

  });

  it(`Case 7 - 2 - 1 mergeDayActivities 合并指定日期的活动 - 存在活动(不增加)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    dayActivities = await calendarService.mergeDayActivities(dayActivities, []);

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(1);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(1);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(1);

  });

  it(`Case 7 - 2 mergeDayActivities 合并指定日期的活动 - 存在活动(增加1个日历项、1个任务、1个备忘)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    // 增加新的日历项、任务和备忘
    // 日历项
    let newplanitem: PlanItemData = {} as PlanItemData;

    newplanitem.sd = day;
    newplanitem.jtn = "结婚纪念日2";
    newplanitem.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(newplanitem);

    if (saved && saved.length > 0) {
      newplanitem = saved[0];
    }

    // 任务
    let newtask: TaskData = {} as TaskData;

    newtask.evd = day;
    newtask.evn = "结婚纪念日前给太太买礼物2";

    newtask = await eventService.saveTask(newtask);

    // 备忘
    let newmemo: MemoData = {} as MemoData;

    newmemo.sd = day;
    newmemo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴2";

    newmemo = await memoService.saveMemo(newmemo);

    dayActivities = await calendarService.mergeDayActivities(dayActivities, [newplanitem, newtask, newmemo]);

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(2);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(2);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(2);

  });

  it(`Case 7 - 1 - 1 mergeDayActivities 合并指定日期的活动 - 没有活动(增加1个日历项、1个任务、1个备忘)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    dayActivities = await calendarService.mergeDayActivities(dayActivities, [planitem1, task, memo]);

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(1);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(1);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(1);
  });

  it(`Case 7 - 1 mergeDayActivities 合并指定日期的活动 - 没有活动(增加1个任务)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    dayActivities = await calendarService.mergeDayActivities(dayActivities, [task]);

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(0);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(1);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(0);
  });

  it(`Case 6 - 1 - 2 fetchDayActivities 取得指定日期的活动 - 当天有1个日历项、1个任务、1个备忘和1个小任务`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evd = day;
    minitask.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveMiniTask(minitask);

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(1);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(2);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(1);
  });

  it(`Case 6 - 1 - 1 fetchDayActivities 取得指定日期的活动 - 当天有1个日历项、1个任务、1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(1);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(1);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(1);
  });

  it(`Case 6 - 1 fetchDayActivities 取得指定日期的活动 - 没有任何活动`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let dayActivities: DayActivityData = await calendarService.fetchDayActivities();

    expect(dayActivities.day).toBe(day);
    expect(dayActivities.calendaritems).toBeDefined();
    expect(dayActivities.calendaritems.length).toBe(0);
    expect(dayActivities.events).toBeDefined();
    expect(dayActivities.events.length).toBe(0);
    expect(dayActivities.memos).toBeDefined();
    expect(dayActivities.memos.length).toBe(0);
  });

  it(`Case 5 - 9 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个小任务`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evd = day;
    minitask.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveMiniTask(minitask);

    // 小任务数据不显示在日历中（式样要求）
    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(0);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 9 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、1个任务(日程每日重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每天走路锻炼10000步";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(2);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(1);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 8 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、1个任务(日程每年重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每年重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.year;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(2);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(1);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 7 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、2个任务(不重复)和1个备忘`, async () => {
    let day: string = moment().add(1, 'days').format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    let task2: TaskData = {} as TaskData;

    task2.evd = day;
    task2.evn = "结婚纪念日前给太太买礼物2";

    await eventService.saveTask(task2);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);
    let dayActivities: DayActivityData = await calendarService.fetchDayActivities(day);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(3);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(2);
    expect(daySummary.memoscount).toBe(1);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 6 fetchDayActivitiesSummary 取得指定日期概要 - 1个备忘`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(0);
    expect(daySummary.agendascount).toBe(0);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(1);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 5 fetchDayActivitiesSummary 取得指定日期概要 - 1个任务(不重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(0);
    expect(daySummary.taskscount).toBe(1);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 4 - 5 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程(每年重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每年重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.year;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);

    // 确认重复日期
    let nextday: string = moment().add(1, "years").format("YYYY/MM/DD");
    let nextdaySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(nextday);

    expect(nextdaySummary).toBeDefined();
    expect(nextdaySummary.day).toBe(nextday);
    expect(nextdaySummary.calendaritemscount).toBe(0);
    expect(nextdaySummary.activityitemscount).toBe(0);
    expect(nextdaySummary.eventscount).toBe(1);
    expect(nextdaySummary.agendascount).toBe(0);
    expect(nextdaySummary.taskscount).toBe(0);
    expect(nextdaySummary.memoscount).toBe(0);
    expect(nextdaySummary.repeateventscount).toBe(1);
    expect(nextdaySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 4 - 4 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程(每月重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每月重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);

    // 确认重复日期
    let nextday: string = moment().add(1, "months").format("YYYY/MM/DD");
    let nextdaySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(nextday);

    expect(nextdaySummary).toBeDefined();
    expect(nextdaySummary.day).toBe(nextday);
    expect(nextdaySummary.calendaritemscount).toBe(0);
    expect(nextdaySummary.activityitemscount).toBe(0);
    expect(nextdaySummary.eventscount).toBe(1);
    expect(nextdaySummary.agendascount).toBe(0);
    expect(nextdaySummary.taskscount).toBe(0);
    expect(nextdaySummary.memoscount).toBe(0);
    expect(nextdaySummary.repeateventscount).toBe(1);
    expect(nextdaySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 4 - 3 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程(每周重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每周重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);

    // 确认重复日期
    let nextday: string = moment().add(1, "weeks").format("YYYY/MM/DD");
    let nextdaySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(nextday);

    expect(nextdaySummary).toBeDefined();
    expect(nextdaySummary.day).toBe(nextday);
    expect(nextdaySummary.calendaritemscount).toBe(0);
    expect(nextdaySummary.activityitemscount).toBe(0);
    expect(nextdaySummary.eventscount).toBe(1);
    expect(nextdaySummary.agendascount).toBe(0);
    expect(nextdaySummary.taskscount).toBe(0);
    expect(nextdaySummary.memoscount).toBe(0);
    expect(nextdaySummary.repeateventscount).toBe(1);
    expect(nextdaySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 4 - 2 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程(每日重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rtjson = rt;

    await eventService.saveAgenda(agenda);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);

    // 确认重复日期
    let nextday: string = moment().add(1, "days").format("YYYY/MM/DD");
    let nextdaySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(nextday);

    expect(nextdaySummary).toBeDefined();
    expect(nextdaySummary.day).toBe(nextday);
    expect(nextdaySummary.calendaritemscount).toBe(0);
    expect(nextdaySummary.activityitemscount).toBe(0);
    expect(nextdaySummary.eventscount).toBe(1);
    expect(nextdaySummary.agendascount).toBe(0);
    expect(nextdaySummary.taskscount).toBe(0);
    expect(nextdaySummary.memoscount).toBe(0);
    expect(nextdaySummary.repeateventscount).toBe(1);
    expect(nextdaySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 4 - 1 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程(不重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(1);
    expect(daySummary.agendascount).toBe(1);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 3 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日历项(任意日历项)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 基本日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '农历节气 自动测试';
    plan.jc = '#a1a1a1';
    plan.jt = PlanType.CalendarPlan;

    plan = await calendarService.savePlan(plan);

    // 基本日历项
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.ji = plan.ji;
    planitem.sd = day;
    planitem.jtn = "谷雨";
    planitem.jtt = PlanItemType.Holiday;

    await calendarService.savePlanItem(planitem);

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(1);
    expect(daySummary.activityitemscount).toBe(1);
    expect(daySummary.eventscount).toBe(0);
    expect(daySummary.agendascount).toBe(0);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 2 fetchDayActivitiesSummary 取得指定日期概要 - 空值(没有任何活动)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let daySummary: DayActivitySummaryData = await calendarService.fetchDayActivitiesSummary(day);

    expect(daySummary).toBeDefined();
    expect(daySummary.day).toBe(day);
    expect(daySummary.calendaritemscount).toBe(0);
    expect(daySummary.activityitemscount).toBe(0);
    expect(daySummary.eventscount).toBe(0);
    expect(daySummary.agendascount).toBe(0);
    expect(daySummary.taskscount).toBe(0);
    expect(daySummary.memoscount).toBe(0);
    expect(daySummary.repeateventscount).toBe(0);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 5 - 1 fetchDayActivitiesSummary 取得指定日期概要 - 没有抛出异常`, async () => {
    expect(function() {
      calendarService.fetchDayActivitiesSummary().then((data) => {
        expect(data).toBeDefined();
      });
    }).not.toThrow();
  });

  it(`Case 4 - 2 - 1 mergeMonthActivities 合并月活动数据 - 存在活动(不增加)`, async () => {
    let day: string = "2019/08/23";

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    // 不增加数据
    monthActivity = calendarService.mergeMonthActivities(monthActivity, []);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(1);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(2);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(1);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(1);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(2);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(1);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 - 5 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个日历项、1个日程(不重复)、1个任务、1个备忘)`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    let activities: Array<any> = new Array<any>();
    activities = activities.concat(savedagenda);   // 合并后返回新数组，原数组不改变
    activities.push(task);
    activities.push(memo);
    activities.push(planitem1);

    // 增加1个日历项、1个日程(不重复)、1个任务、1个备忘
    monthActivity = calendarService.mergeMonthActivities(monthActivity, activities);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(1);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(2);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(1);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(1);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(2);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(1);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 - 4 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个日程(每日重复))`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.st = "08:00";
    agenda.evn = "早锻炼晨跑3000米";
    agenda.rtjson = rt;

    let savedagenda = await eventService.saveAgenda(agenda);

    // 增加1个日程(每日重复)
    monthActivity = calendarService.mergeMonthActivities(monthActivity, savedagenda);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    let betweenMonthEndDays: number = moment("2019/08", "YYYY/MM").endOf('month').diff(moment(day, "YYYY/MM/DD"), "days") + 1;

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(0);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(betweenMonthEndDays);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(0);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(1);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(0);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(1);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 - 3 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个日程(不重复))`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 增加1个日程(不重复)
    monthActivity = calendarService.mergeMonthActivities(monthActivity, savedagenda);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(0);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(1);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(0);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(1);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(0);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 - 2 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个日历项)`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem1);

    if (saved && saved.length > 0) {
      planitem1 = saved[0];
    }

    // 增加1个日历项
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [planitem1]);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(1);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(0);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(0);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(1);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(0);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(0);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 - 1 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个备忘)`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 增加1个备忘
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [memo]);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(0);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(0);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(1);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(0);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(1);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 4 - 1 mergeMonthActivities 合并月活动数据 - 没有活动(增加1个任务)`, async () => {
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    let day: string = "2019/08/23";

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    // 增加1个任务
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [task]);

    let startday: string = moment("2019/08","YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment("2019/08","YYYY/MM").endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBe(0);
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(1);
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBe(0);

    expect(monthActivity.days).toBeDefined();
    expect(monthActivity.days.get(startday)).toBeDefined();
    expect(monthActivity.days.get(startday).day).toBe(startday);
    expect(monthActivity.days.get(startday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(startday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(startday).events).toBeDefined();
    expect(monthActivity.days.get(startday).events.length).toBe(0);
    expect(monthActivity.days.get(startday).memos).toBeDefined();
    expect(monthActivity.days.get(startday).memos.length).toBe(0);

    expect(monthActivity.days.get(day)).toBeDefined();
    expect(monthActivity.days.get(day).day).toBe(day);
    expect(monthActivity.days.get(day).calendaritems).toBeDefined();
    expect(monthActivity.days.get(day).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(day).events).toBeDefined();
    expect(monthActivity.days.get(day).events.length).toBe(1);
    expect(monthActivity.days.get(day).memos).toBeDefined();
    expect(monthActivity.days.get(day).memos.length).toBe(0);

    expect(monthActivity.days.get(endday)).toBeDefined();
    expect(monthActivity.days.get(endday).day).toBe(endday);
    expect(monthActivity.days.get(endday).calendaritems).toBeDefined();
    expect(monthActivity.days.get(endday).calendaritems.length).toBe(0);
    expect(monthActivity.days.get(endday).events).toBeDefined();
    expect(monthActivity.days.get(endday).events.length).toBe(0);
    expect(monthActivity.days.get(endday).memos).toBeDefined();
    expect(monthActivity.days.get(endday).memos.length).toBe(0);

  });

  it(`Case 3 - 5 fetchMonthActivities 取得当前月份活动 - 1个小任务`, async () => {
    // 小任务
    let minitask: MiniTaskData = {} as MiniTaskData;

    minitask.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveMiniTask(minitask);

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities(moment().format("YYYY/MM"));

    expect(monthActivity).toBeDefined();
    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBe(0);  // 式样要求小任务不显示在画面

  });

  // 需要同步执行
  it(`Case 3 - 4 fetchMonthActivities 取得当前月份活动 - 1个备忘`, async () => {
    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    expect(memo).toBeDefined();
    expect(memo.moi).toBeDefined();

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities(moment().format("YYYY/MM"));

    expect(monthActivity).toBeDefined();
    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
    expect(monthActivity.memos).toBeDefined();
    expect(monthActivity.memos.length).toBeGreaterThan(0);
  });

  // 需要同步执行
  it(`Case 3 - 3 fetchMonthActivities 取得2019/08月份活动 - 1个日程（不重复）`, async () => {
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = "2019/08/11";
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    expect(monthActivity).toBeDefined();
    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.events).toBeDefined();
    expect(monthActivity.events.length).toBeGreaterThan(0);
  });

  // 需要同步执行
  it(`Case 3 - 2 fetchMonthActivities 取得2019/08月份活动 - 1个日历项`, async () => {
    // 日历项
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";

    await calendarService.savePlanItem(planitem);

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities("2019/08");

    expect(monthActivity).toBeDefined();
    expect(monthActivity.month).toBe("2019/08");
    expect(monthActivity.calendaritems).toBeDefined();
    expect(monthActivity.calendaritems.length).toBeGreaterThan(0);
  });

  // 可以异步执行
  it(`Case 3 - 1 fetchMonthActivities 取得2019/08月份活动 - 无报错`, async(() => {
    expect(function() {
      calendarService.fetchMonthActivities();
      calendarService.fetchMonthActivities("2019/08");
    }).not.toThrow();
  }));

  // 需要同步执行
  it(`Case 2 - 3 removePlanItem 删除创建的日历项`, async () => {
    // 基本日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '农历节气 自动测试';
    plan.jc = '#a1a1a1';
    plan.jt = PlanType.CalendarPlan;

    plan = await calendarService.savePlan(plan);

    // 日历项
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.ji = plan.ji;
    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    await calendarService.removePlanItem(planitem);

    // 根据日历ID检索日历项
    let results: Array<PlanItemData> = await calendarService.fetchPlanItems(plan.ji);

    expect(results).toBeDefined();
    expect(results.length).toBe(0);
  });

  // 需要同步执行
  it(`Case 2 - 2 fetchPlanItems 取得日历项 - 自定义日历项`, async () => {
    // 基本日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '农历节气 自动测试';
    plan.jc = '#a1a1a1';
    plan.jt = PlanType.CalendarPlan;

    plan = await calendarService.savePlan(plan);

    // 日历项
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.ji = plan.ji;
    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    // 根据日历ID检索日历项
    let results: Array<PlanItemData> = await calendarService.fetchPlanItems(plan.ji);

    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
  });

  // 需要同步执行
  it(`Case 12 - 2 - 1 savePlanItem 保存日历项 - 更新活动`, async () => {
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";
    planitem.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    let changed: PlanItemData = {} as PlanItemData;
    Object.assign(changed, qplanitem);

    changed.jtn = "结婚";
    await calendarService.savePlanItem(changed, qplanitem);

    qplanitem = await calendarService.getPlanItem(planitem.jti);

    expect(qplanitem).toBeDefined();
    expect(qplanitem.jtn).toBe("结婚");
    expect(qplanitem.jtt).toBe(PlanItemType.Activity);
  });

  // 需要同步执行
  it(`Case 12 - 2 savePlanItem 保存日历项 - 活动`, async () => {
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";
    planitem.jtt = PlanItemType.Activity;

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    expect(qplanitem.jtt).toBe(PlanItemType.Activity);
  });

  // 需要同步执行
  it(`Case 12 - 1 - 1 savePlanItem 保存日历项 - 更新节假日`, async () => {
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "国庆节";
    planitem.jtt = PlanItemType.Holiday;

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    let changed: PlanItemData = {} as PlanItemData;
    Object.assign(changed, qplanitem);

    changed.jtn = "国庆";
    await calendarService.savePlanItem(changed, qplanitem);

    qplanitem = await calendarService.getPlanItem(planitem.jti);

    expect(planitem).toBeDefined();
    expect(qplanitem.jtn).toBe("国庆");
    expect(qplanitem.jtt).toBe(PlanItemType.Holiday);
  });

  // 需要同步执行
  it(`Case 12 - 1 savePlanItem 保存日历项 - 节假日`, async () => {
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "国庆节";
    planitem.jtt = PlanItemType.Holiday;

    let saved = await calendarService.savePlanItem(planitem);

    if (saved && saved.length > 0) {
      planitem = saved[0];
    }

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    expect(qplanitem.jtt).toBe(PlanItemType.Holiday);
  });

  // 需要同步执行
  it(`Case 1 - 12 fetchPublicPlans 取得公共日历 - 1个自定义日历`, async () => {
    // 新建日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchPublicPlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBe(0);
  });

  // 需要同步执行
  it(`Case 1 - 11 fetchPublicPlans 取得公共日历 - 1个普通日历、1个活动日历`, async () => {
    // 新建日历
    // 基本日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '农历节气 自动测试';
    plan.jc = '#a1a1a1';
    plan.jt = PlanType.CalendarPlan;

    await calendarService.savePlan(plan);

    // 活动日历
    plan = {} as PlanData;

    plan.jn = '2019年动漫展 自动测试';
    plan.jc = '#ababab';
    plan.jt = PlanType.ActivityPlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchPublicPlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBeGreaterThan(0);
    expect(plans.length).toBe(2);

    if (plans && plans.length > 0) {
      let plan: PlanData = plans[0];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#a1a1a1');
      }

      // 测试排序
      plan = plans[1];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#ababab');
      }
    }
  });

  // 需要同步执行
  it(`Case 1 - 10 fetchPublicPlans 取得公共日历 - 1个活动日历`, async () => {
    // 新建日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '2019年动漫展 自动测试';
    plan.jc = '#ababab';
    plan.jt = PlanType.ActivityPlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchPublicPlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBeGreaterThan(0);

    if (plans && plans.length > 0) {
      let plan: PlanData = plans[0];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#ababab');
      }
    }
  });

  // 需要同步执行
  it(`Case 1 - 9 fetchPublicPlans 取得公共日历 - 1个普通日历`, async () => {
    // 新建日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '农历节气 自动测试';
    plan.jc = '#a1a1a1';
    plan.jt = PlanType.CalendarPlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchPublicPlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBeGreaterThan(0);

    if (plans && plans.length > 0) {
      let plan: PlanData = plans[0];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#a1a1a1');
      }
    }
  });

  // 需要同步执行
  it(`Case 1 - 8 fetchPrivatePlans 取得自定义日历 - 1个自定义日历`, async () => {
    // 新建日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchPrivatePlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBeGreaterThan(0);

    if (plans && plans.length > 0) {
      let plan: PlanData = plans[0];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#f1f1f1');
      }
    }
  });

  // 需要同步执行
  it(`Case 1 - 7 fetchAllPlans 取得所有日历 - 1个自定义日历`, async () => {
    // 新建日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    await calendarService.savePlan(plan);

    // 获取保存的日历
    let plans = await calendarService.fetchAllPlans();

    expect(plans).toBeDefined();
    expect(plans.length).toBeGreaterThan(0);

    if (plans && plans.length > 0) {
      let plan: PlanData = plans[0];

      expect(plan).toBeDefined();

      if (plan) {
        expect(plan.ji).toBeDefined();
        expect(plan.jc).toBe('#f1f1f1');
      }
    }
  });

  // 可以异步执行
  it(`Case 1 - 6 - 1 removePlanSqls 取得删除日历Sql - 删除自定义日历(不含子项目)`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.PrivatePlan, false);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 6 removePlanSqls 取得删除日历Sql - 删除自定义日历`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.PrivatePlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 5 - 1 removePlanSqls 取得删除日历Sql - 删除活动日历(不含子项目)`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.ActivityPlan, false);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 5 removePlanSqls 取得删除日历Sql - 删除活动日历`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.ActivityPlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 4 - 1 removePlanSqls 取得删除日历Sql - 删除普通日历(不含子项目)`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.CalendarPlan, false);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 4 removePlanSqls 取得删除日历Sql - 删除普通日历`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.CalendarPlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  it(`Case 1 - 3 - 1 savePlan 更新日历 - 更新日历成员(增加1个新成员)`, async (done: DoneFn) => {
    // 准备联系人数据
    await prepareContacts();

    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<Member>();

    for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
      let member: Member = {} as Member;

      member.pwi = contact.pwi;
      member.ui = contact.ui;

      plan.members.push(member);
    }

    let savedplan = await calendarService.savePlan(plan);

    let newmember: Member = {} as Member;

    newmember.pwi = xiaolenzi.pwi;
    newmember.ui = xiaolenzi.ui;

    savedplan.members.push(newmember);

    calendarService.savePlan(savedplan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  // 需要同步执行
  it(`Case 1 - 3 savePlan 更新日历 - 更新日历颜色`, async () => {
    let planforUpdate: PlanData = {} as PlanData;

    planforUpdate.jn = '冥王星服务类 自动测试';
    planforUpdate.jc = '#f1f1f1';
    planforUpdate.jt = PlanType.PrivatePlan;

    planforUpdate = await calendarService.savePlan(planforUpdate);

    if (planforUpdate && planforUpdate.ji) {
      let plan: PlanData = planforUpdate;

      plan.jc = '#1a1a1a';

      let savedPlan = await calendarService.savePlan(plan);

      expect(savedPlan).toBeDefined();
      expect(savedPlan.jc).toBe('#1a1a1a');
    } else {
      fail("保存失败, 无返回值.");
    }
  });

  it(`Case 1 - 2 - 2 savePlan 新建日历 - 自定义日历(包含3个共享成员)`, async (done: DoneFn) => {
    // 准备联系人数据
    await prepareContacts();

    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<Member>();

    for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
      let member: Member = {} as Member;

      member.pwi = contact.pwi;
      member.ui = contact.ui;

      plan.members.push(member);
    }

    calendarService.savePlan(plan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 1 - 2 - 1 savePlan 新建日历 - 自定义日历(包含1个共享成员)`, async (done: DoneFn) => {
    // 准备联系人数据
    await prepareContacts();

    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan.members = new Array<Member>();

    let member: Member = {} as Member;

    member.pwi = xiaohaizi.pwi;
    member.ui = xiaohaizi.ui;

    plan.members.push(member);

    calendarService.savePlan(plan)
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  // 需要同步执行
  it('Case 1 - 2 savePlan 新建日历 - 自定义日历', () => {
    expect(function() {
      let plan: PlanData = {} as PlanData;

      plan.jn = '冥王星服务类 自动测试';
      plan.jc = '#f1f1f1';
      plan.jt = PlanType.PrivatePlan;

      calendarService.savePlan(plan).then(savedPlan => {

        expect(savedPlan.ji).toBeDefined();
        expect(savedPlan.ji).not.toBe('');
      });
    }).not.toThrow();
  });

  // 需要同步执行
  it('Case 1 - 1 service should be created', () => {
    expect(calendarService).toBeTruthy();
  });

  // 所有测试case执行结束后
  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
