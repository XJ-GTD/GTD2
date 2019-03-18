import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {fsData, ScdData} from "../tdl/tdl.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";

@Injectable()
export class TddiService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig,
    private util: UtilService,
    private agdRestful:AgdRestful) {
  }

  //响应MQ消息，从服务器获取最新日程
  async pullAgd(si : string){
    let agd = new AgdPro();
    agd.ai = si;
    let bs = new BsModel<AgdPro>();
    bs = await this.agdRestful.get(agd);

    let c = new CTbl();
    c.si = si;
    c = await this.sqlExce.getOne<CTbl>(c);
    let newc = new CTbl();
    if (c == null){
      //插入日程表
      this.setCtbl(newc,bs.data);
      await this.sqlExce.save(newc);
    }else{
      //更新日程表
      this.setCtbl(newc,bs.data);
      //本地日程的备注和提醒不被更新
      newc.bz = c.bz;
      newc.tx = c.tx;
      await this.sqlExce.replaceT(newc);
    }

  }

  private setCtbl(c :CTbl,agd:AgdPro){
    //关联日程ID
    c.sr = agd.rai ;
    //日程发送人用户ID
    c.ui = agd.fc  ;
    //日程ID
    c.si = agd.ai  ;
    //主题
    c.sn = agd.at  ;
    //时间(YYYY/MM/DD)
    c.sd = agd.adt ;
    c.st = agd.st  ;
    c.ed = agd.ed  ;
    c.et = agd.et  ;
    //计划
    c.ji = agd.ap  ;
    //重复
    c.rt = agd.ar  ;
    //提醒
    c.tx = agd.aa  ;
    //备注
    c.bz = agd.am  ;
  }

  private async setDtbl(d :DTbl,cp:ContactPerPro){

    let b = new BTbl();
    b.pwi = d.ai;
    b = await this.sqlExce.getOne<BTbl>(b);
    //帐户ID
    cp.ai = b.ui;
    //手机号码
    cp.mpn = b.rc;
    //姓名
    cp.n = b.rn;
    //头像
    cp.a = b.hiu;

  }

  //获取日程
  async get(si: string){
    let bs = new BsModel<ScdData>();
    //获取本地日程

    let scdData = new ScdData();

    let ctbl = new CTbl();
    ctbl.si = si;
    ctbl = await this.sqlExce.getOne<CTbl>(ctbl);
    Object.assign(scdData, ctbl);

    //获取计划对应色标
    let jh = new JhTbl();
    jh.ji = scdData.ji;
    jh = await this.sqlExce.getOne<JhTbl>(jh);
    Object.assign(scdData.p, jh);

    //获取日程参与人表
    let d = new DTbl();
    d.si = si;
    let dList = await this.sqlExce.getList<DTbl>(d);
    for (let j = 0, len = dList.length; j < len; j++) {
      let fsd = new fsData();
      Object.assign(fsd, dList[j]);
      scdData.fss.push(fsd);
    }

    //获取提醒时间
    let e = new ETbl();
    e.si = si;
    e = await this.sqlExce.getOne<ETbl>(e);
    Object.assign(scdData.r, e);

    bs.code = 0;
    bs.data = scdData;
    return bs;
  }

  //删除日程
  async delete(rcId:string){
    let agdPro:AgdPro = new AgdPro();
    let ctbl:CTbl =new CTbl();

    //日程Id
    ctbl.si = rcId;

    let etbl:ETbl =new ETbl();
    etbl.si = ctbl.si;
    await this.sqlExce.delete(etbl);//本地删除提醒
    let dtbl:DTbl =new DTbl();
    dtbl.si = ctbl.si;
    await this.sqlExce.delete(dtbl);//本地删除日程参与人

    await this.sqlExce.delete(ctbl); //本地删除日程表

    //restFul 删除日程
    let a:AgdPro = new AgdPro();
    a.ai = ctbl.si;//日程ID
    await this.agdRestful.remove(a);

  }

  //修改本地日程
  update():Promise<any>{
    return new Promise((resolve, reject) => {

      //修改本地本地日程（修改范围备注，计划，和提醒）

      //删除本地提醒表

      //插入本地提醒表

    });
  }


  //获取计划列表
  getPlans():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地计划列表

    });
  }
}

export class PageTddIData{
  tdl : ScdData = new ScdData();  //日程事件表信息


}
