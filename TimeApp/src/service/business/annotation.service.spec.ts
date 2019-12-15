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
import * as anyenum from "../../data.enum";
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
  UserConfigMock,
  AssistantServiceMock
} from '../../../test-config/mocks-ionic';

import {MyApp} from '../../app/app.component';
import {SqliteConfig} from "../config/sqlite.config";
import {SqliteInit} from "../sqlite/sqlite.init";
import {RestFulConfig} from "../config/restful.config";
import {SqliteExec} from "../util-service/sqlite.exec";
import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import { RestfulClient } from "../util-service/restful.client";
import {NetworkService} from "../cordova/network.service";
import { ShaeRestful } from "../restful/shaesev";
import { AgdRestful } from "../restful/agdsev";
import { DataRestful } from "../restful/datasev";
import { BacRestful } from "../restful/bacsev";
import {SyncRestful} from "../restful/syncsev";
import {AtTbl} from "../sqlite/tbl/at.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import { MemoService,MemoData } from "./memo.service";
import { AnnotationService,Annotation } from "./annotation.service";
import { EventService } from "./event.service";
import { PlanType,ObjectType , SyncType, DelType, SyncDataStatus} from "../../data.enum";
import { ScheduleRemindService } from "./remind.service";
import {File} from '@ionic-native/file';
import {AssistantService} from "../cordova/assistant.service";
import {TimeOutService} from "../../util/timeOutService";
import {NotificationsService} from "../cordova/notifications.service";
import { FindBugRestful } from "../restful/bugsev";
import {DetectorService} from "../util-service/detector.service";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import { RemindService } from "../util-service/remind.service";
import { GrouperService } from "./grouper.service";


/**
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author 343253410@qq.com
 **/
describe('AnnotationService test suite', () => {

    let config: SqliteConfig;
    let init: SqliteInit;
    let restConfig: RestFulConfig;
    let userConfig: UserConfig;
    let memoService: MemoService;
    let calendarService: CalendarService;
    let planforUpdate: PlanData;
    let sqlExce: SqliteExec;
    let util: UtilService;
    let assistantService: AssistantService;
    let timeOutService: TimeOutService;
    let notificationsService: NotificationsService;
    let grouperService: GrouperService;
    let annotationService: AnnotationService;


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
            MemoService,
            CalendarService,
            EventService,
            AnnotationService,
            ScheduleRemindService,
            Device,
            SQLite,
            SQLitePorter,
            LocalNotifications,
            File,
            Badge,
            RemindService,
            SqliteConfig,
            { provide: AssistantService, useClass: AssistantServiceMock },
            { provide: UserConfig, useClass: UserConfigMock },
            SqliteExec,
            SqliteInit,
            NotificationsService,
            UtilService,
            TimeOutService,
            EmitService,
            DetectorService,
            GrouperService,
            ShaeRestful,
            AgdRestful,
            FindBugRestful,
            DataRestful,
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
        userConfig = TestBed.get(UserConfig);
        restConfig = TestBed.get(RestFulConfig);
    		sqlExce = TestBed.get(SqliteExec);
        memoService = TestBed.get(MemoService);
        calendarService = TestBed.get(CalendarService);
        util = TestBed.get(UtilService);
        assistantService = TestBed.get(AssistantService);
        notificationsService = TestBed.get(NotificationsService);
        timeOutService = TestBed.get(TimeOutService);
        grouperService = TestBed.get(GrouperService);
        annotationService = TestBed.get(AnnotationService);
        await config.generateDb();
        await init.createTables();
        let version = 0;
        while (DataConfig.version > version) {
          await init.createTablespath(++version, 0);
        }
        await init.initData();
        restConfig.init();
        userConfig.init();

        UserConfig.account.id = "13900009004";
        UserConfig.account.name = "测试帐户";

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
    });

    beforeEach(async () => {
      //await config.generateDb();
      let at: AtTbl = new AtTbl();
      await sqlExce.dropByParam(at);
      await sqlExce.createByParam(at);
    });

    it('Case 1 - 1 service should be created', () => {
      expect(annotationService).toBeTruthy();
    });

    it('Case 2 - 1  saveAnnotation 保存参与人信息- 保存', async () => {

        let at: Annotation = new Annotation();
        at.obi = this.util.getUuid();
        at.ui = UserConfig.account.id;
        let rcs : Array<string > =new Array<string>();
        rcs.push("18569990239");
        at.rcs = rcs;
        at.content =  "写了一下午case ,没有保存，手误给删了，我想哭啊，嗷嗷嗷";
        let save: string = await annotationService.saveAnnotation(at);


        let ats: Array<Annotation> = new Array<Annotation>();
        ats =  await annotationService.getAnnotation();
        expect(ats).toBeDefined();
        expect(ats.length).toBeDefined(1);
   });

   afterAll(() => {
     TestBed.resetTestingModule();
   });
});
