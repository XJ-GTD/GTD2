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
  SplashScreenMock
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

import { CalendarService, PlanData, PlanItemData, MonthActivityData } from "./calendar.service";
import { EventService, AgendaData } from "./event.service";
import { MemoService, MemoData } from "./memo.service";
import { PlanType } from "../../data.enum";

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
  let calendarService: CalendarService;
  let eventService: EventService;
  let memoService: MemoService;
  let planforUpdate: PlanData;
  let httpMock: HttpTestingController;

  // 所有测试case执行前, 只执行一次
  beforeEach(async(() => {
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
        RestFulConfig,
        RestfulClient,
        NetworkService,
        EventService,
        MemoService,
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
  }));

  // 所有测试case执行前, 只执行一次
  beforeEach(async () => {
    config = TestBed.get(SqliteConfig);
    init = TestBed.get(SqliteInit);
    await config.generateDb();
    await init.createTables();
  });

  beforeEach(() => {
    calendarService = TestBed.get(CalendarService);
    eventService = TestBed.get(EventService);
    memoService = TestBed.get(MemoService);
    httpMock = TestBed.get(HttpTestingController);

    init.initData();

    const req = httpMock.expectOne('https://www.guobaa.com/ini/parameters?tag=mwxing');
    req.flush({
      d: {
        apil: [
        {name:"ID", value:"https://www.guobaa.com/ini/parameters", desc:"初始化数据"},
        {name:"RA", value:"https://pluto.guobaa.com/aup/doregister", desc:"注册帐户"},
        {name:"SSMIC", value:"https://pluto.guobaa.com/aup/verifycode", desc:"发送短信验证码"},
        {name:"SML", value:"https://pluto.guobaa.com/aup/dologin", desc:"短信登录"},
        {name:"PL", value:"https://pluto.guobaa.com/aup/dologin", desc:"密码登录"},
        {name:"AIU", value:"https://pluto.guobaa.com/aup/user/{unionid}", desc:"帐户信息更新"},
        {name:"AIG", value:"https://pluto.guobaa.com/aup/user/{phoneno}/userinfo", desc:"帐户信息获取"},
        {name:"AAG", value:"https://pluto.guobaa.com/aup/user/{phoneno}/avatar/json", desc:"帐户头像获取"},
        {name:"MP", value:"https://pluto.guobaa.com/aup/user/{unionid}", desc:"修改密码"},
        {name:"B", value:"https://pluto.guobaa.com/bac/backup", desc:"备份"},
        {name:"R", value:"https://pluto.guobaa.com/bac/recover", desc:"恢复"},
        {name:"BS", value:"https://pluto.guobaa.com/bac/latest", desc:"备份查询"},
        {name:"AS", value:"https://pluto.guobaa.com/agd/agenda/save", desc:"日程保存"},
        {name:"ACS", value:"https://pluto.guobaa.com/agd/agendacontacts/save", desc:"日程参与人保存"},
        {name:"AG", value:"https://pluto.guobaa.com/agd/agenda/info", desc:"日程获取"},
        {name:"AR", value:"https://pluto.guobaa.com/agd/agenda/remove", desc:"日程删除"},
        {name:"ASU", value:"https://pluto.guobaa.com/sha/agendashare", desc:"日程转发(分享)上传"},
        {name:"AEW", value:"https://pluto.guobaa.com/sha/agenda/share/{shareid}", desc:"日程网页浏览"},
        {name:"BLA", value:"https://pluto.guobaa.com/bla/target/add", desc:"黑名单手机/帐户添加"},
        {name:"BLR", value:"https://pluto.guobaa.com/bla/target/remove", desc:"黑名单手机/帐户删除"},
        {name:"BLG", value:"https://pluto.guobaa.com/bla/list", desc:"黑名单获取"},
        {name:"VU", value:"https://pluto.guobaa.com/mix/starter/audio", desc:"语音上传"},
        {name:"TU", value:"https://pluto.guobaa.com/mix/starter/text", desc:"文本上传"},
        {name:"PU", value:"https://pluto.guobaa.com/sha/planshare", desc:"计划上传"},
        {name:"PEW", value:"https://pluto.guobaa.com/sha/plan/share/{shareid}", desc:"计划网页浏览"},
        {name:"BIPD", value:"https://pluto.guobaa.com/sha/plan/buildin/download", desc:"内建计划下载"},
        {name:"WSA", value:"wss://pluto.guobaa.com/ws", desc:"WebSocket地址"},
        {name:"POW", value:"https://pluto.guobaa.com/cal/index", desc:"产品官网"},
        {name:"PP", value:"https://pluto.guobaa.com/cal/doc/privatepolicy", desc:"隐私政策"},
        {name:"UP", value:"https://pluto.guobaa.com/cal/doc/userproxy", desc:"使用协议"},
        {name:"AAT", value:"https://pluto.guobaa.com/aba/user/mwxing/access", desc:"帐户登录令牌获取"},
        {name:"CC", value:"https://pluto.guobaa.com/cdc/calendar_caculate/starter", desc:"日程计算"},
        {name:"AIGS", value:"https://pluto.guobaa.com/aup/user/multi/usersinfo", desc:"批量帐户信息获取"},
        {name:"EDTTS", value:"https://pluto.guobaa.com/aag/register/tasks", desc:"注册事件分发任务"},
        {name:"DRT", value:"https://pluto.guobaa.com/cdc/mwxing_daily_summary_start/json/trigger", desc:"每日简报触发"},
        {name:"HWT", value:"https://pluto.guobaa.com/cdc/mwxing_hourly_weather_start/json/trigger", desc:"每小时天气预报触发"},
        {name:"WHK", value:"https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger", desc:"WebHooks事件触发"}
        ]
      }
    });

    httpMock.verify();
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

    agenda.evd = "2019/08/11";
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
  it(`Case 2 - 1 savePlanItem`, async () => {
    let planitem: PlanItemData = {} as PlanItemData;

    planitem.sd = "2019/08/11";
    planitem.jtn = "结婚纪念日";

    planitem = await calendarService.savePlanItem(planitem);

    expect(planitem).toBeDefined();
    expect(planitem.jti).toBeDefined();
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
