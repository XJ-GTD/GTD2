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
import {SqliteInit} from "../sqlite/sqlite.init";
import {RestFulConfig} from "../config/restful.config";
import {UserConfig} from "../config/user.config";

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { AgdRestful } from "../restful/agdsev";
import { BacRestful } from "../restful/bacsev";
import {SyncRestful} from "../restful/syncsev";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import { EventService, AgendaData, TaskData, MiniTaskData, RtJson } from "./event.service";
import { PlanType, IsCreate, IsSuccess, CycleType, OverType } from "../../data.enum";

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
        Device,
        SQLite,
        SQLitePorter,
        SqliteConfig,
        SqliteInit,
        SqliteExec,
        UserConfig,
        UtilService,
        EmitService,
        ShaeRestful,
        AgdRestful,
        BacRestful,
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

    eventService = TestBed.get(EventService);
    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();

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
    let day: string = moment().format("YYYY/MM");

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
    let day: string = moment().format("YYYY/MM");

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
    let day: string = moment().format("YYYY/MM");

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
    let day: string = moment().format("YYYY/MM");

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
    let day: string = moment().format("YYYY/MM");

    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = day;
    agenda.evn = "不重复";

    let agendas = await eventService.saveAgenda(agenda);

    expect(agendas).toBeDefined();
    expect(agendas.length).toBe(1);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
