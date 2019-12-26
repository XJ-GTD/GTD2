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
import {GTbl} from "../sqlite/tbl/g.tbl";
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
import { GrouperService,Grouper } from "./grouper.service";
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";
import {FsData, PageDcData} from "../../data.mapping";
import {ContactsService} from "../cordova/contacts.service";
import {Contacts, Contact} from "@ionic-native/contacts";

/**
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author 343253410@qq.com
 **/
 describe('GrouperService test suite', () => {

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
     let contactsService: ContactsService;


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
             ScheduleRemindService,
             Device,
             SQLite,
             SQLitePorter,
             LocalNotifications,
             File,
             Badge,
             SqliteConfig,
             { provide: AssistantService, useClass: AssistantServiceMock },
             { provide: UserConfig, useClass: UserConfigMock },
             SqliteExec,
             SqliteInit,
             NotificationsService,
             UtilService,
             TimeOutService,
             EmitService,
             Contacts,
             ContactsService,
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
         contactsService = TestBed.get(ContactsService);
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
       let gt: GTbl = new GTbl();
       await sqlExce.drop(gt);
       await sqlExce.create(gt);
     });

     it('Case 1 - 1 service should be created', () => {
       expect(grouperService).toBeTruthy();
     });

     it('Case 2 - 1 save 创建群组 - 无群组的名称', async () => {
       let pd: PageDcData = new PageDcData();
       try {
         await grouperService.saveGrouper(pd);
       } catch (e) {
         expect(e).toBeDefined();
       }

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(0);

     });

     it('Case 2 - 2 save 创建群组 - 有群组的名称', async () => {
       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

     });

     it('Case 2 - 3 save 群组新增成员 - 添加成员', async () => {
       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       let pd2: PageDcData = new PageDcData();
       Object.assign(pd2, pg[0]);
       pd2.gn ="组团打怪群3";
       let fs: FsData = new FsData();
       fs.pwi = "12343";
       pd2.fsl.push(fs);
       await grouperService.saveGrouper(pd2);

       let pg2: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群3");
       expect(pg2).toBeDefined();
       expect(pg2.length).toBeDefined(1);
     });


     it('Case 2 - 4 save 群组新增成员 - 无成员', async () => {
       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       let pd2: PageDcData = new PageDcData();
       Object.assign(pd2, pg[0]);
       pd2.gn ="组团打怪群3";
       await grouperService.saveGrouper(pd2);

       let pg2: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群3");
       expect(pg2).toBeDefined();
       expect(pg2.length).toBeDefined(1);
     });


     it('Case 3 - 1 delete 删除会员 - 删除数据', async () => {
       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pd2: PageDcData = new PageDcData();
       pd2.gn ="组团打怪群2";
       await grouperService.saveGrouper(pd2);

       let pd3: PageDcData = new PageDcData();
       pd3.gn ="组团打怪群3";
       await grouperService.saveGrouper(pd3);

       let pg: Array<PageDcData> = await grouperService.fetchGroups();
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(3);

       let gi: string = pg[0].gi;
       let gn: string = pg[0].gn;

       await grouperService.removeGrouper(gi);

       let pg1: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), gn);
       expect(pg1).toBeDefined();
       expect(pg1.length).toBeDefined(1);
       // expect(pg1[0].del).toBe(DelType.del);

     });

     it('Case 3 - 2 delete 删除会员 - 删除数据', async () => {
       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pd2: PageDcData = new PageDcData();
       pd2.gn ="组团打怪群2";
       await grouperService.saveGrouper(pd2);

       let pd3: PageDcData = new PageDcData();
       pd3.gn ="组团打怪群3";
       await grouperService.saveGrouper(pd3);

       let pg: Array<PageDcData> = await grouperService.fetchGroups();
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(3);
       await grouperService.removeGrouper(pg[0].gi);
     });

     it('Case 4 - 1 receivedGrouper 接收群组数据同步 - 接收群组数据同步', async () => {

       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       await grouperService.receivedGrouper(pg[0].gi);
     });

     it('Case 5 - 1 sendGrouper 发送群组消息 - 发送群组消息', async () => {

       let grouper: Grouper = new Grouper();

       let fss : Array<FsData> = new Array<FsData>();
       let fs: FsData = new FsData();
       fs.pwi = "12343";
       fss.push(fs);
       grouper.fss = fss;

       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       grouper.gi = pg[0].gi;
       await grouperService.sendGrouper(grouper);

     });


     it('Case 6 - 1 receivedGrouperData 接收群组信息 - 接收群组信息', async () => {

       let grouper: Grouper = new Grouper();
       let pullGroupers: Array<Grouper> = new Array<Grouper>();

       let fss : Array<FsData> = new Array<FsData>();
       let fs: FsData = new FsData();
       fs.pwi = "12343";
       fss.push(fs);
       grouper.fss = fss;

       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       grouper.gi = pg[0].gi;
       pullGroupers.push(grouper);
       let result: Array<Grouper> = await grouperService.receivedGrouperData(pullGroupers,SyncDataStatus.UnDeleted);
       expect(result).toBeDefined();
     });

     it('Case 7 - 1 syncGrouper 同步全部的未同步信息 - 同步全部的未同步信息', async (done: DoneFn) => {

       let pullGroupers: Array<Grouper> = new Array<Grouper>();
       grouperService.syncGrouper(pullGroupers).then(() => {
         expect("success").toBe("success");
         done();
       })
       .catch(e => {
         fail("抛出异常, 出错");
         done();
       });
     });

     it('Case 8 - 1 removeGrouperMember 删除群成员 - 删除群成员', async () => {

       let pd: PageDcData = new PageDcData();
       pd.gn ="组团打怪群";
       await grouperService.saveGrouper(pd);

       let pg: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg).toBeDefined();
       expect(pg.length).toBeDefined(1);

       let pd2: PageDcData = new PageDcData();
       Object.assign(pd2, pg[0]);
       // pd2.gn ="组团打怪群3"; 不支持群名称修改
       let fs: FsData = new FsData();
       fs.pwi = "12343";
       pd2.fsl.push(fs);
       await grouperService.saveGrouper(pd2);

       let pg2: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg2).toBeDefined();
       expect(pg2.length).toBeDefined(1);

       //删除
       await grouperService.removeGrouperMember(pg2[0].gi, "12343");  // 非预设联系人无法通过fetchGroups取出来

       let pg3: Array<PageDcData> = await grouperService.filterGroups(await grouperService.fetchGroups(), "组团打怪群");
       expect(pg3).toBeDefined();
       expect(pg3.length).toBeDefined(1);
       expect(pg3[0].fsl.length).toBeDefined(0);
     });

     afterAll(() => {
       TestBed.resetTestingModule();
     });

 });
