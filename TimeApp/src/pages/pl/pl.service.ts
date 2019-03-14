import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {AgdPro, ContactPerPro} from "../../service/restful/agdsev";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {BipdshaeData, ShaeRestful} from "../../service/restful/shaesev";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {PagePlPro} from "../pd/pd.service";
import {PageGlData} from "../gl/gl.service";

@Injectable()
export class PlService {

  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
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

    // 返出参
    let bs = new BsModel<any>();
    bs.code = 0;
    return bs;
  }

  //获取计划
  async getPlan(){
    console.log('---------- PlService getPlan 获取计划开始 ----------------');
    let pld = new PagePlData();
    //获取本地计划
    let jhCtbl: Array<PagePlPro> = await this.sqlExce.getList<PagePlPro>(new JhTbl());
    if(jhCtbl.length>0){
      console.log('---------- PlService getPlan 获取计划日程数量开始 ----------------');
      //获取计划日程数量
      for(let jhc of jhCtbl){
        let c:CTbl =new CTbl();
        c.ji = jhc.ji;
        let cl:Array<any> = await this.sqlExce.getList<CTbl>(c);
        jhc.js = cl.length;
      }
      pld.pl = jhCtbl;
      console.log('---------- PlService getPlan 获取计划日程数量结束 ----------------');
    }
    console.log('---------- PlService getPlan 获取计划结束 ----------------');
    return pld;
  }

}

export class PagePlData {

  pl:Array<PagePlPro> = new Array<PagePlPro>(); //计划列表

}
