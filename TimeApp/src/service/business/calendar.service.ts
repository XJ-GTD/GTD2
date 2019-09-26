import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { BipdshaeData, Plan, PlanPa, ShareData, ShaeRestful } from "../restful/shaesev";
import { SyncData, PushInData, PullInData, DataRestful } from "../restful/datasev";
import { BackupPro, BacRestful, OutRecoverPro, RecoverPro } from "../restful/bacsev";
import { EventData, TaskData, AgendaData, MiniTaskData, EventService, RtJson, TxJson, generateRtJson, generateTxJson } from "./event.service";
import { MemoData, MemoService } from "./memo.service";
import { EventType, PlanType, PlanItemType, PlanDownloadType, ConfirmType, OperateType, ObjectType, PageDirection, CycleType, SyncType, RepeatFlag, DelType, SyncDataSecurity, SyncDataStatus } from "../../data.enum";
import { UserConfig } from "../config/user.config";
import * as moment from "moment";
import { JhaTbl } from "../sqlite/tbl/jha.tbl";
import { JtaTbl } from "../sqlite/tbl/jta.tbl";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { MomTbl } from "../sqlite/tbl/mom.tbl";
import { ParTbl } from "../sqlite/tbl/par.tbl";
import { FjTbl } from "../sqlite/tbl/fj.tbl";
import {
  assertNotEqual,
  assertEqual,
  assertTrue,
  assertFalse,
  assertNotNumber,
  assertNumber,
  assertEmpty,
  assertNotEmpty,
  assertNull,
  assertNotNull,
  assertFail
} from "../../util/util";

@Injectable()
export class CalendarService extends BaseService {

