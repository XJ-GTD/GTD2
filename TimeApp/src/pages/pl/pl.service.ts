import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, P, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {UserConfig} from "../../service/config/user.config";
import {PagePDPro, PagePlData} from "../../data.mapping";
import * as moment from "moment";

@Injectable()
export class PlService {

  constructor(private sqlExec: SqliteExec,
              private shareRestful:ShaeRestful,
              private util: UtilService,) {}

  //下载系统计划
  async downloadPlan(jh:PagePDPro){
    // 出参
    let bs = new BsModel<any>();
    let sqls:Array<string> = new Array<string>();
    console.log('---------- PlService downloadPlan 清除本地旧计划 ----------------');
    await this.delete(jh);

    console.log('---------- PlService downloadPlan 下载系统计划开始 ----------------');
    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.oai = "";
    bip.ompn = "";
    bip.c = "";
    bip.d.pi = jh.ji;
    let br:BsModel<P> = await this.shareRestful.downsysname(bip);
    //插入获取的日程到本地（系统日程需要有特别的表示）
    //计划表
    if(br.data.pn != null){
      let sjh = new JhTbl();
      sjh.ji = jh.ji;
      sjh.jn = br.data.pn.pt;
      sjh.jg = br.data.pn.pd;
      sjh.jc = br.data.pn.pm;
      sjh.jt = br.data.pn.pc;
      sjh.jtd = "1";
      sqls.push(sjh.upT()); // 系统计划修改计划表状态
      //日程表 新计划插入日程表开始
      if(br.data.pa.length>0) {
        for (let pa of br.data.pa) {
          let ctbl:CTbl =new CTbl();
          ctbl.si = this.util.getUuid();//日程ID
          ctbl.sn = pa.at;//主题
          ctbl.ui = UserConfig.user.id; //创建者  用户ID
          ctbl.sd = moment(pa.adt).format("YYYY/MM/DD");//开始日期(YYYY/MM/DD HH:mm)
          ctbl.st = pa.st;//时间(YYYY/MM/DD HH:mm)
          //ctbl.ed = moment(pa.ed).format("YYYY/MM/DD");//结束日期(YYYY/MM/DD HH:mm)
          //ctbl.et = pa.et;//时间(YYYY/MM/DD HH:mm)
          ctbl.ji = pa.ap;//计划
          ctbl.rt = "0";//重复
          ctbl.bz = pa.am;//备注
          ctbl.gs = "2";//归属

          //保存日程表数据
          sqls.push(ctbl.inT());

          let sp = new SpTbl();
          sp.spi = this.util.getUuid();
          sp.si = ctbl.si;
          sp.spn = ctbl.sn;
          sp.sd = ctbl.sd;
          sp.st = ctbl.st;
          //sp.ed = ctbl.ed;
          //sp.et = ctbl.et;
          sp.ji = ctbl.ji;
          sp.bz = ctbl.bz;

          //保存日程表数据
          sqls.push(sp.inT());
        }

        bs.data = br.data.pa.length;
      }
    }
    await this.sqlExec.batExecSql(sqls);

    console.log('---------- PlService downloadPlan 新计划插入日程表结束 ----------------');
    bs.code = 0;
    return bs;
  }

  //删除系统计划
  async delete(jh:PagePDPro){
    if(jh.jt == "1"){
      console.log('---------- PlService delete 删除系统计划开始 ----------------');
      let sqls:Array<string> = new Array<string>();
      // 删除本地系统表计划日程关联  获取系统计划管理日程
      let cTbl:CTbl =new CTbl();
      cTbl.ji = jh.ji;
      let scTbl = await this.sqlExec.getList<CTbl>(cTbl);
      if(scTbl.length>0) {
        for (let j = 0, len = scTbl.length; j < len; j++) {
          //提醒删除
          let eTbl:ETbl =new ETbl();
          eTbl.si = scTbl[j].si;
          sqls.push(eTbl.dT());

          //日程参与人删除
          let dTbl:DTbl =new DTbl();
          dTbl.si = scTbl[j].si;
          sqls.push(dTbl.dT());
        }
        // 删除日程附件表
        let spTbl = new SpTbl();
        spTbl.ji = jh.ji;
        sqls.push(spTbl.dT());
      }
      //计划关联日程删除
      sqls.push(cTbl.dT());

      let jhTbl: JhTbl = new JhTbl();
      Object.assign(jhTbl,jh);
      jhTbl.jtd = "0";
      sqls.push(jhTbl.upT());

      await this.sqlExec.batExecSql(sqls);
      console.log('---------- PlService delete 删除系统计划结束 ----------------');
    }
  }

  //获取计划
  async getPlan(){
    console.log('---------- PlService getPlan 获取计划开始 ----------------');
    let pld = new PagePlData();
    //获取本地计划
    let sql = "select jh.*,COALESCE (gc.count, 0) js from gtd_j_h jh  left join ( select c.ji ji,count(c.ji) count from gtd_c c left join gtd_sp sp on sp.si = c.si group by c.ji) gc on jh.ji = gc.ji order by jh.wtt desc";
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

}
