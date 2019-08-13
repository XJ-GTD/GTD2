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
import {JhaTbl} from "../sqlite/tbl/jha.tbl";
import {MomTbl} from "../sqlite/tbl/mom.tbl";
import {JtaTbl} from "../sqlite/tbl/jta.tbl";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import {FjTbl} from "../sqlite/tbl/fj.tbl";

import { CalendarService, PlanData, PlanItemData, MonthActivityData, MonthActivitySummaryData, DayActivitySummaryData } from "./calendar.service";
import { EventService, AgendaData, TaskData, RtJson } from "./event.service";
import { MemoService, MemoData } from "./memo.service";
import { PlanType, PlanItemType, CycleType, OverType } from "../../data.enum";

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
  let planforUpdate: PlanData;
  let httpMock: HttpTestingController;
  let sqlExce: SqliteExec;

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
        UtilService,
        EmitService,
        ShaeRestful,
        SyncRestful,
        AgdRestful,
        BacRestful,
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

    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();
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

  });

  it(`Case 5 - 1 fetchMonthActivitiesSummary 取得指定月概要 - 空值(没有任何活动)`, async () => {
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

  it(`Case 4 - 6 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、1个任务(日程每日重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.d;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每天走路锻炼10000步";
    agenda.rt = JSON.stringify(rt);

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
    expect(daySummary.repeateventscount).toBe(1);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 4 - 5 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、1个任务(日程每年重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    // 每年重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.y;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";
    agenda.rt = JSON.stringify(rt);

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
    expect(daySummary.repeateventscount).toBe(1);
    expect(daySummary.bookedtimesummary).toBe(0);
  });

  it(`Case 4 - 4 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日程、1个任务(不重复)`, async () => {
    let day: string = moment().format("YYYY/MM/DD");
    // 日程
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "结婚纪念日买礼物给太太";

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

  it(`Case 4 - 3 fetchDayActivitiesSummary 取得指定日期概要 - 存在1个日历项(任意日历项)`, async () => {
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

  it(`Case 4 - 2 fetchDayActivitiesSummary 取得指定日期概要 - 空值(没有任何活动)`, async () => {
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

  it(`Case 4 - 1 fetchDayActivitiesSummary 取得指定日期概要 - 没有抛出异常`, async () => {
    expect(function() {
      calendarService.fetchDayActivitiesSummary().then((data) => {
        expect(data).toBeDefined();
      });
    }).not.toThrow();
  });

  // 需要同步执行
  it(`Case 3 - 4 fetchMonthActivities with precreated memos`, async () => {
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
  it(`Case 3 - 3 fetchMonthActivities with precreated events`, async () => {
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
  it(`Case 3 - 2 fetchMonthActivities with precreated plan items`, async () => {
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
  it(`Case 3 - 1 fetchMonthActivities`, async(() => {
    expect(function() {
      calendarService.fetchMonthActivities();
      calendarService.fetchMonthActivities("2019/08");
    }).not.toThrow();
  }));

  // 需要同步执行
  it(`Case 2 - 3 removePlanItem after created`, async () => {
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
  it(`Case 2 - 2 fetchPlanItems after created`, async () => {
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
  it(`Case 1 - 12 fetchPublicPlans check prev saved private plans`, async () => {
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
  it(`Case 1 - 11 fetchPublicPlans check prev saved public plans and sort`, async () => {
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
  it(`Case 1 - 10 fetchPublicPlans check prev saved public activity plans`, async () => {
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
  it(`Case 1 - 9 fetchPublicPlans check prev saved public plans`, async () => {
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
  it(`Case 1 - 8 fetchPrivatePlans check prev saved private plan`, async () => {
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
  it(`Case 1 - 7 fetchAllPlans check prev saved plan`, async () => {
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
  it(`Case 1 - 6 removePlanSqls PlanType.PrivatePlan`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.PrivatePlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 5 removePlanSqls PlanType.ActivityPlan`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.ActivityPlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 可以异步执行
  it(`Case 1 - 4 removePlanSqls PlanType.CalendarPlan`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.CalendarPlan);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  }));

  // 需要同步执行
  it(`Case 1 - 3 use savePlan to update an exist plan's color`, async () => {
    let savedPlan;

    if (planforUpdate && planforUpdate.ji) {
      let plan: PlanData = planforUpdate;

      plan.jc = '#1a1a1a';

      savedPlan = await calendarService.savePlan(plan);

      planforUpdate = savedPlan;  // 保存用于后面的测试用例

      expect(savedPlan).toBeDefined();
      expect(savedPlan.jc).toBe('#1a1a1a');
    } else {
      expect(savedPlan).not.toBeDefined();
    }
  });

  // 需要同步执行
  it('Case 1 - 2 use savePlan to create a new plan', () => {
    expect(function() {
      let plan: PlanData = {} as PlanData;

      plan.jn = '冥王星服务类 自动测试';
      plan.jc = '#f1f1f1';
      plan.jt = PlanType.PrivatePlan;

      calendarService.savePlan(plan).then(savedPlan => {
        planforUpdate = savedPlan;  // 保存用于后面的测试用例

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
