import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BipdshaeData, ShaeRestful} from "../../service/restful/shaesev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {PagePDPro} from "../pd/pd.service";
import {PagePcPro} from "../pc/pc.service";
import * as moment from "moment";

@Injectable()
export class PlService {

  constructor(private sqlExce: SqliteExec,
              private shareRestful:ShaeRestful,
  ) {
  }

  //下载系统计划
  async downloadPlan(pid:string){
    console.log('---------- PlService downloadPlan 清除本地旧计划开始 ----------------');
    // 删除本地旧计划日程关联
    let dctbl:CTbl =new CTbl();
    dctbl.ji = pid;
    let dctbls = await this.sqlExce.getList<CTbl>(dctbl);//获取旧计划管理日程
    if(dctbls.length>0) {
      for(let jhc of dctbls){
        //提醒删除
        let detbl: ETbl = new ETbl();
        detbl.si = jhc.si;
        await this.sqlExce.delete(detbl);
        //日程参与人删除
        let ddtbl: DTbl = new DTbl();
        ddtbl.si = jhc.si;
        await this.sqlExce.delete(ddtbl);
      }
    }
    //计划关联日程删除
    await this.sqlExce.delete(dctbl);
    console.log('---------- PlService downloadPlan 清除本地旧计划结束 ----------------');

    console.log('---------- PlService downloadPlan 下载系统计划开始 ----------------');
    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.oai = "";
    bip.ompn = "";
    bip.c = "";
    bip.d.pi = pid;
    let br = await this.shareRestful.downsysname(bip);
    //插入获取的日程到本地（系统日程需要有特别的表示）
    //计划表
    if(br.data.pn != null){
      let sjh = new JhTbl();
      sjh = br.data.pn;
      await this.sqlExce.save(sjh);
      console.log('---------- PlService downloadPlan 新计划插入计划表 ----------------');
      //日程表
      if(br.data.pa.length>0) {
        console.log('---------- PlService downloadPlan 新计划插入日程表开始 ----------------');
        for (let pa of br.data.pa) {
          let ctbl:CTbl =new CTbl();
          ctbl.si = pa.ai;//日程ID
          ctbl.sn = pa.at;//主题
          ctbl.sd = pa.adt;//时间(YYYY/MM/DD HH:mm)
          ctbl.ji = pa.ap;//计划
          ctbl.rt = pa.ar;//重复
          ctbl.sn = pa.aa;//提醒

          //保存日程表数据
          await this.sqlExce.save(ctbl);
        }
        console.log('---------- PlService downloadPlan 新计划插入日程表结束 ----------------');
      }
    }else{
      console.log('---------- PlService downloadPlan 系统计划无数据 ----------------');
    }

    // 返出参
    let bs = new BsModel<any>();
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
      this.sqlExce.update(jh).then(data =>{
        let bsmodel = new BsModel();
        bsmodel.code = 0;
        resolve(bsmodel);
      })

    })
  }

  //删除系统计划
  async delete(jh:PagePDPro){
    console.log('---------- PdService delete 删除系统计划开始 ----------------');
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
      let ctbls = await this.sqlExce.getList<CTbl>(ctbl);

      for (let j = 0, len = ctbls.length; j < len; j++) {
        //提醒删除
        let etbl:ETbl =new ETbl();
        etbl.si = ctbls[j].si;
        await this.sqlExce.delete(etbl);

        //日程参与人删除
        let dtbl:DTbl =new DTbl();
        dtbl.si = ctbls[j].si;
        await this.sqlExce.delete(dtbl);
      }
      //计划关联日程删除
      await this.sqlExce.delete(ctbl);

      //更新系统计划jdt数据
      await this.upPlan(jh);

      // 删除本地计划
      //await this.sqlExce.delete(jhTbl);

      // TODO restful删除分享计划

    }else {
      console.log('---------- PdService delete 不是系统计划表 ----------------');
    }
    console.log('---------- PdService delete 删除计划结束 ----------------');
    // 返出参
    let bs = new BsModel();
    bs.code = 0;
    return bs;
  }

  //获取计划
  async getPlan(){

    /*let start = moment('2019/03/01 11:30');

    for (let i = 0; i < 20; i++) {
      let c: CTbl = new CTbl();

      c.si = "2000"+i;
      c.sn = "冥王星计划";
      c.sd = start.format('YYYY/MM/DD');
      c.st = start.format('hh:mm');
      c.ed = '9999/12/31'
      c.et = '24:00'
      c.rt = '0';
      c.sr = c.si;
      c.ji = "2b30de319600c1eca736f49ec6324837";

      this.sqlExce.save(c).then(c => {
        console.log("插入数据=====" + c);
      });
    }*/

    console.log('---------- PlService getPlan 获取计划开始 ----------------');
    let pld = new PagePlData();
    //获取本地计划
    let jhtbl:JhTbl = new JhTbl();
    let jhCtbl: Array<PagePDPro> = await this.sqlExce.getList<PagePDPro>(jhtbl);
    if(jhCtbl.length > 0){
      //console.log('---------- PlService getPlan 获取计划日程数量开始 ----------------');
      //获取计划日程数量
      for(let jhc of jhCtbl){
        let c:CTbl =new CTbl();
        c.ji = jhc.ji;
        let cl:Array<any> = await this.sqlExce.getList<CTbl>(c);
        jhc.js = cl.length;

        if(jhc.jtd == null || jhc.jtd == ""){
          jhc.jtd = "0";
        }
      }
      pld.pl = jhCtbl;
      console.log('---------- PlService getPlan 获取计划日程数量结束 ----------------');
    }
    console.log('---------- PlService getPlan 获取计划结束 ----------------');
    return pld;
  }

}

export class PagePlData {

  pl:Array<PagePDPro> = new Array<PagePDPro>(); //计划列表

}
