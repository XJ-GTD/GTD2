import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {PagePcPro} from "../../data.mapping";
import {CalendarService, PlanData} from "../../service/business/calendar.service";
import {PlanType} from "../../data.enum";

@Injectable()
export class PcService {
  constructor(
              private sqlExce: SqliteExec,
              private util: UtilService,
              private calendarService: CalendarService
  ) {
  }

  //保存计划
  async savePlan(pcData:PagePcPro): Promise<any> {
    let plan: PlanData = {} as PlanData;

    Object.assign(plan, pcData);
    plan.jt = PlanType.PrivatePlan;

    plan = await this.calendarService.savePlan(plan);

    return plan;
  }

}
