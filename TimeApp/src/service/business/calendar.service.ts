import { Injectable } from "@angular/core";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";

@Injectable()
export class CalendarService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {}

  savePlan() {}
  updatePlanColor() {}
  removePlan() {}
  savePlanItem() {}
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
