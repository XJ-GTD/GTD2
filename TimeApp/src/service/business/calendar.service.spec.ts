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

import { CalendarService, PlanData, PlanItemData, MonthActivityData, MonthActivitySummaryData, DayActivityData, DayActivitySummaryData, PagedActivityData } from "./calendar.service";
import { EventService, AgendaData, TaskData, RtJson } from "./event.service";
import { MemoService, MemoData } from "./memo.service";
import { PlanType, PlanItemType, CycleType, OverType, PageDirection } from "../../data.enum";

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
    expect(fetchedPlan.items[0].sd).toBe(day);
    expect(fetchedPlan.items[0].evn).toBe("结婚纪念日买礼物给太太");

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
  it(`Case 1 - 6 removePlanSqls 取得删除日历Sql - 删除自定义日历`, async(() => {
    let result = calendarService.removePlanSqls('ji', PlanType.PrivatePlan);
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
      expect(savedPlan).not.toBeDefined();
    }
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
