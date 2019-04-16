import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, P, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";
import {UserConfig} from "../../service/config/user.config";
import {PagePDPro, PagePlData} from "../../data.mapping";

@Injectable()
export class PlService {

  constructor(private sqlExec: SqliteExec,
              private shareRestful:ShaeRestful,
              private util: UtilService,) {}

  //下载系统计划
  async downloadPlan(pid:string){
    // 出参
    let bs = new BsModel<any>();
    console.log('---------- PlService downloadPlan 清除本地旧计划开始 ----------------');
    // 删除本地旧计划日程关联
    let dctbl:CTbl =new CTbl();
    dctbl.ji = pid;
    let dctbls = await this.sqlExec.getList<CTbl>(dctbl);//获取旧计划管理日程
    if(dctbls.length>0) {
      for(let jhc of dctbls){
        //提醒删除
        let detbl: ETbl = new ETbl();
        detbl.si = jhc.si;
        await this.sqlExec.delete(detbl);
        //日程参与人删除
        let ddtbl: DTbl = new DTbl();
        ddtbl.si = jhc.si;
        await this.sqlExec.delete(ddtbl);
      }

      // 删除日程附件表
      let desp = new SpTbl();
      desp.ji = pid;
      await this.sqlExec.delete(desp);
    }
    //计划关联日程删除
    await this.sqlExec.delete(dctbl);
    console.log('---------- PlService downloadPlan 清除本地旧计划结束 ----------------');

    console.log('---------- PlService downloadPlan 下载系统计划开始 ----------------');
    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.oai = "";
    bip.ompn = "";
    bip.c = "";
    bip.d.pi = pid;
    let br:BsModel<P> = new BsModel<P>();
    br = await this.shareRestful.downsysname(bip);
    //插入获取的日程到本地（系统日程需要有特别的表示）
    //计划表
    if(br.data.pn != null){
      let sjh = new JhTbl();
      sjh.ji = pid;
      sjh.jn = br.data.pn.pt;
      sjh.jg = br.data.pn.pd;
      sjh.jc = br.data.pn.pm;
      sjh.jt = "1";

      await this.sqlExec.update(sjh);
      console.log('---------- PlService downloadPlan 新计划插入计划表 ----------------');
      //日程表
      if(br.data.pa.length>0) {
        console.log('---------- PlService downloadPlan 新计划插入日程表开始 ----------------');
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
          await this.sqlExec.save(ctbl);

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
          await this.sqlExec.save(sp);
        }

        bs.data = br.data.pa.length;
        console.log('---------- PlService downloadPlan 新计划插入日程表结束 ----------------');
      }
    }else{
      console.log('---------- PlService downloadPlan 系统计划无数据 ----------------');
    }

    bs.code = 0;
    return bs;
  }

  //更新系统计划jdt数据
  upPlan(jht:PagePDPro):Promise<BsModel<any>>{
    return new Promise<any>((resolve, reject) => {
      //保存本地计划
      let jh = new JhTbl();
      jh.ji = jht.ji;
      jh.jc = jht.jc;
      jh.jg = jht.jg;
      jh.jn = jht.jn;
      jh.jt = jht.jt;
      jh.jtd = jht.jtd;
      this.sqlExec.update(jh).then(data =>{
        let bsmodel = new BsModel();
        bsmodel.code = 0;
        resolve(bsmodel);
      })

    })
  }

  //删除系统计划
  async delete(jh:PagePDPro){
    console.log('---------- PlService delete 删除系统计划开始 ----------------');
    if(jh.jt == "1"){
      //获取本地计划
      let jhTbl: JhTbl = new JhTbl();
      jhTbl.ji = jh.ji;
      jhTbl.jn = jh.jn;
      jhTbl.jg = jh.jg;
      jhTbl.jc = jh.jc;
      jhTbl.jt = jh.jt;
      jhTbl.jtd = jh.jtd;

      // 删除本地系统表计划日程关联
      //获取系统计划管理日程
      let ctbl:CTbl =new CTbl();
      ctbl.ji = jhTbl.ji;
      let ctbls = await this.sqlExec.getList<CTbl>(ctbl);

      for (let j = 0, len = ctbls.length; j < len; j++) {
        //提醒删除
        let etbl:ETbl =new ETbl();
        etbl.si = ctbls[j].si;
        await this.sqlExec.delete(etbl);

        //日程参与人删除
        let dtbl:DTbl =new DTbl();
        dtbl.si = ctbls[j].si;
        await this.sqlExec.delete(dtbl);
      }

      // 删除日程附件表
      let desp = new SpTbl();
      desp.ji = jh.ji;
      await this.sqlExec.delete(desp);

      //计划关联日程删除
      await this.sqlExec.delete(ctbl);

      //更新系统计划jdt数据
      jh.jtd = "0";
      await this.upPlan(jh);

      // 返出参
      let bs = new BsModel();
      bs.code = 0;
      return bs;
    }else {
      console.log('---------- PlService delete 不是系统计划表 ----------------');
    }
    console.log('---------- PlService delete 删除系统计划结束 ----------------');
  }

  //获取计划
  async getPlan(){

    console.log('---------- PlService getPlan 获取计划开始 ----------------');
    let pld = new PagePlData();
    //获取本地计划
    let jhSql = "select * from gtd_j_h order by wtt desc";
    let jhCtbl: Array<PagePDPro> = await this.sqlExec.getExtList<PagePDPro>(jhSql);
    if(jhCtbl.length > 0){
      console.log('---------- PlService getPlan 获取计划日程数量开始 ----------------');
      let xtJh: Array<PagePDPro> = new  Array<PagePDPro>();
      let zdyJh: Array<PagePDPro> = new  Array<PagePDPro>();

      //获取计划日程数量
      for(let jhc of jhCtbl){
        let sql = 'select c.si from gtd_c c left join gtd_sp sp on sp.si = c.si where c.ji = "'+ jhc.ji + '"';
        let cs = await this.sqlExec.getExtList<CTbl>(sql);
        jhc.js = cs.length;

        jhc.pt = jhc.jn; // 计划分享使用

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

      console.log('---------- PlService getPlan 获取计划日程数量结束 ----------------');
    }
    console.log('---------- PlService getPlan 获取计划结束 ----------------');
    return pld;
  }

}
