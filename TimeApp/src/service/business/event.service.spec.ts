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
import { DataRestful } from "../restful/datasev";
import {SyncRestful} from "../restful/syncsev";
import {EvTbl} from "../sqlite/tbl/ev.tbl";
import {CaTbl} from "../sqlite/tbl/ca.tbl";
import {TTbl} from "../sqlite/tbl/t.tbl";
import {WaTbl} from "../sqlite/tbl/wa.tbl";
import { CalendarService, PlanData } from "./calendar.service";
import {EventService, AgendaData, TaskData, MiniTaskData, RtJson, TxJson} from "./event.service";
import { MemoService } from "./memo.service";
import { PlanType, IsCreate, IsSuccess, IsWholeday, PageDirection, SyncType, DelType, SyncDataStatus, EventType, OperateType, CycleType, OverType} from "../../data.enum";

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
  let calendarService: CalendarService;
  let planforUpdate: PlanData;
  let sqlExce: SqliteExec;
  let util: UtilService;

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
        MemoService,
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
        DataRestful,
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
		util = TestBed.get(UtilService);

    calendarService = TestBed.get(CalendarService);
    eventService = TestBed.get(EventService);
    await config.generateDb();
    await init.createTables();
    await init.initData();
    restConfig.init();

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;  // 每个Case超时时间
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

  it('Case 1 - 1 被分享人保存事件到本地 创建重复事件 -》被分享人保存到本地',async()=>{
    //创建重复事件
    let agdata = {} as   AgendaData;
    agdata.evn = "测试重复日程添加0911";
    agdata.sd = "2019/09/11";

    let rtjon = new RtJson();
    rtjon.cycletype = anyenum.CycleType.week;
    rtjon.over.value = "2019/10/11";
    rtjon.over.type = anyenum.OverType.limitdate;
    rtjon.cyclenum = 2;
    rtjon.openway.push(anyenum.OpenWay.Wednesday);

    agdata.rtjson = rtjon;

    let txjson = new TxJson();
    txjson.reminds.push(30);    // 提前30分钟提醒
    txjson.reminds.push(60); // 提前1小时提醒
    agdata.txjson = txjson;

    agdata.al = anyenum.IsWholeday.NonWhole;
    agdata.st = "11:20";
    agdata.ct = 20;
    let outagds = new Array<AgendaData>();
    outagds = await eventService.saveAgenda(agdata);
    expect(outagds).toBeDefined();
    //分享新增事件,准备测试数据
    for (let j=0,len = outagds.length ; j<len ;j++){
      outagds[j].evi = util.getUuid();
      outagds[j].ui = 'frompublisher1';

      if (outagds[j].fjs && outagds[j].fjs !=null) {
        for (let k = 0, len = outagds[j].fjs.length; k < len; k++) {
          outagds[j].fjs[k].fji = util.getUuid();
          outagds[j].fjs[k].obi = outagds[j].evi;
        }
      }
      if (outagds[j].parters && outagds[j].parters != null) {
        for (let k = 0, len = outagds[j].parters.length; k < len; k++) {
          outagds[j].parters[k].pari = util.getUuid();
          outagds[j].parters[k].obi = outagds[j].evi;
        }
      }
    }
    await eventService.receivedAgendaData(outagds,anyenum.SyncDataStatus.Deleted);

  });

  it('Case 2 - 1 saveTask 保存任务 - 保存1个任务，查询这个任务，查询任务主题', async() => {
  	// 创建任务
    let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
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
    tx.rtjson = new RtJson();
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
    tx.rtjson = new RtJson();
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
    tx.rtjson = new RtJson();
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
    tx.rtjson = new RtJson();
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
		await eventService.finishTask(tx);

		let txx: TaskData = {} as TaskData;
    txx = await eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.cs).toBe(IsSuccess.success);
  })

  it('Case 4 - 1 finishTaskNext 自动创建任务 - 创建任务，自动复制这个任务', async() => {

  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.isrt = IsCreate.isYes;
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();
    //进行复制
    let txx: TaskData = {} as TaskData;
    txx = await eventService.finishTaskNext(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);
  })

	it('Case 5 - 1 fetchPagedTasks 查询任务 - 查询全部2019/08/04这一天的任务', async() => {

		//创建任务
		let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    let tx2: TaskData = {} as TaskData;
    tx2.evn ="shopping,今天穿的是花裤衩 2019-08-17";
    tx2.rtjson = new RtJson();
    tx2 = await eventService.saveTask(tx2);
    expect(tx2).toBeDefined();
    expect(tx2.evi).toBeDefined();

		let day: string = moment().format('YYYY/MM/DD');
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedTasks(day);
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })

	it('Case 6 - 1 fetchPagedCompletedTasks 查询完成的任务 - 查询2019/08/14这一天完成的任务', async() => {

		let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.cs = IsSuccess.success;
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    let tx2: TaskData = {} as TaskData;
    tx2.evn ="shopping,今天穿的是花裤衩 2019-08-17";
    tx2.rtjson = new RtJson();
    tx2.cs = IsSuccess.success;
    tx2 = await eventService.saveTask(tx2);
    expect(tx2).toBeDefined();
    expect(tx2.evi).toBeDefined();


		let day: string = moment().format('YYYY/MM/DD');
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedCompletedTasks(day);
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })

	it('Case 7 - 1 fetchPagedUncompletedTasks 查询未完成的任务 - 查询2019/08/14这一天未完成的任务', async() => {

		let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    let tx2: TaskData = {} as TaskData;
    tx2.evn ="shopping,今天穿的是花裤衩 2019-08-17";
    tx2.rtjson = new RtJson();
    tx2 = await eventService.saveTask(tx2);
    expect(tx2).toBeDefined();
    expect(tx2.evi).toBeDefined();

		let day: string = moment().format('YYYY/MM/DD');
		let data: Array<TaskData> = new Array<TaskData>();
		data = await eventService.fetchPagedUncompletedTasks(day);
		expect(data).toBeDefined();
		expect(data.length).toBeGreaterThan(0);
  })

	it('Case 8 - 1 backup 备份、恢复', async() => {

		let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    let bts: number = moment().unix();
    await eventService.backup(bts);

    await calendarService.recoveryCalendar(bts, true);

    let txx: TaskData = await eventService.getTask(tx.evi);
    expect(txx).toBeDefined();
    expect(txx.evn).toBe(tx.evn);

	});

	it(`Case 9 - 1 sendTask 发送任务`,  async (done: DoneFn) => {
  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    eventService.sendTask(tx)
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });

  it(`Case 10 - 1 sendMiniTask 发送任务`,  async (done: DoneFn) => {
  	let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    eventService.sendMiniTask(tx)
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });


  it(`Case 11 - 2 receivedTask 接收任务,有数据`,   (done: DoneFn) => {
    eventService.receivedTask(util.getUuid())
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });
  });


  it(`Case 12 - 1 acceptReceivedTask 接收任务,有数据,不删除共享`,  async () => {
    	let tx: TaskData = {} as TaskData;
	    tx.evn ="shopping,今天穿的是花裤衩";
	    tx.rtjson = new RtJson();
		  tx.wtt = moment().unix();
	    tx.utt = moment().unix();
	    tx.tb = SyncType.unsynch;
	    tx = await eventService.saveTask(tx);
	    expect(tx).toBeDefined();
	    expect(tx.evi).toBeDefined();

	    let received = await eventService.acceptReceivedTask(tx,SyncDataStatus.UnDeleted);

	    expect(received).toBeDefined();
		  expect(received.evi).toBe(tx.evi);
		  expect(received.tb).toBe(SyncType.synch);
	    expect(received.del).toBe(DelType.undel);

	    let fetched = await eventService.getTask(received.evi);
	    expect(fetched).toBeDefined();
		  expect(fetched.evi).toBe(tx.evi);
		  expect(fetched.tb).toBe(SyncType.synch);
	    expect(fetched.del).toBe(DelType.undel);
  });

   it(`Case 12 - 2 acceptReceivedTask 接收任务,有数据,删除共享`,  async () => {
    	let tx: TaskData = {} as TaskData;
	    tx.evn ="shopping,今天穿的是花裤衩";
	    tx.rtjson = new RtJson();
		  tx.wtt = moment().unix();
	    tx.utt = moment().unix();
	    tx = await eventService.saveTask(tx);
	    expect(tx).toBeDefined();
	    expect(tx.evi).toBeDefined();

	    let received = await eventService.acceptReceivedTask(tx,SyncDataStatus.Deleted);

	    expect(received).toBeDefined();
		  expect(received.evi).toBe(tx.evi);
		  expect(received.tb).toBe(SyncType.synch);
	    expect(received.del).toBe(DelType.del);

	    let fetched = await eventService.getTask(received.evi);
	    expect(fetched).toBeNull();
  });


  it(`Case 13 - 1 acceptReceivedMiniTask 接收小任务,有数据,不删除共享`,  async () => {
    	let tx: MiniTaskData = {} as MiniTaskData;
	    tx.evn ="shopping,今天穿的是花裤衩";
	    tx.rtjson = new RtJson();
		  tx.wtt = moment().unix();
	    tx.utt = moment().unix();
	    tx.tb = SyncType.unsynch;
	    tx.del = DelType.undel;
	    tx = await eventService.saveMiniTask(tx);
	    expect(tx).toBeDefined();
	    expect(tx.evi).toBeDefined();

	    let received = await eventService.acceptReceivedMiniTask(tx,SyncDataStatus.UnDeleted);

	    expect(received).toBeDefined();
		  expect(received.evi).toBe(tx.evi);
		  expect(received.tb).toBe(SyncType.synch);
	    expect(received.del).toBe(DelType.undel);

	    let fetched = await eventService.getMiniTask(received.evi);
	    expect(fetched).toBeDefined();
		  expect(fetched.evi).toBe(tx.evi);
		  expect(fetched.tb).toBe(SyncType.synch);
	    expect(fetched.del).toBe(DelType.undel);
  });

	it(`Case 13 - 2 acceptReceivedMiniTask 接收小任务,有数据,删除共享`,  async () => {
    	let tx: MiniTaskData = {} as MiniTaskData;
	    tx.evn ="shopping,今天穿的是花裤衩";
	    tx.rtjson = new RtJson();
		  tx.wtt = moment().unix();
	    tx.utt = moment().unix();
	    tx.tb = SyncType.unsynch;
	    tx.del = DelType.undel;
	    tx = await eventService.saveMiniTask(tx);
	    expect(tx).toBeDefined();
	    expect(tx.evi).toBeDefined();

	    let received = await eventService.acceptReceivedMiniTask(tx,SyncDataStatus.Deleted);

	    expect(received).toBeDefined();
		  expect(received.evi).toBe(tx.evi);
		  expect(received.tb).toBe(SyncType.synch);
	    expect(received.del).toBe(DelType.del);

	    let fetched = await eventService.getMiniTask(received.evi);
	    expect(fetched).toBeNull();
  });


  it('Case 14 - 1   syncTask 更新单个任务到服务器 ', async () => {

  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.type =EventType.Task;
    tx.tb = SyncType.unsynch;
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    await eventService.syncTask(tx);

  });

  it('Case 15 - 1   syncMiniTask 更新单个小任务到服务器 ', async () => {

  	let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.type =EventType.MiniTask;
    tx.tb = SyncType.unsynch;
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    await eventService.syncMiniTask(tx);

  });

  it('Case 16 - 1   syncTasks 同步全部的未同步的任务到服务器 ，本地有数据（不报错）', async () => {

  	let tx: TaskData = {} as TaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.type =EventType.Task;
    tx.tb = SyncType.unsynch;
    tx = await eventService.saveTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    await eventService.syncTasks();

  });

  it('Case 16 - 2   syncTasks 同步全部的未同步的任务到服务器  ，本地无数据（不报错）', (done: DoneFn) => {
    eventService.syncTasks()
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });

  });


  it('Case 17 - 1   syncMiniTasks 同步全部的未同步的小任务到服务器，本地有数据（不报错） ', async () => {

  	let tx: MiniTaskData = {} as MiniTaskData;
    tx.evn ="shopping,今天穿的是花裤衩";
    tx.rtjson = new RtJson();
    tx.type =EventType.MiniTask;
    tx.tb = SyncType.unsynch;
    tx = await eventService.saveMiniTask(tx);
    expect(tx).toBeDefined();
    expect(tx.evi).toBeDefined();

    await eventService.syncMiniTasks();

  });

  it('Case 17 - 2   syncMiniTasks 同步全部的未同步的小任务到服务器 ，本地无数据（不报错）', (done: DoneFn) => {
    eventService.syncMiniTasks()
    .then(() => {
      expect("success").toBe("success");
     	done();
    })
    .catch(e => {
      fail("抛出异常, 出错");
      done();
    });

  });

  it(`Case 18 - 1 isSameAgenda 比较两个日程是否相同 - 保存后比较`, async () => {
    let agenda: AgendaData = {} as AgendaData;

    agenda.sd = moment().format("YYYY/MM/DD");
    agenda.evn = "比较两个日程是否相同 - 保存后比较";

    let results = await eventService.saveAgenda(agenda);

    let same: boolean = eventService.isSameAgenda(agenda, results[0]);

    expect(same).toBe(true);
  });

  describe(`创建不重复与重复（每天、每周、每月、每年）日程`, () => {
    let dayNoneRepeat: string = moment().format("YYYY/MM/DD");
    let dayDayRepeat: string = moment().add(1, "weeks").format("YYYY/MM/DD");
    let dayWeekRepeat: string = moment().add(1, "months").format("YYYY/MM/DD");
    let dayMonthRepeat: string = moment().add(1, "years").format("YYYY/MM/DD");
    let dayYearRepeat: string = moment().add(2, "years").format("YYYY/MM/DD");
    let dayNoneRepeatAgendas: Array<AgendaData>;
    let dayDayRepeatAgendas: Array<AgendaData>;
    let dayWeekRepeatAgendas: Array<AgendaData>;
    let dayMonthRepeatAgendas: Array<AgendaData>;
    let dayYearRepeatAgendas: Array<AgendaData>;

    beforeEach(async () => {
      // 创建不重复日程
      let noneRepeat: AgendaData = {} as AgendaData;

      noneRepeat.sd = dayNoneRepeat;
      noneRepeat.evn = "不重复";
      noneRepeat.todolist = anyenum.ToDoListStatus.On;

      dayNoneRepeatAgendas = await eventService.saveAgenda(noneRepeat);

      // 创建每天重复日程
      let dayRepeat: AgendaData = {} as AgendaData;

      let dayRepeatrt: RtJson = new RtJson();
      dayRepeatrt.cycletype = CycleType.day;
      dayRepeatrt.over.type = OverType.fornever;

      dayRepeat.sd = dayDayRepeat;
      dayRepeat.evn = "每天重复";
      dayRepeat.rtjson = dayRepeatrt;
      dayRepeat.todolist = anyenum.ToDoListStatus.On;

      dayDayRepeatAgendas = await eventService.saveAgenda(dayRepeat);

      // 创建每周重复日程
      let weekRepeat: AgendaData = {} as AgendaData;

      let weekRepeatrt: RtJson = new RtJson();
      weekRepeatrt.cycletype = CycleType.week;
      weekRepeatrt.over.type = OverType.fornever;

      weekRepeat.sd = dayWeekRepeat;
      weekRepeat.evn = "每周重复";
      weekRepeat.rtjson = weekRepeatrt;

      dayWeekRepeatAgendas = await eventService.saveAgenda(weekRepeat);

      // 创建每月重复日程
      let monthRepeat: AgendaData = {} as AgendaData;

      let monthRepeatrt: RtJson = new RtJson();
      monthRepeatrt.cycletype = CycleType.month;
      monthRepeatrt.over.type = OverType.fornever;

      monthRepeat.sd = dayMonthRepeat;
      monthRepeat.evn = "每月重复";
      monthRepeat.rtjson = monthRepeatrt;

      dayMonthRepeatAgendas = await eventService.saveAgenda(monthRepeat);

      // 创建每年重复日程
      let yearRepeat: AgendaData = {} as AgendaData;

      let yearRepeatrt: RtJson = new RtJson();
      yearRepeatrt.cycletype = CycleType.month;
      yearRepeatrt.over.type = OverType.fornever;

      yearRepeat.sd = dayYearRepeat;
      yearRepeat.evn = "每年重复";
      yearRepeat.rtjson = yearRepeatrt;

      dayYearRepeatAgendas = await eventService.saveAgenda(yearRepeat);

    });

    it(`Case 1 - 1 isAgendaChanged 判断日程是否已被修改 - 未修改`, async () => {
      let agenda = dayNoneRepeatAgendas[0];
      let agenda1 = await eventService.getAgenda(agenda.evi);

      let isChanged = eventService.isAgendaChanged(agenda1, agenda);

      expect(isChanged).toBe(false);
    });

    it(`Case 2 - 1 receivedAgenda 接收共享日程 - 无报错`, async (done: DoneFn) => {
      eventService.receivedAgenda("agenda id")
      .then(() => {
        expect("success").toBe("success");
        done();
      })
      .catch(e => {
        fail("抛出异常, 出错");
        done();
      });
    });

    it(`Case 3 - 1 removeAgenda 删除重复日程 - 第一个日程开始删除`, async () => {
      let agenda = dayDayRepeatAgendas[0];

      await eventService.removeAgenda(agenda, OperateType.FromSel);

      let agenda1 = await eventService.getAgenda(agenda.evi);

      expect(agenda1).toBeNull();
    });

    it(`Case 3 - 2 removeAgenda 删除重复日程 - 第二个日程开始删除`, async () => {
      let agenda0 = dayDayRepeatAgendas[0];
      let agenda = dayDayRepeatAgendas[1];

      await eventService.removeAgenda(agenda, OperateType.FromSel);

      let hasagenda = await eventService.getAgenda(agenda0.evi);

      expect(hasagenda).toBeDefined();

      let agenda1 = await eventService.getAgenda(agenda.evi);

      expect(agenda1).toBeNull();
    });

    it(`Case 4 - 1 todolist 是否加入todoList`, async () => {

			let agenda2: Array<AgendaData> = new Array<AgendaData>();
      agenda2 = await eventService.todolist();

      expect(agenda2).toBeDefined();
      expect(agenda2.length).toBeGreaterThan(0);
    });
  });

  describe(`创建任务`, () => {
    beforeEach(async () => {
      //创建任务
      let task: TaskData = {} as TaskData;
      task.evn = "冥王星三期";
      task.evd = "2019/06/01";
      task = await eventService.saveTask(task);

      let subtask1: TaskData = {} as TaskData;
      subtask1.evn = "设计";
      subtask1.evd = "2019/06/02";
      subtask1.rtevi = task.evi;
      subtask1 = await eventService.saveTask(subtask1);

      let subtask2: TaskData = {} as TaskData;
      subtask2.evn = "开发";
      subtask2.evd = "2019/06/03";
      subtask2.rtevi = task.evi;
      subtask2 = await eventService.saveTask(subtask2);

      let subtask3: TaskData = {} as TaskData;
      subtask3.evn = "测试";
      subtask3.evd = "2019/06/04";
      subtask3.rtevi = task.evi;
      subtask3 = await eventService.saveTask(subtask3);

      let subtask1_1: TaskData = {} as TaskData;
      subtask1_1.evn = "画面UI设计";
      subtask1_1.evd = "2019/06/05";
      subtask1_1.rtevi = subtask1.evi;
      subtask1_1.cs = IsSuccess.success;
      subtask1_1 = await eventService.saveTask(subtask1_1);

      let subtask1_1_1: TaskData = {} as TaskData;
      subtask1_1_1.evn = "画面首页设计";
      subtask1_1_1.evd = "2019/06/06";
      subtask1_1_1.rtevi = subtask1_1.evi;
      subtask1_1_1.cs = IsSuccess.success;
      subtask1_1_1 = await eventService.saveTask(subtask1_1_1);

      let subtask1_1_2: TaskData = {} as TaskData;
      subtask1_1_2.evn = "画面待处理一览设计";
      subtask1_1_2.evd = "2019/06/07";
      subtask1_1_2.rtevi = subtask1_1.evi;
      subtask1_1_2.cs = IsSuccess.success;
      subtask1_1_2 = await eventService.saveTask(subtask1_1_2);

      let subtask1_1_3: TaskData = {} as TaskData;
      subtask1_1_3.evn = "画面新建任务设计";
      subtask1_1_3.evd = "2019/06/08";
      subtask1_1_3.rtevi = subtask1_1.evi;
      subtask1_1_3.cs = IsSuccess.success;
      subtask1_1_3 = await eventService.saveTask(subtask1_1_3);

      let subtask1_1_4: TaskData = {} as TaskData;
      subtask1_1_4.evn = "画面新建日程设计";
      subtask1_1_4.evd = "2019/06/09";
      subtask1_1_4.rtevi = subtask1_1.evi;
      subtask1_1_4.cs = IsSuccess.success;
      subtask1_1_4 = await eventService.saveTask(subtask1_1_4);

      let subtask1_1_5: TaskData = {} as TaskData;
      subtask1_1_5.evn = "画面新建日程设计";
      subtask1_1_5.evd = "2019/06/10";
      subtask1_1_5.rtevi = subtask1_1.evi;
      subtask1_1_5.cs = IsSuccess.success;
      subtask1_1_5 = await eventService.saveTask(subtask1_1_5);

      let subtask1_1_6: TaskData = {} as TaskData;
      subtask1_1_6.evn = "画面新建日历项设计";
      subtask1_1_6.evd = "2019/08/30";
      subtask1_1_6.rtevi = subtask1_1.evi;
      subtask1_1_6 = await eventService.saveTask(subtask1_1_6);

      let subtask1_2: TaskData = {} as TaskData;
      subtask1_2.evn = "前端服务设计";
      subtask1_2.evd = "2019/06/06";
      subtask1_2.rtevi = subtask1.evi;
      subtask1_2.cs = IsSuccess.success;
      subtask1_2 = await eventService.saveTask(subtask1_2);

      let subtask1_3: TaskData = {} as TaskData;
      subtask1_3.evn = "后端云服务设计";
      subtask1_3.evd = "2019/06/07";
      subtask1_3.rtevi = subtask1.evi;
      subtask1_3 = await eventService.saveTask(subtask1_3);

      let subtask2_1: TaskData = {} as TaskData;
      subtask2_1.evn = "页面UI开发";
      subtask2_1.evd = "2019/09/01";
      subtask2_1.rtevi = subtask2.evi;
      subtask2_1 = await eventService.saveTask(subtask2_1);

      let subtask2_2: TaskData = {} as TaskData;
      subtask2_2.evn = "后端云服务开发";
      subtask2_2.evd = "2019/09/11";
      subtask2_2.rtevi = subtask2.evi;
      subtask2_2 = await eventService.saveTask(subtask2_2);

      let subtask2_3: TaskData = {} as TaskData;
      subtask2_3.evn = "前端服务开发";
      subtask2_3.evd = "2019/08/18";
      subtask2_3.rtevi = subtask2.evi;
      subtask2_3.cs = IsSuccess.success;
      subtask2_3 = await eventService.saveTask(subtask2_3);
    });

    it(`Case 1 - 1 fetchPagedTasks 获取翻页任务 - 初始化`, async () => {
      let pagetasks = await eventService.fetchPagedTasks();

      expect(pagetasks).toBeDefined();
      expect(pagetasks.length).toBeGreaterThan(0);

    });

    it(`Case 1 - 2 fetchPagedTasks 获取翻页任务 - 初始化后下拉翻页`, async () => {
      let pagetasks = await eventService.fetchPagedTasks();

      expect(pagetasks).toBeDefined();
      expect(pagetasks.length).toBeGreaterThan(0);

      let topday: string = pagetasks[0].evd;
      let prevpagetasks = await eventService.fetchPagedTasks(topday, PageDirection.PageDown);

      expect(prevpagetasks).toBeDefined();
      expect(prevpagetasks.length).toBeGreaterThan(0);

    });

    it(`Case 1 - 3 fetchPagedTasks 获取翻页任务 - 初始化后上拉翻页`, async () => {
      let pagetasks = await eventService.fetchPagedTasks();

      expect(pagetasks).toBeDefined();
      expect(pagetasks.length).toBeGreaterThan(0);

      let bottomday: string = pagetasks[pagetasks.length - 1].evd;
      let nextpagetasks = await eventService.fetchPagedTasks(bottomday, PageDirection.PageUp);

      expect(nextpagetasks).toBeDefined();
      expect(nextpagetasks.length).toBe(0);

    });

    it(`Case 2 - 1 fetchUncompletedTasks 获取所有未完成任务`, async () => {
      let tasks = await eventService.fetchUncompletedTasks();

      expect(tasks).toBeDefined();
      expect(tasks.length).toBeGreaterThan(0);

    });

  });

  describe(`创建排序事件`, () => {
    beforeEach(async () => {
      //===================普通事件===========================
      let ag1: AgendaData = {} as AgendaData;
      ag1.sd = "2019/09/12";
      ag1.evn = "2019/09/12写一个代码";
      ag1.todolist = anyenum.ToDoListStatus.On;
      ag1.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag1);

      //===================每天重复事件===========================
      let ag2: AgendaData = {} as AgendaData;
      let day: string = "2019/09/11";
      let rt: RtJson = new RtJson();
      rt.cycletype = CycleType.day;
      rt.over.type = OverType.limitdate;
  		rt.over.value ="2020/08/31";
      ag2.sd = day;
      ag2.evn = "每天重复,测试todoLoist排序";
      ag2.rtjson = rt;
      ag2.todolist = anyenum.ToDoListStatus.On;
      ag2.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag2);


      //===================普通事件===========================
      let ag3: AgendaData = {} as AgendaData;
      ag3.sd = "2019/09/13";
      ag3.evn = "2019/09/13写一个代码";
      ag3.todolist = anyenum.ToDoListStatus.On;
      ag3.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag3);


      //===================普通事件===========================
      let ag4: AgendaData = {} as AgendaData;
      ag4.sd = "2019/09/14";
      ag4.evn = "2019/09/14写一个代码";
      ag4.todolist = anyenum.ToDoListStatus.On;
      ag4.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag4);



      //===================普通事件===========================
      let ag5: AgendaData = {} as AgendaData;
      ag5.sd = "2019/09/15";
      ag5.evn = "2019/09/15写一个代码";
      ag5.todolist = anyenum.ToDoListStatus.On;
      ag5.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag5);




      //===================普通事件===========================
      let ag6: AgendaData = {} as AgendaData;
      ag6.sd = "2019/09/16";
      ag6.evn = "2019/09/16写一个代码";
      ag6.todolist = anyenum.ToDoListStatus.On;
      ag6.del = anyenum.DelType.undel;
      await eventService.saveAgenda(ag6);

    });

    it(`Case 1 - 1 测试todolist排序任务`, async () => {
      let agendaArray: Array<AgendaData> = new Array<AgendaData>();
      agendaArray = await eventService.todolist();
      expect(agendaArray).toBeDefined();
      expect(agendaArray.length).toBeGreaterThan(0);
      expect(agendaArray[3].sd).toBe("2019/09/14");
    });


  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
