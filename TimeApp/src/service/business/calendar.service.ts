import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { BipdshaeData, Plan, ShaeRestful } from "../restful/shaesev";
import { EventData, EventType } from "./event.service";
import { MemoData } from "./memo.service";
import * as moment from "moment";
import { JhTbl } from "../sqlite/tbl/jh.tbl";
import { JtaTbl } from "../sqlite/tbl/jta.tbl";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { MomTbl } from "../sqlite/tbl/mom.tbl";

@Injectable()
export class CalendarService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private shareRestful: ShaeRestful) {
    super();
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
      let plandb: JhTbl = new JhTbl();
      Object.assign(plandb, plan);

      await this.sqlExce.updateByParam(plandb);

      this.emitService.emit(`mwxing.calendar.${plan.ji}.updated`);
    } else {
      // 新建
      plan.ji = this.util.getUuid();

      let plandb: JhTbl = new JhTbl();
      Object.assign(plandb, plan);

      await this.sqlExce.prepareSave(plandb);

      this.emitService.emit(`mwxing.calendar.plan.created`);
    }

    return plan;
  }

  updatePlanColor() {}

  /**
   * 取得删除日历SQL
   *
   * @author leon_xi@163.com
   **/
  removePlanSqls(ji: string, jt: PlanType, withchildren: boolean = true): Array<any> {

    this.assertEmpty(ji);   // id不能为空
    this.assertNull(jt);    // 计划类型不能为空

    let plandb: JhTbl = new JhTbl();
    plandb.ji = ji;

    let sqls: Array<any> = new Array<any>();

    sqls.push(plandb.drTParam());

    // 同时删除日历项
    if (withchildren) {
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        let planitemdb: JtaTbl = new JtaTbl();
        planitemdb.ji = ji;

        sqls.push(planitemdb.drTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);   // 附件表
        sqls.push(`delete * from gtd_e where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);    // 提醒表
        sqls.push(`delete * from gtd_d where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);    // 参与人表
        sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);   // 标签表
      }

      if (jt == PlanType.PrivatePlan) {
        let eventdb: EvTbl = new EvTbl();
        eventdb.ji = ji;

        // 删除事件主表
        sqls.push(eventdb.drTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete * from gtd_ea where evi not in (select evi from gtd_ev);`);   // 日程表
        sqls.push(`delete * from gtd_et where evi not in (select evi from gtd_ev);`);   // 任务表

        sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);   // 附件表
        sqls.push(`delete * from gtd_e where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);    // 提醒表
        sqls.push(`delete * from gtd_d where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);    // 参与人表
        sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);   // 标签表

        let memodb: MomTbl = new MomTbl();
        memodb.ji = ji;

        // 删除备忘主表
        sqls.push(memodb.drTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mo);`);   // 附件表
        sqls.push(`delete * from gtd_e where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mo);`);    // 提醒表
        sqls.push(`delete * from gtd_d where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mo);`);    // 参与人表
        sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mo);`);   // 标签表
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
   * 创建/更新日历项
   *
   * @author leon_xi@163.com
   **/
  async savePlanItem(item: PlanItemData): Promise<PlanItemData> {

    this.assertEmpty(item);       // 入参不能为空
    this.assertEmpty(item.sd);    // 日历项所属日期不能为空
    this.assertEmpty(item.jtn);   // 日历项名称不能为空

    if (item.jti) {
      // 更新
      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, item);

      await this.sqlExce.updateByParam(planitemdb);

      this.emitService.emit(`mwxing.calendar.${item.ji}.item.updated`);
    } else {
      // 新建
      item.jti = this.util.getUuid();

      let planitemdb: JtaTbl = new JtaTbl();
      Object.assign(planitemdb, item);

      await this.sqlExce.saveByParam(planitemdb);

      this.emitService.emit(`mwxing.calendar.${item.ji}.item.created`);
    }

    return item;
  }

  /**
   * 删除日历项
   *
   * @author leon_xi@163.com
   **/
  async removePlanItem(jti: string) {

    this.assertEmpty(jti);    // 入参不能为空

    let planitemdb: JtaTbl = new JtaTbl();
    planitemdb.jti = jti;

    await this.sqlExce.dropByParam(planitemdb);

    return;
  }

  /**
   * 取得所有日历
   * 包括 自定义日历/冥王星预定义日历
   * 结果根据类型正序 创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async fetchAllPlans(jts:Array<PlanType> = []): Promise<Array<PlanData>> {

    let sql: string = `select * from gtd_j_h ${(jts && jts.length > 0)? ('jt in (' + jts.join(', ') + ')') : ''} order by jt asc, wtt desc`;

    let plans: Array<PlanData> = await this.sqlExce.getExtList<PlanData>(sql);

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
   * 取得冥王星预定义日历
   * 结果根据类型正序 创建时间倒序
   *
   * @author leon_xi@163.com
   **/
  async asyncfetchPublicPlans(): Promise<Array<PlanData>> {
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

    let sql: string = `select * from gtd_jt where ji = '${ji}' order by sd asc`;

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

    let sql: string = `select * from gtd_ev where ji = '${ji}' order by evd asc`;

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

    let sql: string = `select * from gtd_ev where ji = '${ji}' order by evd ${sort}`;

    return await this.sqlExce.getExtList<EventData>(sql);
  }

  /**
   * 下载指定日历所有日历项
   *
   * @author leon_xi@163.com
   **/
  async downloadPublicPlan(ji: string, jt: PlanType) {

    this.assertEmpty(ji);   // 入参不能为空

    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.d.pi = ji;
    let plan: Plan = await this.shareRestful.downsysname(bip);

    let sqls: Array<any> = new Array<any>();

    if (plan && plan.pn) {
      // 删除既存数据
      let delexistsqls: Array<any> = this.removePlanSqls(ji, jt);

      sqls.concat(delexistsqls);

      // 创建新数据
      let plandb: JhTbl = new JhTbl();
      plandb.ji = ji;
      plandb.jt = jt;
      plandb.jn = plan.pn.pt;
      plandb.jg = plan.pn.pd;
      plandb.jc = plan.pn.pm;
      plandb.jtd = PlanDownloadType.YES;

      sqls.push(plandb.inTParam());

      // 创建日历项
      if (plan.pa && plan.pa.length > 0) {
        for (let pa of plan.pa) {
          let planitemdb: JtaTbl = new JtaTbl();
          planitemdb.ji = ji;         //计划ID
          planitemdb.jtn = pa.at;     //日程事件主题  必传
          planitemdb.sd = moment(pa.adt).format("YYYY/MM/DD");  //所属日期      必传
          planitemdb.st = pa.st;      //所属时间
          planitemdb.bz = pa.am;      //备注

          sqls.push(planitemdb.inTParam());
        }
      }
    }

    await this.sqlExce.sqlBatch(sqls);

    this.emitService.emit(`mwxing.calendar.${ji}.updated`);

    return;
  }

  /**
   * 获取指定年月下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchMonthActivitiesSummary(month: string = moment().format('YYYY/MM')): Promise<MonthActivitySummaryData> {

    this.assertEmpty(month);    // 入参不能为空

    let days: number = moment(month).daysInMonth();
    let arrDays: Array<string> = new Array<string>(days).map((value, index) => {return ("0" + (index + 1)).slice(-2);});

    let daysql: string = `select '${arrDays.join(`' sd union all select '`)}' sd`;

    let sql: string = `select gday.sd day,
                              sum(CASE gjt.jtt WHEN '${PlanItemType.Holiday}' THEN 1 ELSE 0 END) calendaritemscount,
                              sum(CASE gjt.jtt WHEN '${PlanItemType.Activity}' THEN 1 ELSE 0 END) activityitemscount,
                              count(gev.evi) eventscount,
                              sum(CASE gev.evt WHEN '${EventType.Agenda}' THEN 1 ELSE 0 END) agendascount,
                              sum(CASE gev.evt WHEN '${EventType.Task}' THEN 1 ELSE 0 END) taskscount,
                              count(gmo.moi) memoscount,
                              sum(CASE gev.rtevi WHEN NULL THEN 0 ELSE 1 END) repeateventscount,
                              0 bookedtimesummary
                      from (${daysql}) gday
                          left join gtd_jt gjt on gday.sd = gjt.sd
                          left join gtd_ev gev on gday.sd = gev.sd
                          left join gtd_mo gmo on gday.sd = gmo.sd
                      group by gday.sd`;

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
  async fetchMonthActivities(month: string = moment().format('YYYY/MM')) {

    this.assertEmpty(month);    // 入参不能为空

    let monthActivity: MonthActivityData = new MonthActivityData();

    let sqlcalitems: string = `select * from gtd_jt where substr(sd, 0, 7) = '${month}' order by sd asc, st asc`;

    monthActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems);

    let sqlevents: string = `select * from gtd_ev where substr(sd, 0, 7) = '${month}' order by sd asc, st asc`;

    monthActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents);

    let sqlmemos: string = `select * from gtd_mo where substr(sd, 0, 7) = '${month}' order by sd asc, st asc`;

    monthActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos);

    return monthActivity;
  }

  mergeMonthActivities() {}

  /**
   * 获取指定日期下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchDayActivitiesSummary(day: string = moment().format('YYYY/MM/DD')): Promise<DayActivitySummaryData> {

    this.assertEmpty(day);    // 入参不能为空

    let sql: string = `select gday.sd day,
                              sum(CASE gjt.jtt WHEN '${PlanItemType.Holiday}' THEN 1 ELSE 0 END) calendaritemscount,
                              sum(CASE gjt.jtt WHEN '${PlanItemType.Activity}' THEN 1 ELSE 0 END) activityitemscount,
                              count(gev.evi) eventscount,
                              sum(CASE gev.evt WHEN '${EventType.Agenda}' THEN 1 ELSE 0 END) agendascount,
                              sum(CASE gev.evt WHEN '${EventType.Task}' THEN 1 ELSE 0 END) taskscount,
                              count(gmo.moi) memoscount,
                              sum(CASE gev.rtevi WHEN NULL THEN 0 ELSE 1 END) repeateventscount,
                              0 bookedtimesummary
                      from (select '${day}' sd) gday
                          left join gtd_jt gjt on gday.sd = gjt.sd
                          left join gtd_ev gev on gday.sd = gev.sd
                          left join gtd_mo gmo on gday.sd = gmo.sd
                      group by gday.sd`;

    let daySummary: DayActivitySummaryData = this.sqlExce.getExtOne<DayActivitySummaryData>(sql);

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

    let sqlcalitems: string = `select * from gtd_jt where sd = '${day}' order by st asc`;

    dayActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems);

    let sqlevents: string = `select * from gtd_ev where sd = '${day}' order by st asc`;

    dayActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents);

    let sqlmemos: string = `select * from gtd_mo where sd = '${day}' order by st asc`;

    dayActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos);

    return dayActivity;
  }

  mergeDayActivities() {}
  findActivities() {}
  sendPlan() {}
  receivedPlan() {}
  syncPrivatePlan() {}
  syncPrivatePlans() {}
  sharePlan() {}
  fetchPagedActivities() {}
  mergePagedActivities() {}
  backup(bts: number) {}
  recovery(plans: Array<PlanData>): Array<any> {}
}

export interface PlanData extends JhTbl {
  items: Array<PlanItemData> = new Array<PlanItemData>();
}

export interface PlanItemData extends JtaTbl {

}

export interface MonthActivityData {
  month: string;                        // 所属年月
  calendaritems: Array<PlanItemData>;   // 日历项
  events: Array<EventData>;             // 事件
  memos: Array<MemoData>;               // 备忘
  days: Map<string, DayActivityData>;   // 当月每天的活动
}

export interface DayActivityData {
  day: string;                          // 所属日期
  calendaritems: Array<PlanItemData>;   // 日历项
  events: Array<EventData>;             // 事件
  memos: Array<MemoData>;               // 备忘
}

export interface MonthActivitySummaryData {
  month: string;                        // 所属年月
  days: Array<DayActivitySummaryData>;  // 每日活动汇总
}

export interface DayActivitySummaryData {
  day: string;                  // 所属日期
  calendaritemscount: number;   // 日期日历项数量
  activityitemscount: number;   // 活动日历项数量
  eventscount: number;          // 事件数量
  agendascount: number;         // 日程数量
  taskscount: number;           // 任务数量
  memoscount: number;           // 备忘数量
  repeateventscount: number;    // 重复事件数量
  bookedtimesummary: number;    // 总预定时长
}

export enum PlanType {
  CalendarPlan = 0,
  ActivityPlan = 1,
  PrivatePlan = 2
}

export enum PlanItemType {
  Holiday = 0,
  Activity = 1
}

export enum PlanDownloadType {
  NO = 0,
  YES = 1
}

export enum ObjectType {
  Event = 'event',
  Memo = 'memo',
  Calendar = 'calendar'
}
