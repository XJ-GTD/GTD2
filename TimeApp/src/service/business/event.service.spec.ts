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

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { AgdRestful } from "../restful/agdsev";
import { BacRestful } from "../restful/bacsev";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import { EventService,TaskData,MiniTaskData} from "./event.service";
import { PlanType,IsCreate } from "../../data.enum";

/**
 * 事件Service 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('EventService test suite', () => {
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
        UtilService,
        EmitService,
        ShaeRestful,
        AgdRestful,
        BacRestful,
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
    restConfig = TestBed.get(RestFulConfig);
		sqlExce = TestBed.get(SqliteExec);

    eventService = TestBed.get(EventService);
    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();
  });

  beforeEach(async () => {
    //await config.generateDb();
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

  // 需要同步执行
  it('Case 1 - 1 service should be created', () => {
    expect(eventService).toBeTruthy();
  });

  it('Case 2 - 1 saveTask 保存任务 - 保存1个任务，查询这个任务，查询任务主题', async() => {
  	// 创建任务
    let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //获取插入的数据，校验插入是否一致
    let txx: TaskData = {} as TaskData;
    txx = await eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  });

  it('Case 2 - 2 saveTask 更新任务 - 创建1个任务，更新这个任务，查询任务主题', async() => {
  	// 创建任务
    let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //根据ID，更新相关内容
    let evn: string = "老张，记得去买烟"
    tx.evn = evn;
    await eventService.saveTask(tx);
    //获取插入的数据，校验插入是否一致
    let txx: TaskData = {} as TaskData;
    txx = await eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(evn);
  });

  it('Case 3 - 1 saveMiniTask 创建小任务 - 创建一个小任务', async() => {
  	// 创建任务
    let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //获取插入的数据，校验插入是否一致
    let txx: MiniTaskData = {} as MiniTaskData;
    txx = await eventService.getMiniTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  });

   it('Case 3 - 2 saveMiniTask 更新小任务 - 创建一个小任务，更新小任务', async() => {

  	let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //根据ID，更新相关内容
    let evn: string = "老张，记得去买烟"
    tx.evn = evn;
    await eventService.saveMiniTask(tx);
    //获取插入的数据，校验插入是否一致
    let txx: MiniTaskData = {} as MiniTaskData;
    txx = await eventService.getMiniTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(evn);
  });

  it('Case 3 - 1 finishTask 完成任务 - 创建一个任务，完成这个任务',async() => {

  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    let isrt: string = await eventService.finishTask(tx.evi);
    expect(isrt).toBeDefined();
    expect(isrt).toBe(IsCreate.isYes);
  })

  it('Case 4 - 1 finishTaskNext 自动创建任务 - 创建任务，自动复制这个任务', async() => {

  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.isrt = IsCreate.isYes;
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    await eventService.finishTaskNext(tx.evi);

    //验证是否已获取数据
    let txx: TaskData = {} as TaskData;
    txx = await eventService.getTaskNext(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  })

	it('Case 5 - 1 fetchPagedTasks 查询任务 - 查询全部2019/08/04这一天的任务', async() => {

		let day: string = "2019/08/14";
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedTasks(day,"");
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })

	it('Case 6 - 1 fetchPagedCompletedTasks 查询完成的任务 - 查询2019/08/14这一天完成的任务', async() => {

		let day: string = "2019/08/14";
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedCompletedTasks(day,"");
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })

	it('Case 7 - 1 fetchPagedUncompletedTasks 查询未完成的任务 - 查询2019/08/14这一天未完成的任务', async() => {

		let day: string = "2019/08/14";
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedUncompletedTasks(day,"");
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })


  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
