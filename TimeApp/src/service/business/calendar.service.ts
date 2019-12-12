import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { BipdshaeData, Plan, PlanPa, ShaeRestful} from "../restful/shaesev";
import { SyncData, PushInData, PullInData, DataRestful, DayCountCodec, ShareInData } from "../restful/datasev";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import { EventData, TaskData, AgendaData, MiniTaskData, EventService, Attachment, RtJson, TxJson, Member, generateRtJson, generateTxJson } from "./event.service";
import { MemoData, MemoService } from "./memo.service";
import { Grouper } from "./grouper.service";
import { Annotation } from "./annotation.service";
import { EventType, PlanType, PlanItemType, PlanDownloadType, MemberShareState, SelfDefineType, ConfirmType, OperateType, ObjectType, PageDirection, CycleType, SyncType, RepeatFlag, DelType, SyncDataSecurity, SyncDataStatus, InviteState, ModiPower, InvitePowr } from "../../data.enum";
import { UserConfig } from "../config/user.config";
import * as moment from "moment";
import { JhaTbl } from "../sqlite/tbl/jha.tbl";
import { JtaTbl } from "../sqlite/tbl/jta.tbl";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { ParTbl } from "../sqlite/tbl/par.tbl";
import { FjTbl } from "../sqlite/tbl/fj.tbl";
import { RwTbl } from "../sqlite/tbl/rw.tbl";
import {
  assertEmpty,
  assertEqual,
  assertFail
} from "../../util/util";
import {FsData, PageDcData} from "../../data.mapping";
import { ScheduleRemindService } from "./remind.service";
import {AsyncQueue} from "../../util/asyncQueue";
import {DetectorService} from "../util-service/detector.service";
import {TimeOutService} from "../../util/timeOutService";
import {GrouperService} from "./grouper.service";
import { Observable, BehaviorSubject } from 'rxjs';
import { checksum } from "../../util/crypto-util";

@Injectable()
export class CalendarService extends BaseService {

  private attachmentcached: Map<string, Array<Attachment>> = new Map<string, Array<Attachment>>();

  private calendarsubjects: Map<string, BehaviorSubject<boolean>> = new Map<string, BehaviorSubject<boolean>>();
  private calendarobservables: Map<string, Observable<boolean>> = new Map<string, Observable<boolean>>();
  private annotationsubjects: Map<string, BehaviorSubject<boolean>> = new Map<string, BehaviorSubject<boolean>>();
  private annotationobservables: Map<string, Observable<boolean>> = new Map<string, Observable<boolean>>();
  private attachmentsubjects: Map<string, BehaviorSubject<number>> = new Map<string, BehaviorSubject<number>>();
  private attachmentobservables: Map<string, Observable<number>> = new Map<string, Observable<number>>();

