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
  AssistantServiceMock
} from '../../../test-config/mocks-ionic';

import {MyApp} from '../../app/app.component';
import {SqliteConfig} from "../config/sqlite.config";
import {SqliteInit} from "../sqlite/sqlite.init";
import {RestFulConfig} from "../config/restful.config";
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { AgdRestful } from "../restful/agdsev";
import { BacRestful } from "../restful/bacsev";
import { DataRestful } from "../restful/datasev";
import {SyncRestful} from "../restful/syncsev";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, RtJson } from "./event.service";
import { GrouperService } from "./grouper.service";
import { PlanType, IsCreate, IsSuccess, CycleType, OverType } from "../../data.enum";
import { ScheduleRemindService } from "./remind.service";
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
 * 事件Service 日程 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('EventService test suite for agenda', () => {
  let config: SqliteConfig;
  let init: SqliteInit;
  let restConfig: RestFulConfig;
  let eventService: EventService;
  let planforUpdate: PlanData;
  let sqlExce: SqliteExec;
  let assistantService: AssistantService;
  let timeOutService: TimeOutService;
  let notificationsService: NotificationsService;
  let grouperService: GrouperService;

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
        EventService,
        CalendarService,
        ScheduleRemindService,
        Device,
        SQLite,
        File,
        LocalNotifications,
        SQLitePorter,
        SqliteConfig,
        SqliteInit,
        Badge,
        SqliteExec,
        { provide: AssistantService, useClass: AssistantServiceMock },
        UserConfig,
        NotificationsService,
        UtilService,
        EmitService,
        TimeOutService,
        DetectorService,
        ShaeRestful,
        FindBugRestful,
        AgdRestful,
        BacRestful,
        DataRestful,
        GrouperService,
        PersonRestful,
        Contacts,
        ContactsService,
        SyncRestful,
        Network,
        HTTP,
        HttpClient,
        { provide: RestFulConfig, useClass: RestFulConfigMock },
        { provide: RestfulClient, useClass: RestfulClientMock },
        NetworkService,
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
    config = TestBed.get(SqliteConfig);
    init = TestBed.get(SqliteInit);
    restConfig = TestBed.get(RestFulConfig);  // 别删除
		sqlExce = TestBed.get(SqliteExec);
    assistantService = TestBed.get(AssistantService);
    notificationsService = TestBed.get(NotificationsService);
    timeOutService = TestBed.get(TimeOutService);
    grouperService = TestBed.get(GrouperService);

    eventService = TestBed.get(EventService);
    await config.generateDb();
    await init.createTables();
    let version = 0;
    while (DataConfig.version > version) {
      await init.createTablespath(++version, 0);
    }
    await init.initData();
    restConfig.init();

    UserConfig.account.id = "13900009004";
    UserConfig.account.name = "测试帐户";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
  });

  beforeEach(async () => {
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

  });

  it('Case 1 - 5 saveAgenda 保存日程 - 每年重复', async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.year;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每年重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBeGreaterThan(0);
  });

  it('Case 1 - 4 saveAgenda 保存日程 - 每月重复', async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每月重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBeGreaterThan(0);
  });

  it('Case 1 - 3 saveAgenda 保存日程 - 每周重复', async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每周重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBeGreaterThan(0);
  });

  it('Case 1 - 2 saveAgenda 保存日程 - 每天重复', async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.fornever;

    agenda.sd = day;
    agenda.evn = "每天重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBeGreaterThan(0);
  });

  // 需要同步执行
  it('Case 1 - 1 saveAgenda 保存日程 - 不重复', async () => {
    let day: string = moment().format("YYYY/MM/DD");

    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "不重复";

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(1);
  });

	it('Case 1 - 2 - 1 saveAgenda 保存日程 - 每天重复 - 间隔2天执行一次, 重复2次结束', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.over.value ="2";

    agenda.sd = day;
    agenda.evn = "每天重复 -重复2次结束";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(2);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/08/25"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 2 - 2 saveAgenda 保存日程 - 每天重复 - 直到2019/08/31', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.day;
    rt.over.type = OverType.limitdate;
		rt.over.value ="2019/08/31";

    agenda.sd = day;
    agenda.evn = "每天重复 -直到2019/08/31";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(9);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/08/24", "2019/08/25", "2019/08/26", "2019/08/27", "2019/08/28", "2019/08/29", "2019/08/30", "2019/08/31"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

	it('Case 1 - 3 - 1 saveAgenda 保存日程 - 每周重复 - 间隔2周执行一次, 周三重复2次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每周重复 - 周三重复2次
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.times;
    rt.openway.push(3);
    rt.cyclenum = 2;
    rt.over.value ="2";

    agenda.sd = day;
    agenda.evn = "每周重复 - 周三重复2次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(3);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/08/28", "2019/09/11"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });


  it('Case 1 - 3 - 1 - 2  saveAgenda 保存日程 - 每周重复 - 间隔2周执行一次, 周三、周四重复2次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每周重复 - 周三重复2次
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.times;
    rt.openway.push(3);
    rt.openway.push(4);
    rt.cyclenum = 2;
    rt.over.value ="2";

    agenda.sd = day;
    agenda.evn = "每周重复 - 周三、周四重复2次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(5);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/08/28","2019/08/29", "2019/09/11", "2019/09/12"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 3 - 2 saveAgenda 保存日程 - 每周重复 - 周三重复到2019/08/31', async () => {
    let day: string = "2019/08/13";

    let agenda: AgendaData = {} as AgendaData;

    // 每周重复 - 周三重复2次
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.limitdate;
    rt.openway.push(3);
    rt.over.value ="2019/08/31";

    agenda.sd = day;
    agenda.evn = "周三重复到2019/08/31";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(4);

    for (let each of agendas) {
      expect(["2019/08/13", "2019/08/14", "2019/08/21", "2019/08/28"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });


   it('Case 1 - 3 - 2 - 1 saveAgenda 保存日程 - 每周重复 - 周三、周四 重复到2019/08/31', async () => {
    let day: string = "2019/08/13";

    let agenda: AgendaData = {} as AgendaData;

    // 每周重复 - 周三重复2次
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.limitdate;
    rt.openway.push(3);
    rt.openway.push(4);
    rt.over.value ="2019/08/31";

    agenda.sd = day;
    agenda.evn = "周三重复到2019/08/31";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(7);

    for (let each of agendas) {
      expect(["2019/08/13", "2019/08/14","2019/08/15", "2019/08/21", "2019/08/22", "2019/08/28","2019/08/29"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

	it('Case 1 - 3 - 1 saveAgenda 保存日程 - 每周重复 - 当前星期重复2次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每周重复 - 周三重复2次
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.week;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.over.value ="2";

    agenda.sd = day;
    agenda.evn = "每周重复 - 当前星期重复2次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(2);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/09/06"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 4 - 1 saveAgenda 保存日程 - 每月重复 - 每个月13号执行，间隔2个月执行一次，循环4次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.openway.push(12);
    rt.over.value ="4";

    agenda.sd = day;
    agenda.evn = "每个月13号执行，间隔2个月执行一次，循环4次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(5);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/09/13", "2019/11/13", "2020/01/13", "2020/03/13"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });


  it('Case 1 - 4 - 1 saveAgenda 保存日程 - 每月重复 - 每个月13、14号执行，间隔2个月执行一次，循环4次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.openway.push(12);
    rt.openway.push(13);
    rt.over.value ="4";

    agenda.sd = day;
    agenda.evn = "每个月13号执行，间隔2个月执行一次，循环4次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(9);

    for (let each of agendas) {
      expect(["2019/08/23", "2019/09/13","2019/09/14", "2019/11/13","2019/11/14", "2020/01/13","2020/01/14", "2020/03/13","2020/03/14"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });


  it('Case 1 - 4 - 2 saveAgenda 保存日程 - 每月重复 - 每个月13号执行，间隔2个月执行一次，直到2019/12/31', async () => {
    let day: string = "2019/08/13";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.limitdate;
    rt.cyclenum = 2;
    rt.openway.push(12);
    rt.over.value ="2019/12/31";

    agenda.sd = day;
    agenda.evn = "每个月13号执行，间隔2个月执行一次，直到2019/12/31";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(3);

    for (let each of agendas) {
      expect(["2019/08/13", "2019/10/13", "2019/12/13"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });


  it('Case 1 - 4 - 2 - 1 saveAgenda 保存日程 - 每月重复 - 每个月13、14号执行，间隔2个月执行一次，直到2019/12/31', async () => {
    let day: string = "2019/08/13";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.limitdate;
    rt.cyclenum = 2;
    rt.openway.push(12);
    rt.openway.push(13);
    rt.over.value ="2019/12/31";

    agenda.sd = day;
    agenda.evn = "每个月13号执行，间隔2个月执行一次，直到2019/12/31";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(6);

    for (let each of agendas) {
      expect(["2019/08/13", "2019/08/14", "2019/10/13", "2019/10/14", "2019/12/13", "2019/12/14"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 4 - 3  saveAgenda 保存日程 - 每月重复 - 每个月当前日期执行，间隔2个月执行一次，循环4次', async () => {
    let day: string = "2019/08/13";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.month;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.over.value ="4";

    agenda.sd = day;
    agenda.evn = "每个月13号执行，间隔2个月执行一次，循环4次";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(4);

    for (let each of agendas) {
      expect(["2019/08/13", "2019/10/13", "2019/12/13", "2020/02/13"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 5 - 1 saveAgenda 保存日程 - 每年重复 - 每年当前时间执行一次，间隔 2年，循环四次', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.year;
    rt.over.type = OverType.times;
    rt.cyclenum = 2;
    rt.over.value ="4";

    agenda.sd = day;
    agenda.evn = "每年重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(4);

    for (let each of agendas) {
      expect(["2019/08/23", "2021/08/23", "2023/08/23", "2025/08/23"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  it('Case 1 - 5 - 2 saveAgenda 保存日程 - 每年重复 - 每年当前时间执行一次，间隔 2年，直到2023/1/1', async () => {
    let day: string = "2019/08/23";

    let agenda: AgendaData = {} as AgendaData;

    // 每日重复, 永远
    let rt: RtJson = new RtJson();
    rt.cycletype = CycleType.year;
    rt.over.type = OverType.limitdate;
    rt.cyclenum = 2;
    rt.over.value ="2023/1/1";

    agenda.sd = day;
    agenda.evn = "每年重复";
    agenda.rtjson = rt;

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(2);

    for (let each of agendas) {
      expect(["2019/08/23", "2021/08/23"].indexOf(each.evd)).toBeGreaterThanOrEqual(0);
    }
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