  private calendaractivities: Array<MonthActivityData> = new Array<MonthActivityData>();

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private userConfig: UserConfig,
              private eventService: EventService,
              private memoService: MemoService,
              private bacRestful: BacRestful,
              private shareRestful: ShaeRestful,
              private dataRestful: DataRestful) {
    super();
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
    if (moment(month).isBefore(firstMonth)) {
      let currentMonth: string = moment(firstMonth).subtract(1, "months").format("YYYY/MM");

      while(true) {
        await this.getCalendarActivities(PageDirection.PageDown);

        if (month == currentMonth) {
          break;
        }

        currentMonth = moment(currentMonth).subtract(1, "months").format("YYYY/MM");
      }
    }

    // 往后添加
    if (moment(lastMonth).isBefore(month)) {
      let currentMonth: string = moment(lastMonth).add(1, "months").format("YYYY/MM");

      while(true) {
        await this.getCalendarActivities(PageDirection.PageUp);

        if (month == currentMonth) {
          break;
        }

        currentMonth = moment(currentMonth).add(1, "months").format("YYYY/MM");
      }
    }

    return this.calendaractivities;
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
  async getCalendarActivities(direction: PageDirection = PageDirection.PageInit): Promise<Array<MonthActivityData>> {
    this.assertEmpty(direction);    // 入参不能为空

    switch(direction) {
      case PageDirection.PageInit :
        this.calendaractivities = new Array<MonthActivityData>();   // 强制重新初始化

        this.calendaractivities.push(await this.fetchMonthActivities(moment().subtract(1, "months").format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().format("YYYY/MM")));
        this.calendaractivities.push(await this.fetchMonthActivities(moment().add(1, "months").format("YYYY/MM")));

        // 活动变化时自动更新日历显示列表数据
        this.emitService.destroy("mwxing.calendar.activities.changed");
        this.emitService.register("mwxing.calendar.activities.changed", (data) => {
          if (!data) {
            this.assertFail("事件mwxing.calendar.activities.changed无扩展数据");
            return;
          }

          // 多条数据同时更新/单条数据更新
          if (data instanceof Array) {
            // 获取每月最后一条数据的索引位置
            let monthlyLastDataIndex: Map<string, number> = data.reduce((target, val, index) => {
              if (val.evd) {
                let month: string = moment(val.evd).format("YYYY/MM");
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
          } else {
            this.mergeCalendarActivity(data);
          }
        });

        break;
      case PageDirection.PageUp :
        if (this.calendaractivities.length < 1) {
          this.assertFail("getCalendarActivities 调用PageDirection.PageUp之前, 请先调用PageDirection.PageInit。");
        }
        let lastmonth: string = this.calendaractivities[this.calendaractivities.length - 1].month;
        this.calendaractivities.push(await this.fetchMonthActivities(moment(lastmonth).add(1, "months").format("YYYY/MM")));
        break;
      case PageDirection.PageDown :
        if (this.calendaractivities.length < 1) {
          this.assertFail("getCalendarActivities 调用PageDirection.PageDown, 请先调用PageDirection.PageInit。");
        }
        let firstmonth: string = this.calendaractivities[0].month;
        this.calendaractivities.unshift(await this.fetchMonthActivities(moment(firstmonth).subtract(1, "months").format("YYYY/MM")));
        break;
      default:
        this.assertFail();    // 非法参数
    }

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
        currentmonth = moment(item.sd).format("YYYY/MM");

        if (moment(firstmonth).diff(currentmonth, "months") <= 0 && moment(currentmonth).diff(lastmonth, "months") <= 0) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [item], update);
        }

        break;
      case "AgendaData" :
        // 转换成匹配对象类型
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(agenda.evd).format("YYYY/MM");

        if (moment(firstmonth).diff(currentmonth, "months") <= 0 && moment(currentmonth).diff(lastmonth, "months") <= 0) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [agenda], update);
        }

        break;
      case "TaskData" :
        // 转换成匹配对象类型
        let task: TaskData = {} as TaskData;
        Object.assign(task, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(task.evd).format("YYYY/MM");

        if (moment(firstmonth).diff(currentmonth, "months") <= 0 && moment(currentmonth).diff(lastmonth, "months") <= 0) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [task], update);
        }

        break;
      case "MiniTaskData" :
        // 转换成匹配对象类型
        let minitask: MiniTaskData = {} as MiniTaskData;
        Object.assign(minitask, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(minitask.evd).format("YYYY/MM");

        if (moment(firstmonth).diff(currentmonth, "months") <= 0 && moment(currentmonth).diff(lastmonth, "months") <= 0) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [minitask], update);
        }

        break;
      case "MemoData" :
        // 转换成匹配对象类型
        let memo: MemoData = {} as MemoData;
        Object.assign(memo, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(memo.sd).format("YYYY/MM");

        if (moment(firstmonth).diff(currentmonth, "months") <= 0 && moment(currentmonth).diff(lastmonth, "months") <= 0) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [memo], update);
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
        plan.members = plan.members || new Array<PlanMember>();
      }

      await this.sqlExce.batExecSqlByParam(sqls);

      this.emitService.emit(`mwxing.calendar.plans.changed`, plan);
    } else {
      // 新建
      let sqls: Array<any> = new Array<any>();

      plan.ji = this.util.getUuid();
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
        plan.members = plan.members || new Array<PlanMember>();
      }

      await this.sqlExce.batExecSqlByParam(sqls);

      this.emitService.emit(`mwxing.calendar.plans.changed`, plan);
    }

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

    plan.members = await this.sqlExce.getExtLstByParam<PlanMember>(planmembersql, [ObjectType.CalendarPlan, ji, DelType.undel]) || new Array<PlanMember>();

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
  async removePlan(ji: string, jt: PlanType, withchildren: boolean = true) {

    this.assertEmpty(ji);   // id不能为空
    this.assertNull(jt);    // 计划类型不能为空

    let sqls: Array<any> = this.removePlanSqls(ji, jt, withchildren);

    await this.sqlExce.batExecSqlByParam(sqls);

    return;
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

    let planitem: PlanItemData = {} as PlanItemData;

    Object.assign(planitem, planitemdb);

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
            item.txs = txjson.text();

            let planitemdb: JtaTbl = new JtaTbl();
            Object.assign(planitemdb, item);

            planitemdb.tb = SyncType.unsynch;

            await this.sqlExce.updateByParam(planitemdb);

            Object.assign(item, planitemdb);

            items.push(item);
          } else {
            // 修改为重复日历项(删除后创建)
            let sqls: Array<any> = new Array<any>();

            // 删除当前日历项
            origin.del = DelType.del;
            origin.synch = SyncType.unsynch;

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
            items.push(origin);

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
              item.txs = txjson.text();

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
                item.rfg = RepeatFlag.RepeatToNon;

                item.rtjson = rtjson;
                item.rt = JSON.stringify(rtjson);
                item.rts = rtjson.text();

                item.txjson = txjson;
                item.tx = JSON.stringify(txjson);
                item.txs = txjson.text();

                let planitemdb: JtaTbl = new JtaTbl();
                Object.assign(planitemdb, item);

                planitemdb.tb = SyncType.unsynch;

                await this.sqlExce.updateByParam(planitemdb);

                Object.assign(item, planitemdb);

                items.push(item);
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
                                              and sd >= ?3
                                              and del <> ?4
                                            order by sd asc`;

                let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, RepeatFlag.Repeat, origin.sd, DelType.undel]) || new Array<PlanItemData>();

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
                                            and sd >= ?3
                                            and del <> ?4
                                          order by sd asc`;

              let futurealloriginitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [futureallrtjti, RepeatFlag.Repeat, origin.sd, DelType.undel]) || new Array<PlanItemData>();

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

              let alloriginitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchAll, [allrtjti, RepeatFlag.Repeat, DelType.undel]) || new Array<PlanItemData>();

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

    let items: Array<PlanItemData> = new Array<PlanItemData>();
    let itemdbs: Array<JtaTbl> = new Array<JtaTbl>();

    let rtjson: RtJson = generateRtJson(item.rtjson, item.rt);
    let txjson: TxJson = generateTxJson(item.txjson, item.tx);

    let rtjti: string = "";

    rtjson.each(item.sd, (day) => {
      let newitem: PlanItemData = {} as PlanItemData;
      Object.assign(newitem, item);

      newitem.jti = this.util.getUuid();
      newitem.sd = day;

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

      newitem.rtjson = rtjson;
      newitem.rt = JSON.stringify(rtjson);
      newitem.rts = rtjson.text();

      newitem.txjson = txjson;
      newitem.tx = JSON.stringify(txjson);
      newitem.txs = txjson.text();

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
        origin.synch = SyncType.unsynch;

        let planitemdb: JtaTbl = new JtaTbl();
        Object.assign(planitemdb, origin);

        sqls.push(planitemdb.upTParam());

        itemsid.push(origin.jti);
        items.push(origin);
      }

      // 删除当前选择以及将来所有日历项
      if (modiType == OperateType.FromSel) {
        // 删除将来所有重复日历项
        let rtjti: string = origin.rtjti? origin.rtjti : origin.jti;

        let fetchFromSel: string = `select *
                                    from gtd_jta
                                    where (jti = ?1 or rtjti = ?1)
                                      and rfg = ?2
                                      and sd >= ?3
                                      and del <> ?4
                                    order by sd asc`;

        let originitems: Array<PlanItemData> = await this.sqlExce.getExtLstByParam<PlanItemData>(fetchFromSel, [rtjti, RepeatFlag.Repeat, origin.sd, DelType.undel]) || new Array<PlanItemData>();

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
      origin.synch = SyncType.unsynch;

      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, origin);

      sqls.push(planitemdb.upTParam());

      itemsid.push(origin.jti);
      items.push(origin);
    }

    // 设置关联数据删除标志
    sqls.push([`update gtd_par set del = ?, tb = ? where obt = ? and obi in (' + itemsid.join(', ') + ')`, [DelType.del, SyncType.unsynch, ObjectType.Calendar]]);
    sqls.push([`update gtd_fj set del = ?, tb = ? where obt = ? and obi in (' + itemsid.join(', ') + ')`, [DelType.del, SyncType.unsynch, ObjectType.Calendar]]);
    sqls.push([`delete from gtd_wa where obt = ? and obi in (' + itemsid.join(', ') + ')`, [ObjectType.Calendar,]]);    // 提醒表
    sqls.push([`delete from gtd_mrk where obt = ? and obi in (' + itemsid.join(', ') + ')`, [ObjectType.Calendar]]);   // 标签表

    // 执行SQL
    await this.sqlExce.batExecSqlByParam(sqls);

    this.emitService.emit(`mwxing.calendar.activities.changed`, items);

    return items;
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
      let planagendas: Array<AgendaData> = await this.sqlExce.getExtLstByParam<AgendaData>(subsqlagenda, [plan.ji, RepeatFlag.NonRepeat, RepeatFlag.Repeat, RepeatFlag.RepeatToNon, DelType.del, EventType.Agenda]) || new Array<AgendaData>();

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
      let plantasks: Array<TaskData> = await this.sqlExce.getExtLstByParam<TaskData>(subsqltask, [plan.ji, RepeatFlag.NonRepeat, RepeatFlag.Repeat, RepeatFlag.RepeatToNon, DelType.del, EventType.Task]) || new Array<TaskData>();

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
          planitemdb.jtn = pa.at;     //日程事件主题  必传
          planitemdb.sd = moment(pa.adt).format("YYYY/MM/DD");  //所属日期      必传
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
   * 获取指定年月下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchMonthActivitiesSummary(month: string = moment().format('YYYY/MM')): Promise<MonthActivitySummaryData> {

    this.assertEmpty(month);    // 入参不能为空

    let days: number = moment(month).daysInMonth();
    let arrDays: Array<string> = new Array<string>(days).fill("01");  // 必须要先填充, 否则不能map
    arrDays = arrDays.map((value, index) => {
      return (month + "/" + ("0" + (index + 1)).slice(-2));
    });
    console.log(arrDays.join(","));
    let daysql: string = `select '${arrDays.join(`' sd union all select '`)}' sd`;

    let sql: string = `select gdaymom.day day,
                          dayitem.jtn daycalendaritem,
                          gdaymom.calendaritemscount calendaritemscount,
                          gdaymom.activityitemscount activityitemscount,
                          gdaymom.eventscount eventscount,
                          gdaymom.agendascount agendascount,
                          gdaymom.taskscount taskscount,
                          gdaymom.repeateventscount repeateventscount,
                          gdaymom.memoscount memoscount,
                          gdaymom.bookedtimesummary bookedtimesummary
                      from (select gdayev.day day,
                                max(gdayev.calendaritemscount) calendaritemscount,
                                max(gdayev.activityitemscount) activityitemscount,
                                max(gdayev.eventscount) eventscount,
                                max(gdayev.agendascount) agendascount,
                                max(gdayev.taskscount) taskscount,
                                max(gdayev.repeateventscount) repeateventscount,
                                sum(CASE WHEN IFNULL(gmo.moi, '') = '' THEN 0 WHEN gmo.del = '${DelType.del}' THEN 0 ELSE 1 END) memoscount,
                                0 bookedtimesummary
                        from (select gdayjta.day day,
                                    max(gdayjta.calendaritemscount) calendaritemscount,
                                    max(gdayjta.activityitemscount) activityitemscount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) eventscount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                    sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                    sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) repeateventscount
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

    let startday: string = moment(month).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(month).endOf('month').format("YYYY/MM/DD");

    // 初始化每日记录
    days.set(startday, new DayActivityData(startday));
    let stepday: string = startday;
    while (stepday != endday) {
      stepday = moment(stepday).add(1, "days").format("YYYY/MM/DD");

      let day: string = stepday;
      days.set(day, new DayActivityData(day));
    }

    let sqlcalitems: string = `select * from gtd_jta where substr(sd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by sd asc, st asc`;

    monthActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems) || new Array<PlanItemData>();

    days = monthActivity.calendaritems.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.calendaritems.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    let sqlevents: string = `select * from gtd_ev where substr(evd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by evd asc`;

    monthActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents) || new Array<EventData>();

    days = monthActivity.events.reduce((days, value) => {
      let day: string = value.evd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.events.push(value);
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

    let startday: string = moment(monthActivities.month).startOf('month').format("YYYY/MM/DD");
    let endday: string = moment(monthActivities.month).endOf('month').format("YYYY/MM/DD");

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
            // 插入
            monthActivities.calendaritems.push(item);
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
              monthActivities.events.splice(index, 1);
            } else {
              // 更新
              monthActivities.events.splice(index, 1, event);
            }
          } else {
            monthActivities.events.push(event);
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
            monthActivities.memos.push(memo);
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

      days = monthActivities.calendaritems.reduce((days, value) => {
        let day: string = value.sd;
        let dayActivity: DayActivityData = days.get(day);

        this.assertNull(dayActivity);

        dayActivity.calendaritems.push(value);
        days.set(day, dayActivity);

        return days;
      }, days);

      days = monthActivities.events.reduce((days, value) => {
        let day: string = value.evd;
        let dayActivity: DayActivityData = days.get(day);

        this.assertNull(dayActivity);

        dayActivity.events.push(value);
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
                          gdaymom.memoscount memoscount,
                          gdaymom.bookedtimesummary bookedtimesummary
                      from (select gdayev.day day,
                            max(gdayev.calendaritemscount) calendaritemscount,
                            max(gdayev.activityitemscount) activityitemscount,
                            max(gdayev.eventscount) eventscount,
                            max(gdayev.agendascount) agendascount,
                            max(gdayev.taskscount) taskscount,
                            max(gdayev.repeateventscount) repeateventscount,
                            sum(CASE WHEN IFNULL(gmo.moi, '') = '' THEN 0 WHEN gmo.del = '${DelType.del}' THEN 0 ELSE 1 END) memoscount,
                            0 bookedtimesummary
                        from (select gdayjta.day day,
                                max(gdayjta.calendaritemscount) calendaritemscount,
                                max(gdayjta.activityitemscount) activityitemscount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) eventscount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN IFNULL(gev.rtevi, '') <> '' THEN 0 WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                sum(CASE WHEN IFNULL(gev.evi, '') = '' THEN 0 WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) repeateventscount
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

    dayActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems) || new Array<PlanItemData>();

    let sqlevents: string = `select * from gtd_ev where evd = '${day}' and del <> '${DelType.del}'`;

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
      resultActivity.calendaritems = await this.sqlExce.getExtLstByParam<PlanItemData>(sqlcalitems, ciargs) || new Array<PlanItemData>();
    }

    if (sqlevents && seachEvent) {
      resultActivity.events = await this.sqlExce.getExtLstByParam<EventData>(sqlevents, evargs) || new Array<EventData>();
    }

    if (sqlmemos && seachMemo) {
      resultActivity.memos = await this.sqlExce.getExtLstByParam<MemoData>(sqlmemos, moargs) || new Array<MemoData>();
    }

    return resultActivity;
  }

  /**
   * 共享日历
   *
   * @author leon_xi@163.com
   **/
  async sendPlan(plan: PlanData) {
    this.assertEmpty(plan);     // 入参不能为空
    this.assertNotEqual(plan.jt, PlanType.PrivatePlan);   // 非自定义日历不能共享

    await this.syncPrivatePlan(plan);

    return;
  }

  /**
   * 接收日历数据同步
   *
   * @author leon_xi@163.com
   **/
  async receivedPlan(ji: string) {

    this.assertEmpty(ji);   // 入参不能为空

    let pull: PullInData = new PullInData();

    pull.d.push(ji);

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

    plandb.del = status;
    plandb.tb = SyncType.synch;

    await this.sqlExce.repTByParam(plandb);

    let localplan: PlanData = {} as PlanData;

    Object.assign(localplan, plandb);

    return localplan;
  }

  /**
   * 同步指定自定义日历
   *
   * @author leon_xi@163.com
   **/
  async syncPrivatePlan(plan: PlanData) {

    this.assertEmpty(plan);       // 入参不能为空
    this.assertNotEqual(plan.jt, PlanType.PrivatePlan);   // 非自定义日历不能共享
    this.assertEmpty(plan.ji);    // 日历ID不能为空
    this.assertEmpty(plan.del);   // 删除标记不能为空

    // 构造Push数据结构
    let push: PushInData = new PushInData();

    let sync: SyncData = new SyncData();

    sync.id = plan.ji;
    sync.type = "Plan";
    sync.security = SyncDataSecurity.None;
    sync.status = SyncDataStatus[plan.del];
    sync.payload = plan;

    push.d.push(sync);

    await this.dataRestful.push(push);

    return;
  }

  /**
   * 同步所有自定义日历
   *
   * @author leon_xi@163.com
   **/
  async syncPrivatePlans() {
    let sql: string = `select * from gtd_jha where jt = ? and tb = ?`;

    let unsyncedplans = await this.sqlExce.getExtLstByParam<PlanData>(sql, [PlanType.PrivatePlan, SyncType.unsynch]);

    // 存在未同步日历
    if (unsyncedplans && unsyncedplans.length > 0) {
      // 构造Push数据结构
      let push: PushInData = new PushInData();

      for (let plan of unsyncedplans) {
        let sync: SyncData = new SyncData();

        sync.id = plan.ji;
        sync.type = "Plan";
        sync.security = SyncDataSecurity.None;
        sync.status = SyncDataStatus[plan.del];
        sync.payload = plan;

        push.d.push(sync);
      }

      await this.dataRestful.push(push);
    }

    return;
  }

  /**
   * 更新已同步标志
   * 根据日历ID和更新时间戳
   *
   * @author leon_xi@163.com
   **/
  async acceptSyncPrivatePlans(syncids: Array<Array<any>>) {

    this.assertEmpty(syncids);    // 入参不能为空

    if (syncids.length < 1) {     // 入参是空数组直接返回
      return;
    }

    let sqls: Array<any> = new Array<any>();

    for (let syncid of syncids) {
      sqls.push([`update gtd_jha set tb = ? where ji = ? and utt = ?`, [SyncType.synch, ...syncid]]);
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

    let shareplan: Plan = this.convertPlanData2Plan(plan);

    let upplan: ShareData = new ShareData();

    upplan.oai = "";
    upplan.ompn = "";
    upplan.c = "";
    upplan.d.p = shareplan;

    let shared = await this.shareRestful.share(upplan);

    if (shared)
      return shared.psurl;
    else
      return "";
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
        startday = moment(day).subtract(Math.floor(daysPerPage / 2), "days").format("YYYY/MM/DD");
        endday = moment(day).add(Math.floor(daysPerPage / 2), "days").format("YYYY/MM/DD");
        break;
      case PageDirection.PageDown :
        endday = moment(day).subtract(1, "days").format("YYYY/MM/DD");
        startday = moment(day).subtract(daysPerPage, "days").format("YYYY/MM/DD");
        break;
      case PageDirection.PageUp :
        startday = moment(day).add(1, "days").format("YYYY/MM/DD");
        endday = moment(day).add(daysPerPage, "days").format("YYYY/MM/DD");
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
      stepday = moment(stepday).add(1, "days").format("YYYY/MM/DD");

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
      stepday = moment(stepday).add(1, "days").format("YYYY/MM/DD");

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

    if (src.evi && src.ed) {    // AgendaData
      return "AgendaData";
    }

    if (src.evi && src.cs) {    // TaskData
      return "TaskData";
    }

    if (src.evi && !src.cs && !src.ed) {    // MiniTaskData
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

export interface PlanMember extends ParTbl {

}

export interface PlanData extends JhaTbl {
  items: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>;
  members: Array<PlanMember>;
}

export interface PlanItemData extends JtaTbl {
  rtjson: RtJson;
  txjson: TxJson;
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
  bookedtimesummary: number;    // 总预定时长
}