  private calendaractivities: Array<MonthActivityData> = new Array<MonthActivityData>();
  private activitiesqueue: AsyncQueue;
  private calendardatarws: Map<string, ReadWriteData> = new Map<string, ReadWriteData>();
  private datasrwqueue: AsyncQueue;

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private userConfig: UserConfig,
              private eventService: EventService,
              private memoService: MemoService,
              private grouperService: GrouperService,
              private remindService: ScheduleRemindService,
              private bacRestful: BacRestful,
              private shareRestful: ShaeRestful,
              private dataRestful: DataRestful,
              private detectorService: DetectorService,
              private timeOutService: TimeOutService) {
    super();
    moment.locale('zh-cn');

    this.datasrwqueue = new AsyncQueue(({data}, callback) => {
      let rw: string = data.rw;
      let payload: any = data.payload;

      try {
        if (payload instanceof Array) {
          for (let single of payload) {
            (rw == "read")? this.read(single) : ((rw == "writeandread")? this.write(single, true) : this.write(single));
          }
        } else {
          (rw == "read")? this.read(payload) : ((rw == "writeandread")? this.write(payload, true) : this.write(payload));
        }

        callback();
      } catch(err) {}
    },1,1,"home.list.modifiy1");

    this.datasrwqueue.setTimeOutService(this.timeOutService);

    this.activitiesqueue = new AsyncQueue( async ({data}, callback) => {

      // 多条数据同时更新/单条数据更新
      if (data instanceof Array) {
        // 获取每月最后一条数据的索引位置
        let monthlyLastDataIndex: Map<string, number> = data.reduce((target, val, index) => {
          if (val.evd) {
            let month: string = moment(val.evd, "YYYY/MM/DD").format("YYYY/MM");
            target.set(month, index);
          } else if (!val.evd && val.sd) {
            let month: string = moment(val.sd, "YYYY/MM/DD").format("YYYY/MM");
            target.set(month, index);
          }

          return target;
        }, new Map<string, number>());

        let lastindexes: Array<number> = new Array<number>();

        monthlyLastDataIndex.forEach((val) => {
          lastindexes.push(val);
        });

        let index = 0;
        for (let single of data) {
          if (lastindexes.indexOf(index) >= 0) {
            this.mergeCalendarActivity(single, true);
          } else {
            this.mergeCalendarActivity(single, false);
          }
          index++;
        }

        // 同步提醒，如果有的话
        await this.remindService.syncScheduledReminds(data);
      } else {
        this.mergeCalendarActivity(data);

        // 同步提醒，如果有的话
        await this.remindService.syncScheduledReminds([data]);
      }

      callback();
    },1,1,"home.list.modifiy");

    this.activitiesqueue.setTimeOutService(this.timeOutService);

    // 活动变化时自动更新日历显示列表数据
    this.emitService.destroy("mwxing.calendar.activities.changed");
    this.emitService.register("mwxing.calendar.activities.changed", (data) => {
      if (!data) {
        this.assertFail("事件mwxing.calendar.activities.changed无扩展数据");
        return;
      }

      let refresh: boolean = false;
      if (data.refresh != undefined) {
        refresh = data.refresh;
        data = data.data;
      }

      this.activitiesqueue.push({data: data}, () => {
        if (refresh) {
          // 用于接收第一次登录，接收完日程后，刷新首页的附件数量
          this.refreshAttachmentObservables();
        }

        // 完成处理
        this.detectorService.detector();
        if (this.calendaractivities.length > 0) {
          for (let monthactivities of this.calendaractivities) {
            this.emitService.emit("mwxing.calendar." + monthactivities.month + ".changed", monthactivities);
          }
        }
      });
    });

    // 活动读写状态变更时自动发送状态到画面
    this.emitService.destroy("mwxing.calendar.datas.readwrite");
    this.emitService.register("mwxing.calendar.datas.readwrite", (data) => {
      if (!data) {
        this.assertFail("事件mwxing.calendar.datas.readwrite无扩展数据");
        return;
      }

      this.datasrwqueue.push({data: data}, () => {
        this.detectorService.detector();
      });
    });
  }

  clearCalendarActivities() {
    this.calendaractivities.length = 0;
  }

  /**
   * 刷新日历显示列表到指定月份
   *
   * 所有月份数据保持在calendaractivities中
   *
   * @author leon_xi@163.com
   **/
  async refreshCalendarActivitiesToMonth(month: string = moment().format("YYYY/MM"), skipInit: boolean = true): Promise<Array<MonthActivityData>> {
    this.assertEmpty(month);    // 入参不能为空

    // 数据不存在
    if (!this.calendaractivities || this.calendaractivities.length <= 0) {
      if (!skipInit) {
        await this.getCalendarActivities(PageDirection.PageInit);
      } else {
        return this.calendaractivities;
      }
    }

    let firstMonth: string = this.calendaractivities[0].month;
    let lastMonth: string = this.calendaractivities[this.calendaractivities.length - 1].month;

    // 往前添加
    if (moment(month,"YYYY/MM").isBefore(moment(firstMonth,"YYYY/MM"))) {
      let currentMonth: string = moment(firstMonth,"YYYY/MM").subtract(1, "months").format("YYYY/MM");

      while(true) {
        await this.getCalendarActivities(PageDirection.PageDown);

        if (month == currentMonth) {
          break;
        }

        currentMonth = moment(currentMonth, "YYYY/MM").subtract(1, "months").format("YYYY/MM");
      }
    }

    // 往后添加
    if (moment(lastMonth,"YYYY/MM").isBefore(moment(month,"YYYY/MM"))) {
      let currentMonth: string = moment(lastMonth,"YYYY/MM").add(1, "months").format("YYYY/MM");

      while(true) {
        await this.getCalendarActivities(PageDirection.PageUp);

        if (month == currentMonth) {
          break;
        }

        currentMonth = moment(currentMonth,"YYYY/MM").add(1, "months").format("YYYY/MM");
      }
    }

    return this.calendaractivities;
  }

  async fetchReadWriteDatas(): Promise<Array<ReadWriteData>> {
    let sql: string = `select * from gtd_rw order by type, id, mark, rw, utt asc`;

    let rwdatas: Array<ReadWriteData> = await this.sqlExce.getExtLstByParam<ReadWriteData>(sql, []) || new Array<ReadWriteData>();

    return rwdatas;
  }

  async saveReadWriteDatas(datas: Map<string, ReadWriteData>, callback: () => void) {
    if (!datas || datas.size <= 0) {
      callback();
      return;
    }

    let rwTbls: Array<RwTbl> = new Array<RwTbl>();
    datas.forEach((val) => {
      let rwtbl: RwTbl = new RwTbl();
      Object.assign(rwtbl, val);

      rwTbls.push(rwtbl);
    });

    let sqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(rwTbls);

    if (sqls && sqls.length > 0) {
      await this.sqlExce.batExecSqlByParam(sqls);
    }

    callback();
    return;
  }

  getCalendarObservables(): Map<string, Observable<boolean>> {
    this.fetchReadWriteDatas().then((datas) => {
      for (let data of datas) {
        let rwdata: ReadWriteData = {} as ReadWriteData;
        Object.assign(rwdata, data);

        let rwkey: ReadWriteKey = new ReadWriteKey(rwdata.type, rwdata.id, rwdata.mark, rwdata.rw);
        this.calendardatarws.set(rwkey.encode(), rwdata);

        // 刷新首页未读状态
        this.calendardatarws.forEach((rwdata) => {
          let rwkey: ReadWriteKey = new ReadWriteKey(rwdata.type, rwdata.id, rwdata.mark, rwdata.rw);

          if (rwdata.rw == "write" && (rwdata.mark == "content" || rwdata.mark == "annotation")) {
            let readData: ReadWriteData = this.calendardatarws.get(rwkey.encode());

            if (readData) {
              switch(rwdata.type) {
                case "event":
                  if ((readData.nval || readData.cval || readData.bval || readData.checksum) != (rwdata.nval || rwdata.cval || rwdata.bval || rwdata.checksum)) {

                    // 首页标记未读
                    if (rwdata.mark == "content") {
                      this.commit(rwdata.id, true);
                    }

                    // 首页标记Annotation
                    if (rwdata.mark == "annotation") {
                      this.annotation(rwdata.id, true);
                    }
                  }

                  break;
                default:
                  break;
              }
            }
          }
        });
      }

      let callback = () => {
        setTimeout(() => {
          this.saveReadWriteDatas(this.calendardatarws, callback);
        }, 60 * 1000);
      };

      this.saveReadWriteDatas(null, callback);
    });

    return this.calendarobservables;
  }

  refreshCalendarObservables() {
    // 刷新首页未读状态
    this.calendardatarws.forEach((rwdata) => {
      let rwkey: ReadWriteKey = new ReadWriteKey(rwdata.type, rwdata.id, rwdata.mark, rwdata.rw);

      if (rwdata.rw == "write" && (rwdata.mark == "content" || rwdata.mark == "annotation")) {
        let readData: ReadWriteData = this.calendardatarws.get(rwkey.encode());

        if (readData) {
          switch(rwdata.type) {
            case "event":
              if ((readData.nval || readData.cval || readData.bval || readData.checksum) != (rwdata.nval || rwdata.cval || rwdata.bval || rwdata.checksum)) {

                // 首页标记未读
                if (rwdata.mark == "content") {
                  this.commit(rwdata.id, true);
                }

                // 首页标记Annotation
                if (rwdata.mark == "annotation") {
                  this.annotation(rwdata.id, true);
                }
              }

              break;
            default:
              break;
          }
        }
      }
    });
  }

  getAnnotationObservables(): Map<string, Observable<boolean>> {
    return this.annotationobservables;
  }

  getAttachmentObservables(): Map<string, Observable<number>> {
    this.eventService.fetchAttachments().then((attachments) => {
      for (let attachment of attachments) {
        let objectattaments: Array<Attachment> = this.attachmentcached.get(attachment.obi) || new Array<Attachment>();

        objectattaments.push(attachment);

        this.attachmentcached.set(attachment.obi, objectattaments);
      }

      this.attachmentcached.forEach((value, key) => {
        let subject: BehaviorSubject<number> = this.attachmentsubjects.get(key);

        let count = value.reduce((target, ele) => {
          if (ele.del != DelType.del) target++;

          return target;
        }, 0);

        if (!subject) {
          subject = new BehaviorSubject<number>(count);
          this.attachmentsubjects.set(key, subject);
          this.attachmentobservables.set(key, subject.asObservable());
        } else {
          subject.next(count);
        }

        this.detectorService.detector();  // 刷新页面
      });
    });

    return this.attachmentobservables;
  }

  refreshAttachmentObservables() {
    this.attachmentcached.forEach((value, key) => {
      let subject: BehaviorSubject<number> = this.attachmentsubjects.get(key);

      let count = value.reduce((target, ele) => {
        if (ele.del != DelType.del) target++;

        return target;
      }, 0);

      if (!subject) {
        subject = new BehaviorSubject<number>(count);
        this.attachmentsubjects.set(key, subject);
        this.attachmentobservables.set(key, subject.asObservable());
      } else {
        subject.next(count);
      }
    });
  }

  /**
   * 取得日历显示列表
   *
   * 所有月份数据保持在calendaractivities中
   *
   * 初始化(PageDirection.PageInit)3个月的数据（上一个月、当前月份、下个月）
   * 向上翻页(PageDirection.PageUp)加载最后一个月的下一个月的数据
   * 向下翻页(PageDirection.PageDown)加载第一个月的上一个月的数据
   *
   * @author leon_xi@163.com
   **/
  async getCalendarActivities(direction: PageDirection = PageDirection.PageInit,month:moment.Moment = moment()): Promise<Array<MonthActivityData>> {
    this.assertEmpty(direction);    // 入参不能为空

    switch(direction) {
      case PageDirection.NoOption : //单纯获取当前缓存数据
        return this.calendaractivities;
      case PageDirection.PageAssign :
        this.calendaractivities.push(await this.fetchMonthActivities(month.format("YYYY/MM")));
        break;
      case PageDirection.PageInit :
        this.calendaractivities = new Array<MonthActivityData>();   // 强制重新初始化

        this.calendaractivities.push(await this.fetchMonthActivities(moment().subtract(3, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().subtract(2, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().subtract(1, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().add(1, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().add(2, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().add(3, "months").format("YYYY/MM")));


        break;
      case PageDirection.PageUp :
        if (this.calendaractivities.length < 1) {
          this.assertFail("getCalendarActivities 调用PageDirection.PageUp之前, 请先调用PageDirection.PageInit。");
        }
        let lastmonth: string = this.calendaractivities[this.calendaractivities.length - 1].month;
        this.calendaractivities.push(await this.fetchMonthActivities(moment(lastmonth,"YYYY/MM").add(1, "months").format("YYYY/MM")));
        break;
      case PageDirection.PageDown :
        if (this.calendaractivities.length < 1) {
          this.assertFail("getCalendarActivities 调用PageDirection.PageDown, 请先调用PageDirection.PageInit。");
        }
        let firstmonth: string = this.calendaractivities[0].month;
        this.calendaractivities.unshift(await this.fetchMonthActivities(moment(firstmonth,"YYYY/MM").subtract(1, "months").format("YYYY/MM")));
        break;
      default:
        this.assertFail();    // 非法参数
    }

    this.calendaractivities.forEach((val) => {
      if (val) {
        val.events.forEach((ele) => {
          if (ele.evi) {
            // Observable
            let subject: BehaviorSubject<boolean> = this.calendarsubjects.get(ele.evi);

            if (!subject) {
              subject = new BehaviorSubject<boolean>(false);
              this.calendarsubjects.set(ele.evi, subject);
              this.calendarobservables.set(ele.evi, subject.asObservable());
            } else {
              subject.next(false);
            }

            let annotationsubject: BehaviorSubject<boolean> = this.annotationsubjects.get(ele.evi);

            if (!annotationsubject) {
              annotationsubject = new BehaviorSubject<boolean>(false);
              this.annotationsubjects.set(ele.evi, annotationsubject);
              this.annotationobservables.set(ele.evi, annotationsubject.asObservable());
            } else {
              subject.next(false);
            }

            let attachmentsubject: BehaviorSubject<number> = this.attachmentsubjects.get(ele.evi);

            let fjn: number = Number(ele.fj);

            if (!attachmentsubject) {
              attachmentsubject = new BehaviorSubject<number>(isNaN(fjn)? fjn : 0);
              this.attachmentsubjects.set(ele.evi, attachmentsubject);
              this.attachmentobservables.set(ele.evi, attachmentsubject.asObservable());
            } else {
              attachmentsubject.next(isNaN(fjn)? fjn : 0);
            }
            // Observable

          }
        });
      }
    });

    return this.calendaractivities;
  }

  /**
   * 合并日历显示列表
   *
   * 所有月份数据保持在calendaractivities中
   *
   * @author leon_xi@163.com
   **/
  mergeCalendarActivity(activity: any, update: boolean = true) {
    this.assertEmpty(activity);   // 入参不能为空

    // 如果没有缓存数据，不处理
    if (this.calendaractivities.length < 1) {
      return;
    }

    // 判断活动数据类型
    let activityType: string = this.getActivityType(activity);

    let firstmonth: string = this.calendaractivities[0].month;
    let lastmonth: string = this.calendaractivities[this.calendaractivities.length - 1].month;
    let currentmonth: string = "";

    // 根据活动日期合并入缓存日历显示列表数据
    switch (activityType) {
      case "PlanItemData" :
        // 转换成匹配对象类型
        let item: PlanItemData = {} as PlanItemData;
        Object.assign(item, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(item.sd, "YYYY/MM/DD").format("YYYY/MM");

        if (moment(firstmonth,"YYYY/MM").diff(moment(currentmonth, "YYYY/MM"), "months") <= 0 && moment(currentmonth, "YYYY/MM").diff(moment(lastmonth, "YYYY/MM"), "months") <= 0) {
          // let diff = moment(currentmonth,"YYYY/MM").diff(moment(firstmonth,"YYYY/MM"), "months");
          //
          // let currentmonthactivities = this.calendaractivities[diff];
          // this.mergeMonthActivities(currentmonthactivities, [item], update);

          // 解决数据所属日期跨月修改，原数据所属月对象不能被正常移除
          for (let monthactivities of this.calendaractivities) {
            this.mergeMonthActivities(monthactivities, [item], update);
          }
        }

        break;
      case "AgendaData" :
        // 转换成匹配对象类型
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(agenda.evd, "YYYY/MM/DD").format("YYYY/MM");

        if (moment(firstmonth,"YYYY/MM").diff(moment(currentmonth, "YYYY/MM"), "months") <= 0 && moment(currentmonth, "YYYY/MM").diff(moment(lastmonth, "YYYY/MM"), "months") <= 0) {
          // let diff = moment(currentmonth,"YYYY/MM").diff(moment(firstmonth,"YYYY/MM"), "months");
          //
          // let currentmonthactivities = this.calendaractivities[diff];
          // this.mergeMonthActivities(currentmonthactivities, [agenda], update);

          // 解决数据所属日期跨月修改，原数据所属月对象不能被正常移除
          for (let monthactivities of this.calendaractivities) {
            this.mergeMonthActivities(monthactivities, [agenda], update);
          }
        }

        break;
      case "TaskData" :
        // 转换成匹配对象类型
        let task: TaskData = {} as TaskData;
        Object.assign(task, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(task.evd, "YYYY/MM/DD").format("YYYY/MM");

        if (moment(firstmonth,"YYYY/MM").diff(moment(currentmonth, "YYYY/MM"), "months") <= 0 && moment(currentmonth,"YYYY/MM").diff(moment(lastmonth, "YYYY/MM"), "months") <= 0) {
          // let diff = moment(currentmonth,"YYYY/MM").diff(moment(firstmonth,"YYYY/MM"), "months");
          //
          // let currentmonthactivities = this.calendaractivities[diff];
          // this.mergeMonthActivities(currentmonthactivities, [task], update);

          // 解决数据所属日期跨月修改，原数据所属月对象不能被正常移除
          for (let monthactivities of this.calendaractivities) {
            this.mergeMonthActivities(monthactivities, [task], update);
          }
        }

        break;
      case "MiniTaskData" :
        // 转换成匹配对象类型
        let minitask: MiniTaskData = {} as MiniTaskData;
        Object.assign(minitask, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(minitask.evd, "YYYY/MM/DD").format("YYYY/MM");

        if (moment(firstmonth,"YYYY/MM").diff(moment(currentmonth, "YYYY/MM"), "months") <= 0 && moment(currentmonth,"YYYY/MM").diff(moment(lastmonth, "YYYY/MM"), "months") <= 0) {
          // let diff = moment(currentmonth, "YYYY/MM").diff(moment(firstmonth,"YYYY/MM"), "months");
          //
          // let currentmonthactivities = this.calendaractivities[diff];
          // this.mergeMonthActivities(currentmonthactivities, [minitask], update);

          // 解决数据所属日期跨月修改，原数据所属月对象不能被正常移除
          for (let monthactivities of this.calendaractivities) {
            this.mergeMonthActivities(monthactivities, [minitask], update);
          }
        }

        break;
      case "MemoData" :
        // 转换成匹配对象类型
        let memo: MemoData = {} as MemoData;
        Object.assign(memo, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(memo.sd, "YYYY/MM/DD").format("YYYY/MM");

        if (moment(firstmonth,"YYYY/MM").diff(moment(currentmonth, "YYYY/MM"), "months") <= 0 && moment(currentmonth,"YYYY/MM").diff(moment(lastmonth, "YYYY/MM"), "months") <= 0) {
          // let diff = moment(currentmonth,"YYYY/MM").diff(moment(firstmonth,"YYYY/MM"), "months");
          //
          // let currentmonthactivities = this.calendaractivities[diff];
          // this.mergeMonthActivities(currentmonthactivities, [memo], update);

          // 解决数据所属日期跨月修改，原数据所属月对象不能被正常移除
          for (let monthactivities of this.calendaractivities) {
            this.mergeMonthActivities(monthactivities, [memo], update);
          }
        }

        break;
      default :
        this.assertFail();    // 非法数据
    }
  }

  /**
   * 创建/更新日历
   *
   * @author leon_xi@163.com
   **/
  async savePlan(plan: PlanData): Promise<PlanData> {

    // 入参严格检查
    this.assertEmpty(plan);      // 对象不能为空
    this.assertEmpty(plan.jn);   // 名称不能为空
    this.assertEmpty(plan.jc);   // 颜色不能为空

    if (plan.ji) {
      // 更新
      let sqls: Array<any> = new Array<any>();

      plan.tb = SyncType.unsynch;

      let plandb: JhaTbl = new JhaTbl();
      Object.assign(plandb, plan);

      sqls.push(plandb.upTParam());

      // 保存日历成员
      if (plan.members && plan.members.length > 0) {
        for (let member of plan.members) {
          if (member.pari) {
            member.tb = SyncType.unsynch;
          } else {
            member.pari = this.util.getUuid();
            member.obt = ObjectType.CalendarPlan;
            member.obi = plan.ji;
            member.del = DelType.undel;
            member.tb = SyncType.unsynch;
          }

          let memberdb: ParTbl = new ParTbl();
          Object.assign(memberdb, member);

          sqls.push(memberdb.rpTParam());
        }
      } else {
        plan.members = plan.members || new Array<Member>();
      }

      await this.sqlExce.batExecSqlByParam(sqls);
    } else {

      // 新建
      let sqls: Array<any> = new Array<any>();

      plan.ji = this.util.getUuid();
      plan.jt = plan.jt || PlanType.PrivatePlan;  // 默认创建自定义日历
      plan.del = DelType.undel;
      plan.tb = SyncType.unsynch;

      let plandb: JhaTbl = new JhaTbl();
      Object.assign(plandb, plan);

      sqls.push(plandb.inTParam());

      // 保存日历成员
      if (plan.members && plan.members.length > 0) {
        for (let member of plan.members) {
          member.pari = this.util.getUuid();
          member.obt = ObjectType.CalendarPlan;
          member.obi = plan.ji;
          member.del = DelType.undel;
          member.tb = SyncType.unsynch;

          let memberdb: ParTbl = new ParTbl();
          Object.assign(memberdb, member);

          sqls.push(memberdb.inTParam());
        }
      } else {
        plan.members = plan.members || new Array<Member>();
      }

      await this.sqlExce.batExecSqlByParam(sqls);
    }

    this.emitService.emit(`mwxing.calendar.plans.changed`, plan);
    this.syncPrivatePlans([plan]);

    return plan;
  }

  /**
   * 更新日历颜色
   *
   * @author leon_xi@163.com
   **/
  async updatePlanColor(ji: string, jc: string) {

    this.assertEmpty(ji);   // 计划ID不能为空
    this.assertEmpty(jc);   // 颜色不能为空

    let plandb: JhaTbl = new JhaTbl();

    plandb.ji = ji;
    plandb.jc = jc;
    plandb.tb = SyncType.unsynch;

    await this.sqlExce.updateByParam(plandb);

    let plan: PlanData = await this.getPlan(ji, false);

    this.emitService.emit(`mwxing.calendar.plans.changed`, plan);

    return;
  }

  /**
   * 取得计划
   *
   * @author leon_xi@163.com
   **/
  async getPlan(ji: string, withchildren: boolean = true): Promise<PlanData> {

    this.assertEmpty(ji);   // 计划ID不能为空

    let plan: PlanData = {} as PlanData;
    let plandb: JhaTbl = new JhaTbl();

    let plansql: string = `select * from gtd_jha where ji = ? and del = ?`;

    plandb = await this.sqlExce.getExtOneByParam<JhaTbl>(plansql, [ji, DelType.undel]);

    // 计划不存在直接返回
    if (!plandb) {
      return null;
    }

    Object.assign(plan, plandb);

    // 取得计划共享成员
    let planmembersql: string = `select * from gtd_par where obt = ? and obi = ? and del = ?`;

    plan.members = await this.sqlExce.getExtLstByParam<Member>(planmembersql, [ObjectType.CalendarPlan, ji, DelType.undel]) || new Array<Member>();

    if (!withchildren) {
      return plan;
    }

    let params: Array<any> = new Array<any>();
    params.push(ji);

    // 检索可能的事件/备忘
    if (plan.jt == PlanType.CalendarPlan || plan.jt == PlanType.ActivityPlan) {
      let sql = `select * from gtd_jta where ji = ? and del <> '${DelType.del}'`;

      plan.items = await this.sqlExce.getExtLstByParam<PlanItemData>(sql, params);
    }

    if (plan.jt == PlanType.PrivatePlan) {
      let agendasql = `select ev.*,
                              ea.sd sd,
                              ea.st st,
                              ea.ed ed,
                              ea.et et,
                              ea.ct ct
                       from gtd_ev ev
                          left join gtd_ca ea on ea.evi = ev.evi
                       where ev.type = '${EventType.Agenda}' and ev.ji = ? and ev.del <> '${DelType.del}'`;

      let agendas: Array<AgendaData> = await this.sqlExce.getExtLstByParam<AgendaData>(agendasql, params);

      let tasksql = `select ev.*,
                            et.cs cs,
                            et.isrt isrt,
                            et.cd cd,
                            et.fd fd
                     from gtd_ev ev
                        left join gtd_t et on et.evi = ev.evi
                     where ev.type = '${EventType.Task}' and ev.ji = ? and ev.del <> '${DelType.del}'`;

      let tasks: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(tasksql, params);

      let minitasksql = `select *
                         from gtd_ev
                         where type = '${EventType.MiniTask}' and ji = ? and del <> '${DelType.del}'`;

      let minitasks: Array<MiniTaskData> = await this.sqlExce.getExtLstByParam<MiniTaskData>(minitasksql, params);

      let memosql = `select * from gtd_mom where ji = ? and del <> '${DelType.del}'`;

      let memos: Array<MemoData> = await this.sqlExce.getExtLstByParam<MemoData>(memosql, params);

      let merged: Array<AgendaData | TaskData | MiniTaskData | MemoData> = new Array<AgendaData | TaskData | MiniTaskData | MemoData>();

      merged = merged.concat(agendas);
      merged = merged.concat(tasks);
      merged = merged.concat(minitasks);
      merged = merged.concat(memos);

      plan.items = merged;
    }

    return plan;
  }

  /**
   * 取得删除日历SQL
   *
   * @author leon_xi@163.com
   **/
  removePlanSqls(ji: string, jt: PlanType, withchildren: boolean = true): Array<any> {

    this.assertEmpty(ji);   // id不能为空
    this.assertNull(jt);    // 计划类型不能为空

    let sqls: Array<any> = new Array<any>();

    // 同时删除日历项
    if (withchildren) {
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        let plandb: JhaTbl = new JhaTbl();
        plandb.ji = ji;
        plandb.jtd = "0";

        sqls.push(plandb.upTParam());

        let planitemdb: JtaTbl = new JtaTbl();
        planitemdb.ji = ji;
        planitemdb.del = DelType.del;

        sqls.push(planitemdb.upTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push([`update gtd_fj set del = ? where obt = ? and obi not in (select jti from gtd_jta where del <> ?);`, [DelType.del, ObjectType.Calendar, DelType.del]]);   // 附件表
        sqls.push([`delete from gtd_wa where obt = ? and obi not in (select jti from gtd_jta where del <> ?);`, [ObjectType.Calendar, DelType.del]]);    // 提醒表
        sqls.push([`update gtd_par set del = ? where obt = ? and obi not in (select jti from gtd_jta where del <> ?);`, [DelType.del, ObjectType.Calendar, DelType.del]]);    // 参与人表
        sqls.push([`delete from gtd_mrk where obt = ? and obi not in (select jti from gtd_jta where del <> ?);`, [ObjectType.Calendar, DelType.del]]);   // 标签表
      }

      if (jt == PlanType.PrivatePlan) {
        let plandb: JhaTbl = new JhaTbl();
        plandb.ji = ji;
        plandb.del = DelType.del;

        sqls.push(plandb.upTParam());

        let eventdb: EvTbl = new EvTbl();
        eventdb.ji = ji;
        eventdb.del = DelType.del;

        // 删除事件主表
        sqls.push(eventdb.upTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push([`delete from gtd_ca where evi not in (select evi from gtd_ev where del <> ?);`, [DelType.del]]);   // 日程表
        sqls.push([`delete from gtd_t where evi not in (select evi from gtd_ev where del <> ?);`, [DelType.del]]);   // 任务表

        sqls.push([`update gtd_fj set del = ? where obt = ? and obi not in (select evi from gtd_ev where del <> ?);`, [DelType.del, ObjectType.Event, DelType.del]]);   // 附件表
        sqls.push([`delete from gtd_wa where obt = ? and obi not in (select evi from gtd_ev where del <> ?);`, [ObjectType.Event, DelType.del]]);    // 提醒表
        sqls.push([`update gtd_par set del = ? where obt = ? and obi not in (select evi from gtd_ev where del <> ?);`, [DelType.del, ObjectType.Event, DelType.del]]);    // 参与人表
        sqls.push([`delete from gtd_mrk where obt = ? and obi not in (select evi from gtd_ev where del <> ?);`, [ObjectType.Event, DelType.del]]);   // 标签表

        let memodb: MomTbl = new MomTbl();
        memodb.ji = ji;

        // 删除备忘主表
        sqls.push(memodb.dTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push([`update gtd_fj set del = ? where obt = ? and obi not in (select moi from gtd_mom where del <> ?);`, [DelType.del, ObjectType.Memo, DelType.del]]);   // 附件表
        sqls.push([`delete from gtd_wa where obt = ? and obi not in (select moi from gtd_mom where del <> ?);`, [ObjectType.Memo, DelType.del]]);    // 提醒表
        sqls.push([`update gtd_par set del = ? where obt = ? and obi not in (select moi from gtd_mom where del <> ?);`, [DelType.del, ObjectType.Memo, DelType.del]]);    // 参与人表
        sqls.push([`delete from gtd_mrk where obt = ? and obi not in (select moi from gtd_mom where del <> ?);`, [ObjectType.Memo, DelType.del]]);   // 标签表
      }
    } else {
      // 不删除子元素，需要把子元素的计划ID更新为空/默认计划ID
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        let plandb: JhaTbl = new JhaTbl();
        plandb.ji = ji;
        plandb.jtd = "0";

        sqls.push(plandb.upTParam());

        // 更新日历项表计划ID
        sqls.push([`update gtd_jta set ji = ?, utt = ? where ji = ?`, ['', moment().unix(), ji]]);
      }

      if (jt == PlanType.PrivatePlan) {
        let plandb: JhaTbl = new JhaTbl();
        plandb.ji = ji;
        plandb.del = DelType.del;

        sqls.push(plandb.upTParam());

        // 更新事件主表
        sqls.push([`update gtd_ev set ji = ?, utt = ? where ji = ?`, ['', moment().unix(), ji]]);

        // 更新备忘主表
        sqls.push([`update gtd_mom set ji = ?, utt = ? where ji = ?`, ['', moment().unix(), ji]]);
      }
    }

    return sqls;
  }

  /**
   * 删除日历
   *
   * @author leon_xi@163.com
   **/
  // async removePlan(ji: string, jt: PlanType, withchildren: boolean = true) {
  //
  //   this.assertEmpty(ji);   // id不能为空
  //   this.assertNull(jt);    // 计划类型不能为空
  //
  //   let sqls: Array<any> = this.removePlanSqls(ji, jt, withchildren);
  //
  //   await this.sqlExce.batExecSqlByParam(sqls);
  //
  //   return;
  // }

  /**
   * 删除日历
   *
   * @author leon_xi@163.com
   **/
  async removePlan(plan: PlanData, withchildren: boolean = true): Promise<PlanData> {
    this.assertEmpty(plan);       // 计划不能为空
    this.assertEmpty(plan.ji);    // 计划ID不能为空
    this.assertEmpty(plan.jt);    // 计划类型不能为空

    let ji: string = plan.ji;
    let jt: string = plan.jt;

    let sqls: Array<any> = new Array<any>();

    // 公共日历 直接删除关联日历项
    if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
      plan.del = DelType.del;

      let jhadb: JhaTbl = new JhaTbl();
      Object.assign(jhadb, plan);

      sqls.push(jhadb.upTParam());

      let items: Array<PlanItemData> = new Array<PlanItemData>();

      let sql: string = `select * from gtd_jta where ji = ? and del = ?`;

      items = await this.sqlExce.getExtLstByParam<PlanItemData>(sql, [ji, DelType.undel]) || items;

      let removeditems: Array<PlanItemData> = new Array<PlanItemData>();

      // 存在日历项
      if (items.length > 0) {
        let removedjtas: Array<JtaTbl> = new Array<JtaTbl>();
        for (let item of items) {
          item.del = DelType.del;

          let jtadb: JtaTbl = new JtaTbl();
          Object.assign(jtadb, item);

          removeditems.push(item);
          removedjtas.push(jtadb);
        }

        let removesqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(removedjtas) || new Array<any>();

        for (let removesql of removesqls) {
          sqls.push(removesql);
        }
      }

      await this.sqlExce.batExecSqlByParam(sqls);

      this.emitService.emit(`mwxing.calendar.activities.changed`, removeditems);
      this.emitService.emit(`mwxing.calendar.plans.changed`, plan);
    }

    // 自定义日历
    if (jt == PlanType.PrivatePlan) {
      plan.del = DelType.del;
      plan.tb = SyncType.unsynch;

      let jhadb: JhaTbl = new JhaTbl();
      Object.assign(jhadb, plan);

      sqls.push(jhadb.upTParam());

      let updatedactivites: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData> = new Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>();

      // 同时删除关联日历项/事件/备忘
      if (withchildren) {
        // 关联日历项
        let items: Array<PlanItemData> = new Array<PlanItemData>();

        let itemsql: string = `select * from gtd_jta where ji = ? and del = ?`;

        items = await this.sqlExce.getExtLstByParam<PlanItemData>(itemsql, [ji, DelType.undel]) || items;

        // 存在日历项
        if (items.length > 0) {
          let removedjtas: Array<JtaTbl> = new Array<JtaTbl>();
          for (let item of items) {
            item.del = DelType.del;

            let jtadb: JtaTbl = new JtaTbl();
            Object.assign(jtadb, item);

            updatedactivites.push(item);
            removedjtas.push(jtadb);
          }

          let removesqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(removedjtas) || new Array<any>();

          for (let removesql of removesqls) {
            sqls.push(removesql);
          }
        }

        // 关联日程/任务/小任务
        let events: Array<EventData> = new Array<EventData>();

        let eventsql: string = `select * from gtd_ev where ji = ? and (rtevi is null or rtevi = '') and del = ?`;

        events = await this.sqlExce.getExtLstByParam<EventData>(eventsql, [ji, DelType.undel]) || events;

        // 存在事件
        for (let event of events) {
          let evi: string = event.evi;
          let type: string = event.type;

          if (type == EventType.Agenda) {
            let agenda: AgendaData = await this.eventService.getAgenda(evi);

            await this.eventService.removeAgenda(agenda, OperateType.FromSel);
          }

          if (type == EventType.Task) {
            let task: TaskData = await this.eventService.getTask(evi);

            await this.eventService.removeTask(task);
          }

          // 暂未实现删除功能
          // if (type == EventType.MiniTask) {
          //   let minitask: MiniTaskData = await this.eventService.getMiniTask(evi);
          //
          //   await this.eventService.removeMiniTask(minitask);
          // }
        }

        // 关联备忘
        let memos: Array<MemoData> = new Array<MemoData>();

        let memosql: string = `select * from gtd_mom where ji = ? and del = ?`;

        memos = await this.sqlExce.getExtLstByParam<MemoData>(memosql, [ji, DelType.undel]) || memos;

        // 存在事件
        if (memos.length > 0) {
          let removedmoms: Array<MomTbl> = new Array<MomTbl>();

          for (let memo of memos) {
            memo.del = DelType.del;

            let memodb: MomTbl = new MomTbl();
            Object.assign(memodb, memo);

            removedmoms.push(memodb);
            updatedactivites.push(memo);
          }

          let removesqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(removedmoms) || new Array<any>();

          for (let removesql of removesqls) {
            sqls.push(removesql);
          }
        }
      } else {
        // 关联日历项
        let items: Array<PlanItemData> = new Array<PlanItemData>();

        let itemsql: string = `select * from gtd_jta where ji = ? and del = ?`;

        items = await this.sqlExce.getExtLstByParam<PlanItemData>(itemsql, [ji, DelType.undel]) || items;

        // 存在日历项
        if (items.length > 0) {
          let removedjtas: Array<JtaTbl> = new Array<JtaTbl>();
          for (let item of items) {
            item.ji = "";

            let jtadb: JtaTbl = new JtaTbl();
            Object.assign(jtadb, item);

            updatedactivites.push(item);
            removedjtas.push(jtadb);
          }

          let updatesqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(removedjtas) || new Array<any>();

          for (let updatesql of updatesqls) {
            sqls.push(updatesql);
          }
        }

        // 关联日程/任务/小任务
        let events: Array<EventData> = new Array<EventData>();

        let eventsql: string = `select * from gtd_ev where ji = ? and (rtevi is null or rtevi = '') and del = ?`;

        events = await this.sqlExce.getExtLstByParam<EventData>(eventsql, [ji, DelType.undel]) || events;

        // 存在事件
        for (let event of events) {
          let evi: string = event.evi;
          let type: string = event.type;

          if (type == EventType.Agenda) {
            let agenda: AgendaData = await this.eventService.getAgenda(evi);

            let changed: AgendaData = {} as AgendaData;
            Object.assign(changed, agenda);

            changed.ji = "";

            await this.eventService.saveAgenda(changed, agenda, OperateType.FromSel);
          }

          if (type == EventType.Task) {
            let task: TaskData = await this.eventService.getTask(evi);

            let changed: TaskData = {} as TaskData;
            Object.assign(changed, task);

            changed.ji = "";

            await this.eventService.saveTask(changed);
          }

          // 暂未实现删除功能
          // if (type == EventType.MiniTask) {
          //   let minitask: MiniTaskData = await this.eventService.getMiniTask(evi);
          //
          //   await this.eventService.removeMiniTask(minitask);
          // }
        }

        // 关联备忘
        let memos: Array<MemoData> = new Array<MemoData>();

        let memosql: string = `select * from gtd_mom where ji = ? and del = ?`;

        memos = await this.sqlExce.getExtLstByParam<MemoData>(memosql, [ji, DelType.undel]) || memos;

        // 存在备忘
        if (memos.length > 0) {
          let removedmoms: Array<MomTbl> = new Array<MomTbl>();

          for (let memo of memos) {
            memo.ji = "";

            let memodb: MomTbl = new MomTbl();
            Object.assign(memodb, memo);

            removedmoms.push(memodb);
            updatedactivites.push(memo);
          }

          let updatesqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(removedmoms) || new Array<any>();

          for (let updatesql of updatesqls) {
            sqls.push(updatesql);
          }
        }
      }

      await this.sqlExce.batExecSqlByParam(sqls);

      this.emitService.emit(`mwxing.calendar.activities.changed`, updatedactivites);
      this.emitService.emit(`mwxing.calendar.plans.changed`, plan);
      this.syncPrivatePlans([plan]);
    }

    return plan;
  }

  /**
   * 根据日历项ID取得日历项
   *
   * @author leon_xi@163.com
   **/
  async getPlanItem(jti: string): Promise<PlanItemData> {
    this.assertEmpty(jti);       // 入参不能为空

    let planitemdb: JtaTbl = new JtaTbl();

    let sql: string = `select * from gtd_jta where jti = ? and del = ?`;

    planitemdb = await this.sqlExce.getExtOneByParam<JtaTbl>(sql, [jti, DelType.undel]);

    if (!planitemdb) return null;

    let planitem: PlanItemData = {} as PlanItemData;

    Object.assign(planitem, planitemdb);

    planitem.rtjson = generateRtJson(planitem.rtjson, planitem.rt);
    planitem.txjson = generateTxJson(planitem.txjson, planitem.tx);

    // 获取参与人
    let members: Array<Member> = new Array<Member>();

    let querymemberdb: ParTbl = new ParTbl();
    querymemberdb.obi = jti;
    querymemberdb.obt = ObjectType.Calendar;

    let memberdbs: Array<ParTbl> = await this.sqlExce.getLstByParam<ParTbl>(querymemberdb) || new Array<ParTbl>();

    for (let memberdb of memberdbs) {
      let member = {} as Member;
      Object.assign(member, memberdb);

      let fs: FsData = this.userConfig.GetOneBTbl(memberdb.pwi);

      this.assertEmpty(fs);   // 联系人不能为空

      Object.assign(member, fs);

      members.push(member);
    }

    planitem.members = members;

    return planitem;
  }

  /**
   * 根据日历项ID取得日历项
   *
   * @author leon_xi@163.com
   **/
  async findPlanItem(cond: PlanItemData): Promise<PlanItemData> {
    this.assertEmpty(cond);       // 入参不能为空

    let planitemdb: JtaTbl = new JtaTbl();
    Object.assign(planitemdb, cond);

    let planitems = await this.sqlExce.getLstByParam<JtaTbl>(planitemdb);

    if (!planitems || planitems.length <= 0) return null;

    planitemdb = planitems[0];    // 取第一条

    let planitem: PlanItemData = {} as PlanItemData;

    Object.assign(planitem, planitemdb);

    planitem.rtjson = generateRtJson(planitem.rtjson, planitem.rt);
    planitem.txjson = generateTxJson(planitem.txjson, planitem.tx);

    // 获取参与人
    let members: Array<Member> = new Array<Member>();

    let querymemberdb: ParTbl = new ParTbl();
    querymemberdb.obi = planitem.jti;
    querymemberdb.obt = ObjectType.Calendar;

    let memberdbs: Array<ParTbl> = await this.sqlExce.getLstByParam<ParTbl>(querymemberdb) || new Array<ParTbl>();

    for (let memberdb of memberdbs) {
      let member = {} as Member;
      Object.assign(member, memberdb);

      let fs: FsData = this.userConfig.GetOneBTbl(memberdb.pwi);

      this.assertEmpty(fs);   // 联系人不能为空

      Object.assign(member, fs);

      members.push(member);
    }

    planitem.members = members;

    return planitem;
  }

  /**
   * 取得两个日历项变化的字段名成数组
   *
   * @param {PlanItemData} one
   * @param {PlanItemData} another
   * @returns {Array<string>}
   *
   * @author leon_xi@163.com
   */
  changedPlanItemFields(one: PlanItemData, another: PlanItemData): Array<string> {
    assertEmpty(one);   // 入参不能为空
    assertEmpty(another);   // 入参不能为空

    let changed: Array<string> = new Array<string>();

    for (let key of Object.keys(one)) {
      if (["wtt", "utt", "rts", "txs"].indexOf(key) >= 0) continue;   // 忽略字段

      if (one.hasOwnProperty(key)) {
        let value = one[key];

        // 如果两个值都为空, 继续
        if (!value && !another[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !another[key]) {
          changed.push(key);
          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && another[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(another[key]));

            if (!(onert.sameWith(anotherrt))) {
              changed.push(key);
              continue;
            }
          }

          if (typeof value === 'string' && value != "" && another[key] != "" && key == "tx") {
            let onetx: TxJson = new TxJson();
            Object.assign(onetx, JSON.parse(value));

            let anothertx: TxJson = new TxJson();
            Object.assign(anothertx, JSON.parse(another[key]));

            if (!(onetx.sameWith(anothertx))) {
              changed.push(key);
              continue;
            }
          }

          if (value != another[key]) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, another[key]);

          if (!(onert.sameWith(anotherrt))) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof TxJson) {
          let onetx: TxJson = new TxJson();
          Object.assign(onetx, value);

          let anothertx: TxJson = new TxJson();
          Object.assign(anothertx, another[key]);

          if (!(onetx.sameWith(anothertx))) {
            changed.push(key);
            continue;
          }
        }

        if (value instanceof Array) {
          if (value.length != another[key].length) {
            changed.push(key);
            continue;
          }

          if (value.length > 0) {
            if (value[0] && value[0].hasOwnProperty("pari") && another[key][0] && another[key][0].hasOwnProperty("pari")) {
              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.pari > b.pari) return -1;
                if (a.pari < b.pari) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) {
                changed.push(key);
                continue;
              }

            } else if (value[0] instanceof FjTbl && another[key][0] instanceof FjTbl) {

              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.fji > b.fji) return -1;
                if (a.fji < b.fji) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) {
                changed.push(key);
                continue;
              }

            } else {
              continue; // 非比较字段，忽略
            }
          }
        }
      }
    }

    return changed;
  }

  /**
   * 判断两个日历项是否相同
   *
   * @param {PlanItemData} one
   * @param {PlanItemData} another
   * @returns {boolean}
   *
   * @author leon_xi@163.com
   */
  isSamePlanItem(one: PlanItemData, another: PlanItemData): boolean {
    if (!one || !another) return false;

    for (let key of Object.keys(one)) {
      if (["wtt", "utt", "rts", "txs"].indexOf(key) >= 0) continue;   // 忽略字段

      if (one.hasOwnProperty(key)) {
        let value = one[key];

        // 如果两个值都为空, 继续
        if (!value && !another[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !another[key]) return false;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && another[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(another[key]));

            if (!(onert.sameWith(anotherrt))) return false;

            continue;
          }

          if (typeof value === 'string' && value != "" && another[key] != "" && key == "tx") {
            let onetx: TxJson = new TxJson();
            Object.assign(onetx, JSON.parse(value));

            let anothertx: TxJson = new TxJson();
            Object.assign(anothertx, JSON.parse(another[key]));

            if (!(onetx.sameWith(anothertx))) return false;

            continue;
          }

          if (value != another[key]) return false;
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, another[key]);

          if (!(onert.sameWith(anotherrt))) return false;

          continue;
        }

        if (value instanceof TxJson) {
          let onetx: TxJson = new TxJson();
          Object.assign(onetx, value);

          let anothertx: TxJson = new TxJson();
          Object.assign(anothertx, another[key]);

          if (!(onetx.sameWith(anothertx))) return false;

          continue;
        }

        if (value instanceof Array) {
          if (value.length != another[key].length) return false;

          if (value.length > 0) {
            if (value[0] && value[0].hasOwnProperty("pari") && another[key][0] && another[key][0].hasOwnProperty("pari")) {
              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.pari > b.pari) return -1;
                if (a.pari < b.pari) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else if (value[0] instanceof FjTbl && another[key][0] instanceof FjTbl) {

              let compare = value.concat(another[key]);

              compare.sort((a, b) => {
                if (a.fji > b.fji) return -1;
                if (a.fji < b.fji) return 1;
                return 0;
              });

              let result = compare.reduce((target, val) => {
                if (!target) {
                  target = val;
                } else {
                  if (!val) {
                    target = {};
                  } else {
                    let issame: boolean = true;

                    for (let key of Object.keys(target)) {
                      if (["wtt", "utt"].indexOf(key) >= 0) continue;   // 忽略字段

                      if (target.hasOwnProperty(key)) {
                        let value = target[key];

                        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                          if (value != val[key]) issame = false;
                        }
                      }
                    }

                    if (issame) {
                      target = null;
                    } else {
                      target = {};
                    }
                  }
                }

                return target;
              }, null);

              if (result && result.isEmpty()) return false;

            } else {
              return false;
            }
          }
        }

      }
    }

    return true;
  }

  /**
   * 判断日历项修改是否需要确认
   * 当前日历项修改 还是 将来日历项全部修改
   *
   * @param {PlanItemData} before
   * @param {PlanItemData} after
   * @returns {boolean}
   */
  hasPlanItemModifyConfirm(before: PlanItemData, after: PlanItemData): ConfirmType {
    assertEmpty(before);  // 入参不能为空
    assertEmpty(after);  // 入参不能为空

    let confirm: ConfirmType = ConfirmType.None;

    // 确认修改前日程是否重复
    if (before.rfg != RepeatFlag.Repeat) return confirm;

    for (let key of Object.keys(before)) {
      if (["sd", "st", "jtn", "rt", "rtjson"].indexOf(key) >= 0) {   // 比较字段
        let value = before[key];

        // 如果两个值都为空, 继续
        if (!value && !after[key]) {
          continue;
        }

        // 如果one的值为空, 不一致
        if (!value || !after[key]) {

          if (confirm == ConfirmType.None) {
            confirm = ConfirmType.CurrentOrFutureAll;
          } else if (confirm == ConfirmType.All) {
            confirm = ConfirmType.FutureAll;
          }

          continue;
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          if (typeof value === 'string' && value != "" && after[key] != "" && key == "rt") {
            let onert: RtJson = new RtJson();
            Object.assign(onert, JSON.parse(value));

            let anotherrt: RtJson = new RtJson();
            Object.assign(anotherrt, JSON.parse(after[key]));

            if (!(onert.sameWith(anotherrt))) {

              if (confirm == ConfirmType.None) {
                confirm = ConfirmType.All;
              } else if (confirm == ConfirmType.CurrentOrFutureAll) {
                confirm = ConfirmType.FutureAll;
              }

            }

            continue;
          }

          if (value != after[key]) {
            if (confirm == ConfirmType.None) {
              confirm = ConfirmType.CurrentOrFutureAll;
            } else if (confirm == ConfirmType.All) {
              confirm = ConfirmType.FutureAll;
            }

            continue;
          }
        }

        if (value instanceof RtJson) {
          let onert: RtJson = new RtJson();
          Object.assign(onert, value);

          let anotherrt: RtJson = new RtJson();
          Object.assign(anotherrt, after[key]);

          if (!(onert.sameWith(anotherrt))) {
            if (confirm == ConfirmType.None) {
              confirm = ConfirmType.All;
            } else if (confirm == ConfirmType.CurrentOrFutureAll) {
              confirm = ConfirmType.FutureAll;
            }
          }

          continue;
        }
      }
    }

    return confirm;
  }

  checksumPlanItem(item: PlanItemData): string {
    return "";
  }

  /**
   * 创建/更新日历项
   *
   * @author leon_xi@163.com
   **/
  async savePlanItem(item: PlanItemData, origin: PlanItemData = null, modiType: OperateType = OperateType.Non): Promise<Array<PlanItemData>> {

    this.assertEmpty(item);       // 入参不能为空
    this.assertEmpty(item.sd);    // 日历项所属日期不能为空
    this.assertEmpty(item.jtn);   // 日历项名称不能为空

    let items: Array<PlanItemData> = new Array<PlanItemData>();

    if (item.jti) {
      this.assertEmpty(origin);   // 修改日历项原日历项不能为空
      this.assertEmpty(modiType); // 修改日历项修改类型不能为空

      // 获取改变字段
      let changed: Array<string> = this.changedPlanItemFields(item, origin);

      if (changed && changed.length > 0) {
        // 存在修改
        let rtjson: RtJson = generateRtJson(item.rtjson, item.rt);
        let txjson: TxJson = generateTxJson(item.txjson, item.tx);

        if (origin.rfg == RepeatFlag.NonRepeat) {
          // 修改前为非重复日历项
          if (rtjson.cycletype == CycleType.close) {
            // 修改为非重复日历项
            item.rtjson = rtjson;
            item.rt = JSON.stringify(rtjson);
            item.rts = rtjson.text();

            item.txjson = txjson;
            item.tx = JSON.stringify(txjson);
            item.txs = txjson.text(item.sd,item.st);

            let members: Array<Member>= item.members || new Array<Member>();
            let memberdbs: Array<ParTbl> = new Array<ParTbl>();

            // 保存参与人
            for (let member of members) {
              if (!member.pari) { // 新增参与人
                member.pari = this.util.getUuid();
                member.obt = ObjectType.Calendar;
                member.obi = item.jti;

                member.sdt = MemberShareState.SendWait;
                member.tb = SyncType.unsynch;
                member.del = DelType.undel;
              }

              let memberdb: ParTbl = new ParTbl();
              Object.assign(memberdb, member);

              memberdbs.push(memberdb);
            }

            let sqls: Array<any> = new Array<any>();

            if (memberdbs.length > 0) {
              sqls = this.sqlExce.getFastSaveSqlByParam(memberdbs) || new Array<any>();
            }

            item.members = members;

            let planitemdb: JtaTbl = new JtaTbl();
            Object.assign(planitemdb, item);

            planitemdb.tb = SyncType.unsynch;
            sqls.push(planitemdb.rpTParam());

            await this.sqlExce.batExecSqlByParam(sqls);

            Object.assign(item, planitemdb);

            items.push(item);
          } else {
            // 修改为重复日历项(删除后创建)
            let sqls: Array<any> = new Array<any>();

            // 删除当前日历项
            origin.del = DelType.del;
            origin.tb = SyncType.unsynch;

            let planitemdb: JtaTbl = new JtaTbl();
            Object.assign(planitemdb, origin);

            sqls.push(planitemdb.upTParam());

            // 创建新的重复日历项
            let anewitem: PlanItemData = {} as PlanItemData;
            Object.assign(anewitem, item);

            // 重置日历项ID
            anewitem.jti = "";
            anewitem.rtjti = "";

            this.newPlanitem(anewitem, (newitems, newsqls) => {
              for (let newitem of newitems) {
                items.push(newitem);
              }

              for (let sql of newsqls) {
                sqls.push(sql);
              }
            });

            // 删除日历项放在返回日历项的最后
            items.push(cloneObject<PlanItemData>(origin));

            await this.sqlExce.batExecSqlByParam(sqls);
          }
        } else {
          // 修改前为重复日历项

          let confirm: ConfirmType = this.hasPlanItemModifyConfirm(origin, item);

          // 只修改重复 没有确认 修改所有的重复日历项
          // 只修改重复以外的内容 确认 选择当前/将来所有的重复日历项
          // 同时修改重复和其它内容 确认 选择将来所有的重复日历项
          switch (confirm) {
            case ConfirmType.None:                // 只修改当前日历项
              // 修改当前日历项
              item.rtjson = rtjson;
              item.rt = JSON.stringify(rtjson);
              item.rts = rtjson.text();

              item.txjson = txjson;
              item.tx = JSON.stringify(txjson);
              item.txs = txjson.text(item.sd,item.st);

              let planitemdb: JtaTbl = new JtaTbl();
              Object.assign(planitemdb, item);

              planitemdb.tb = SyncType.unsynch;

              await this.sqlExce.updateByParam(planitemdb);

              Object.assign(item, planitemdb);

              items.push(item);
              break;
            case ConfirmType.CurrentOrFutureAll:  // 修改当前及将来所有日历项
              // 修改当前/将来所有日历项
              this.assertEqual(modiType, OperateType.Non);  // 入参不能为Non

              // 之修改当前日历项
              if (modiType == OperateType.OnlySel) {
                let sqls: Array<any> = new Array<any>();

                item.rfg = RepeatFlag.RepeatToOnly;

                // 关闭重复
                item.rtjson = new RtJson();
                item.rt = JSON.stringify(item.rtjson);
                item.rts = item.rtjson.text();

                item.txjson = txjson;
                item.tx = JSON.stringify(txjson);
                item.txs = txjson.text(item.sd,item.st);

                item.tb = SyncType.unsynch;

                let planitemdb: JtaTbl = new JtaTbl();
                Object.assign(planitemdb, item);

                sqls.push(planitemdb.upTParam());

                items.push(item);

                // 如果是重复第一条（父记录）,重构剩余重复日历项
                if (!origin.rtjti || origin.rtjti == "") {
                  let rtjti: string = origin.jti;

                  let fetchFromSel: string = `select *
                                              from gtd_jta
                                              where rtjti = ?1
                                                and del <> ?2
                                              order by sd asc`;

                  let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, DelType.del]) || new Array<PlanItemData>();

                  let originitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

                  rtjti = "";

                  for (let originitem of originitems) {
                    originitem.tb = SyncType.unsynch;
                    originitem.rtjti = rtjti;

                    if (rtjti == "") {
                      rtjti = originitem.jti;
                    }

                    let planitemdb: JtaTbl = new JtaTbl();
                    Object.assign(planitemdb, originitem);

                    items.push(originitem);
                    originitemsdb.push(planitemdb);
                  }

                  let originitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(originitemsdb) || new Array<any>();

                  for (let originitemsql of originitemssqls) {
                    sqls.push(originitemsql);
                  }
                }

                await this.sqlExce.batExecSqlByParam(sqls);
              }

              // 修改当前及以后所有日历项
              if (modiType == OperateType.FromSel) {
                let sqls: Array<any> = new Array<any>();

                // 创建新的重复日历项
                let anewitem: PlanItemData = {} as PlanItemData;
                Object.assign(anewitem, item);

                // 重置日历项ID
                anewitem.jti = "";
                anewitem.rtjti = "";

                this.newPlanitem(anewitem, (newitems, newsqls) => {
                  for (let newitem of newitems) {
                    items.push(newitem);
                  }

                  for (let sql of newsqls) {
                    sqls.push(sql);
                  }
                });

                // 删除将来所有重复日历项
                let rtjti: string = origin.rtjti? origin.rtjti : origin.jti;

                let fetchFromSel: string = `select *
                                            from gtd_jta
                                            where (jti = ?1 or rtjti = ?1)
                                              and rfg = ?2
                                              and date(replace(sd, '/', '-')) >= date(replace(?3, '/', '-'))
                                              and del <> ?4
                                            order by sd asc`;

                let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, RepeatFlag.Repeat, origin.sd, DelType.del]) || new Array<PlanItemData>();

                let originitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

                for (let originitem of originitems) {
                  originitem.del = DelType.del;
                  originitem.tb = SyncType.unsynch;

                  let planitemdb: JtaTbl = new JtaTbl();
                  Object.assign(planitemdb, originitem);

                  items.push(originitem);
                  originitemsdb.push(planitemdb);
                }

                let originitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(originitemsdb) || new Array<any>();

                for (let originitemsql of originitemssqls) {
                  sqls.unshift(originitemsql);
                }

                // 执行SQL
                await this.sqlExce.batExecSqlByParam(sqls);
              }
              break;
            case ConfirmType.FutureAll:           // 修改将来所有日历项
              // 修改将来所有日历项
              this.assertNotEqual(modiType, OperateType.FromSel);  // 入参不能为FromSel以外

              let futureallsqls: Array<any> = new Array<any>();

              // 创建新的重复日历项
              let bnewitem: PlanItemData = {} as PlanItemData;
              Object.assign(bnewitem, item);

              // 重置日历项ID
              bnewitem.jti = "";
              bnewitem.rtjti = "";

              this.newPlanitem(bnewitem, (newitems, newsqls) => {
                for (let newitem of newitems) {
                  items.push(newitem);
                }

                for (let sql of newsqls) {
                  futureallsqls.push(sql);
                }
              });

              // 删除将来所有重复日历项
              let futureallrtjti: string = origin.rtjti? origin.rtjti : origin.jti;

              let fetchFromSel: string = `select *
                                          from gtd_jta
                                          where (jti = ?1 or rtjti = ?1)
                                            and rfg = ?2
                                            and date(replace(sd, '/', '-')) >= date(replace(?3, '/', '-'))
                                            and del <> ?4
                                          order by sd asc`;

              let futurealloriginitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [futureallrtjti, RepeatFlag.Repeat, origin.sd, DelType.del]) || new Array<PlanItemData>();

              let futurealloriginitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

              for (let originitem of futurealloriginitems) {
                originitem.del = DelType.del;
                originitem.tb = SyncType.unsynch;

                let planitemdb: JtaTbl = new JtaTbl();
                Object.assign(planitemdb, originitem);

                items.push(originitem);
                futurealloriginitemsdb.push(planitemdb);
              }

              let futurealloriginitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(futurealloriginitemsdb) || new Array<any>();

              for (let originitemsql of futurealloriginitemssqls) {
                futureallsqls.unshift(originitemsql);
              }

              // 执行SQL
              await this.sqlExce.batExecSqlByParam(futureallsqls);

              break;
            case ConfirmType.All:                 // 修改所有日历项
              let allsqls: Array<any> = new Array<any>();

              // 查询原有重复日历项
              let allrtjti: string = origin.rtjti? origin.rtjti : origin.jti;

              let fetchAll: string = `select *
                                          from gtd_jta
                                          where (jti = ?1 or rtjti = ?1)
                                            and rfg = ?2
                                            and del <> ?3
                                          order by sd asc`;

              let alloriginitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchAll, [allrtjti, RepeatFlag.Repeat, DelType.del]) || new Array<PlanItemData>();

              // 创建新的重复日历项
              let cnewitem: PlanItemData = {} as PlanItemData;
              Object.assign(cnewitem, item);

              // 重置日历项ID,开始日期
              cnewitem.jti = "";
              cnewitem.rtjti = "";
              cnewitem.sd = alloriginitems[0].sd;

              this.newPlanitem(cnewitem, (newitems, newsqls) => {
                for (let newitem of newitems) {
                  items.push(newitem);
                }

                for (let sql of newsqls) {
                  allsqls.push(sql);
                }
              });

              // 删除将来所有重复日历项
              let alloriginitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

              for (let originitem of alloriginitems) {
                originitem.del = DelType.del;
                originitem.tb = SyncType.unsynch;

                let planitemdb: JtaTbl = new JtaTbl();
                Object.assign(planitemdb, originitem);

                items.push(originitem);
                alloriginitemsdb.push(planitemdb);
              }

              let alloriginitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(alloriginitemsdb) || new Array<any>();

              for (let originitemsql of alloriginitemssqls) {
                allsqls.unshift(originitemsql);
              }

              // 执行SQL
              await this.sqlExce.batExecSqlByParam(allsqls);

              break;
            default:
              assertFail();
          } // End of switch
        }
      } else {
        // 没有修改
        items.push(item);
      }
    } else {
      // 新建
      let sqls: Array<any> = new Array<any>();

      this.newPlanitem(item, (newitems, newsqls) => {
        for (let newitem of newitems) {
          items.push(newitem);
        }

        for (let sql of newsqls) {
          sqls.push(sql);
        }
      });

      // 执行创建SQL
      await this.sqlExce.batExecSqlByParam(sqls);
    }

    this.emitService.emit("mwxing.calendar.activities.changed", items);
    this.syncPlanItems(items);

    return items;
  }

  private newPlanitem(item: PlanItemData, callback: (items, sqls) => void) {
    this.assertEmpty(item);           // 入参不能为空
    this.assertEmpty(item.sd);        // 日历项所属日期不能为空
    this.assertEmpty(item.jtn);       // 日历项名称不能为空

    this.assertNotEmpty(item.jti);    // 日历项ID不能有值
    this.assertNotEmpty(item.rtjti);  // 重复日历项ID不能有值

    // 日历项类型默认活动
    if (!item.jtt) {
      item.jtt = PlanItemType.Activity;
    }

    // 自定义日历项
    if (!item.jtc) {
      item.jtc = SelfDefineType.Define;
    }

    let items: Array<PlanItemData> = new Array<PlanItemData>();
    let itemdbs: Array<JtaTbl> = new Array<JtaTbl>();
    let members: Array<Member> = item.members || new Array<Member>();
    let memberdbs: Array<ParTbl> = new Array<ParTbl>();

    let rtjson: RtJson = generateRtJson(item.rtjson, item.rt);
    let txjson: TxJson = generateTxJson(item.txjson, item.tx);

    let rtjti: string = "";

    rtjson.each(item.sd, (day) => {
      let newitem: PlanItemData = {} as PlanItemData;
      Object.assign(newitem, item);

      newitem.jti = this.util.getUuid();
      newitem.sd = day;
      newitem.ui = UserConfig.account.id;

      if (rtjson.cycletype != CycleType.close) {
        // 重复标志
        newitem.rfg = RepeatFlag.Repeat;

        if (rtjti != "") {
          newitem.rtjti = rtjti;
        }
      } else {
        // 非重复标志
        newitem.rfg = RepeatFlag.NonRepeat;
      }

      if (!rtjti || rtjti == "") {
        // 保存参与人
        for (let member of members) {
          member.pari = this.util.getUuid();
          member.obt = ObjectType.Calendar;
          member.obi = newitem.jti;

          member.sdt = MemberShareState.SendWait;
          member.tb = SyncType.unsynch;
          member.del = DelType.undel;

          let memberdb: ParTbl = new ParTbl();
          Object.assign(memberdb, member);

          memberdbs.push(memberdb);
        }

        newitem.members = members;
      }

      newitem.rtjson = rtjson;
      newitem.rt = JSON.stringify(rtjson);
      newitem.rts = rtjson.text();

      newitem.txjson = txjson;
      newitem.tx = JSON.stringify(txjson);


      newitem.st = !newitem.st ? moment().format('HH:mm') : newitem.st;
      newitem.txs = txjson.text(newitem.sd,newitem.st);

      newitem.pn = !newitem.pn ? 0 : newitem.pn;
      newitem.md = !newitem.md ? ModiPower.enable : newitem.md;
      newitem.iv = !newitem.iv ? InvitePowr.enable : newitem.iv;

      newitem.tb = SyncType.unsynch;
      newitem.del = DelType.undel;

      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, newitem);

      itemdbs.push(planitemdb);
      items.push(newitem);

      if (rtjti == "" && rtjson.cycletype != CycleType.close) {
        rtjti = newitem.jti;
      }
    });

    let sqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(itemdbs) || new Array<any>();
    let membersqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(memberdbs) || new Array<any>();

    for (let membersql of membersqls) {
      sqls.push(membersql);
    }

    callback(items, sqls);

    return;
  }

  /**
   * 删除日历项
   *
   * @author leon_xi@163.com
   **/
  async removePlanItem(origin: PlanItemData, modiType: OperateType = OperateType.Non): Promise<Array<PlanItemData>> {

    this.assertEmpty(origin);    // 入参不能为空
    this.assertEmpty(modiType);  // 入参不能为空

    let items: Array<PlanItemData> = new Array<PlanItemData>();
    let sqls: Array<any> = new Array<any>();
    let itemsid: Array<string> = new Array<string>();

    if (origin.rfg == RepeatFlag.Repeat) {  // 重复日历项
      this.assertEqual(modiType, OperateType.Non);    // 入参不能为Non

      // 只删除当前选择日历项
      if (modiType == OperateType.OnlySel) {
        // 删除当前日历项
        origin.del = DelType.del;
        origin.tb = SyncType.unsynch;

        let planitemdb: JtaTbl = new JtaTbl();
        Object.assign(planitemdb, origin);

        sqls.push(planitemdb.upTParam());

        itemsid.push(origin.jti);
        items.push(origin);

        // 删除第一条（父记录）,重构剩余重复日历项
        if (!origin.rtjti || origin.rtjti == "") {
          let rtjti: string = origin.jti;

          let fetchFromSel: string = `select *
                                      from gtd_jta
                                      where rtjti = ?1
                                        and (rfg = ?2 or rfg = ?3)
                                        and del <> ?4
                                      order by sd asc`;

          let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, RepeatFlag.Repeat, RepeatFlag.RepeatToOnly, DelType.del]) || new Array<PlanItemData>();

          let originitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

          rtjti = "";

          for (let originitem of originitems) {
            originitem.tb = SyncType.unsynch;
            originitem.rtjti = rtjti;

            if (rtjti == "") {
              rtjti = originitem.jti;
            }

            let planitemdb: JtaTbl = new JtaTbl();
            Object.assign(planitemdb, originitem);

            items.push(originitem);
            originitemsdb.push(planitemdb);
          }

          let originitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(originitemsdb) || new Array<any>();

          for (let originitemsql of originitemssqls) {
            sqls.push(originitemsql);
          }
        }
      }

      // 删除当前选择以及将来所有日历项
      if (modiType == OperateType.FromSel) {
        // 删除将来所有重复日历项
        let rtjti: string = origin.rtjti? origin.rtjti : origin.jti;

        let fetchFromSel: string = `select *
                                    from gtd_jta
                                    where (jti = ?1 or rtjti = ?1)
                                      and (rfg = ?2 or rfg = ?3)
                                      and date(replace(sd, '/', '-')) >= date(replace(?4, '/', '-'))
                                      and del <> ?5
                                    order by sd asc`;

        let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, RepeatFlag.Repeat, RepeatFlag.RepeatToOnly, origin.sd, DelType.del]) || new Array<PlanItemData>();

        let originitemsdb: Array<JtaTbl> = new Array<JtaTbl>();

        for (let originitem of originitems) {
          originitem.del = DelType.del;
          originitem.tb = SyncType.unsynch;

          let planitemdb: JtaTbl = new JtaTbl();
          Object.assign(planitemdb, originitem);

          itemsid.push(originitem.jti);
          items.push(originitem);
          originitemsdb.push(planitemdb);
        }

        let originitemssqls: Array<any> = this.sqlExce.getFastSaveSqlByParam(originitemsdb) || new Array<any>();

        for (let originitemsql of originitemssqls) {
          sqls.push(originitemsql);
        }
      }
    } else {  // 非重复 或 重复修改为非重复
      // 删除当前日历项
      origin.del = DelType.del;
      origin.tb = SyncType.unsynch;

      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, origin);

      sqls.push(planitemdb.upTParam());

      itemsid.push(origin.jti);
      items.push(origin);
    }

    // 设置关联数据删除标志
    sqls.push([`update gtd_par set del = ?, tb = ? where obt = ? and obi in ('` + itemsid.join(`', '`) + `')`, [DelType.del, SyncType.unsynch, ObjectType.Calendar]]);
    sqls.push([`update gtd_fj set del = ?, tb = ? where obt = ? and obi in ('` + itemsid.join(`', '`) + `')`, [DelType.del, SyncType.unsynch, ObjectType.Calendar]]);
    sqls.push([`delete from gtd_wa where obt = ? and obi in ('` + itemsid.join(`', '`) + `')`, [ObjectType.Calendar]]);    // 提醒表
    sqls.push([`delete from gtd_mrk where obt = ? and obi in ('` + itemsid.join(`', '`) + `')`, [ObjectType.Calendar]]);   // 标签表

    // 执行SQL
    await this.sqlExce.batExecSqlByParam(sqls);

    this.emitService.emit(`mwxing.calendar.activities.changed`, items);
    this.syncPlanItems(items);

    return items;
  }

  async getExchangeActivitySummary(phoneno: string): Promise<ExchangeSummaryData> {
    assertEmpty(phoneno);   // 入参不能为空

    let exchanges = await this.fetchExchangeActivitySummary([phoneno]);

    if (!exchanges || exchanges.length <= 0) {
      return new ExchangeSummaryData(phoneno);
    } else {
      return exchanges[0];
    }
  }

  /**
   * 取得指定手机号交换数据概要
   * 包括 活动和日历项
   *
   * @author leon_xi@163.com
   **/
  async fetchExchangeActivitySummary(friends: Array<string> = new Array<string>()): Promise<Array<ExchangeSummaryData>> {
    assertEmpty(friends);               // 入参不能为空
    assertEqual(friends.length, 0);  // 入参不能为空数组

    let exchangesummarysql: string = `select activitycount.phone,
                                             activitycount.sendactivities,
                                             activitycount.receivedactivities,
                                             planitemcount.sendplanitems,
                                             planitemcount.receivedplanitems
                                      from
                                      (select send.phone, ifnull(send.sendactivities, 0) sendactivities, ifnull(receive.receivedactivities, 0) receivedactivities
                                      from
                                      (select parbev.phone, count(parbev.evi) sendactivities
                                        from
                                        (select distinct parb.phone phone, ev.evi evi, ev.del del
                                        from
                                        (select par.pwi pwi, par.del del, par.obt obt, par.obi obi, b.rc phone
                                        from gtd_par par
                                        left join gtd_b b
                                        on b.pwi = par.pwi) parb
                                        left join gtd_ev ev
                                        on (ifnull(ev.ui, '') = ?1 or ifnull(ev.ui, '') = '') and parb.del <> ?2 and parb.obt = ?3 and parb.obi = ev.evi) parbev
                                        where parbev.phone in ('${friends.join(`', '`)}')
                                      group by parbev.phone) send
                                      left join
                                      (select evb.phone, count(evb.evi) receivedactivities
                                        from
                                        (select b.rc phone, ev.ui ui, ev.evi evi, ev.del del
                                        from gtd_ev ev
                                        left join gtd_b b
                                        on ev.del <> ?2 and b.ui = ev.ui) evb
                                        where evb.phone in ('${friends.join(`', '`)}')
                                      group by evb.phone) receive
                                      on receive.phone = send.phone) activitycount
                                      left join
                                      (select send.phone, ifnull(send.sendplanitems, 0) sendplanitems, ifnull(receive.receivedplanitems, 0) receivedplanitems
                                      from
                                      (select parbjta.phone, count(parbjta.jti) sendplanitems
                                        from
                                        (select distinct parb.phone phone, jta.jti jti, jta.del del
                                        from
                                        (select par.pwi pwi, par.del del, par.obt obt, par.obi obi, b.rc phone
                                        from gtd_par par
                                        left join gtd_b b
                                        on b.pwi = par.pwi) parb
                                        left join gtd_jta jta
                                        on (ifnull(jta.ui, '') = ?1 or ifnull(jta.ui, '') = '') and parb.del <> ?2 and parb.obt = ?4 and parb.obi = jta.jti) parbjta
                                        where parbjta.phone in ('${friends.join(`', '`)}')
                                      group by parbjta.phone) send
                                      left join
                                      (select jtab.phone, count(jtab.jti) receivedplanitems
                                        from
                                        (select b.rc phone, jta.ui ui, jta.jti jti, jta.del del
                                        from gtd_jta jta
                                        left join gtd_b b
                                        on jta.del <> ?2 and b.ui = jta.ui) jtab
                                        where jtab.phone in ('${friends.join(`', '`)}')
                                      group by jtab.phone) receive
                                      on receive.phone = send.phone) planitemcount
                                      on planitemcount.phone = activitycount.phone`;

    let exchangesummarys: Array<ExchangeSummaryData> = await this.sqlExce.getExtLstByParam<ExchangeSummaryData>(exchangesummarysql,
        [UserConfig.account.id, DelType.del, ObjectType.Event, ObjectType.Calendar]) || new Array<ExchangeSummaryData>();

    return exchangesummarys;
  }

  /**
   * 取得所有日历概要
   * 包括 自定义日历/冥王星预定义日历
   * 结果根据类型正序 创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async fetchAllPlansSummary(jts:Array<PlanType> = []): Promise<Array<PlanSummaryData>> {

    let sql: string = `select jha.*, ifnull(events.eventscount, 0) eventscount, ifnull(memos.memoscount, 0) memoscount, ifnull(items.itemscount, 0) itemscount
                    from gtd_jha jha
                    left join
                    (select ev.ji ji, count(*) eventscount
                      from gtd_ev ev
                      where ev.del <> 'del' and ev.ji in (select ji from gtd_jha where del <> 'del')
                      group by ev.ji) events
                    on jha.ji = events.ji
                    left join
                    (select mom.ji ji, count(*) memoscount
                      from gtd_mom mom
                      where mom.del <> 'del' and mom.ji in (select ji from gtd_jha where del <> 'del')
                      group by mom.ji) memos
                    on jha.ji = memos.ji
                    left join
                    (select jta.ji ji, count(*) itemscount
                      from gtd_jta jta
                      where jta.del <> 'del' and jta.ji in (select ji from gtd_jha where del <> 'del')
                      group by jta.ji) items
                    on jha.ji = items.ji
                    where ${(jts && jts.length > 0)? ('jha.jt in (' + jts.join(', ') + ') and') : ''} jha.del <> '${DelType.del}'
                    order by jha.jt asc, jha.wtt desc`

    let plansummarys: Array<PlanSummaryData> = await this.sqlExce.getExtList<PlanSummaryData>(sql) || new Array<PlanSummaryData>();

    return plansummarys;
  }

  /**
   * 取得所有日历
   * 包括 自定义日历/冥王星预定义日历
   * 结果根据类型正序 创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async fetchAllPlans(jts:Array<PlanType> = []): Promise<Array<PlanData>> {

    let sql: string = `select * from gtd_jha where ${(jts && jts.length > 0)? ('jt in (' + jts.join(', ') + ') and') : ''} del <> '${DelType.del}' order by jt asc, wtt desc`;

    let plans: Array<PlanData> = await this.sqlExce.getExtList<PlanData>(sql) || new Array<PlanData>();

    // 获取每个日历的日历项
    for (let plan of plans) {
      let items: Array<any> = new Array<any>();

      let subsqljta: string = `select * from gtd_jta where ji = ?1 and del <> ?2`;
      let planitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(subsqljta, [plan.ji, DelType.del]) || new Array<PlanItemData>();

      for (let planitem of planitems) {
        items.push(planitem);
      }

      let subsqlagenda: string = `select agenda.*
                                    from (select ev.* from gtd_ev ev where ev.type = ?6 and ev.ji = ?1 and ev.rfg = ?2 and del <> ?5) agenda
                                    left join gtd_ca ca on ca.evi = agenda.evi
                                  union all
                                  select agenda.*
                                    from (select ev.* from gtd_ev ev where ev.type = ?6 and ev.ji = ?1 and del <> ?5 and (ev.rfg = ?3 or ev.rfg = ?4)) agenda
                                    left join gtd_ca ca on ca.evi = agenda.rtevi`;
      let planagendas: Array<AgendaData> = await this.sqlExce.getExtLstByParam<AgendaData>(subsqlagenda, [plan.ji, RepeatFlag.NonRepeat, RepeatFlag.Repeat, RepeatFlag.RepeatToOnly, DelType.del, EventType.Agenda]) || new Array<AgendaData>();

      for (let planagenda of planagendas) {
        items.push(planagenda);
      }

      let subsqltask: string = `select task.*
                                  from (select ev.* from gtd_ev ev where ev.type = ?6 and ev.ji = ?1 and ev.rfg = ?2 and del <> ?5) task
                                  left join gtd_ca ca on ca.evi = task.evi
                                union all
                                select task.*
                                  from (select ev.* from gtd_ev ev where ev.type = ?6 and ev.ji = ?1 and del <> ?5 and (ev.rfg = ?3 or ev.rfg = ?4)) task
                                  left join gtd_ca ca on ca.evi = task.rtevi`;
      let plantasks: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(subsqltask, [plan.ji, RepeatFlag.NonRepeat, RepeatFlag.Repeat, RepeatFlag.RepeatToOnly, DelType.del, EventType.Task]) || new Array<TaskData>();

      for (let plantask of plantasks) {
        items.push(plantask);
      }

      let subsqlmemo: string = `select * from gtd_mom where ji = ?1 and del <> ?2`;
      let planmemos: Array<MemoData> = await this.sqlExce.getExtLstByParam<MemoData>(subsqlmemo, [plan.ji, DelType.del]) || new Array<MemoData>();

      for (let planmemo of planmemos) {
        items.push(planmemo);
      }

      plan.items = items;
    }

    return plans;
  }

  /**
   * 取得自定义日历
   * 结果根据创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async fetchPrivatePlans(): Promise<Array<PlanData>> {
    return await this.fetchAllPlans([PlanType.PrivatePlan]);
  }

  /**
   * 合并日历一览
   *
   * @author leon_xi@163.com
   **/
  mergePlans(plans: Array<PlanData>, plan: PlanData): Array<PlanData> {
    this.assertEmpty(plans);   // 入参不能为空
    this.assertEmpty(plan);    // 入参不能为空

    let existids: Array<string> = new Array<string>();

    existids = plans.reduce((target, val) => {
      target.push(val.ji);

      return target;
    }, existids);

    let index: number = existids.indexOf(plan.ji);

    if (index >= 0) {
      // 更新/删除原有日历
      if (plan.del != DelType.del) {
        plans.splice(index, 1, plan);
      } else {
        plans.splice(index, 1);
      }
    } else {
      // 新增日历
      if (plan.del != DelType.del) {
        plans.unshift(plan);
      }
    }

    return plans;
  }

  /**
   * 取得冥王星预定义日历
   * 结果根据类型正序 创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async fetchPublicPlans(): Promise<Array<PlanData>> {
    return await this.fetchAllPlans([PlanType.CalendarPlan, PlanType.ActivityPlan]);
  }

  /**
   * 取得指定日历所有日历项
   * 结果根据所属日期正序排序
   *
   * @author leon_xi@163.com
   **/
  async fetchPlanItems(ji: string): Promise<Array<PlanItemData>> {

    this.assertEmpty(ji);   // 入参不能为空

    let sql: string = `select * from gtd_jta where ji = '${ji}' and del <> '${DelType.del}' order by sd asc`;

    return await this.sqlExce.getExtList<PlanItemData>(sql);
  }

  /**
   * 取得指定日历所有事件
   * 结果根据事件日期正序排序
   *
   * @author leon_xi@163.com
   **/
  async fetchPlanEvents(ji: string): Promise<Array<EventData>> {

    this.assertEmpty(ji);   // 入参不能为空

    let sql: string = `select * from gtd_ev where ji = '${ji}' and del <> '${DelType.del}' order by evd asc`;

    return await this.sqlExce.getExtList<EventData>(sql);
  }

  /**
   * 取得指定日历所有备忘
   * 结果根据创建时间戳正序/倒序排序
   *
   * @author leon_xi@163.com
   **/
  async fetchPlanMemos(ji: string, sort: SortType = SortType.ASC): Promise<Array<MemoData>> {

    this.assertEmpty(ji);   // 入参不能为空

    let sql: string = `select * from gtd_mom where ji = '${ji}' and del <> '${DelType.del}' order by sd ${sort}`;

    return await this.sqlExce.getExtList<MemoData>(sql);
  }

  /**
   * 下载指定日历所有日历项
   *
   * @author leon_xi@163.com
   **/
  async downloadPublicPlan(ji: string, jt: PlanType): Promise<PlanData> {

    this.assertEmpty(ji);   // 入参不能为空

    let plandata: PlanData = {} as PlanData;

    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.d.pi = ji;
    let plan: Plan = await this.shareRestful.downsysname(bip);

    let sqls: Array<any> = new Array<any>();

    if (plan && plan.pn) {
      // 删除既存数据
      let delexistsqls: Array<any> = this.removePlanSqls(ji, jt);

      sqls = sqls.concat(delexistsqls);

      // 创建新数据
      let plandb: JhaTbl = new JhaTbl();
      plandb.ji = ji;
      plandb.jt = jt;
      plandb.jn = plan.pn.pt;
      plandb.jg = plan.pn.pd;
      plandb.jc = plan.pn.pm;
      plandb.jtd = PlanDownloadType.YES;
      plandb.tb = SyncType.synch;
      plandb.del = DelType.undel;

      Object.assign(plandata, plandb);
      plandata.items = new Array<any>();

      sqls.push(plandb.rpTParam());

      let itemType: PlanItemType = (jt == PlanType.CalendarPlan? PlanItemType.Holiday : PlanItemType.Activity);

      // 创建日历项
      if (plan.pa && plan.pa.length > 0) {
        let planitems: Array<JtaTbl> = new Array<JtaTbl>();

        for (let pa of plan.pa) {
          let planitemdata: PlanItemData = {} as PlanItemData;

          let planitemdb: JtaTbl = new JtaTbl();
          planitemdb.jti = this.util.getUuid();
          planitemdb.ji = ji;         //计划ID
          planitemdb.jtt = itemType;  //日历项类型
          planitemdb.jtc = SelfDefineType.System;  //日历项类型 下载
          planitemdb.jtn = pa.at;     //日程事件主题  必传
          planitemdb.sd = moment(pa.adt, "YYYY/MM/DD HH:mm").format("YYYY/MM/DD");  //所属日期      必传
          planitemdb.st = pa.st;      //所属时间
          planitemdb.bz = pa.am;      //备注
          planitemdb.px = plan.pn.px; //排序
          planitemdb.tb = SyncType.synch;
          planitemdb.del = DelType.undel;

          Object.assign(planitemdata, planitemdb);
          plandata.items.push(planitemdata);

          planitems.push(planitemdb)
        }

        if (planitems.length > 0) {
          let subsqls = this.sqlExce.getFastSaveSqlByParam(planitems);

          for (let subsql of subsqls) {
            sqls.push(subsql);
          }
        }
      }
    }

    await this.sqlExce.batExecSqlByParam(sqls);

    this.emitService.emit(`mwxing.calendar.plans.changed`, plandata);
    this.emitService.emit(`mwxing.calendar.activities.changed`, plandata.items);

    return plandata;
  }

  /**
   * 获取用户的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchActivitiesSummary(): Promise<ActivitySummaryData> {

    let sql: string = `select
                        max(jta.calendaritemscount) calendaritemscount,
                        max(jta.activityitemscount) activityitemscount,
                        max(ev.eventscount) eventscount,
                        max(ev.agendascount) agendascount,
                        max(ev.taskscount) taskscount,
                        max(ev.repeateventscount) repeateventscount,
                        max(mo.memoscount) memoscount,
                        max(mo.bookedtimesummary) bookedtimesummary
                      from (select
                              sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Holiday}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) calendaritemscount,
                              sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Activity}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) activityitemscount
                            from gtd_jta gjt) jta,
                            (select
                              sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) eventscount,
                              sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                              sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                              sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) repeateventscount
                            from gtd_ev gev) ev,
                            (select
                              sum(CASE WHEN IFNULL(gmo.moi, '') = '' THEN 0 WHEN gmo.del = '${DelType.del}' THEN 0 ELSE 1 END) memoscount,
                              0 bookedtimesummary
                            from gtd_mom gmo) mo`;

    let summary: ActivitySummaryData = new ActivitySummaryData();
    summary = await this.sqlExce.getExtOne<ActivitySummaryData>(sql);

    return summary;
  }

  /**
   * 重新计算指定年月下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  refreshMonthActivitiesSummary(origin: MonthActivitySummaryData, monthActivities: MonthActivityData): MonthActivitySummaryData {
    this.assertEmpty(origin);                 // 入参不能为空
    this.assertEmpty(origin.month);           // 每月概要月份不能为空
    this.assertEmpty(monthActivities);        // 入参不能为空
    this.assertEmpty(monthActivities.month);  // 每月活动月份不能为空
    this.assertNotEqual(origin.month, monthActivities.month); // 两个月份不能不一致

    for (let daysummary of origin.days) {
      let dayActivities: DayActivityData = monthActivities.days.get(daysummary.day);

      // 计算日历项
      let calendaritemscount: number = 0;
      let activityitemscount: number = 0;
      let daycalendaritem: string = "";
      let px: number = null;

      for (let item of dayActivities.calendaritems) {
        if (item.jtt == PlanItemType.Holiday) {
          calendaritemscount++;
        }

        if (item.jtt == PlanItemType.Activity) {
          activityitemscount++;
        }

        if (!px) {
          px = item.px;
          daycalendaritem = item.jtn;
        } else {
          if (px > item.px) {
            px = item.px;
            daycalendaritem = item.jtn;
          }
        }
      }

      daysummary.daycalendaritem = daycalendaritem;
      daysummary.calendaritemscount = calendaritemscount;
      daysummary.activityitemscount = activityitemscount;

      // 计算活动
      let acceptableeventscount: number = 0;
      let eventscount: number = 0;
      let agendascount: number = 0;
      let taskscount: number = 0;
      let repeateventscount: number = 0;

      for (let event of dayActivities.events) {
        eventscount++;

        if (event.ui != UserConfig.account.id && event.invitestatus == InviteState.None) {
          acceptableeventscount++;
        }

        if (event.type == EventType.Agenda && (!event.rtevi && event.rtevi == "")) {
          agendascount++;
        }

        if (event.type == EventType.Task) {
          taskscount++;
        }

        if (event.rtevi && event.rtevi != "") {
          repeateventscount++;
        }
      }

      daysummary.acceptableeventscount = acceptableeventscount;
      daysummary.eventscount = eventscount;
      daysummary.agendascount = agendascount;
      daysummary.taskscount = taskscount;
      daysummary.repeateventscount = repeateventscount;

      // 计算备忘
      daysummary.memoscount = dayActivities.memos.length;
    }

    return origin;
  }

  /**
   * 获取指定年月下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchMonthActivitiesSummary(month: string = moment().format('YYYY/MM')): Promise<MonthActivitySummaryData> {

    this.assertEmpty(month);    // 入参不能为空

    let days: number = moment(month,"YYYY/MM").daysInMonth();
    let arrDays: Array<string> = new Array<string>(days).fill("01");  // 必须要先填充, 否则不能map
    arrDays = arrDays.map((value, index) => {
      return (month + "/" + ("0" + (index + 1)).slice(-2));
    });
    let daysql: string = `select '${arrDays.join(`' sd union all select '`)}' sd`;

    let sql: string = `select gdaymom.day day,
                          dayitem.jtn daycalendaritem,
                          gdaymom.calendaritemscount calendaritemscount,
                          gdaymom.activityitemscount activityitemscount,
                          gdaymom.eventscount eventscount,
                          gdaymom.agendascount agendascount,
                          gdaymom.taskscount taskscount,
                          gdaymom.repeateventscount repeateventscount,
                          gdaymom.acceptableeventscount acceptableeventscount,
                          gdaymom.memoscount memoscount,
                          gdaymom.bookedtimesummary bookedtimesummary
                      from (select gdayev.day day,
                                max(gdayev.calendaritemscount) calendaritemscount,
                                max(gdayev.activityitemscount) activityitemscount,
                                max(gdayev.eventscount) eventscount,
                                max(gdayev.agendascount) agendascount,
                                max(gdayev.taskscount) taskscount,
                                max(gdayev.repeateventscount) repeateventscount,
                                max(gdayev.acceptableeventscount) acceptableeventscount,
                                sum(CASE WHEN IFNULL(gmo.moi, '') = '' THEN 0 WHEN gmo.del = '${DelType.del}' THEN 0 ELSE 1 END) memoscount,
                                0 bookedtimesummary
                        from (select gdayjta.day day,
                                    max(gdayjta.calendaritemscount) calendaritemscount,
                                    max(gdayjta.activityitemscount) activityitemscount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) eventscount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                    sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 WHEN gev.invitestatus = '${InviteState.Accepted}' THEN 1 WHEN gev.ui = '${UserConfig.account.id}' THEN 1 ELSE 0 END) repeateventscount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN IFNULL(gev.ui, '') = '${UserConfig.account.id}' THEN 0 WHEN IFNULL(gev.del, '') = '${DelType.del}' THEN 0 WHEN IFNULL(gev.invitestatus, '${InviteState.None}') = '${InviteState.None}' THEN 1 ELSE 0 END) acceptableeventscount
                              from (select gday.sd day,
                                      sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Holiday}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) calendaritemscount,
                                      sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Activity}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) activityitemscount
                                    from (${daysql}) gday
                                        left join gtd_jta gjt on gday.sd = gjt.sd
                                    group by gday.sd) gdayjta
                                left join gtd_ev gev on gdayjta.day = gev.evd
                              group by gdayjta.day) gdayev
                        left join gtd_mom gmo on gdayev.day = gmo.sd
                        group by gdayev.day) gdaymom
                      left join (
                        select sd, jtn from gtd_jta group by sd having px >= 0 and min(px)
                      ) dayitem
                      on gdaymom.day = dayitem.sd`;

    let monthSummary: MonthActivitySummaryData = new MonthActivitySummaryData();
    monthSummary.month = month;
    monthSummary.days = await this.sqlExce.getExtList<DayActivitySummaryData>(sql);

    return monthSummary;
  }

  /**
   * 获取指定年月下的活动
   *
   * @author leon_xi@163.com
   **/
  async fetchMonthActivities(month: string = moment().format('YYYY/MM')): Promise<MonthActivityData> {

    this.assertEmpty(month);    // 入参不能为空

    let monthActivity: MonthActivityData = new MonthActivityData();

    monthActivity.month = month;

    let days: Map<string, DayActivityData> = new Map<string, DayActivityData>();

    let startday: string = moment(month,"YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(month,"YYYY/MM").endOf('month').format("YYYY/MM/DD");

    // 初始化每日记录
    days.set(startday, new DayActivityData(startday));
    let stepday: string = startday;
    while (stepday != endday) {
      stepday = moment(stepday,"YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");

      let day: string = stepday;
      days.set(day, new DayActivityData(day));
    }

    let sqlcalitems: string = `select * from gtd_jta where substr(sd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by sd asc, st asc`;

    monthActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems) || new Array<PlanItemData>();

    days = monthActivity.calendaritems.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      // 天气设置到天气字段
      if (value.jtt == PlanItemType.Weather) {
        dayActivity.weather = value;
      } else {
        dayActivity.calendaritems.push(value);
      }
      days.set(day, dayActivity);

      return days;
    }, days);

    //let sqlevents: string = `select * from gtd_ev where substr(evd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by evd asc, evt asc`;

    let sqleventcounts: string = `select evp.*,
                                   case when evp.ui <> ?5 then evp.apn + 1 else evp.apn end apn,
                                   sum(case when ifnull(fj.fji, '') = '' then 0 else 1 end) fj
                            from (select ev.*,
                                         sum(case when ifnull(par.pari, '') = '' then 0 else 1 end) pn,
                                         sum(case when ifnull(par.pari, '') = '' then 0 when ifnull(par.sdt, '') = ?4 then 1 else 0 end) apn
                                    from (select * from gtd_ev where substr(evd, 1, 7) = ?1 AND del <> ?2) ev
                                    left join gtd_par par
                                    on par.obt = ?3 and par.del <> ?2 and par.obi = ev.evi
                                    group by ev.evi) evp
                            left join gtd_fj fj
                            on fj.obt = ?3 and fj.del <> ?2 and fj.obi = evp.evi
                            group by evp.evi`

    //monthActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents) || new Array<EventData>();
    monthActivity.events = await this.sqlExce.getExtLstByParam<EventData>(sqleventcounts, [month, DelType.del, ObjectType.Event, MemberShareState.Accepted, UserConfig.account.id]) || new Array<EventData>();

    // 手动排序, Group By中无法排序
    monthActivity.events.sort((a, b) => {
        let adt = moment(a.evd + " " + a.evt, "YYYY/MM/DD HH:mm");
        let bdts = b.evd + " " + b.evt;

        return adt.diff(moment(bdts, "YYYY/MM/DD HH:mm"));
    });

    days = monthActivity.events.reduce((days, value) => {
      let day: string = value.evd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      // 受邀人未接受的重复子日程不显示
      if (value.ui != UserConfig.account.id && value.rtevi && value.invitestatus != InviteState.Accepted && value.invitestatus != InviteState.Rejected) {
        // 不加入日程一览
      } else {
        dayActivity.events.push(value);
      }
      days.set(day, dayActivity);

      return days;
    }, days);

    let sqlmemos: string = `select * from gtd_mom where substr(sd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by sd asc`;

    monthActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos) || new Array<MemoData>();

    days = monthActivity.memos.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.memos.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    monthActivity.days = days;

    monthActivity.days.forEach((val) => {
      monthActivity.arraydays.push(val);
    });

    return monthActivity;
  }

  annotation(id: string, value: boolean) {
    // Observable
    let subject: BehaviorSubject<boolean> = this.annotationsubjects.get(id);

    if (!subject) {
      subject = new BehaviorSubject<boolean>(value);
      this.annotationsubjects.set(id, subject);
      this.annotationobservables.set(id, subject.asObservable());
    } else {
      subject.next(value);
    }
    // Observable
  }

  attachment(id: string, value: number) {
    // Observable
    let subject: BehaviorSubject<number> = this.attachmentsubjects.get(id);

    if (!subject) {
      subject = new BehaviorSubject<number>(value);
      this.attachmentsubjects.set(id, subject);
      this.attachmentobservables.set(id, subject.asObservable());
    } else {
      subject.next(value);
    }
    // Observable
  }

  commit(id: string, value: boolean) {
    // Observable
    let subject: BehaviorSubject<boolean> = this.calendarsubjects.get(id);

    if (!subject) {
      subject = new BehaviorSubject<boolean>(value);
      this.calendarsubjects.set(id, subject);
      this.calendarobservables.set(id, subject.asObservable());
    } else {
      subject.next(value);
    }
    // Observable
  }

  /**
   * 数据对象已读
   *
   * @author leon_xi@163.com
   **/
  read(read: PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData | Attachment | Grouper | Annotation) {
    assertEmpty(read);  // 入参不能为空

    let data: any = read;

    let datatype: string = this.getDataType(data);

    let readKey: ReadWriteKey;
    let writeKey: ReadWriteKey;
    let writeOriginData: ReadWriteData;
    let readNewData: ReadWriteData = {} as ReadWriteData;

    switch (datatype) {
      case "Agenda":
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, data);

        readKey = new ReadWriteKey(ObjectType.Event, agenda.evi, "content", "read");
        writeKey = new ReadWriteKey(ObjectType.Event, agenda.evi, "content", "write");

        writeOriginData = this.calendardatarws.get(writeKey.encode());

        Object.assign(readNewData, readKey);

        readNewData.checksum = checksum(`${agenda.evn}${agenda.evd}${agenda.evt}`);
        readNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(readKey.encode(), readNewData);

        if (!writeOriginData) {
          // 不存在写入数据, 直接设置已读
          this.commit(agenda.evi, false);
        } else {
          if ((writeOriginData.nval || writeOriginData.cval || writeOriginData.bval || writeOriginData.checksum) == (readNewData.nval || readNewData.cval || readNewData.bval || readNewData.checksum)) {
            // 读取数据和写入数据一致
            this.commit(agenda.evi, false);
          } else {
            // 读取数据和写入数据不一致
            this.commit(agenda.evi, true);
          }
        }

        break;
      case "Attachment":
        let attachment: Attachment = {} as Attachment;
        Object.assign(attachment, data);

        readKey = new ReadWriteKey(attachment.obt, attachment.obi, `attachment_${attachment.fji}`, "read");
        writeKey = new ReadWriteKey(attachment.obt, attachment.obi, `attachment_${attachment.fji}`, "write");

        writeOriginData = this.calendardatarws.get(writeKey.encode());

        Object.assign(readNewData, readKey);

        readNewData.bval = true;
        readNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(readKey.encode(), readNewData);

        if (!writeOriginData) {
          // 不存在写入数据, 直接设置已读
          this.commit(attachment.obi, false);
        } else {
          let comparewrite = writeOriginData.nval || writeOriginData.cval || writeOriginData.bval || writeOriginData.checksum;
          let compareread = readNewData.nval || readNewData.cval || readNewData.bval || readNewData.checksum;
          if (comparewrite && compareread) {
            // 读取数据和写入数据一致
            this.commit(attachment.obi, false);
          } else {
            // 读取数据和写入数据不一致
            this.commit(attachment.obi, true);
          }
        }

        // 每个附件单独比较, 不需要循环比较
        // let compares: Map<string, any> = new Map<string, any>();
        //
        // this.calendardatarws.forEach((value, k) => {
        //   let key = ReadWriteKey.decode(k);
        //   if (key.type == attachment.obt && key.id == attachment.obi) {
        //     if (key.mark.startsWith("attachment_")) {
        //       let compare: any = compares.get(key.mark) || {};
        //
        //       if (key.rw == "read") {
        //         compare.read = value.nval || value.cval || value.bval || value.checksum;
        //       } else {
        //         compare.write = value.nval || value.cval || value.bval || value.checksum;
        //       }
        //
        //       compares.set(key.mark, compare);
        //     }
        //   }
        // });
        //
        // let readOrWrite: boolean = true;
        //
        // compares.forEach((value, key) => {
        //   if (value.read != value.write) readOrWrite = false;
        // });
        //
        // if (readOrWrite) {
        //   this.commit(attachment.obi, false);
        // } else {
        //   this.commit(attachment.obi, true);
        // }

        break;
      case "PlanItem":
      case "Task":
      case "MiniTask":
      case "Memo":
      case "Grouper":
        break;
      case "Annotation":
        let annotation: Annotation = {} as Annotation;
        Object.assign(annotation, data);

        readKey = new ReadWriteKey(annotation.obt, annotation.obi, "annotation", "read");
        writeKey = new ReadWriteKey(annotation.obt, annotation.obi, "annotation", "write");

        writeOriginData = this.calendardatarws.get(writeKey.encode());

        Object.assign(readNewData, readKey);

        readNewData.bval = true;
        readNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(readKey.encode(), readNewData);

        if (!writeOriginData) {
          // 不存在写入数据, 直接设置已读
          this.annotation(annotation.obi, false);
        } else {
          if ((writeOriginData.nval || writeOriginData.cval || writeOriginData.bval || writeOriginData.checksum) && (readNewData.nval || readNewData.cval || readNewData.bval || readNewData.checksum)) {
            // 读取数据和写入数据一致
            this.annotation(annotation.obi, false);
          } else {
            // 读取数据和写入数据不一致
            this.annotation(annotation.obi, true);
          }
        }

        break;
      default:
        assertFail("Read error for unknown type " + datatype);
    }
  }

  /**
   * 数据对象未读
   *
   * @author leon_xi@163.com
   **/
  write(write: PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData | Attachment | Grouper | Annotation, readed: boolean = false) {
    assertEmpty(write);  // 入参不能为空

    let data: any = write;

    let datatype: string = this.getDataType(data);

    let readKey: ReadWriteKey;
    let writeKey: ReadWriteKey;
    let readOriginData: ReadWriteData;
    let writeNewData: ReadWriteData = {} as ReadWriteData;

    switch (datatype) {
      case "Agenda":
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, data);

        readKey = new ReadWriteKey(ObjectType.Event, agenda.evi, "content", "read");
        writeKey = new ReadWriteKey(ObjectType.Event, agenda.evi, "content", "write");

        readOriginData = this.calendardatarws.get(readKey.encode());

        Object.assign(writeNewData, writeKey);

        writeNewData.checksum = checksum(`${agenda.evn}${agenda.evd}${agenda.evt}`);
        writeNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(writeKey.encode(), writeNewData);
        if (readed) {
          this.calendardatarws.set(readKey.encode(), writeNewData);
          readOriginData = writeNewData;
        }

        if (!readOriginData) {
          // 不存在读取数据, 直接设置未读
          this.commit(agenda.evi, true);
        } else {
          if ((readOriginData.nval || readOriginData.cval || readOriginData.bval || readOriginData.checksum) == (writeNewData.nval || writeNewData.cval || writeNewData.bval || writeNewData.checksum)) {
            // 读取数据和写入数据一致
            this.commit(agenda.evi, false);
          } else {
            // 读取数据和写入数据不一致
            this.commit(agenda.evi, true);
          }
        }

        break;
      case "Attachment":
        let attachment: Attachment = {} as Attachment;
        Object.assign(attachment, data);

        // 控制附件所述对象已读未读逻辑
        readKey = new ReadWriteKey(attachment.obt, attachment.obi, `attachment_${attachment.fji}`, "read");
        writeKey = new ReadWriteKey(attachment.obt, attachment.obi, `attachment_${attachment.fji}`, "write");

        Object.assign(writeNewData, writeKey);

        writeNewData.bval = true;
        writeNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(writeKey.encode(), writeNewData);
        if (readed) {
          this.calendardatarws.set(readKey.encode(), writeNewData);
        }

        let compares: Map<string, any> = new Map<string, any>();

        this.calendardatarws.forEach((value, k) => {
          let key = ReadWriteKey.decode(k);

          if (key.type == attachment.obt && key.id == attachment.obi) {
            if (key.mark.startsWith("attachment_")) {
              let compare: any = compares.get(key.mark) || {};

              if (key.rw == "read") {
                compare.read = value.nval || value.cval || value.bval || value.checksum;
              } else {
                compare.write = value.nval || value.cval || value.bval || value.checksum;
              }

              compares.set(key.mark, compare);
            }
          }
        });

        let readOrWrite: boolean = true;

        compares.forEach((value, key) => {
          if (!(value.read && value.write)) readOrWrite = false;
        });

        if (readOrWrite) {
          this.commit(attachment.obi, false);
        } else {
          this.commit(attachment.obi, true);
        }

        // 控制附件数量显示逻辑
        let cached: Array<Attachment> = this.attachmentcached.get(attachment.obi) || new Array<Attachment>();

        let index: number = cached.findIndex((val) => {
          return val.fji == attachment.fji;
        });

        if (index >= 0) {
          cached.splice(index, 1, attachment);
        } else {
          cached.push(attachment);
        }

        let count = cached.reduce((target, ele) => {
          if (ele.del != DelType.del) target++;

          return target;
        }, 0);
        console.log("update attachment " + count + " for " + attachment.obi);
        this.attachment(attachment.obi, count);

        this.attachmentcached.set(attachment.obi, cached);
        break;
      case "PlanItem":
      case "Task":
      case "MiniTask":
      case "Memo":
      case "Grouper":
        break;
      case "Annotation":
        let annotation: Annotation = {} as Annotation;
        Object.assign(annotation, data);

        readKey = new ReadWriteKey(annotation.obt, annotation.obi, `annotation`, "read");
        writeKey = new ReadWriteKey(annotation.obt, annotation.obi, `annotation`, "write");

        Object.assign(writeNewData, writeKey);

        writeNewData.bval = true;
        writeNewData.utt = moment().unix();

        // 读取数据访问缓存
        this.calendardatarws.set(writeKey.encode(), writeNewData);
        if (readed) {
          this.calendardatarws.set(readKey.encode(), writeNewData);
        }

        // 读取数据访问缓存
        this.calendardatarws.set(writeKey.encode(), writeNewData);
        if (readed) {
          this.calendardatarws.set(readKey.encode(), writeNewData);
          readOriginData = writeNewData;
        }

        if (!readOriginData) {
          // 不存在读取数据, 直接设置未读
          this.annotation(annotation.obi, true);
        } else {
          if ((readOriginData.nval || readOriginData.cval || readOriginData.bval || readOriginData.checksum) && (writeNewData.nval || writeNewData.cval || writeNewData.bval || writeNewData.checksum)) {
            // 读取数据和写入数据一致
            this.annotation(annotation.obi, false);
          } else {
            // 读取数据和写入数据不一致
            this.annotation(annotation.obi, true);
          }
        }

        break;
      default:
        assertFail("Write error for unknown type " + datatype);
    }
  }

  /**
   * 合并(更新/插入/删除)月活动数据（用于日历页月度活动一览）
   *
   * 避免重复查询数据库, 提高效率
   * 不属于当月范围内的活动将被忽略
   *
   * @author leon_xi@163.com
   **/
  mergeMonthActivities(monthActivities: MonthActivityData, activitiedatas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>, update: boolean = true): MonthActivityData {

    // 入参不能为空
    this.assertEmpty(monthActivities);            // 月活动数据不能为空
    this.assertEmpty(monthActivities.month);      // 月活动数据月份不能为空
    this.assertEmpty(activitiedatas);             // 活动数据不能为空

    let activities: Array<any> = activitiedatas;

    // 没有合并数据直接返回
    if (activities.length == 0) {
      return monthActivities;
    }

    let startday: string = moment(monthActivities.month,"YYYY/MM").startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(monthActivities.month,"YYYY/MM").endOf('month').format("YYYY/MM/DD");

    // 循环合并更新活动
    for (let activity of activities) {
      let day: string = "";
      let activityType: string = this.getActivityType(activity);

      // 取得活动日期
      switch (activityType) {
        case "PlanItemData" :
          day = activity.sd;
          break;
        case "AgendaData" :
          day = activity.evd;
          break;
        case "TaskData" :
          day = activity.evd;
          break;
        case "MiniTaskData" :
          day = activity.evd;
          break;
        case "MemoData" :
          day = activity.sd;
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }

      // 获取既存活动ID, 用于判断更新/插入/删除
      let calendaritemids: Array<string> = new Array<string>();
      let eventids: Array<string> = new Array<string>();
      let memoids: Array<string> = new Array<string>();

      monthActivities.calendaritems.reduce((calendaritemids, value) => {
        calendaritemids.push(value.jti);
        return calendaritemids;
      }, calendaritemids);
      monthActivities.events.reduce((eventids, value) => {
        eventids.push(value.evi);
        return eventids;
      }, eventids);
      monthActivities.memos.reduce((memoids, value) => {
        memoids.push(value.moi);
        return memoids;
      }, memoids);

      // 更新/插入/删除活动数据
      let index: number = -1;

      // 不属于当页日期范围内的活动
      // 如果id存在当页内则从此页删除 (解决数据所属日期跨月修改，原数据所属月对象不能被正常移除)
      // 否则忽略
      if (startday > day || day > endday) {
        switch (activityType) {
          case "PlanItemData" :
            index = calendaritemids.indexOf(activity.jti);

            // 发现存在此数据, 需要移除
            if (index >= 0) {
              monthActivities.calendaritems.splice(index, 1);
            }
            break;
          case "AgendaData" :
          case "TaskData" :
          case "MiniTaskData" :
            index = eventids.indexOf(activity.evi);

            // 发现存在此数据, 需要移除
            if (index >= 0) {
              monthActivities.events.splice(index, 1);
            }
            break;
          case "MemoData" :
            index = memoids.indexOf(activity.moi);

            // 发现存在此数据, 需要移除
            if (index >= 0) {
              monthActivities.memos.splice(index, 1);
            }
            break;
          default:
            this.assertFail();  // 不能有上述以外的活动
        }

        continue;
      }

      switch (activityType) {
        case "PlanItemData" :
          index = calendaritemids.indexOf(activity.jti);

          let item: PlanItemData = {} as PlanItemData;
          Object.assign(item, activity);

          if (index >= 0) {
            // 更新/删除
            if (item.del == DelType.del) {
              // 删除
              monthActivities.calendaritems.splice(index, 1);
            } else {
              // 更新
              monthActivities.calendaritems.splice(index, 1, item);
            }
          } else {
            if (item.del != DelType.del) {
              // 插入
              monthActivities.calendaritems.push(item);
            }
          }
          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          index = eventids.indexOf(activity.evi);

          let event: EventData = {} as EventData;
          Object.assign(event, activity);

          // 增加接受参与人数量处理
          let apn: number = 0;
          if (event.members && event.members.length > 0) {
            let accepted = event.members.filter((ele) => {
              return ele.sdt == MemberShareState.Accepted;
            });

            if (accepted) {
              apn = accepted.length;
            }

            // 他人日程需要+1
            if (event.ui != UserConfig.account.id) {
              apn++;
            }
          }
          event.apn = apn || event.apn || (event.ui != UserConfig.account.id)? 1 : 0;
          event.pn = event.pn || 0;
          // 增加补充数量处理
          let fjn: number = 0;
          if (event.attachments && event.attachments.length > 0) {
            let accepted = event.attachments.filter((ele) => {
              return ele.del != DelType.del;
            });

            if (accepted) {
              fjn = accepted.length;
            }
          }
          event.fj = event.fj || fjn + "";

          if (index >= 0) {
            // 更新/删除
            if (event.del == DelType.del) {
              // 删除
              monthActivities.events.splice(index, 1);
            } else {
              // 更新
              monthActivities.events.splice(index, 1, event);
            }
          } else {
            if (event.del != DelType.del) {
              monthActivities.events.push(event);
            }
          }
          break;
        case "MemoData" :
          let memo: MemoData = {} as MemoData;
          Object.assign(memo, activity);

          index = memoids.indexOf(activity.moi);
          if (index >= 0) {
            // 更新/删除
            if (memo.del == DelType.del) {
              // 删除
              monthActivities.memos.splice(index, 1);
            } else {
              // 更新
              monthActivities.memos.splice(index, 1, memo);
            }
          } else {
            if (memo.del != DelType.del) {
              monthActivities.memos.push(memo);
            }
          }
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }
    }

    // 重构每天活动数据
    // let days: Map<string, DayActivityData> = new Map<string, DayActivityData>();

    // 初始化每日记录
    // days.set(startday, new DayActivityData(startday));
    // let stepday: string = startday;
    // while (stepday != endday) {
    //   stepday = moment(stepday).add(1, "days").format("YYYY/MM/DD");
    //
    //   let day: string = stepday;
    //   days.set(day, new DayActivityData(day));
    // }

    if (update) {
      let days: Map<string, DayActivityData> = monthActivities.days;

      // 清空数据
      days.forEach((dayActivity) => {
        dayActivity.calendaritems.length = 0;
        dayActivity.events.length = 0;
        dayActivity.memos.length = 0;
      });

      // 排序
      monthActivities.calendaritems.sort((a, b) => {
        let adt = moment(a.sd + " " + a.st || "00:00", "YYYY/MM/DD HH:mm");
        let bdts = moment(b.sd + " " + b.st || "00:00", "YYYY/MM/DD HH:mm");

        return adt.diff(bdts);
      });
      monthActivities.events.sort((a, b) => {
        let adt = moment(a.evd + " " + a.evt, "YYYY/MM/DD HH:mm");
        let bdts = moment(b.evd + " " + b.evt, "YYYY/MM/DD HH:mm");

        return adt.diff(bdts);
      });

      days = monthActivities.calendaritems.reduce((days, value) => {
        let day: string = value.sd;
        let dayActivity: DayActivityData = days.get(day);

        this.assertNull(dayActivity);

        // 天气设置到天气字段
        if (value.jtt == PlanItemType.Weather) {
          dayActivity.weather = value;
        } else {
          dayActivity.calendaritems.push(value);
        }
        days.set(day, dayActivity);

        return days;
      }, days);

      days = monthActivities.events.reduce((days, value) => {
        let day: string = value.evd;
        let dayActivity: DayActivityData = days.get(day);

        this.assertNull(dayActivity);

        // 受邀人未接受的重复子日程不显示
        if (value.ui != UserConfig.account.id && value.rtevi && value.invitestatus != InviteState.Accepted && value.invitestatus != InviteState.Rejected) {
          // 不加入日程一览
        } else {
          dayActivity.events.push(value);
        }
        days.set(day, dayActivity);

        return days;
      }, days);

      days = monthActivities.memos.reduce((days, value) => {
        let day: string = value.sd;
        let dayActivity: DayActivityData = days.get(day);

        this.assertNull(dayActivity);

        dayActivity.memos.push(value);
        days.set(day, dayActivity);

        return days;
      }, days);

      monthActivities.days = days;
    }

    return monthActivities;
  }

  /**
   * 获取指定日期下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchDayActivitiesSummary(day: string = moment().format('YYYY/MM/DD')): Promise<DayActivitySummaryData> {

    this.assertEmpty(day);    // 入参不能为空

    let sql: string = `select gdaymom.day day,
                          dayitem.jtn daycalendaritem,
                          gdaymom.calendaritemscount calendaritemscount,
                          gdaymom.activityitemscount activityitemscount,
                          gdaymom.eventscount eventscount,
                          gdaymom.agendascount agendascount,
                          gdaymom.taskscount taskscount,
                          gdaymom.repeateventscount repeateventscount,
                          gdaymom.acceptableeventscount acceptableeventscount,
                          gdaymom.memoscount memoscount,
                          gdaymom.bookedtimesummary bookedtimesummary
                      from (select gdayev.day day,
                            max(gdayev.calendaritemscount) calendaritemscount,
                            max(gdayev.activityitemscount) activityitemscount,
                            max(gdayev.eventscount) eventscount,
                            max(gdayev.agendascount) agendascount,
                            max(gdayev.taskscount) taskscount,
                            max(gdayev.repeateventscount) repeateventscount,
                            max(gdayev.acceptableeventscount) acceptableeventscount,
                            sum(CASE WHEN IFNULL(gmo.moi, '') = '' THEN 0 WHEN gmo.del = '${DelType.del}' THEN 0 ELSE 1 END) memoscount,
                            0 bookedtimesummary
                        from (select gdayjta.day day,
                                max(gdayjta.calendaritemscount) calendaritemscount,
                                max(gdayjta.activityitemscount) activityitemscount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) eventscount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 WHEN gev.invitestatus = '${InviteState.Accepted}' THEN 1 WHEN gev.ui = '${UserConfig.account.id}' THEN 1 ELSE 0 END) repeateventscount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN IFNULL(gev.ui, '') = '${UserConfig.account.id}' THEN 0 WHEN IFNULL(gev.del, '') = '${DelType.del}' THEN 0 WHEN IFNULL(gev.invitestatus, '${InviteState.None}') = '${InviteState.None}' THEN 1 ELSE 0 END) acceptableeventscount
                          from (select gday.sd day,
                                  sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Holiday}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) calendaritemscount,
                                  sum(CASE WHEN IFNULL(gjt.jti, '') = '' THEN 0 WHEN gjt.jtt <> '${PlanItemType.Activity}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) activityitemscount
                                from (select '${day}' sd) gday
                                    left join gtd_jta gjt on gday.sd = gjt.sd
                                group by gday.sd) gdayjta
                            left join gtd_ev gev on gdayjta.day = gev.evd
                          group by gdayjta.day) gdayev
                      left join gtd_mom gmo on gdayev.day = gmo.sd
                      group by gdayev.day) gdaymom
                    left join (
                      select sd, jtn from gtd_jta group by sd having px >= 0 and min(px)
                    ) dayitem
                    on gdaymom.day = dayitem.sd`;

    let daySummary: DayActivitySummaryData = await this.sqlExce.getExtOne<DayActivitySummaryData>(sql);

    return daySummary;
  }

  /**
   * 获取指定日期下的活动
   *
   * @author leon_xi@163.com
   **/
  async fetchDayActivities(day: string = moment().format('YYYY/MM/DD')): Promise<DayActivityData> {

    this.assertEmpty(day);

    let dayActivity: DayActivityData = new DayActivityData();

    dayActivity.day = day;

    let sqlcalitems: string = `select * from gtd_jta where sd = '${day}' and del <> '${DelType.del}' order by st asc`;

    let items = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems) || new Array<PlanItemData>();

    dayActivity.calendaritems = items.reduce((dayitems, value) => {

      // 天气设置到天气字段
      if (value.jtt == PlanItemType.Weather) {
        dayActivity.weather = value;
      } else {
        dayitems.push(value);
      }

      return dayitems;
    }, new Array<PlanItemData>());

    let sqlevents: string = `select * from gtd_ev where evd = '${day}' and del <> '${DelType.del}' and (ui = '${UserConfig.account.id}' or (ui <> '${UserConfig.account.id}' and not (ifnull(rtevi, '') <> '' and invitestatus <> '${InviteState.Accepted}')))`;

    dayActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents) || new Array<EventData>();

    let sqlmemos: string = `select * from gtd_mom where sd = '${day}' and del <> '${DelType.del}'`;

    dayActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos) || new Array<MemoData>();

    return dayActivity;
  }

  /**
   * 合并(更新/插入/删除)日活动数据（用于每日活动一览）
   *
   * 避免重复查询数据库, 提高效率
   * 不属于当日范围内的活动将被忽略
   *
   * @author leon_xi@163.com
   **/
  mergeDayActivities(dayActivities: DayActivityData, activitiedatas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>): DayActivityData {
    // 入参不能为空
    this.assertEmpty(dayActivities);            // 日活动数据不能为空
    this.assertEmpty(dayActivities.day);        // 日活动数据日期不能为空
    this.assertEmpty(activitiedatas);           // 活动数据不能为空

    let activities: Array<any> = activitiedatas;

    // 没有合并数据直接返回
    if (activities.length == 0) {
      return dayActivities;
    }

    let activityday: string = dayActivities.day;

    // 循环合并更新活动
    for (let activity of activities) {
      let day: string = "";
      let activityType: string = this.getActivityType(activity);

      // 取得活动日期
      switch (activityType) {
        case "PlanItemData" :
          day = activity.sd;
          break;
        case "AgendaData" :
          day = activity.evd;
          break;
        case "TaskData" :
          day = activity.evd;
          break;
        case "MiniTaskData" :
          day = activity.evd;
          break;
        case "MemoData" :
          day = activity.sd;
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }

      // 不属于当页日期范围内的活动忽略
      if (activityday != day) {
        continue;
      }

      // 获取既存活动ID, 用于判断更新/插入/删除
      let calendaritemids: Array<string> = new Array<string>();
      let eventids: Array<string> = new Array<string>();
      let memoids: Array<string> = new Array<string>();

      dayActivities.calendaritems.reduce((calendaritemids, value) => {
        calendaritemids.push(value.jti);
        return calendaritemids;
      }, calendaritemids);
      dayActivities.events.reduce((eventids, value) => {
        eventids.push(value.evi);
        return eventids;
      }, eventids);
      dayActivities.memos.reduce((memoids, value) => {
        memoids.push(value.moi);
        return memoids;
      }, memoids);

      // 更新/插入/删除活动数据
      let index: number = -1;

      switch (activityType) {
        case "PlanItemData" :
          index = calendaritemids.indexOf(activity.jti);

          let item: PlanItemData = {} as PlanItemData;
          Object.assign(item, activity);

          // 天气设置到天气字段
          if (item.jtt == PlanItemType.Weather) {
            dayActivities.weather = item;
          } else {
            if (index >= 0) {
              // 更新/删除
              if (item.del == DelType.del) {
                // 删除
                if (index == 0) {
                  dayActivities.calendaritems = dayActivities.calendaritems.slice(1);
                } else {
                  dayActivities.calendaritems = dayActivities.calendaritems.slice(0, index).concat(dayActivities.calendaritems.slice(index + 1));
                }
              } else {
                // 更新
                if (index == 0) {
                  dayActivities.calendaritems = dayActivities.calendaritems.slice(1);
                  dayActivities.calendaritems.unshift(item);
                } else {
                  let tail = dayActivities.calendaritems.slice(index + 1);
                  tail.unshift(item);
                  dayActivities.calendaritems = dayActivities.calendaritems.slice(0, index).concat(tail);
                }
              }
            } else {
              // 插入
              dayActivities.calendaritems.push(item);
            }
          }

          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          index = eventids.indexOf(activity.evi);

          let event: EventData = {} as EventData;
          Object.assign(event, activity);

          if (index >= 0) {
            // 更新/删除
            if (event.del == DelType.del) {
              // 删除
              if (index == 0) {
                dayActivities.events = dayActivities.events.slice(1);
              } else {
                dayActivities.events = dayActivities.events.slice(0, index).concat(dayActivities.events.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                dayActivities.events = dayActivities.events.slice(1);
                dayActivities.events.unshift(event);
              } else {
                let tail = dayActivities.events.slice(index + 1);
                tail.unshift(event);
                dayActivities.events = dayActivities.events.slice(0, index).concat(tail);
              }
            }
          } else {
            dayActivities.events.push(event);
          }
          break;
        case "MemoData" :
          let memo: MemoData = {} as MemoData;
          Object.assign(memo, activity);

          index = memoids.indexOf(activity.moi);
          if (index >= 0) {
            // 更新/删除
            if (memo.del == DelType.del) {
              // 删除
              if (index == 0) {
                dayActivities.memos = dayActivities.memos.slice(1);
              } else {
                dayActivities.memos = dayActivities.memos.slice(0, index).concat(dayActivities.memos.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                dayActivities.memos = dayActivities.memos.slice(1);
                dayActivities.memos.unshift(memo);
              } else {
                let tail = dayActivities.memos.slice(index + 1);
                tail.unshift(memo);
                dayActivities.memos = dayActivities.memos.slice(0, index).concat(tail);
              }
            }
          } else {
            dayActivities.memos.push(memo);
          }
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }
    }

    return dayActivities;
  }

  /**
   * 查询群组/联系人（拼音/手机号/用户帐号）
   * 完全匹配或者模糊匹配
   *
   * @author leon_xi@163.com
   **/
  findFriends(ns: Array<any>): Array<FsData> {
    let res: Array<FsData> = new Array<FsData>();
    let rsbs: Map<string, FsData> = new Map<string, FsData>();
    if (!ns || ns.length == 0) {
      return new Array<FsData>();
    }

    //TODO 联系人和群组是否要放入环境中，每次取性能有影响

    //获取群组列表
    let gs: Array<PageDcData> = new Array<PageDcData>();
    Object.assign(gs, UserConfig.groups);

    //循环参数中的pingy数组
    for (let n of ns) {
      //根据帐户id或者手机号查询时，不查询群组
      if (!n.n && (n.ai || n.mpn)) continue;

      let piny = n.n;
      //首先查找群组
      for (let g of gs) {
        let simulary = this.util.compareTwoStrings(piny, g.gnpy);
        if (simulary > 0.8) {
          //piny = piny.replace(g.gnpy, "");
          for (let b1 of g.fsl) {
            rsbs.set(b1.ranpy, b1);
          }
        }
      }
    }

    //获取联系人列表
    let bs: Array<FsData> = new Array<FsData>();
    Object.assign(bs, UserConfig.friends);

    let b3ran: Array<string> = new Array();
    let b3rn: Array<string> = new Array();

    for (let b3 of bs) {
      b3ran.push(b3.ranpy);
      b3rn.push(b3.rnpy);
    }

    for (let n of ns) {
      //根据帐户id或者手机号查询时，不查询群组
      if (!n.n && (n.ai || n.mpn)) {
        for (let b1 of bs) {
          //注册用户存在用户ID
          if (n.ai && b1.ui && n.ai == b1.ui) {
            res.push(b1);
            continue;
          }

          //非注册用户不存在用户ID
          if (n.mpn && b1.rc && n.mpn == b1.rc) {
            res.push(b1);
          }
        }
      }

      if (n.n) {
        let piny = n.n;
        //查找联系人
        let simularyranrs = this.util.findBestMatch(piny, b3ran);
        let simularyrnrs = this.util.findBestMatch(piny, b3rn);

        if (simularyranrs.bestMatch.rating > 0.5) {
          let index = 0;
          for (let rating of simularyranrs.ratings) {
            if (rating.rating > 0.8) {
               rsbs.set(b3ran[index], bs[index]);
            }
            index++;
          }
        }

        if (simularyrnrs.bestMatch.rating > 0.5) {
          let index = 0;
          for (let rating of simularyrnrs.ratings) {
            if (rating.rating > 0.8) {
                 rsbs.set(b3ran[index], bs[index]);
            }
            index++;
          }
        }
      }
    }

    rsbs.forEach((value, key, map) => {
      res.push(value);
    })

    return res;
  }

  /**
   * 查询活动（时间/内容/标签）
   *
   * 日历项/事件/备忘
   *
   * @author leon_xi@163.com
   **/
  async findActivities(condition: FindActivityCondition): Promise<ActivityData> {

    this.assertEmpty(condition);    // 入参不能为空

    let resultActivity: ActivityData = new ActivityData();
    resultActivity.condition = condition;

    let sqlcalitems: string = '';
    let sqlevents: string = '';
    let sqlmemos: string = '';

    let ciargs: any = [];
    let evargs: any = [];
    let moargs: any = [];

    let seachCalendar: boolean = false;
    let seachEvent: boolean = false;
    let seachMemo: boolean = false;

    // 查询范围
    if (condition.target && condition.target.length > 0) {
      if (condition.target.indexOf(ObjectType.Calendar) >= 0) {
        seachCalendar = true;
      }
      if (condition.target.indexOf(ObjectType.Event) >= 0) {
        seachEvent = true;
      }
      if (condition.target.indexOf(ObjectType.Memo) >= 0) {
        seachMemo = true;
      }
    } else {
      seachCalendar = true;
      seachEvent = true;
      seachMemo = true;
    }

    // 查询全部类型 日历项/事件/备忘
    let ciwhere: string = '';
    let evwhere: string = '';
    let mowhere: string = '';

    // 开始日期
    if (condition.sd) {
      ciwhere += (ciwhere? '' : 'where ');
      ciwhere += `sd >= ? `;
      ciargs.push(condition.sd);

      evwhere += (evwhere? '' : 'where ');
      evwhere += `evd >= ? `;
      evargs.push(condition.sd);

      mowhere += (mowhere? '' : 'where ');
      mowhere += `sd >= ? `;
      moargs.push(condition.sd);
    }

    // 结束日期
    if (condition.ed) {
      ciwhere += (ciwhere? 'and ' : 'where ');
      ciwhere += `sd <= ? `;
      ciargs.push(condition.ed);

      evwhere += (evwhere? 'and ' : 'where ');
      evwhere += `evd <= ? `;
      evargs.push(condition.ed);

      mowhere += (mowhere? 'and ' : 'where ');
      mowhere += `sd <= ? `;
      moargs.push(condition.ed);
    }

    // 内容查询
    if (condition.text) {
      ciwhere += (ciwhere? 'and ' : 'where ');
      ciwhere += `jtn like ? `;
      ciargs.push("%" + condition.text + "%");

      evwhere += (evwhere? 'and ' : 'where ');
      evwhere += `(evn like ? or bz like ?) `;
      evargs.push("%" + condition.text + "%");
      evargs.push("%" + condition.text + "%");

      mowhere += (mowhere? 'and ' : 'where ');
      mowhere += `mon like ? `;
      moargs.push("%" + condition.text + "%");
    }

    // 标签查询
    if (condition.mark && condition.mark.length > 0) {
      let likes: string = new Array<string>(condition.mark.length).fill('?', 0, condition.mark.length).join(' or mkl like ');
      let querymarks: Array<string> = condition.mark.map(value => { return "%" + value + "%";});

      ciwhere += (ciwhere? 'and ' : 'where ');
      ciwhere += `jti in (select obi from gtd_mrk where obt = ? and (mkl like ${likes})) `;
      ciargs.push(ObjectType.Calendar);
      ciargs = ciargs.concat(querymarks);

      evwhere += (evwhere? 'and ' : 'where ');
      evwhere += `evi in (select obi from gtd_mrk where obt = ? and (mkl like ${likes})) `;
      evargs.push(ObjectType.Event);
      evargs = evargs.concat(querymarks);

      mowhere += (mowhere? 'and ' : 'where ');
      mowhere += `moi in (select obi from gtd_mrk where obt = ? and (mkl like ${likes})) `;
      moargs.push(ObjectType.Memo);
      moargs = moargs.concat(querymarks);
    }

    // 增加删除标记判断
    ciwhere += (ciwhere? 'and ' : 'where ');
    ciwhere += `del <> ? `;
    ciargs.push(DelType.del);

    evwhere += (evwhere? 'and ' : 'where ');
    evwhere += `del <> ? `;
    evargs.push(DelType.del);

    mowhere += (mowhere? 'and ' : 'where ');
    mowhere += `del <> ? `;
    moargs.push(DelType.del);

    sqlcalitems = `select * from gtd_jta ${ciwhere} order by sd asc`;
    sqlevents = `select * from gtd_ev ${evwhere} order by evd asc`;
    sqlmemos = `select * from gtd_mom ${mowhere} order by sd asc`;

    // 执行查询
    if (sqlcalitems && seachCalendar) {
      console.log(sqlcalitems);
      resultActivity.calendaritems = await this.sqlExce.getExtLstByParam<PlanItemData>(sqlcalitems, ciargs) || new Array<PlanItemData>();
    }

    if (sqlevents && seachEvent) {
      console.log(sqlevents);
      resultActivity.events = await this.sqlExce.getExtLstByParam<EventData>(sqlevents, evargs) || new Array<EventData>();
    }

    if (sqlmemos && seachMemo) {
      console.log(sqlmemos);
      resultActivity.memos = await this.sqlExce.getExtLstByParam<MemoData>(sqlmemos, moargs) || new Array<MemoData>();
    }

    return resultActivity;
  }

  /**
   * 共享日历项
   *
   * @author leon_xi@163.com
   **/
  async sendPlanItem(planitem: PlanItemData) {
    this.assertEmpty(planitem);     // 入参不能为空

    await this.syncPlanItems([planitem]);

    return;
  }

  async codecPlanItems(): Promise<Array<DayCountCodec>> {
    let sql: string = `select sd day, count(*) count
                      from gtd_jta
                      where jtc <> ?1 and del <> ?2
                      group by day`;
    let daycounts: Array<DayCountCodec> = await this.sqlExce.getExtLstByParam<DayCountCodec>(sql, [SelfDefineType.System, DelType.del]) || new Array<DayCountCodec>();

    return daycounts;
  }

  async codecPlans(): Promise<Array<DayCountCodec>> {
    let sql: string = `select sd day, count(*) count
                      from gtd_jha
                      where jtc = ?1 and del <> ?2
                      group by day`;
    let daycounts: Array<DayCountCodec> = await this.sqlExce.getExtLstByParam<DayCountCodec>(sql, [SelfDefineType.System, DelType.del]) || new Array<DayCountCodec>();

    return daycounts;
  }

  /**
   * 同步指定/所有未同步日历项
   *
   * @author leon_xi@163.com
   **/
  async syncPlanItems(planitems: Array<PlanItemData> = new Array<PlanItemData>()) {
    this.assertEmpty(planitems);    // 入参不能为空

    let members = new Array<Member>();

    if (planitems.length <= 0) {
      let sql: string = `select * from gtd_jta where jtc <> ? and (tb = ? or julianday(strftime('%Y-%m-%d', wtt, 'unixepoch', 'localtime')) <= julianday('2017-11-22')) and del <> ?`;

      planitems = await this.sqlExce.getExtLstByParam<PlanItemData>(sql, [SelfDefineType.System, SyncType.unsynch, DelType.del]) || planitems;

      if (planitems && planitems.length > 0) {
        // this.util.toastStart(`发现${planitems.length}条未同步纪念日, 开始同步...`, 1000);
        this.util.tellyou(`发现${planitems.length}条未同步纪念日, 开始同步...`);


      }

      let sqlmember: string = ` select par.*  ,
                                    b.ran,
                                   b.ranpy,
                                   '' hiu,
                                   b.rn,
                                   b.rnpy,
                                   b.rc,
                                   b.rel,
                                   b.src
                              from (select
                                    case when rfg = ?1 then jti
                                       when ifnull(rtjti, '') = '' then jti
                                       else rtjti end forcejti
                                    from gtd_jta
                                    where ui <> '' and ui is not null and (tb = ?2 or julianday(strftime('%Y-%m-%d', wtt, 'unixepoch', 'localtime')) <= julianday('2017-11-22'))) jta
                              inner join gtd_par par
                              on jta.forcejti = par.obi and par.obt = ?3
                              inner join gtd_b b
                              on par.pwi = b.pwi `;
      members =  await this.sqlExce.getExtLstByParam<Member>(sqlmember,
        [RepeatFlag.NonRepeat, SyncType.unsynch, ObjectType.Calendar]) || members;
    }

    // 存在未同步日历
    if (planitems.length > 0) {
      // 构造Push数据结构
      let push: PushInData = new PushInData();

      for (let planitem of planitems) {
        // 忽略内建日历项
        if (planitem.jtc == SelfDefineType.System) continue;

        let sync: SyncData = new SyncData();

        sync.fields.unshared.push("del");             // 删除状态为个人数据不共享给他人
        sync.fields.unshared.push("bz");              // 备注为个人数据不共享给他人
        sync.fields.unshared.push("ji");              // 计划为个人数据不共享给他人
        sync.fields.unshared.push("tx");              // 提醒为个人数据不共享给他人
        sync.fields.unshared.push("txs");             // 提醒为个人数据不共享给他人
        sync.fields.unshared.push("invitestatus");    // 接受拒绝状态为个人数据不共享给他人

        // 非重复日程/重复日程的第一条需要通知
        if (!planitem.rtjti || planitem.rfg == RepeatFlag.RepeatToOnly) {
          sync.main = true;
        } else {
          sync.main = false;
          sync.group = planitem.rtjti;
        }

        sync.src = planitem.ui;
        sync.id = planitem.jti;
        sync.type = "PlanItem";
        sync.title = planitem.jtn;
        sync.security = SyncDataSecurity.None;
        sync.datetime = planitem.sd + " " + planitem.st;

        // 设置删除状态
        if (planitem.del == DelType.del) {
          sync.status = SyncDataStatus.Deleted;
        } else {
          sync.status = SyncDataStatus.UnDeleted;
        }

        // 设置受邀状态
        if (planitem.invitestatus == InviteState.Accepted) {
          sync.invitestate = InviteState.Accepted;
        } else if (planitem.invitestatus == InviteState.Rejected) {
          sync.invitestate = InviteState.Rejected;
        } else {
          sync.invitestate = InviteState.None;
        }

        if (members.length > 0) {
          let masterid: string;
          if (planitem.rtjti == "") {
            //非重复数据或重复数据的父记录
            masterid = planitem.jti;
          } else if (planitem.rfg == RepeatFlag.RepeatToOnly) {
            //重复中独立数据
            masterid = planitem.jti;
          } else {
            //重复数据
            masterid = planitem.rtjti;
          }

          let membersTos: Array<Member> = members.filter((value, index, arr) => {
            return masterid == value.obi;
          });

          planitem.members = membersTos;
        }

        sync.to = (planitem.members && planitem.members.length > 0)? planitem.members.reduce((target, element) => {
          if (element && element.rc) target.push(element.rc);

          return target;
        }, new Array<string>()) : [];

        sync.payload = planitem;

        push.d.push(sync);
      }

      if (push.d.length > 0) {
        await this.dataRestful.push(push);
      }
    }

    return;
  }

  /**
   * 完成日历项同步,更新日历项同步状态
   *
   * @author leon_xi@163.com
   */
  async acceptSyncPlanItems(ids: Array<string>) {
    let sqls: Array<any> = new Array<any>();

    let sql: string = `update gtd_jta set tb = ? where jti in ('` + ids.join(`', '`) + `')`;

    sqls.push([sql, [SyncType.synch]]);

    await this.sqlExce.batExecSqlByParam(sqls);

    // 同步完成后刷新缓存
    for (let id of ids) {
      this.getPlanItem(id).then((planitem) => {
        if (planitem) {
          this.emitService.emit("mwxing.calendar.activities.changed", planitem);
        }
      });
    }
  }

  /**
   * 接收日历项数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedPlanItem(jti: any) {

    this.assertEmpty(jti);   // 入参不能为空

    let pull: PullInData = new PullInData();

    pull.type = "PlanItem";

    if (jti instanceof Array) {
      pull.d.splice(0, 0, ...jti);
    } else {
      pull.d.push(jti);
    }

    // 发送下载日历项请求
    await this.dataRestful.pull(pull);

    return;
  }

  /**
   * 接收日历项保存到本地
   *
   * @author leon_xi@163.com
   **/
  async receivedPlanItemData(planitems: Array<PlanItemData>, status: SyncDataStatus): Promise<Array<PlanItemData>> {

    this.assertEmpty(planitems);      // 入参不能为空
    this.assertEmpty(status);         // 入参不能为空

    let sqlparam = new Array<any>();

    let saved: Array<PlanItemData> = new Array<PlanItemData>();

    for (let planitem of planitems) {
      let current = {} as PlanItemData;
      Object.assign(current, planitem);

      // 删除参与人时，通过这个字段传递删除数据
      if (status == SyncDataStatus.Deleted) {
        current.del = DelType.del;
      } else {
        // 删除字段不共享, 如果不存在需要设置默认值
        if (!current.del) current.del = DelType.undel;
      }

      current.tb = SyncType.synch;

      // 非共享字段，第一次接收需要付初值
      if (!current.bz) {
        current.bz = "";
      }

      if (!current.ji) {
        current.ji = "";
      }

      if (!current.tx) {
        let txjson: TxJson = new TxJson();

        current.tx = JSON.stringify(txjson);
        current.txs = txjson.text(planitem.sd,planitem.st);
      }

      if (!current.invitestatus) {
        current.invitestatus = InviteState.None;
      }

      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, current);
      sqlparam.push(planitemdb.rpTParam());

      //相关参与人更新
      if (current.rfg == RepeatFlag.NonRepeat || (current.rfg != RepeatFlag.NonRepeat && current.rtjti == '')) {
        let delpar = new ParTbl();
        delpar.obt = ObjectType.Calendar;
        delpar.obi = current.jti;
        sqlparam.push(delpar.dTParam());

        if (current.members && current.members.length > 0) {
          for (let member of current.members){
            let par = new ParTbl();
            Object.assign(par, member);

            par.pari = this.util.getUuid();
            par.obi = current.jti;
            par.obt = ObjectType.Calendar;
            par.tb = SyncType.synch;
            par.del = DelType.undel;

            sqlparam.push(par.rpTParam());
          }
        }
      }

      saved.push(current);
    }

    this.sqlExce.batExecSqlByParam(sqlparam);
    this.emitService.emit(`mwxing.calendar.activities.changed`, saved);

    return saved;
  }

  /**
   * 接受邀请
   *
   * @author leon_xi@163.com
   */
  async acceptReceivedPlanItem(jti: string): Promise<PlanItemData> {
    this.assertEmpty(jti);       // 入参不能为空

    let origin: PlanItemData = await this.getPlanItem(jti);

    let current: PlanItemData = {} as PlanItemData;
    Object.assign(current, origin);

    current.invitestatus = InviteState.Accepted;

    await this.savePlanItem(current, origin);

    return current;
  }

  /**
   * 拒绝邀请
   *
   * @author leon_xi@163.com
   */
  async rejectReceivedPlanItem(jti: string): Promise<PlanItemData> {
    this.assertEmpty(jti);       // 入参不能为空

    let origin: PlanItemData = await this.getPlanItem(jti);

    let current: PlanItemData = {} as PlanItemData;
    Object.assign(current, origin);

    current.invitestatus = InviteState.Rejected;
    current.del = DelType.del;                     // 拒绝的日程设置为删除, 从用户日历显示中删除

    await this.savePlanItem(current, origin);

    return current;
  }

  /**
   * 共享日历
   *
   * @author leon_xi@163.com
   **/
  async sendPlan(plan: PlanData) {
    this.assertEmpty(plan);     // 入参不能为空
    this.assertNotEqual(plan.jt, PlanType.PrivatePlan);   // 非自定义日历不能共享

    await this.syncPrivatePlans([plan]);

    return;
  }

  async requestInitialData() {
    let pull: PullInData = new PullInData();
    pull.type = "Plan|Attachment|Grouper|Memo|PlanItem|Agenda|Task|MiniTask";
    await this.dataRestful.pull(pull);
    return;
  }

  async requestDeviceDiffData(types: Array<string> = ["Grouper", "Attachment", "Agenda", "PlanItem", "Memo"]) {
    assertEmpty(types);   // 入参不能为空

    for (let type of types) {
      let daycounts: Array<DayCountCodec>;

      if (type == "Grouper") {
        daycounts = await this.grouperService.codecGrouper() || new Array<DayCountCodec>();
      }

      if (type == "Agenda") {
        daycounts = await this.eventService.codecAgendas() || new Array<DayCountCodec>();
      }

      if (type == "Attachment") {
        daycounts = await this.eventService.codecAttachments() || new Array<DayCountCodec>();
      }

      if (type == "PlanItem") {
        daycounts = await this.codecPlanItems() || new Array<DayCountCodec>();
      }

      if (type == "Memo") {
        daycounts = await this.memoService.codecMemos() || new Array<DayCountCodec>();
      }

      let code = daycounts.reduce((target, ele) => {
        if (target) {
          target += ",";
          target += ele.day;
          target += " ";
          target += ele.count;
        } else {
          target += ele.day;
          target += " ";
          target += ele.count;
        }

        return target;
      }, "");

      let pull: PullInData = new PullInData();
      pull.type = `${type}#Diff`;

      pull.d.push(code);

      await this.dataRestful.pull(pull);
    }

    return;
  }

  /**
   * 接收日历数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedPlan(ji: any) {

    this.assertEmpty(ji);   // 入参不能为空

    let pull: PullInData = new PullInData();

    pull.type = "Plan";

    if (ji instanceof Array) {
      pull.d.splice(0, 0, ...ji);
    } else {
      pull.d.push(ji);
    }

    // 发送下载日历请求
    await this.dataRestful.pull(pull);

    return;
  }

  /**
   * 接收日历保存到本地
   *
   * @author leon_xi@163.com
   **/
  async receivedPlanData(plan: PlanData, status: SyncDataStatus): Promise<PlanData> {

    this.assertEmpty(plan);     // 入参不能为空
    this.assertEmpty(plan.ji);  // 计划ID不能为空
    this.assertEmpty(status);   // 入参不能为空

    let plandb: JhaTbl = new JhaTbl();

    Object.assign(plandb, plan);

    if (status == SyncDataStatus.Deleted) {
      plandb.del = DelType.del;
    }
    plandb.tb = SyncType.synch;

    await this.sqlExce.repTByParam(plandb);

    let localplan: PlanData = {} as PlanData;

    Object.assign(localplan, plandb);
    this.emitService.emit(`mwxing.calendar.plans.changed`, localplan);

    return localplan;
  }

  /**
   * 同步指定或所有自定义日历
   *
   * @author leon_xi@163.com
   **/
  async syncPrivatePlans(plans: Array<PlanData> = new Array<PlanData>()) {
    this.assertEmpty(plans);    // 入参不能为空

    if (plans.length <= 0) {
      let sql: string = `select * from gtd_jha where jt = ? and (tb = ? or julianday(strftime('%Y-%m-%d', wtt, 'unixepoch', 'localtime')) <= julianday('2017-11-22'))`;

      plans = await this.sqlExce.getExtLstByParam<PlanData>(sql, [PlanType.PrivatePlan, SyncType.unsynch]) || plans;

      if (plans && plans.length > 0) {
        // this.util.toastStart(`发现${plans.length}条未同步日历, 开始同步...`, 1000);
        this.util.tellyou(`发现${plans.length}条未同步日历, 开始同步...`);
      }
    }

    // 存在未同步日历
    if (plans.length > 0) {
      // 构造Push数据结构
      let push: PushInData = new PushInData();

      for (let plan of plans) {
        if (plan.jt != PlanType.PrivatePlan) continue;

        let sync: SyncData = new SyncData();

        sync.src = UserConfig.account.id;
        sync.id = plan.ji;
        sync.type = "Plan";
        sync.title = plan.jn;
        sync.security = SyncDataSecurity.None;
        sync.datetime = moment.unix(plan.wtt).format("YYYY/MM/DD HH:mm");
        sync.invitestate = InviteState.None;

        // 设置删除状态
        if (plan.del == DelType.del) {
          sync.status = SyncDataStatus.Deleted;
        } else {
          sync.status = SyncDataStatus.UnDeleted;
        }

        sync.payload = plan;

        push.d.push(sync);
      }

      if (push.d.length > 0) await this.dataRestful.push(push);
    }

    return;
  }

  /**
   * 更新已同步标志
   * 根据日历ID和更新时间戳
   *
   * @author leon_xi@163.com
   **/
  async acceptSyncPrivatePlans(syncids: Array<string>) {

    this.assertEmpty(syncids);    // 入参不能为空

    if (syncids.length < 1) {     // 入参是空数组直接返回
      return;
    }

    let sqls: Array<any> = new Array<any>();

    for (let syncid of syncids) {
      sqls.push([`update gtd_jha set tb = ? where ji = ?`, [SyncType.synch, syncid]]);
    }

    await this.sqlExce.batExecSqlByParam(sqls);

    return;
  }

  /**
   * 分享日历
   *
   * 日历数据上传服务器，并获得分享URL
   *
   * @author leon_xi@163.com
   **/
  async sharePlan(plan: PlanData, refreshChildren: boolean = false): Promise<string> {
    this.assertEmpty(plan);     // 入参不能为空
    this.assertEmpty(plan.ji);  // 计划ID不能为空

    if (refreshChildren) {
      plan = await this.getPlan(plan.ji, true);   // 重新获取计划和计划子项目
    }

    let share: ShareInData = new ShareInData();

    share.from.phoneno = UserConfig.account.phone;
    share.from.name = UserConfig.account.name;
    share.payload = plan;

    return await this.dataRestful.share("plan", share);
  }

  private convertPlanData2Plan(src: PlanData): Plan {
    this.assertEmpty(src);      // 入参不能为空

    let dest: Plan = new Plan();

    dest.pn = {
      ji: src.ji,
      jn: src.jn,
      jc: src.jc
    };

    if (src.items && src.items.length > 0) {
      for (let item of src.items) {
        dest.pa.push(this.convertPlanActivity2PlanPa(item));
      }
    }

    return dest;
  }

  private convertPlanActivity2PlanPa(source: PlanItemData | TaskData | AgendaData | MiniTaskData | MemoData): PlanPa {
    let pa: PlanPa = new PlanPa();

    let src: any = source;

    if (src.jti) {  // PlanItemData
      //关联日程ID
      pa.rai = "";
      //日程发送人用户ID
      pa.fc = "";
      //日程ID
      pa.ai = (<PlanItemData>src).jti;
      //主题
      pa.at = (<PlanItemData>src).jtn;
      //时间(YYYY/MM/DD)
      pa.adt = (<PlanItemData>src).sd;
      //开始时间
      pa.st = (<PlanItemData>src).st;
      //结束日期
      pa.ed = (<PlanItemData>src).sd;
      //结束时间
      pa.et = (<PlanItemData>src).st;
      //计划
      pa.ap = (<PlanItemData>src).ji;
      //重复
      pa.ar = "";
      //提醒
      pa.aa = "";
      //备注
      pa.am = (<PlanItemData>src).bz;
      //优先级
      pa.px = (<PlanItemData>src).px;
    }

    if (src.evi && src.ed) {    // AgendaData
      //关联日程ID
      pa.rai = (<AgendaData>src).rtevi;
      //日程发送人用户ID
      pa.fc = (<AgendaData>src).ui;
      //日程ID
      pa.ai = (<AgendaData>src).evi;
      //主题
      pa.at = (<AgendaData>src).evn;
      //时间(YYYY/MM/DD)
      pa.adt = (<AgendaData>src).sd;
      //开始时间
      pa.st = (<AgendaData>src).st;
      //结束日期
      pa.ed = (<AgendaData>src).ed;
      //结束时间
      pa.et = (<AgendaData>src).et;
      //计划
      pa.ap = (<AgendaData>src).ji;
      //重复
      pa.ar = "";
      //提醒
      pa.aa = "";
      //备注
      pa.am = (<AgendaData>src).bz;
      //优先级
      pa.px = 0;
    }

    if (src.evi && src.cs) {    // TaskData
      //关联日程ID
      pa.rai = "";
      //日程发送人用户ID
      pa.fc = (<TaskData>src).ui;
      //日程ID
      pa.ai = (<TaskData>src).evi;
      //主题
      pa.at = (<TaskData>src).evn;
      //时间(YYYY/MM/DD)
      pa.adt = (<TaskData>src).evd;
      //开始时间
      pa.st = "99:99";
      //结束日期
      pa.ed = (<TaskData>src).evd;
      //结束时间
      pa.et = "99:99";
      //计划
      pa.ap = (<TaskData>src).ji;
      //重复
      pa.ar = "";
      //提醒
      pa.aa = "";
      //备注
      pa.am = (<TaskData>src).bz;
      //优先级
      pa.px = 0;
    }

    if (src.evi && !src.cs && !src.ed) {    // MiniTaskData
      //关联日程ID
      pa.rai = "";
      //日程发送人用户ID
      pa.fc = (<MiniTaskData>src).ui;
      //日程ID
      pa.ai = (<MiniTaskData>src).evi;
      //主题
      pa.at = (<MiniTaskData>src).evn;
      //时间(YYYY/MM/DD)
      pa.adt = (<MiniTaskData>src).evd;
      //开始时间
      pa.st = "99:99";
      //结束日期
      pa.ed = (<MiniTaskData>src).evd;
      //结束时间
      pa.et = "99:99";
      //计划
      pa.ap = (<MiniTaskData>src).ji;
      //重复
      pa.ar = "";
      //提醒
      pa.aa = "";
      //备注
      pa.am = (<MiniTaskData>src).bz;
      //优先级
      pa.px = 0;
    }

    if (src.moi) {    // MemoData
      //关联日程ID
      pa.rai = "";
      //日程发送人用户ID
      pa.fc = "";
      //日程ID
      pa.ai = (<MemoData>src).moi;
      //主题
      pa.at = (<MemoData>src).mon;
      //时间(YYYY/MM/DD)
      pa.adt = (<MemoData>src).sd;
      //开始时间
      pa.st = "99:99";
      //结束日期
      pa.ed = (<MemoData>src).sd;
      //结束时间
      pa.et = "99:99";
      //计划
      pa.ap = (<MemoData>src).ji;
      //重复
      pa.ar = "";
      //提醒
      pa.aa = "";
      //备注
      pa.am = "";
      //优先级
      pa.px = 0;
    }

    return pa;
  }

  /**
   * 获取翻页活动数据（用于日程一览）
   *
   * 默认一页显示1周7天, 可指定天数（使用奇数7, 9, 11, ...）
   * 支持向上或向下翻页
   * 默认查询当天向前3天以及向后3天共7天数据
   *
   * @author leon_xi@163.com
   **/
  async fetchPagedActivities(day: string = moment().format("YYYY/MM/DD"), direction: PageDirection = PageDirection.PageInit, daysPerPage: number = 7): Promise<PagedActivityData> {

    this.assertEmpty(day);          // 入参不能为空
    this.assertEmpty(direction);    // 入参不能为空
    this.assertEmpty(daysPerPage);  // 入参不能为空

    let pagedActivities: PagedActivityData = new PagedActivityData();

    let startday: string = day;
    let endday: string = day;

    switch(direction) {
      case PageDirection.PageInit :
        startday = moment(day, "YYYY/MM/DD").subtract(Math.floor(daysPerPage / 2), "days").format("YYYY/MM/DD");
        endday = moment(day, "YYYY/MM/DD").add(Math.floor(daysPerPage / 2), "days").format("YYYY/MM/DD");
        break;
      case PageDirection.PageDown :
        endday = moment(day, "YYYY/MM/DD").subtract(1, "days").format("YYYY/MM/DD");
        startday = moment(day, "YYYY/MM/DD").subtract(daysPerPage, "days").format("YYYY/MM/DD");
        break;
      case PageDirection.PageUp :
        startday = moment(day, "YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");
        endday = moment(day, "YYYY/MM/DD").add(daysPerPage, "days").format("YYYY/MM/DD");
        break;
      default:
        this.assertFail();
    }

    pagedActivities.startday = startday;
    pagedActivities.endday = endday;

    let days: Map<string, DayActivityData> = new Map<string, DayActivityData>();

    // 初始化每日记录
    days.set(startday, new DayActivityData(startday));
    let stepday: string = startday;
    while (stepday != endday) {
      stepday = moment(stepday, "YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");

      let day: string = stepday;
      days.set(day, new DayActivityData(day));
    }

    // 检索日历项记录
    let sqlcalitems: string = `select * from gtd_jta where sd >= '${startday}' and sd <= '${endday}' order by st asc`;

    pagedActivities.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems) || pagedActivities.calendaritems;

    days = pagedActivities.calendaritems.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.calendaritems.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    // 检索事件记录
    let sqlevents: string = `select * from gtd_ev where evd >= '${startday}' and evd <= '${endday}' `;

    pagedActivities.events = await this.sqlExce.getExtList<EventData>(sqlevents) || pagedActivities.events;

    days = pagedActivities.events.reduce((days, value) => {
      let day: string = value.evd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.events.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    // 检索备忘记录
    let sqlmemos: string = `select * from gtd_mom where sd >= '${startday}' and sd <= '${endday}'`;

    pagedActivities.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos) || pagedActivities.memos;

    days = pagedActivities.memos.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.memos.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    pagedActivities.days = days;

    return pagedActivities;
  }

  /**
   * 合并(更新/插入/删除)翻页活动数据（用于日程一览）
   *
   * 避免重复查询数据库, 提高效率
   * 不属于当页日期范围内的活动将被忽略
   *
   * @author leon_xi@163.com
   **/
  mergePagedActivities(pagedActivities: PagedActivityData, activitiedatas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>): PagedActivityData {

    // 入参不能为空
    this.assertEmpty(pagedActivities);            // 翻页数据不能为空
    this.assertEmpty(pagedActivities.startday);   // 翻页数据开始日期不能为空
    this.assertEmpty(pagedActivities.endday);     // 翻页数据结束日期不能为空
    this.assertEmpty(activitiedatas);                 // 活动数据不能为空

    let activities: Array<any> = activitiedatas;

    // 没有合并数据直接返回
    if (activities.length == 0) {
      return pagedActivities;
    }

    let startday: string = pagedActivities.startday;
    let endday: string = pagedActivities.endday;

    // 循环合并更新活动
    for (let activity of activities) {
      let day: string = "";
      let activityType: string = this.getActivityType(activity);

      // 取得活动日期
      switch (activityType) {
        case "PlanItemData" :
          day = activity.sd;
          break;
        case "AgendaData" :
          day = activity.evd;
          break;
        case "TaskData" :
          day = activity.evd;
          break;
        case "MiniTaskData" :
          day = activity.evd;
          break;
        case "MemoData" :
          day = activity.sd;
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }

      // 不属于当页日期范围内的活动忽略
      if (startday > day || day > endday) {
        continue;
      }

      // 获取既存活动ID, 用于判断更新/插入/删除
      let calendaritemids: Array<string> = new Array<string>();
      let eventids: Array<string> = new Array<string>();
      let memoids: Array<string> = new Array<string>();

      pagedActivities.calendaritems.reduce((calendaritemids, value) => {
        calendaritemids.push(value.jti);
        return calendaritemids;
      }, calendaritemids);
      pagedActivities.events.reduce((eventids, value) => {
        eventids.push(value.evi);
        return eventids;
      }, eventids);
      pagedActivities.memos.reduce((memoids, value) => {
        memoids.push(value.moi);
        return memoids;
      }, memoids);

      // 更新/插入/删除活动数据
      let index: number = -1;

      switch (activityType) {
        case "PlanItemData" :
          index = calendaritemids.indexOf(activity.jti);

          let item: PlanItemData = {} as PlanItemData;
          Object.assign(item, activity);

          if (index >= 0) {
            // 更新/删除
            if (item.del == DelType.del) {
              // 删除
              if (index == 0) {
                pagedActivities.calendaritems = pagedActivities.calendaritems.slice(1);
              } else {
                pagedActivities.calendaritems = pagedActivities.calendaritems.slice(0, index).concat(pagedActivities.calendaritems.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                pagedActivities.calendaritems = pagedActivities.calendaritems.slice(1);
                pagedActivities.calendaritems.unshift(item);
              } else {
                let tail = pagedActivities.calendaritems.slice(index + 1);
                tail.unshift(item);
                pagedActivities.calendaritems = pagedActivities.calendaritems.slice(0, index).concat(tail);
              }
            }
          } else {
            // 插入
            pagedActivities.calendaritems.push(item);
          }
          break;
        case "AgendaData" :
        case "TaskData" :
        case "MiniTaskData" :
          index = eventids.indexOf(activity.evi);

          let event: EventData = {} as EventData;
          Object.assign(event, activity);

          if (index >= 0) {
            // 更新/删除
            if (event.del == DelType.del) {
              // 删除
              if (index == 0) {
                pagedActivities.events = pagedActivities.events.slice(1);
              } else {
                pagedActivities.events = pagedActivities.events.slice(0, index).concat(pagedActivities.events.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                pagedActivities.events = pagedActivities.events.slice(1);
                pagedActivities.events.unshift(event);
              } else {
                let tail = pagedActivities.events.slice(index + 1);
                tail.unshift(event);
                pagedActivities.events = pagedActivities.events.slice(0, index).concat(tail);
              }
            }
          } else {
            pagedActivities.events.push(event);
          }
          break;
        case "MemoData" :
          let memo: MemoData = {} as MemoData;
          Object.assign(memo, activity);

          index = memoids.indexOf(activity.moi);
          if (index >= 0) {
            // 更新/删除
            if (memo.del == DelType.del) {
              // 删除
              if (index == 0) {
                pagedActivities.memos = pagedActivities.memos.slice(1);
              } else {
                pagedActivities.memos = pagedActivities.memos.slice(0, index).concat(pagedActivities.memos.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                pagedActivities.memos = pagedActivities.memos.slice(1);
                pagedActivities.memos.unshift(memo);
              } else {
                let tail = pagedActivities.memos.slice(index + 1);
                tail.unshift(memo);
                pagedActivities.memos = pagedActivities.memos.slice(0, index).concat(tail);
              }
            }
          } else {
            pagedActivities.memos.push(memo);
          }
          break;
        default:
          this.assertFail();  // 不能有上述以外的活动
      }
    }

    // 重构每天活动数据
    let days: Map<string, DayActivityData> = new Map<string, DayActivityData>();

    // 初始化每日记录
    days.set(startday, new DayActivityData(startday));
    let stepday: string = startday;
    while (stepday != endday) {
      stepday = moment(stepday, "YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD");

      let day: string = stepday;
      days.set(day, new DayActivityData(day));
    }

    days = pagedActivities.calendaritems.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.calendaritems.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    days = pagedActivities.events.reduce((days, value) => {
      let day: string = value.evd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.events.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    days = pagedActivities.memos.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.memos.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    pagedActivities.days = days;

    return pagedActivities;
  }

  /**
   * 取得数据类型
   *
   * @author leon_xi@163.com
   **/
  getDataType(source: PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData | Attachment | Grouper | Annotation): string {
    this.assertEmpty(source);

    let src: any = source;

    if (src.jti) {  // PlanItemData
      return "PlanItem";
    }

    if (src.evi && src.type == EventType.Agenda) {    // AgendaData
      return "Agenda";
    }

    if (src.evi && src.type == EventType.Task) {    // TaskData
      return "Task";
    }

    if (src.evi && src.type == EventType.MiniTask) {    // MiniTaskData
      return "MiniTask";
    }

    if (src.moi) {    // MemoData
      return "Memo";
    }

    if (src.fji) {    // Attachment
      return "Attachment";
    }

    if (src.gi) {    // Grouper
      return "Grouper";
    }

    if (src.ati) {    // Annotation
      return "Annotation";
    }

    this.assertFail();

  }

  /**
   * 取得活动类型
   *
   * @author leon_xi@163.com
   **/
  getActivityType(source: PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData): string {

    this.assertEmpty(source);

    let src: any = source;

    if (src.jti) {  // PlanItemData
      return "PlanItemData";
    }

    if (src.evi && src.type == EventType.Agenda) {    // AgendaData
      return "AgendaData";
    }

    if (src.evi && src.type == EventType.Task) {    // TaskData
      return "TaskData";
    }

    if (src.evi && src.type == EventType.MiniTask) {    // MiniTaskData
      return "MiniTaskData";
    }

    if (src.moi) {    // MemoData
      return "MemoData";
    }

    this.assertFail();
  }

  /**
   * 备份所有日历和活动
   *
   * JhaTbl
   * JtaTbl
   * EvTbl
   * CaTbl
   * TTbl
   * MomTbl
   * ParTbl
   * FjTbl
   * WaTbl    提醒不备份
   * MrkTbl   标注不备份
   *
   * @author leon_xi@163.com
   **/
  async backupCalendar(bts: number) {
    this.assertEmpty(bts);    // 入参不能为空

    // JhaTbl
    // JtaTbl
    await this.backup(bts);

    // EvTbl
    // CaTbl
    // TTbl
    await this.eventService.backup(bts);

    // MomTbl
    await this.memoService.backup(bts);

    // ParTbl
    // FjTbl
    // WaTbl    提醒不备份
    // MrkTbl   标注不备份
    let backupPro: BackupPro = new BackupPro();
    //操作账户ID
    backupPro.oai = UserConfig.account.id
    //操作手机号码
    backupPro.ompn = UserConfig.account.phone;
    //时间戳
    backupPro.d.bts = bts;

    // 参与人
    let par = new ParTbl();
    backupPro.d.par = await this.sqlExce.getLstByParam<ParTbl>(par);

    // 附件
    let fj = new FjTbl();
    backupPro.d.fj = await this.sqlExce.getLstByParam<FjTbl>(fj);

    await this.bacRestful.backup(backupPro);

    return;
  }

  /**
   * 恢复所有日历和活动
   *
   * JhaTbl
   * JtaTbl
   * EvTbl
   * CaTbl
   * TTbl
   * MomTbl
   * ParTbl
   * FjTbl
   * WaTbl
   * MrkTbl
   *
   * @author leon_xi@163.com
   **/
  async recoveryCalendar(bts: number, autoSave: boolean = true): Promise<Array<any>> {
    this.assertEmpty(bts);   // 入参不能为空

    let recoverPro: RecoverPro = new RecoverPro();
    //操作账户ID
    recoverPro.oai = UserConfig.account.id;
    //操作手机号码
    recoverPro.ompn = UserConfig.account.phone;
    recoverPro.d.bts = bts;
    let rdn = new Array <string> ();
    rdn.push('jha');
    rdn.push('jta');
    rdn.push('ev');
    rdn.push('ca');
    rdn.push('tt');
    rdn.push('mom');
    rdn.push('par');
    rdn.push('fj');
    recoverPro.d.rdn = rdn;
    let recoveries = await this.bacRestful.recover(recoverPro);

    // JhaTbl
    // JtaTbl
    let planrecoveries = this.recovery(recoveries);

    // EvTbl
    // CaTbl
    // TTbl
    let eventrecoveries = this.eventService.recovery(recoveries);

    // MomTbl
    let memorecoveries = this.memoService.recovery(recoveries);

    // ParTbl
    // FjTbl
    // WaTbl    提醒不备份 删除原有提醒, 恢复数据提醒重新生成(过期提醒无需生成)
    // MrkTbl   标注不备份 删除原有标注, 恢复数据标注重新生成
    let sqls: Array<any> = new Array<any>();

    let pars = recoveries.par;

    // 删除参与人
    sqls.push([`delete from gtd_par;`, []]);

    // 恢复备份参与人
    for (let par of pars) {
      let pardb: ParTbl = new ParTbl();
      Object.assign(pardb, par);

      sqls.push(pardb.inTParam());
    }

    let fjs = recoveries.fj;

    // 删除附件
    sqls.push([`delete from gtd_fj;`, []]);

    // 恢复备份附件
    for (let fj of fjs) {
      let fjdb: ParTbl = new ParTbl();
      Object.assign(fjdb, fj);

      sqls.push(fjdb.inTParam());
    }

    // 自动保存到数据库
    if (autoSave) {
      await this.sqlExce.batExecSqlByParam([...planrecoveries, ...eventrecoveries, ...memorecoveries, ...sqls]);
    }

    return [...planrecoveries, ...eventrecoveries, ...memorecoveries, ...sqls];
  }

  /**
   * 备份日历和日历项
   *
   * @author leon_xi@163.com
   **/
  async backup(bts: number) {
    this.assertEmpty(bts);    // 入参不能为空

    let backupPro: BackupPro = new BackupPro();
    //操作账户ID
    backupPro.oai = UserConfig.account.id
    //操作手机号码
    backupPro.ompn = UserConfig.account.phone;
    //时间戳
    backupPro.d.bts = bts;

    // 日历(自定义日历)
    let jha = new JhaTbl();
    jha.jt = PlanType.PrivatePlan;

    backupPro.d.jha = await this.sqlExce.getLstByParam<JhaTbl>(jha);

    // 日历项(自定义日历项)
    let jtasql = `select * from gtd_jta where ji in (select ji from gtd_jha where jt = ?) or ji is null or ji = ?`;
    backupPro.d.jta = await this.sqlExce.getExtLstByParam<JtaTbl>(jtasql, [PlanType.PrivatePlan, '']);

    await this.bacRestful.backup(backupPro);

    return;
  }

  /**
   * 恢复日历和日历项
   *
   * @author leon_xi@163.com
   **/
  recovery(recoveries: OutRecoverPro): Array<any> {
    this.assertEmpty(recoveries);   // 入参不能为空

    let sqls: Array<any> = new Array<any>();

    let planitems = recoveries.jta;

    // 删除自定义日历项
    sqls.push([`delete from gtd_jta where ji in (select ji from gtd_jha where jt = ?) or ji is null or ji = ?;`, [PlanType.PrivatePlan, '']]);

    // 恢复备份日历项
    for (let planitem of planitems) {
      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, planitem);

      sqls.push(planitemdb.inTParam());
    }

    let plans = recoveries.jha;

    // 删除自定义日历
    sqls.push([`delete from gtd_jha where jt = ?`, [PlanType.PrivatePlan]]);

    // 恢复备份日历
    for (let plan of plans) {
      let plandb: JhaTbl = new JhaTbl();
      Object.assign(plandb, plan);

      sqls.push(plandb.inTParam());
    }

    return sqls;
  }
}

export class FindActivityCondition {
  sd: string;
  ed: string;
  st: string;
  et: string;
  text: string;
  mark: Array<string> = new Array<string>();
  target: Array<ObjectType> = new Array<ObjectType>();
}

export interface PlanData extends JhaTbl {
  items: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>;
  members: Array<Member>;
}

export interface PlanSummaryData extends JhaTbl {
  itemscount: number;
  eventscount: number;
  memoscount: number;
}

export interface PlanItemData extends JtaTbl {
  rtjson: RtJson;
  txjson: TxJson;
  members: Array<Member>;
}

export class ReadWriteKey {
  type: string;
  id: string;
  mark: string;
  rw: string;

  constructor(type: string, id: string, mark: string, rw: string) {
    this.type = type;
    this.id = id;
    this.mark = mark;
    this.rw = rw;
  }

  encode(): string {
    return JSON.stringify(this);
  }

  static decode(code: string): ReadWriteKey {
    let coder = JSON.parse(code);

    return new ReadWriteKey(coder.type, coder.id, coder.mark, coder.rw);
  }
}

export interface ReadWriteData extends RwTbl {
}

export class PagedActivityData {
  startday: string;                     // 开始日期
  endday: string;                       // 结束日期
  calendaritems: Array<PlanItemData> = new Array<PlanItemData>();   // 日历项
  events: Array<EventData> = new Array<EventData>();             // 事件
  memos: Array<MemoData> = new Array<MemoData>();               // 备忘
  days: Map<string, DayActivityData> = new Map<string, DayActivityData>();   // 指定期间每天的活动
}

export class MonthActivityData {
  month: string;                        // 所属年月
  calendaritems: Array<PlanItemData> = new Array<PlanItemData>();   // 日历项
  events: Array<EventData> = new Array<EventData>();             // 事件
  memos: Array<MemoData> = new Array<MemoData>();               // 备忘
  days: Map<string, DayActivityData> = new Map<string, DayActivityData>();   // 当月每天的活动
  arraydays: Array<DayActivityData> = new Array<DayActivityData>();
}

export class DayActivityData {
  day: string;                                                      // 所属日期
  calendaritems: Array<PlanItemData> = new Array<PlanItemData>();   // 日历项
  events: Array<EventData> = new Array<EventData>();                // 事件
  memos: Array<MemoData> = new Array<MemoData>();                   // 备忘
  weather: PlanItemData;                       // 天气JSON字符串

  constructor(day: string = "") {
    this.day = day;
  }
}

export class ActivityData {
  condition: FindActivityCondition;     // 查询条件
  calendaritems: Array<PlanItemData> = new Array<PlanItemData>();   // 日历项
  events: Array<EventData> = new Array<EventData>();             // 事件
  memos: Array<MemoData> = new Array<MemoData>();               // 备忘
}

export class ActivitySummaryData {
  calendaritemscount: number;   // 日期日历项数量
  activityitemscount: number;   // 活动日历项数量
  eventscount: number;          // 事件数量
  agendascount: number;         // 日程数量
  taskscount: number;           // 任务数量
  memoscount: number;           // 备忘数量
  repeateventscount: number;    // 重复事件数量
  acceptableeventscount: number;// 待接受事件数量
  bookedtimesummary: number;    // 总预定时长
}

export class ExchangeSummaryData {
  phone: string;                // 手机号码
  sendactivities: number = 0;       // 发出活动数量
  receivedactivities: number = 0;   // 接收活动数量
  sendplanitems: number = 0;        // 发出日历项数量
  receivedplanitems: number = 0;    // 接收日历项数量

  constructor(phone: string = "") {
    this.phone = phone;
  }
}

export class MonthActivitySummaryData {
  month: string;                        // 所属年月
  days: Array<DayActivitySummaryData> = new Array<DayActivitySummaryData>();  // 每日活动汇总
}

export class DayActivitySummaryData {
  day: string;                  // 所属日期
  daycalendaritem: string;      // 每日日历项
  calendaritemscount: number;   // 日期日历项数量
  activityitemscount: number;   // 活动日历项数量
  eventscount: number;          // 事件数量
  agendascount: number;         // 日程数量
  taskscount: number;           // 任务数量
  memoscount: number;           // 备忘数量
  repeateventscount: number;    // 重复事件数量
  acceptableeventscount: number;// 待接受事件数量
  bookedtimesummary: number;    // 总预定时长
}

export function generateDataType(activityType: string) {
  let datatype: string = "";

  switch(activityType) {
    case "PlanData":
      datatype = "Plan";
      break;
    case "PlanItemData":
      datatype = "PlanItem";
      break;
    case "AgendaData":
      datatype = "Agenda";
      break;
    case "TaskData":
      datatype = "Task";
      break;
    case "MiniTaskData":
      datatype = "MiniTask";
      break;
    case "MemoData":
      datatype = "Memo";
      break;
    default:
      datatype = "Invalid Data Type";
  }

  return datatype;
}

export function cloneObject<T>(origin: T) {
  let cloned: T = {} as T;
  Object.assign(cloned, origin);

  return cloned;
}
