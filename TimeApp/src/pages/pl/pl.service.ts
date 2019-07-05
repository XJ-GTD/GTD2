import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, Plan, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {PagePDPro, PagePlData, RcInParam} from "../../data.mapping";
import * as moment from "moment";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {EmitService} from "../../service/util-service/emit.service";

@Injectable()
export class PlService {

  constructor(private sqlExec: SqliteExec,
              private shareRestful:ShaeRestful,
              private pgService:PgBusiService,
              private emitService:EmitService) {}

  //下载系统计划
  async downloadPlan(jh:PagePDPro){
    // 出参
    let count = 0;
    console.log('---------- PlService downloadPlan 清除本地旧计划 ----------------');
    await this.delete(jh);
    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.d.pi = jh.ji;
    let plan:Plan = await this.shareRestful.downsysname(bip);
    //插入获取的日程到本地（系统日程需要有特别的表示）
    //计划表
    let sjh = new JhTbl();
    sjh.ji = jh.ji;
    sjh.jtd = "1";
    if( plan!= undefined && plan.pn != null){
      sjh.jn = plan.pn.pt;
      sjh.jg = plan.pn.pd;
      sjh.jc = plan.pn.pm;
      sjh.jt = plan.pn.pc; // 系统计划
      //日程表 新计划插入日程表开始
      let rcArray:Array<RcInParam> = new Array<RcInParam>();
      if(plan.pa.length>0) {
        for (let pa of plan.pa) {
          let rc:RcInParam = new RcInParam();
          rc.sn = pa.at;//日程事件主题  必传
          rc.sd = moment(pa.adt).format("YYYY/MM/DD");//开始日期      必传
          rc.st = pa.st;//开始时间
          rc.ji = pa.ap;//计划ID
          rc.bz = pa.am;//备注
          if(plan.pn.pc == "1"){
            rc.gs = "4";//归属
          }else if(plan.pn.pc == "0"){
            rc.gs = "3";//归属
            rc.px = plan.pn.px; //排序
          }
          rcArray.push(rc);
        }
        count = plan.pa.length;
        await this.pgService.saveBatch(rcArray);

        this.emitService.emitRef("");
      }
    }
    await this.sqlExec.update(sjh);

    console.log('---------- PlService downloadPlan 新计划插入日程表结束 ----------------');
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
    //获取本地计划
    //最新日程和日程特殊表保存规则修改
    //计划修改只修改日程特殊表的计划ID,计划所属日程数量统计需要调整 4/28 席理加
    //let sql = "select jh.*,COALESCE (gc.count, 0) js from gtd_j_h jh" +
    //  " left join " +
    //  "( select c.ji ji,count(c.ji) count from gtd_c c left join gtd_sp sp on sp.si = c.si group by c.ji) gc on jh.ji = gc.ji" +
    //  " left join" +
    //  "( select c.ji ji,count(c.ji) count from gtd_c c left join gtd_jt jt on jt.si = c.si group by c.ji) jt on jh.ji = jt.ji" +
    //  " order by jh.wtt desc";
    //修改后
    let sql = "select jh.*,COALESCE (gc.count, COALESCE (jt.count, 0)) js from gtd_j_h jh" +
      " left join " +
      "( select sp.ji ji,count(sp.ji) count from gtd_sp sp group by sp.ji) gc on jh.ji = gc.ji" +
      " left join " +
      "( select c.ji ji,count(c.ji) count from gtd_c c left join gtd_jt jt1 on jt1.si = c.si group by c.ji) jt on jh.ji = jt.ji" +
      " order by jh.wtt desc";
    //修改结束 4/28 席理加
    let jhTbl: Array<PagePDPro> = await this.sqlExec.getExtList<PagePDPro>(sql);
    if(jhTbl.length > 0){
      let xtJh: Array<PagePDPro> = new  Array<PagePDPro>();
      let zdyJh: Array<PagePDPro> = new  Array<PagePDPro>();

      //获取计划日程数量
      for(let jhc of jhTbl){
        if(jhc.jt == "2"){  // 本地计划
          zdyJh.push(jhc);
        }else{
          xtJh.push(jhc);
          if(jhc.jtd == null || jhc.jtd == "" || jhc.jtd == '0'){
            jhc.jtd = '0';
            jhc.js = '?';
          }
        }
      }

      pld.xtJh = xtJh;
      pld.zdyJh = zdyJh;
    }
    console.log('---------- PlService getPlan 获取计划结束 ----------------');
    return pld;
  }

  async getJh(ji: string, prop: string = 'all') {
    let jh:JhTbl = new JhTbl();
    jh.ji = ji;

    jh = await this.sqlExec.getOne(jh);

    if (prop == 'all') {
      return jh;
    } else {
      return jh.get(prop);
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
