import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, Plan, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {PagePDPro, PagePlData, RcInParam} from "../../data.mapping";
import * as moment from "moment";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {EmitService} from "../../service/util-service/emit.service";
import {CalendarService, PlanData} from "../../service/business/calendar.service";
import {PlanType} from "../../data.enum";

@Injectable()
export class PlService {

  constructor(private sqlExec: SqliteExec,
              private shareRestful:ShaeRestful,
              private calendarService: CalendarService,
              private pgService:PgBusiService,
              private emitService:EmitService) {}

  //下载系统计划
  async downloadPlan(jh:PagePDPro){
    // 出参
    let count = 0;
    let plandata: PlanData = await this.calendarService.downloadPublicPlan(jh.ji, PlanType[jh.jt]);

    if (plandata && plandata.items) {
      count = plandata.items.length;
    }

    return count;
  }

  //删除系统计划
  async delete(jh:PagePDPro){
    return this.pgService.delRcByJiAndJt(jh.ji,jh.jt);
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
    let jh:JhTbl = new JhTbl();
    jh.ji = ji;

    jh = await this.sqlExec.getOne<JhTbl>(jh);

    if (prop == 'all') {
      return jh;
    } else {
      return jh[prop];
    }
  }

  //获取计划
  getPlanCus():Promise<Array<JhTbl>>{
    return new Promise<Array<JhTbl>>(async (resolve, reject) => {
      //获取本地计划
      let j:JhTbl = new JhTbl();
      j.jt = "2";
      let jhTbl: Array<JhTbl> = await this.sqlExec.getList<JhTbl>(j);
      resolve(jhTbl);
      return;
    })
  }
}
