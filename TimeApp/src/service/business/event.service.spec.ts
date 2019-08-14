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
import {RestFulConfig} from "../config/restful.config";

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { AgdRestful } from "../restful/agdsev";
import { BacRestful } from "../restful/bacsev";

import { CalendarService, PlanData } from "./calendar.service";
import { EventService } from "./event.service";
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
  let eventService: EventService;
  let planforUpdate: PlanData;

  beforeAll(() => {
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
    eventService = TestBed.get(EventService);
  });

  beforeEach(async () => {
    await config.generateDb();
  });

  // 需要同步执行
  it('Case 1 - 1 service should be created', () => {
    expect(eventService).toBeTruthy();
  });
  
  it('Case 2 - 1 service should be saveTask', () => {
  	// 创建任务
    let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //获取插入的数据，校验插入是否一致
    let txx: TaskData = {} as TaskData;
    txx = eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  });
  
  it('Case 2 - 2 service should be saveTask', () => {
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
    txx = eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(evn);
  });
  
  it('Case 3 - 1 service should be saveMiniTask', () => {
  	// 创建任务
    let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //获取插入的数据，校验插入是否一致
    let txx: MiniTaskData = {} as MiniTaskData;
    txx = eventService.getMiniTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  });
  
   it('Case 3 - 2 service should be saveMiniTask', () => {
   	
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
    txx = eventService.getMiniTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(evn);
  });
  
  it('Case 3 - 1 service should be finishTask', () => {
  	
  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    let isrt: string = await eventService.finishTask(tx.evi);
    expect(isrt).toBeDefined();
    expect(isrt).toBe(IsCreate.isYes);
  })
  
  it('Case 4 - 1 service should be finishTaskNext', () => {
  	
  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    await eventService.finishTaskNext(tx.evi);
    //验证是否已获取数据
    let txx: TaskData = {} as TaskData;
    txx = eventService.getTaskNext(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  })

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
