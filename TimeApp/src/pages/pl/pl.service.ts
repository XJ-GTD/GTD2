import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, Plan, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {PagePDPro, PagePlData, RcInParam} from "../../data.mapping";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {CalendarService, PlanData} from "../../service/business/calendar.service";
import {PlanType} from "../../data.enum";

@Injectable()
export class PlService {

  constructor(private sqlExec: SqliteExec,
              private shareRestful:ShaeRestful,
              private calendarService: CalendarService,
              private emitService:EmitService) {}

  //下载系统计划
  async downloadPlan(jh:PagePDPro){
    // 出参
    let count = 0;
    let plandata: PlanData = await this.calendarService.downloadPublicPlan(jh.ji, <PlanType>jh.jt);

    if (plandata && plandata.items) {
      count = plandata.items.length;
    }

    return count;
  }

  //删除系统计划
  async delete(jh:PagePDPro){
    let plan: PlanData = await this.calendarService.getPlan(jh.ji);

    return this.calendarService.removePlan(plan);
  }

  //获取计划
  async getPlan(){
    console.log('---------- PlService getPlan 获取计划开始 ----------------');
    let pld = new PagePlData();

    let plans: Array<PlanData> = await this.calendarService.fetchAllPlans([PlanType.PrivatePlan, PlanType.CalendarPlan, PlanType.ActivityPlan]);

    let xtJh: Array<PagePDPro> = new  Array<PagePDPro>();
    let zdyJh: Array<PagePDPro> = new  Array<PagePDPro>();

    for (let plan of plans) {
      let jhc: PagePDPro = new PagePDPro();

      Object.assign(jhc, plan);
      jhc.js = plan.items.length;

      if (plan.jt == PlanType.PrivatePlan) {
        zdyJh.push(jhc);
      } else {
        xtJh.push(jhc);
        if(jhc.jtd == null || jhc.jtd == "" || jhc.jtd == '0'){
          jhc.jtd = '0';
          jhc.js = '?';
        }
      }
    }

    pld.xtJh = xtJh;
    pld.zdyJh = zdyJh;

    console.log('---------- PlService getPlan 获取计划结束 ----------------');
    return pld;
  }

  async getJh(ji: string, prop: string = 'all') {
    let plandata: PlanData = await this.calendarService.getPlan(ji, prop == 'all');

    return plandata;
  }

  //获取计划
  async getPlanCus() {
    let plans: Array<PlanData> = await this.calendarService.fetchPrivatePlans();
    return plans;
  }
}
