import { Injectable } from "@angular/core";
import { BaseService, SortType } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";
import { BipdshaeData, Plan, ShaeRestful } from "../service/restful/shaesev";
import { EventData } from "./event.service";
import { MemoData } from "./memo.service";

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

      await this.sqlExce.update(plandb);

      this.emitService.emit(`mwxing.calendar.${plan.ji}.updated`);
    } else {
      // 新建
      plan.ji = this.util.getUuid();

      let plandb: JhTbl = new JhTbl();
      Object.assign(plandb, plan);

      await this.sqlExce.insert(plandb);

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

    sqls.push(plandb.del());

    // 同时删除日历项
    if (withchildren) {
      if (jt == PlanType.CalendarPlan || jt == PlanType.ActivityPlan) {
        let planitemdb: JhiTbl = new JhiTbl();
        planitemdb.ji = ji;

        sqls.push(planitemdb.del());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);   // 附件表
        sqls.push(`delete * from gtd_e where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);    // 提醒表
        sqls.push(`delete * from gtd_d where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);    // 参与人表
        sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Calendar}' and obi not in (select jti from gtd_jt);`);   // 标签表
      }

      if (jt == PlanType.PrivatePlan) {
        let eventdb: EVTbl = new EVTbl();
        eventdb.ji = ji;

        // 删除事件主表
        sqls.push(eventdb.del());

        // 删除关联表，通过未关联主表条件删除
        sqls.push(`delete * from gtd_ea where evi not in (select evi from gtd_ev);`);   // 日程表
        sqls.push(`delete * from gtd_et where evi not in (select evi from gtd_ev);`);   // 任务表

        sqls.push(`delete * from gtd_fj where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);   // 附件表
        sqls.push(`delete * from gtd_e where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);    // 提醒表
        sqls.push(`delete * from gtd_d where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);    // 参与人表
        sqls.push(`delete * from gtd_mk where obt = '${ObjectType.Event}' and obi not in (select evi from gtd_ev);`);   // 标签表

        let memodb: MoTbl = new MoTbl();
        memodb.ji = ji;

        // 删除备忘主表
        sqls.push(memodb.del());

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

    await this.sqlExce.sqlBatch(sqls);

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
      let planitemdb: JhiTbl = new JhiTbl();
      Object.assign(planitemdb, item);

      await this.sqlExce.update(planitemdb);

      this.emitService.emit(`mwxing.calendar.${item.ji}.item.updated`);
    } else {
      // 新建
      item.jti = this.util.getUuid();

      let planitemdb: JhiTbl = new JhiTbl();
      Object.assign(planitemdb, item);

      await this.sqlExce.insert(planitemdb);

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

    let planitemdb: JhiTbl = new JhiTbl();
    planitemdb.jti = jti;

    await this.sqlExce.delete(planitemdb);

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

      sqls.push(plandb.insert());

      // 创建日历项
      if (plan.pa && plan.pa.length > 0) {
        for (let pa of plan.pa) {
          let planitemdb: JhiTbl = new JhiTbl();
          planitemdb.ji = ji;         //计划ID
          planitemdb.jtn = pa.at;     //日程事件主题  必传
          planitemdb.sd = moment(pa.adt).format("YYYY/MM/DD");  //所属日期      必传
          planitemdb.st = pa.st;      //所属时间
          planitemdb.bz = pa.am;      //备注

          sqls.push(planitemdb.insert());
        }
      }
    }

    await this.sqlExce.sqlBatch(sqls);

    this.emitService.emit(`mwxing.calendar.${ji}.updated`);

    return;
  }

  fetchMonthActivities() {}
  mergeMonthActivities() {}
  fetchDayActivities() {}
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

export class PlanData implements JhTbl {
  items: Array<PlanItemData> = new Array<PlanItemData>();
}

export class PlanItemData implements JhiTbl {

}

export enum PlanType {
  CalendarPlan = 0,
  ActivityPlan = 1,
  PrivatePlan = 2
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
