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
  SplashScreenMock
} from '../../../../test-config/mocks-ionic';

import {MyApp} from '../../app/app.component';
import {SqliteConfig} from "../../config/sqlite.config";
import {RestFulConfig} from "../../config/restful.config";

import {EmitService} from "../../util-service/emit.service";
import {UtilService} from "../../util-service/util.service";
import { SqliteExec } from "../../util-service/sqlite.exec";
import { RestfulClient } from "../../util-service/restful.client";
import {NetworkService} from "../../cordova/network.service";

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
  let sqlExce: SqliteExec;

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
        Device,
        SQLite,
        SQLitePorter,
        SqliteConfig,
        SqliteExec,
        UtilService,
        EmitService,
        Network,
        HTTP,
        HttpClient,
        RestFulConfig,
        RestfulClient,
        NetworkService,
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
  }));

  beforeEach(async () => {
    config = TestBed.get(SqliteConfig);
    await config.generateDb();
  });

  beforeEach(() => {
    sqlExce = TestBed.get(SqliteExec);
  });

  // 需要同步执行
  it('Case 1 - 8 cTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 7 upTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 6 dTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 5 sloTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 4 slTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 3 drTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 2 inTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  // 需要同步执行
  it('Case 1 - 1 rpTParam', () => {
    expect(sqlExce).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
