import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EmitService } from "../util-service/emit.service";

@Injectable()
export class CalendarService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService) {}

  /**
   * 创建/更新日历
   *
   * @author leon_xi@163.com
   **/
  async savePlan(plan: PlanData): PlanData {

    // 入参严格检查
    assertEmpty(plan);      // 对象不能为空
    assertEmpty(plan.jn);   // 名称不能为空
    assertEmpty(plan.jc);   // 颜色不能为空

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
  removePlan() {}

  /**
   * 创建/更新日历项
   *
   * @author leon_xi@163.com
   **/
  async savePlanItem(item: PlanItemData) {
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

    return plan;
  }

  removePlanItem() {}
  fetchAllPlans() {}
  fetchPrivatePlans() {}
  fetchPublicPlans() {}
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
  backup() {}
  recovery() {}
  PlanData() {}
  PlanItemData() {}
}

export class PlanData implements JhTbl {
  items: Array<PlanItemData> = new Array<PlanItemData>();
}

export class PlanItemData implements JhiTbl {

}
