import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { BipdshaeData, Plan, PlanPa, ShareData, ShaeRestful } from "../restful/shaesev";
import { EventData, TaskData, AgendaData, MiniTaskData } from "./event.service";
import { EventType, PlanType, PlanItemType, PlanDownloadType, ObjectType, PageDirection, SyncType, DelType } from "../../data.enum";
import { MemoData } from "./memo.service";
import * as moment from "moment";
import { JhaTbl } from "../sqlite/tbl/jha.tbl";
import { JtaTbl } from "../sqlite/tbl/jta.tbl";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { MomTbl } from "../sqlite/tbl/mom.tbl";

@Injectable()
export class CalendarService extends BaseService {

  private calendaractivities: Array<MonthActivityData> = new Array<MonthActivityData>();

  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private shareRestful: ShaeRestful) {
    super();
  }

  clearCalendarActivities() {
    this.calendaractivities.length = 0;
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
            for (let single of data) {
              this.mergeCalendarActivity(single);
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
  mergeCalendarActivity(activity: any) {
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

        if (firstmonth >= currentmonth && currentmonth <= lastmonth) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [item]);
        }

        break;
      case "AgendaData" :
        // 转换成匹配对象类型
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(agenda.evd).format("YYYY/MM");

        if (firstmonth >= currentmonth && currentmonth <= lastmonth) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [agenda]);
        }

        break;
      case "TaskData" :
        // 转换成匹配对象类型
        let task: TaskData = {} as TaskData;
        Object.assign(task, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(task.evd).format("YYYY/MM");

        if (firstmonth >= currentmonth && currentmonth <= lastmonth) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [task]);
        }

        break;
      case "MiniTaskData" :
        // 转换成匹配对象类型
        let minitask: MiniTaskData = {} as MiniTaskData;
        Object.assign(minitask, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(minitask.evd).format("YYYY/MM");

        if (firstmonth >= currentmonth && currentmonth <= lastmonth) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [minitask]);
        }

        break;
      case "MemoData" :
        // 转换成匹配对象类型
        let memo: MemoData = {} as MemoData;
        Object.assign(memo, activity);

        // 判断数据是否属于当前缓存日期范围
        currentmonth = moment(memo.sd).format("YYYY/MM");

        if (firstmonth >= currentmonth && currentmonth <= lastmonth) {
          let diff = moment(currentmonth).diff(firstmonth, "months");

          let currentmonthactivities = this.calendaractivities[diff];
          this.mergeMonthActivities(currentmonthactivities, [memo]);
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
      let plandb: JhaTbl = new JhaTbl();
      Object.assign(plandb, plan);

      await this.sqlExce.updateByParam(plandb);

      this.emitService.emit(`mwxing.calendar.${plan.ji}.updated`);
    } else {
      // 新建
      plan.ji = this.util.getUuid();

      let plandb: JhaTbl = new JhaTbl();
      Object.assign(plandb, plan);

      await this.sqlExce.saveByParam(plandb);

      this.emitService.emit(`mwxing.calendar.plan.created`);
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

    await this.sqlExce.updateByParam(plandb);

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

    plandb.ji = ji;

    plandb = await this.sqlExce.getOneByParam<JhaTbl>(plandb);

    // 计划不存在直接返回
    if (!plandb) {
      return null;
    }

    Object.assign(plan, plandb);

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

    let plandb: JhaTbl = new JhaTbl();
    plandb.ji = ji;
    plandb.del = DelType.del;

    let sqls: Array<any> = new Array<any>();

    sqls.push(plandb.upTParam());

    // 同时删除日历项
    if (withchildren) {
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        let planitemdb: JtaTbl = new JtaTbl();
        planitemdb.ji = ji;
        planitemdb.del = DelType.del;

        sqls.push(planitemdb.upTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`update gtd_fj set del = '${DelType.del}' where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jta where del <> '${DelType.del}');`);   // 附件表
        sqls.push(`delete from gtd_wa where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jta where del <> '${DelType.del}');`);    // 提醒表
        sqls.push(`update gtd_par set del = '${DelType.del}' where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jta where del <> '${DelType.del}');`);    // 参与人表
        sqls.push(`delete from gtd_mrk where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jta where del <> '${DelType.del}');`);   // 标签表
      }

      if (jt == PlanType.PrivatePlan) {
        let eventdb: EvTbl = new EvTbl();
        eventdb.ji = ji;
        eventdb.del = DelType.del;

        // 删除事件主表
        sqls.push(eventdb.upTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete from gtd_ca where evi not in (select evi from gtd_ev where del <> '${DelType.del}');`);   // 日程表
        sqls.push(`delete from gtd_t where evi not in (select evi from gtd_ev where del <> '${DelType.del}');`);   // 任务表

        sqls.push(`update gtd_fj set del = '${DelType.del}' where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev where del <> '${DelType.del}');`);   // 附件表
        sqls.push(`delete from gtd_wa where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev where del <> '${DelType.del}');`);    // 提醒表
        sqls.push(`update gtd_par set del = '${DelType.del}' where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev where del <> '${DelType.del}');`);    // 参与人表
        sqls.push(`delete from gtd_mrk where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev where del <> '${DelType.del}');`);   // 标签表

        let memodb: MomTbl = new MomTbl();
        memodb.ji = ji;

        // 删除备忘主表
        sqls.push(memodb.dTParam());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`update gtd_fj set del = '${DelType.del}' where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mom where del <> '${DelType.del}');`);   // 附件表
        sqls.push(`delete from gtd_wa where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mom where del <> '${DelType.del}');`);    // 提醒表
        sqls.push(`update gtd_par set del = '${DelType.del}' where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mom where del <> '${DelType.del}');`);    // 参与人表
        sqls.push(`delete from gtd_mrk where obt = '${ObjectType.Memo}' and obi not in (select moi from gtd_mom where del <> '${DelType.del}');`);   // 标签表
      }
    } else {
      // 不删除子元素，需要把子元素的计划ID更新为空/默认计划ID
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        // 更新日历项表计划ID
        sqls.push(`update gtd_jta set ji = '', utt = ${moment().unix()} where ji = '${ji}'`);
      }

      if (jt == PlanType.PrivatePlan) {
        // 更新事件主表
        sqls.push(`update gtd_ev set ji = '', utt = ${moment().unix()} where ji = '${ji}'`);

        // 更新备忘主表
        sqls.push(`update gtd_mom set ji = '', utt = ${moment().unix()} where ji = '${ji}'`);
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
    planitemdb.jti = jti;

    planitemdb = await this.sqlExce.getOneByParam<JtaTbl>(planitemdb);

    let planitem: PlanItemData = {} as PlanItemData;

    Object.assign(planitem, planitemdb);

    return planitem;
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

    if (!item.jtt) {
      item.jtt = PlanItemType.Activity;
    }

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

      planitemdb.tb = SyncType.synch;
      planitemdb.del = DelType.undel;

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

    await this.sqlExce.delByParam(planitemdb);

    // 删除日历项关联表项目

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

    let sql: string = `select * from gtd_jha where ${(jts && jts.length > 0)? ('jt in (' + jts.join(', ') + ') and') : ''} del <> '${DelType.del}' order by jt asc, wtt desc`;

    let plans: Array<PlanData> = await this.sqlExce.getExtList<PlanData>(sql);

    // 获取每个日历的日历项

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

      sqls.push(plandb.inTParam());

      let itemType: PlanItemType = (jt == PlanType.CalendarPlan? PlanItemType.Holiday : PlanItemType.Activity);

      // 创建日历项
      if (plan.pa && plan.pa.length > 0) {
        for (let pa of plan.pa) {
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

          sqls.push(planitemdb.inTParam());
        }
      }
    }

    await this.sqlExce.batExecSqlByParam(sqls);

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
    let arrDays: Array<string> = new Array<string>(days).fill("01");  // 必须要先填充, 否则不能map
    arrDays = arrDays.map((value, index) => {
      return (month + "/" + ("0" + (index + 1)).slice(-2));
    });
    console.log(arrDays.join(","));
    let daysql: string = `select '${arrDays.join(`' sd union all select '`)}' sd`;

    let sql: string = `select gdayev.day day,
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
                                  sum(CASE WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                  sum(CASE WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                  sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) repeateventscount
                            from (select gday.sd day,
                                    sum(CASE WHEN gjt.jtt <> '${PlanItemType.Holiday}' THEN 0 WHEN gjt.del <> '${DelType.del}' THEN 0 ELSE 1 END) calendaritemscount,
                                    sum(CASE WHEN gjt.jtt <> '${PlanItemType.Activity}' THEN 0 WHEN gjt.del <> '${DelType.del}' THEN 0 ELSE 1 END) activityitemscount
                                  from (${daysql}) gday
                                      left join gtd_jta gjt on gday.sd = gjt.sd
                                  group by gday.sd) gdayjta
                              left join gtd_ev gev on gdayjta.day = gev.evd
                            group by gdayjta.day) gdayev
                      left join gtd_mom gmo on gdayev.day = gmo.sd
                      group by gdayev.day`;

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

    monthActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems);

    days = monthActivity.calendaritems.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.calendaritems.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    let sqlevents: string = `select * from gtd_ev where substr(evd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by evd asc`;

    monthActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents);

    days = monthActivity.events.reduce((days, value) => {
      let day: string = value.evd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.events.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    let sqlmemos: string = `select * from gtd_mom where substr(sd, 1, 7) = '${month}' AND del <> '${DelType.del}' order by sd asc`;

    monthActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos);

    days = monthActivity.memos.reduce((days, value) => {
      let day: string = value.sd;
      let dayActivity: DayActivityData = days.get(day);

      this.assertNull(dayActivity);

      dayActivity.memos.push(value);
      days.set(day, dayActivity);

      return days;
    }, days);

    monthActivity.days = days;

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
  mergeMonthActivities(monthActivities: MonthActivityData, activitiedatas: Array<PlanItemData | AgendaData | TaskData | MiniTaskData | MemoData>): MonthActivityData {

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
              if (index == 0) {
                monthActivities.calendaritems = monthActivities.calendaritems.slice(1);
              } else {
                monthActivities.calendaritems = monthActivities.calendaritems.slice(0, index).concat(monthActivities.calendaritems.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                monthActivities.calendaritems = monthActivities.calendaritems.slice(1);
                monthActivities.calendaritems.unshift(item);
              } else {
                let tail = monthActivities.calendaritems.slice(index + 1);
                tail.unshift(item);
                monthActivities.calendaritems = monthActivities.calendaritems.slice(0, index).concat(tail);
              }
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
              if (index == 0) {
                monthActivities.events = monthActivities.events.slice(1);
              } else {
                monthActivities.events = monthActivities.events.slice(0, index).concat(monthActivities.events.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                monthActivities.events = monthActivities.events.slice(1);
                monthActivities.events.unshift(event);
              } else {
                let tail = monthActivities.events.slice(index + 1);
                tail.unshift(event);
                monthActivities.events = monthActivities.events.slice(0, index).concat(tail);
              }
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
              if (index == 0) {
                monthActivities.memos = monthActivities.memos.slice(1);
              } else {
                monthActivities.memos = monthActivities.memos.slice(0, index).concat(monthActivities.memos.slice(index + 1));
              }
            } else {
              // 更新
              if (index == 0) {
                monthActivities.memos = monthActivities.memos.slice(1);
                monthActivities.memos.unshift(memo);
              } else {
                let tail = monthActivities.memos.slice(index + 1);
                tail.unshift(memo);
                monthActivities.memos = monthActivities.memos.slice(0, index).concat(tail);
              }
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
    let days: Map<string, DayActivityData> = new Map<string, DayActivityData>();

    // 初始化每日记录
    days.set(startday, new DayActivityData(startday));
    let stepday: string = startday;
    while (stepday != endday) {
      stepday = moment(stepday).add(1, "days").format("YYYY/MM/DD");

      let day: string = stepday;
      days.set(day, new DayActivityData(day));
    }

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

    return monthActivities;
  }

  /**
   * 获取指定日期下的活动汇总
   *
   * @author leon_xi@163.com
   **/
  async fetchDayActivitiesSummary(day: string = moment().format('YYYY/MM/DD')): Promise<DayActivitySummaryData> {

    this.assertEmpty(day);    // 入参不能为空

    let sql: string = `select gdayev.day day,
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
                                  sum(CASE WHEN gev.type <> '${EventType.Agenda}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) agendascount,
                                  sum(CASE WHEN gev.type <> '${EventType.Task}' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) taskscount,
                                  sum(CASE WHEN IFNULL(gev.rtevi, '') = '' THEN 0 WHEN gev.del = '${DelType.del}' THEN 0 ELSE 1 END) repeateventscount
                            from (select gday.sd day,
                                    sum(CASE WHEN gjt.jtt <> '${PlanItemType.Holiday}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) calendaritemscount,
                                    sum(CASE WHEN gjt.jtt <> '${PlanItemType.Activity}' THEN 0 WHEN gjt.del = '${DelType.del}' THEN 0 ELSE 1 END) activityitemscount
                                  from (select '${day}' sd) gday
                                      left join gtd_jta gjt on gday.sd = gjt.sd
                                  group by gday.sd) gdayjta
                              left join gtd_ev gev on gdayjta.day = gev.evd
                            group by gdayjta.day) gdayev
                      left join gtd_mom gmo on gdayev.day = gmo.sd
                      group by gdayev.day`;

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

    dayActivity.calendaritems = await this.sqlExce.getExtList<PlanItemData>(sqlcalitems);

    let sqlevents: string = `select * from gtd_ev where evd = '${day}' and del <> '${DelType.del}'`;

    dayActivity.events = await this.sqlExce.getExtList<EventData>(sqlevents);

    let sqlmemos: string = `select * from gtd_mom where sd = '${day}' and del <> '${DelType.del}'`;

    dayActivity.memos = await this.sqlExce.getExtList<MemoData>(sqlmemos);

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

    // 查询范围
    if (condition.target && condition.target.length > 0) {

    } else {
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

      sqlcalitems = `select * from gtd_jta ${ciwhere} order by sd asc`;
      sqlevents = `select * from gtd_ev ${evwhere} order by evd asc`;
      sqlmemos = `select * from gtd_mom ${mowhere} order by sd asc`;
    }

    // 执行查询
    if (sqlcalitems) {
      resultActivity.calendaritems = await this.sqlExce.getExtLstByParam<PlanItemData>(sqlcalitems, ciargs);
    }

    if (sqlevents) {
      resultActivity.events = await this.sqlExce.getExtLstByParam<EventData>(sqlevents, evargs);
    }

    if (sqlmemos) {
      resultActivity.memos = await this.sqlExce.getExtLstByParam<MemoData>(sqlmemos, moargs);
    }

    return resultActivity;
  }

  sendPlan() {}

  /**
   * 接收日历保存到本地
   *
   * @author leon_xi@163.com
   **/
  async receivedPlan(ji: string): Promise<PlanData> {

    this.assertEmpty(ji);   // 入参不能为空

    // 从服务器下载计划

    // 保存计划
    return null;
  }

  syncPrivatePlan(plan: PlanData) {

  }

  syncPrivatePlans() {}

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

  backup(bts: number) {}
  recovery(plans: Array<PlanData>): Array<any> {
    let sqls: Array<any> = new Array<any>();

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
}

export interface PlanItemData extends JtaTbl {

}

export class PagedActivityData {
  startday: string;                     // 开始日期
  endday: string;                       // 结束日期
  calendaritems: Array<PlanItemData>;   // 日历项
  events: Array<EventData>;             // 事件
  memos: Array<MemoData>;               // 备忘
  days: Map<string, DayActivityData>;   // 指定期间每天的活动
}

export class MonthActivityData {
  month: string;                        // 所属年月
  calendaritems: Array<PlanItemData>;   // 日历项
  events: Array<EventData>;             // 事件
  memos: Array<MemoData>;               // 备忘
  days: Map<string, DayActivityData>;   // 当月每天的活动
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
  calendaritems: Array<PlanItemData>;   // 日历项
  events: Array<EventData>;             // 事件
  memos: Array<MemoData>;               // 备忘
}

export class MonthActivitySummaryData {
  month: string;                        // 所属年月
  days: Array<DayActivitySummaryData>;  // 每日活动汇总
}

export class DayActivitySummaryData {
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
