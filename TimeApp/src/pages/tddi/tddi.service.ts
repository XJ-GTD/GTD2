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
    //他人创建
    c.gs = "0";
    //新消息未读
    c.du = "0";
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





  //修改本地日程详情
  async updateDetail(scd:ScdData){


    //更新日程
    let c = new CTbl();
    Object.assign(c,scd);
    //消息设为已读
    c.du= "1";
    await  this.sqlExce.update(c);

    //更新提醒时间
    let e = new ETbl();
    Object.assign(e,scd.r);
    await this.sqlExce.update(c);

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
