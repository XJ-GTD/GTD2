import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {fsData, ScdData, SpecScdData} from "../tdl/tdl.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {AgdPro, AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";

@Injectable()
export class TddjService {
  constructor(private sqlExce: SqliteExec,private userConfig: UserConfig,
              private util :UtilService,private agdful : AgdRestful) {
  }

  //获取日程
  async get(si: string, type: string) {
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
  delete(): Promise<any> {
    return new Promise((resolve, reject) => {

      //删除本地日程

      //restFul删除日程

    });
  }

  //修改本地日程详情
  async updateDetail(scd:ScdData){


    //更新日程
    let c = new CTbl();
    Object.assign(c,scd);
    await  this.sqlExce.update(c);

    //更新提醒时间
    let e = new ETbl();
    Object.assign(e,scd.r);
    await this.sqlExce.update(c);

    //restful用参数
    let agd = new AgdPro();
    this.setAdgPro(agd,c);
    await this.agdful.save(agd);
  }

  //修改本地日程参与人
  async updateContact(scd:ScdData){


    //restful用参数
    let agd = new AgdPro();
    agd.ai = scd.si;

    //更新参与人
    let d = new DTbl();
    d.si = scd.si;
    await this.sqlExce.delete(d);

    for (let j = 0, len = scd.fss.length; j < len; j++) {
      let dnew :DTbl  = new DTbl();
      Object.assign(dnew,scd.fss[j]);
      dnew.pi = this.util.getUuid();
      dnew.si = scd.si;
      await this.sqlExce.save(dnew);

      //restful用
      let cp = new ContactPerPro();
      this.setAdgContactPro(cp,dnew);
      agd.ac.push(cp);
    }
    await this.agdful.save(agd);
  }

  private setAdgPro(agd:AgdPro,c :CTbl){
    //关联日程ID
    agd.rai = c.sr;
    //日程发送人用户ID
    agd.fc = c.ui;
    //日程ID
    agd.ai = c.si;
    //主题
    agd.at = c.sn;
    //时间(YYYY/MM/DD)
    agd.adt = c.sd;
    agd.st = c.st;
    agd.ed = c.ed;
    agd.et = c.et;
    //计划
    agd.ap = c.ji;
    //重复
    agd.ar = c.rt;
    //提醒
    agd.aa = c.tx;
    //备注
    agd.am = c.bz;
  }

  private async setAdgContactPro(cp:ContactPerPro,d :DTbl){

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

  //修改本地日程（可修改重复日程的某一天，暂不使用此功能）
  async update(updDt: string, scd: ScdData, type: string) {

    //设置原始日程id
    let pni = "";
    if (scd.pni =="" || scd.pni == null){
      pni = scd.si;
    }else{
      pni = scd.pni;
    }
    let updDate : string = "";

    //修改当天日程
    if (type == "0"){
      /*当前日期之前日程更新为有结束的日程*/
      updDate = moment(updDate).subtract(1, 'd').to("YYYY/MM/DD");
      await this.setCurBefore(updDate,scd,pni);

      /*为修改的当前日期添加一条新的日程*/
      updDate = moment(updDate).to("YYYY/MM/DD");
      await this.setCur(updDate,scd,pni);

      /*添加当前日期之后的日程(开始日期为当前日期+1,结束日为日程结束日)，日程内容设定与原日程相同*/
      updDate = moment(updDate).add(1,'d').to("YYYY/MM/DD");
      await this.setCurAfter(updDate,scd,pni);
    }

    //修改当天以后所有
    if (type == "1"){
      /*当前日期之前日程更新为有结束的日程*/
      updDate = moment(updDate).subtract(1, 'd').to("YYYY/MM/DD");
      await this.setCurBefore(updDate,scd,pni);

      /*删除当前日期之后的所有日程（包含当前日期）*/
      updDate = moment(updDate).to("YYYY/MM/DD");
      await this.delFromCur(updDate,scd);

      /*添加当前日期之后的日程(开始日期为当前日期)，日程内容设定与原日程相同*/
      updDate = moment(updDate).to("YYYY/MM/DD");
      await this.setCurAfter(updDate,scd,pni);

    }

    let bsModel = new BsModel();
    bsModel.code = 0;
    return bsModel;
  }

  //当前日期之前日程更新为有结束的日程
  private async setCurBefore(updDate: string, scd: ScdData, pni: string) {
    //修改本地本地日程
    let c = new CTbl();
    c.si = scd.si;
    c.pni = pni;
    //设置结束日
    c.ed = updDate;
    await this.sqlExce.update(c);

    /*restFul修改日程*/
    //当前日期之前日程的修改更新到服务器
    let agd = new AgdPro();
    this.setAdgPro(agd,c);
    await this.agdful.save(agd);
  }

  //为修改的当前日期添加一条新的日程
  private async setCur(updDate: string, scd: ScdData, pni: string){

    //restful用参数
    let agd = new AgdPro();
    agd.ai = scd.si;

    //添加新日程
    let cnew = new CTbl();
    Object.assign(cnew,scd);
    cnew.si = this.util.getUuid();
    //设置开始日
    cnew.sd = updDate;
    //设置结束日
    cnew.ed = updDate;
    //设置原始日程ID
    cnew.pni = pni;
    await  this.sqlExce.save(cnew);

    this.setAdgPro(agd,cnew);

    //对应添加新的日程参与人
    for (let j = 0, len = scd.fss.length; j < len; j++) {
      let dnew :DTbl  = new DTbl();
      Object.assign(dnew,scd.fss[j]);
      dnew.pi = this.util.getUuid();
      dnew.si = cnew.si;
      await this.sqlExce.save(dnew);

      //restful用
      let cp = new ContactPerPro();
      this.setAdgContactPro(cp,dnew);
      agd.ac.push(cp);
    }

    //对应添加新的日程提醒
    let e = new ETbl();
    Object.assign(e,scd.r);
    e.wi = this.util.getUuid();
    e.si = cnew.si;
    await this.sqlExce.save(e);

    /*restFul修改日程*/
    //修改的当前日期的日程相关信息更新到服务器
    //日程
    await this.agdful.save(agd);

    //参与人
    await this.agdful.contactssave(agd);
  }

  //添加当前日期之后的日程，日程内容设定与原日程相同
  private async setCurAfter(updDate: string, scd: ScdData, pni: string){
    let agd = new AgdPro();
    agd.ai = scd.si;

    //获取原日程详情
    let oldc = new CTbl();
    oldc.si = scd.si;
    oldc = await this.sqlExce.getOne<CTbl>(oldc);

    //获取原日程参与人
    let condi = new DTbl();
    let oldd:Array<DTbl> = new Array<DTbl>();
    condi.si = scd.si;
    oldd = await this.sqlExce.getList<DTbl>(condi);

    //获取原日程提醒
    let condi2 = new ETbl();
    let olde= new ETbl();
    condi2 .si = scd.si;
    olde = await this.sqlExce.getOne<ETbl>(condi2);

    //添加当期日期后日程
    let cnew = new CTbl();
    Object.assign(cnew,oldc);
    cnew.si = this.util.getUuid();

    //设置开始日
    cnew.sd = updDate;
    //设置原始日程ID
    cnew.pni = pni;
    await  this.sqlExce.save(cnew);
    //restful用
    this.setAdgPro(agd,cnew);

    //对应添加新的日程参与人
    for (let j = 0, len = oldd.length; j < len; j++) {
      let dnew :DTbl  = new DTbl();
      Object.assign(dnew,oldd[j]);
      dnew.pi = this.util.getUuid();
      dnew.si = cnew.si;
      await this.sqlExce.save(dnew);

      //restful用
      let cp = new ContactPerPro();
      this.setAdgContactPro(cp,dnew);
      agd.ac.push(cp);
    }

    //对应添加新的日程提醒
    let e = new ETbl();
    Object.assign(e,olde);
    e.wi = this.util.getUuid();
    e.si = cnew.si;
    await this.sqlExce.save(e);

    /*restFul修改日程*/
    //当前日期之后日程相关信息更新到服务器
    //日程
    await this.agdful.save(agd);

    //参与人
    await this.agdful.contactssave(agd);

  }

  //删除当前日期之后的所有日程（包含当前日期）
  private async delFromCur(updDate: string, scd: ScdData){

  }

  //获取计划列表
  getPlans(): Promise<any> {
    return new Promise((resolve, reject) => {
      //获取本地计划列表

    });
  }
}
