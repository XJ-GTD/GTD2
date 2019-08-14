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
    memoService = TestBed.get(MemoService);
  });

  beforeEach(async () => {
    await config.generateDb();
  });

  // 需要同步执行
  it('Case 1 - 1 service should be created', () => {
    expect(memoService).toBeTruthy();
  });

   it('Case 1 - 2 save memo service should be created', async () => {
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

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
