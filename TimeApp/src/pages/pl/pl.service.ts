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
  async downloadPlan(pid:string){
    //restful获取计划日程
    let bip = new BipdshaeData();
    bip.oai = "";
    bip.ompn = "";
    bip.c = "";
    bip.d.pi = pid;

    let br = await this.shareRestful.downsysname(bip);

    // 删除本地计划日程关联
    let dctbl:CTbl =new CTbl();
    dctbl.ji = pid;

    let ctbls = await this.sqlExce.getList<CTbl>(dctbl);//获取计划管理日程

    for (var j = 0, len = ctbls.length; j < len; j++) {

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
    await this.sqlExce.delete(dctbl);

    //插入获取的日程到本地（系统日程需要有特别的表示）
    //计划表
    let sjh = new JhTbl();
    sjh = br.data.pn;
    await this.sqlExce.save(sjh);
    //日程表
    let agd = new Array<AgdPro>();
    agd = br.data.pa;
    for (var j = 0, len = agd.length; j < len; j++) {
      let ctbl:CTbl =new CTbl();
      ctbl.si = agd[j].ai;//日程ID
      ctbl.sn = agd[j].at;//主题
      ctbl.sd = agd[j].adt;//时间(YYYY/MM/DD HH:mm)
      ctbl.ji = agd[j].ap;//计划
      ctbl.rt = agd[j].ar;//重复
      ctbl.sn = agd[j].aa;//提醒

      //保存日程表数据
      await this.sqlExce.save(ctbl);

      let cps = new Array<ContactPerPro>();
      for (var d = 0, len = cps.length; d < len; d++) {
        let cp = new ContactPerPro();
        cp = cps[d];

        let dtbl:DTbl =new DTbl();
        dtbl.pi = this.util.getUuid();
        dtbl.si = agd[j].ai;
        dtbl.st = agd[j].at;
        dtbl.son = agd[j].am;
        dtbl.ai = cps[d].ai;
        //保存日程参与人
        await this.sqlExce.save(dtbl);
      }
    }

    // 返出参
    let ret = new BsModel();
    ret.code = 0;
    ret.message = "成功";
    return ret;
  }

  //获取计划
  async getPlan(pid:string){
    //获取本地计划
    let jhTbl: JhTbl = new JhTbl();
    jhTbl.ji = pid;

    let jhList = await this.sqlExce.getList<JhTbl>(jhTbl);

    let out = Array<PagePlPro>();
    //获取计划管理日程（日程数量）无重复判断
    for (let j = 0, len = jhList.length; j < len; j++) {
      let ctbl:CTbl =new CTbl();
      ctbl.ji = jhList[j].ji;
      let c = await this.sqlExce.getList<CTbl>(ctbl);

      let p:PagePlPro = new PagePlPro();
      p.ji = jhList[j].ji;
      p.jn = jhList[j].jn;
      p.jg = jhList[j].jg;
      p.jc = jhList[j].jc;
      p.jt = jhList[j].jt;
      p.js = c.length;

      out.push(p);
    }

    // 返出参
    let ret = new BsModel();
    ret.code = 0;
    ret.data = out;
    return ret;
  }
}
//页面项目
export class PagePlPro{
  ji: string="";//计划ID
  jn: string="";//计划名
  jg: string="";//计划描述
  jc: string="";//计划颜色标记
  jt: string="";//计划类型

  js: number=0; //日程数量
}
