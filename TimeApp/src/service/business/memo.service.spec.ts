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
  UserConfigMock,
  AssistantServiceMock
} from '../../../test-config/mocks-ionic';
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";

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
import {MomTbl} from "../sqlite/tbl/mom.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import { MemoService,MemoData } from "./memo.service";
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
import { GrouperService } from "./grouper.service";
import {ContactsService} from "../cordova/contacts.service";
import {Contacts, Contact} from "@ionic-native/contacts";
import { PersonRestful } from "../restful/personsev";

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
        DetectorService,
        GrouperService,
        ShaeRestful,
        AgdRestful,
        FindBugRestful,
        PersonRestful,
        Contacts,
        ContactsService,
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
    UserConfig.user.nickname = "测试帐户";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
  });

  beforeEach(async () => {
    //await config.generateDb();
    let mom: MomTbl = new MomTbl();
    await sqlExce.dropByParam(mom);
    await sqlExce.createByParam(mom);
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
  	  let bts: number = moment().unix();
  	  //先备份
  		await memoService.backup(bts);
  		//后还原
  		await calendarService.recoveryCalendar(bts, true);
  		//验证还原后的数据是否和原有数据匹配
  		let gmom: MemoData = await memoService.getMemo(mom.moi);
	    expect(gmom).toBeDefined();
	    expect(gmom.mon).toBe(mom.mon);
  });

  it('Case 6 - 1   syncMemo 更新已同步备忘标志 - 本地有数据(无报错)', async () => {

  	let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom = await memoService.saveMemo(mom);
	  expect(mom).toBeDefined();

	  await memoService.syncMemos([mom]);

  });


	xit('Case 7 - 1   syncMemos 同步所有未同备忘 - 本地有数据(无报错)', async () => {

		let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom = await memoService.saveMemo(mom);
	  expect(mom).toBeDefined();

	  let mom1: MemoData = {} as MemoData;
	  mom1.mon='你们都是大爷1';
	  mom1 = await memoService.saveMemo(mom1);
	  expect(mom1).toBeDefined();

	  await memoService.syncMemos();

	});


	it('Case 7 - 2   syncMemos 同步所有未同备忘 - 本地无数据(无报错)', (done: DoneFn) => {
	   memoService.syncMemos()
    .then(() => {
      	expect("success").toBe("success");
     		 done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });

	});


	it(`Case 8 - 1 receivedMemoData 接收备忘数据 - 不删除共享备忘`, async () => {

		let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom.wtt = moment().unix();
    mom.utt = moment().unix();
    mom.tb = SyncType.unsynch;
    mom.del = DelType.undel;
	  mom = await memoService.saveMemo(mom);

	  let receivedMemoData = await memoService.receivedMemoData(mom,SyncDataStatus.UnDeleted);

	  expect(receivedMemoData).toBeDefined();
	  expect(receivedMemoData.moi).toBe(mom.moi);
	  expect(receivedMemoData.tb).toBe(SyncType.synch);
    expect(receivedMemoData.del).toBe(DelType.undel);

    let fetched = await memoService.getMemo(receivedMemoData.moi);
    expect(fetched).toBeDefined();
	  expect(fetched.moi).toBe(mom.moi);
	  expect(fetched.tb).toBe(SyncType.synch);
    expect(fetched.del).toBe(DelType.undel);

	});

	it(`Case 8 - 2 receivedMemoData 接收备忘数据 - 删除共享备忘`, async () => {

		let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom.wtt = moment().unix();
    mom.utt = moment().unix();
    mom.tb = SyncType.unsynch;
    mom.del = DelType.undel;
	  mom = await memoService.saveMemo(mom);

    let received: MemoData = {} as MemoData;
    Object.assign(received, mom);

    received.moi = util.getUuid();

	  let receivedMemoData = await memoService.receivedMemoData(received, SyncDataStatus.Deleted);

	  expect(receivedMemoData).toBeDefined();
	  expect(receivedMemoData.moi).toBe(received.moi);
	  expect(receivedMemoData.tb).toBe(SyncType.synch);
    expect(receivedMemoData.del).toBe(DelType.del);

    let fetched = await memoService.getMemo(receivedMemoData.moi);
    expect(fetched).toBeNull();

	});


  it(`Case 9 - 1 receivedMemo 接收备忘共享请求(无报错)`,  (done: DoneFn) => {
    memoService.receivedMemo(util.getUuid())
    .then(() => {
      	expect("success").toBe("success");
     		 done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 10 - 1 sendMemo 发送备忘(无报错)`,  async (done: DoneFn) => {
  	let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom = await memoService.saveMemo(mom);
	  expect(mom).toBeDefined();
	  expect(mom.moi).toBeDefined();
	  expect(mom.del).toBeDefined();

    memoService.sendMemo(mom)
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 11 - 1 shareMemo 分享备忘(无报错)`,  async (done: DoneFn) => {
  	let mom: MemoData = {} as MemoData;
	  mom.mon='你们都是大爷';
	  mom = await memoService.saveMemo(mom);
	  expect(mom).toBeDefined();
	  expect(mom.moi).toBeDefined();
	  expect(mom.del).toBeDefined();

    memoService.shareMemo(mom)
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
