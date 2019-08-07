import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";

@Injectable()
export class CalendarService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService) {
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
   * 删除日历
   *
   * @author leon_xi@163.com
   **/
  async removePlan(ji: string, jt: PlanType, withchildren: boolean = true) {

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

  fetchPlanItems() {}
  downloadPublicPlan() {}
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

export enum ObjectType {
  Event = 'event',
  Memo = 'memo',
  Calendar = 'calendar'
}
