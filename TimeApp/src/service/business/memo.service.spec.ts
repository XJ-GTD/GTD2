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

import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { BacRestful } from "../restful/bacsev";

import { CalendarService, PlanData } from "./calendar.service";
import { MemoService,MemoData } from "./memo.service";
import { PlanType,ObjectType } from "../../data.enum";

/**
 * 备忘Service 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('MemoService test suite', () => {
  let config: SqliteConfig;
  let init: SqliteInit;
  let restConfig: RestFulConfig;
  let memoService: MemoService;
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
        MemoService,
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
    
    memoService = TestBed.get(MemoService);
    
    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
  });

  beforeEach(async () => {
    await config.generateDb();
  });

  // 需要同步执行
  it('Case 1 - 1 service should be created', () => {
    expect(memoService).toBeTruthy();
  });

   it('Case 2 - 1  saveMemo 创建备忘 - 创建1个备忘 ', async () => {
   	let mom: MemoData = {} as MemoData;
   	mom.mon='本周三写完测试用例';
   	mom = await memoService.saveMemo(mom);
   	expect(mom).toBeDefined();
    expect(mom.moi).toBeDefined();
    //取出返回值
    let gmom: MemoData = {} as MemoData;
    gmom = await memoService.getMemo(mom.moi);
    expect(gmom).toBeDefined();
    expect(gmom.mon).toBe(mom.mon);
  });

  it('Case 2 - 2  saveMemo 更新备忘 - 创建1个任务，更新备忘', async () => {
   	let mom: MemoData = {} as MemoData;
   	mom.mon='本周三写完测试用例';
   	mom = await memoService.saveMemo(mom);
   	expect(mom).toBeDefined();
    expect(mom.moi).toBeDefined();
    let mon: string = "老张，你又长膘了";
    mom.mon=mon;
    await memoService.saveMemo(mom);
    //取出返回值
    let gmom: MemoData = {} as MemoData;
    gmom = await memoService.getMemo(mom.moi);
    expect(gmom).toBeDefined();
    expect(gmom.mon).toBe(mon);
  });

  it('Case 3 - 1  updateMemoPlan 更新备忘计划 - 创建1个任务，更新备忘计划', async () => {
  	//插入获取ID
   	let mom: MemoData = {} as MemoData;
   	mom.mon='我老大，叫老席，你动我代码试试';
   	mom = await memoService.saveMemo(mom);
   	expect(mom).toBeDefined();
    expect(mom.moi).toBeDefined();
    //根据ID测试更新方法
    let ji: string = "abc123";
    await memoService.updateMemoPlan(ji,mom.moi);
    //更新完成后，获取原有数据
    let gmom: MemoData = {} as MemoData;
    gmom = await memoService.getMemo(mom.moi);
    expect(gmom).toBeDefined();
   	expect(gmom.ji).toBe(ji);
  });


  it('Case 4 - 1   removeMemo 删除任务 - 创建1个任务 ，删除这个任务', async () => {
  	//插入获取ID
   	let mom: MemoData = {} as MemoData;
   	mom.mon='我老大，叫老席，你动我代码试试';
   	mom = await memoService.saveMemo(mom);
   	expect(mom).toBeDefined();
    expect(mom.moi).toBeDefined();
    //根据ID测试更新方法
    let ji: string = "abc123";
    await memoService.removeMemo(mom.moi);
    //更新完成后，获取原有数据
    let gmom: MemoData = {} as MemoData;
    gmom = await memoService.getMemo(mom.moi);
    expect(gmom).toBeNull();
  });

  it('Case 5 - 1   backup与recovery  备份恢复任务- 备份任务、 恢复任务、查询任务', async () => {

  		let mom: MemoData = {} as MemoData;
	   	mom.mon='我老大，叫老席，你动我代码试试';
	   	mom = await memoService.saveMemo(mom);
	   	expect(mom).toBeDefined();
	    expect(mom.moi).toBeDefined();
  	  let bts: Number = moment().unix();
  	  //先备份
  		memoService.backup(bts);
  		//后还原
  		memoService.recovery(null,bts);
  		//验证还原后的数据是否和原有数据匹配
  		let gmom: MemoData = {} as MemoData;
	    gmom = await memoService.getMemo(mom.moi);
	    expect(gmom).toBeDefined();
	    expect(gmom.mon).toBe(mom.mon);
  });


  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
