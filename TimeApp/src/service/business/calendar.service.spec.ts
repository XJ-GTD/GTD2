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
  RestfulClientMock
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

import { CalendarService, PlanData, PlanItemData, PlanMember, MonthActivityData, MonthActivitySummaryData, DayActivityData, DayActivitySummaryData, PagedActivityData, FindActivityCondition } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, RtJson } from "./event.service";
import { MemoService, MemoData } from "./memo.service";
import { PlanType, PlanItemType, CycleType, OverType, PageDirection, SyncType, DelType, SyncDataStatus } from "../../data.enum";

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
  let httpMock: HttpTestingController;
  let sqlExce: SqliteExec;
  let util: UtilService;

  // 联系人用于测试
  let xiaopangzi: BTbl;
  let xiaohaizi: BTbl;
  let xiaolenzi: BTbl;
  let caoping: BTbl;
  let luojianfei: BTbl;
  let huitailang: BTbl;
  let xuezhenyang: BTbl;

  let prepareContacts = async function() {
    let sqls: Array<string> = new Array<string>();

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
        UserConfig,
        DataConfig,
        UtilService,
        EmitService,
        ShaeRestful,
        SyncRestful,
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
        MemoService,
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
    restConfig = TestBed.get(RestFulConfig);
    sqlExce = TestBed.get(SqliteExec);
    util = TestBed.get(UtilService);

    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();

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

  it(`Case 27 - 1 acceptSyncPrivatePlans 更新已同步日历标志 - 本地无数据(无报错)`, (done: DoneFn) => {
    calendarService.acceptSyncPrivatePlans([["planid", moment().unix()]])
    .then(() => {
      expect("success").toBe("success");
      done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 26 - 1 - 1 syncPrivatePlans 同步所有未同步自定义日历 - 有未同步数据(不报错)`, async (done: DoneFn) => {
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

  it(`Case 25 - 2 syncPrivatePlan 同步自定义日历数据 - 冥王星公共日历(报错)`, async (done: DoneFn) => {
    // 下载公共日历
    await calendarService.downloadPublicPlan("shanghai_animation_exhibition_2019", PlanType.ActivityPlan);

    let plan = await calendarService.getPlan("shanghai_animation_exhibition_2019");

    // 共享自定义日历
    calendarService.syncPrivatePlan(plan)
    .then(() => {
      fail("未抛出异常, 出错");
      done();
    })
    .catch(e => {
      expect(e).not.toBe("");
      done();
    });
  });

  it(`Case 25 - 1 syncPrivatePlan 同步自定义日历数据(无报错)`, async (done: DoneFn) => {
    // 自定义日历
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    plan = await calendarService.savePlan(plan);

    // 同步自定义日历数据
    calendarService.syncPrivatePlan(plan)
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

  it(`Case 21 - 5 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个备忘`, async () => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    const mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    await memoService.saveMemo(memo);

    expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
    // 本月备忘为1
    expect(calendaractivities[1].memos.length).toBe(1);
  });

  it(`Case 21 - 4 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个日历项`, async () => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    const mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    await calendarService.savePlanItem(planitem1);

    expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
    // 本月日历项为1
    expect(calendaractivities[1].calendaritems.length).toBe(1);
  });

  it(`Case 21 - 3 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个日程`, async () => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    const mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    await eventService.saveAgenda(agenda);

    expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
    // 本月事件为1
    expect(calendaractivities[1].events.length).toBe(1);
  });

  it(`Case 21 - 2 mergeCalendarActivity 合并日历显示列表活动数据 - 合并1个任务`, async () => {
    // 初始化
    let calendaractivities = await calendarService.getCalendarActivities();

    const mergeSpy = spyOn(calendarService, 'mergeCalendarActivity').and.callThrough();

    // 任务
    let task: TaskData = {} as TaskData;

    task.evn = "结婚纪念日前给太太买礼物";

    await eventService.saveTask(task);

    expect(mergeSpy.calls.any()).toBe(true, 'calendarService.mergeCalendarActivity called');
    // 本月事件为1
    expect(calendaractivities[1].events.length).toBe(1);
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

  it(`Case 17 - 3 getCalendarActivities 取得日历画面显示活动一览 - 向下拉加载`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.getCalendarActivities(PageDirection.PageUp);
    await calendarService.getCalendarActivities(PageDirection.PageDown);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(5);
    expect(calendarholdings[0].month).toBe(moment(month).subtract(2, "months").format("YYYY/MM"));
    expect(calendarholdings[1].month).toBe(moment(month).subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[2].month).toBe(month);
    expect(calendarholdings[3].month).toBe(moment(month).add(1, "months").format("YYYY/MM"));
    expect(calendarholdings[4].month).toBe(moment(month).add(2, "months").format("YYYY/MM"));
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

  it(`Case 17 - 2 getCalendarActivities 取得日历画面显示活动一览 - 向上拉加载`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    await calendarService.getCalendarActivities(PageDirection.PageUp);

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(4);
    expect(calendarholdings[0].month).toBe(moment(month).subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[1].month).toBe(month);
    expect(calendarholdings[2].month).toBe(moment(month).add(1, "months").format("YYYY/MM"));
    expect(calendarholdings[3].month).toBe(moment(month).add(2, "months").format("YYYY/MM"));
  });

  it(`Case 17 - 1 getCalendarActivities 取得日历画面显示活动一览 - 默认当前月份以及前后各一个月`, async () => {
    let month: string = moment().format("YYYY/MM");

    let calendarholdings = await calendarService.getCalendarActivities();

    expect(calendarholdings).toBeDefined();
    expect(calendarholdings.length).toBe(3);
    expect(calendarholdings[0].month).toBe(moment(month).subtract(1, "months").format("YYYY/MM"));
    expect(calendarholdings[1].month).toBe(month);
    expect(calendarholdings[2].month).toBe(moment(month).add(1, "months").format("YYYY/MM"));
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

    await calendarService.removePlan(plan.ji, PlanType.PrivatePlan);

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
    let days: number = moment(month).daysInMonth();

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
    let days: number = moment(month).daysInMonth();

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
    let days: number = moment(month).daysInMonth();

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

    planitem1 = await calendarService.savePlanItem(planitem1);

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

    planitem1 = await calendarService.savePlanItem(planitem1);

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

    planitem1 = await calendarService.savePlanItem(planitem1);

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

    let endday: string = moment(day).subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day).subtract(7, "days").format("YYYY/MM/DD");

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

    let endday: string = moment(day).subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day).subtract(7, "days").format("YYYY/MM/DD");

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

    let endday: string = moment(day).subtract(1, "days").format("YYYY/MM/DD");
    let startday: string = moment(day).subtract(7, "days").format("YYYY/MM/DD");

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

    let startday: string = moment(day).add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day).add(7, "days").format("YYYY/MM/DD");

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

    let startday: string = moment(day).add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day).add(7, "days").format("YYYY/MM/DD");

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

    let startday: string = moment(day).add(1, "days").format("YYYY/MM/DD");
    let endday: string = moment(day).add(7, "days").format("YYYY/MM/DD");

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

    // 更新日历项、任务和备忘
    planitem1.jtn = "结婚";
    planitem1 = await calendarService.savePlanItem(planitem1);

    task.evn = "结婚纪念日礼物";
    task = await eventService.saveTask(task);

    memo.mon = "结婚纪念日买了一块定制巧克力";
    memo = await memoService.saveMemo(memo);

    dayActivities = await calendarService.mergeDayActivities(dayActivities, [planitem1, task, memo]);

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

    newplanitem = await calendarService.savePlanItem(newplanitem);

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

    planitem1 = await calendarService.savePlanItem(planitem1);

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
    expect(daySummary.eventscount).toBe(0);
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
    expect(nextdaySummary.agendascount).toBe(1);
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
    expect(nextdaySummary.agendascount).toBe(1);
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
    expect(nextdaySummary.agendascount).toBe(1);
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
    expect(nextdaySummary.agendascount).toBe(1);
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
    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    planitem1 = await calendarService.savePlanItem(planitem1);

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

    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    // 不增加数据
    monthActivity = calendarService.mergeMonthActivities(monthActivity, []);

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    planitem1 = await calendarService.savePlanItem(planitem1);

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

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

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

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    let betweenMonthEndDays: number = moment(moment().format("YYYY/MM")).endOf('month').diff(day, "days") + 1;

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

    let savedagenda = await eventService.saveAgenda(agenda);

    // 增加1个日程(不重复)
    monthActivity = calendarService.mergeMonthActivities(monthActivity, savedagenda);

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 日历项
    let planitem1: PlanItemData = {} as PlanItemData;

    planitem1.sd = day;
    planitem1.jtn = "结婚纪念日";
    planitem1.jtt = PlanItemType.Activity;

    planitem1 = await calendarService.savePlanItem(planitem1);

    // 增加1个日历项
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [planitem1]);

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 备忘
    let memo: MemoData = {} as MemoData;

    memo.sd = day;
    memo.mon = "结婚纪念日买了一块定制巧克力给太太, 太太很高兴";

    memo = await memoService.saveMemo(memo);

    // 增加1个备忘
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [memo]);

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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
    let monthActivity: MonthActivityData = await calendarService.fetchMonthActivities();

    let day: string = moment().format("YYYY/MM/DD");

    // 任务
    let task: TaskData = {} as TaskData;

    task.evd = day;
    task.evn = "结婚纪念日前给太太买礼物";

    task = await eventService.saveTask(task);

    // 增加1个任务
    monthActivity = calendarService.mergeMonthActivities(monthActivity, [task]);

    let startday: string = moment(moment().format("YYYY/MM")).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(moment().format("YYYY/MM")).endOf('month').format("YYYY/MM/DD");

    expect(monthActivity.month).toBe(moment().format("YYYY/MM"));
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

    planitem = await calendarService.savePlanItem(planitem);

    await calendarService.removePlanItem(planitem.jti);

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

    planitem = await calendarService.savePlanItem(planitem);

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

    planitem = await calendarService.savePlanItem(planitem);

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    qplanitem.jtn = "结婚";
    await calendarService.savePlanItem(qplanitem);

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

    planitem = await calendarService.savePlanItem(planitem);

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

    planitem = await calendarService.savePlanItem(planitem);

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();

    let qplanitem: PlanItemData = await calendarService.getPlanItem(planitem.jti);

    qplanitem.jtn = "国庆";
    await calendarService.savePlanItem(qplanitem);

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

    planitem = await calendarService.savePlanItem(planitem);

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

    plan.members = new Array<PlanMember>();

    for (let contact of [xiaopangzi, xiaohaizi, xuezhenyang]) {
      let member: PlanMember = {} as PlanMember;

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

    plan.members = new Array<PlanMember>();

    let member: PlanMember = {} as PlanMember;

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
