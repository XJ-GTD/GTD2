import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {PageRcData} from "../tdc/tdc.service";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {AgdPro, AgdRestful} from "../../service/restful/agdsev";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";

@Injectable()
export class TddiService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig,
    private util: UtilService,
    private agdRestful:AgdRestful) {
  }

  //获取日程
  get():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地日程

      //获取计划对应色标

    });
  }

  //删除日程
  async delete(dt:string,type: string,rcId:string){
    let agdPro:AgdPro = new AgdPro();
    let ctbl:CTbl =new CTbl();
    //日程Id
    ctbl.si = rcId;
    let cData = await this.sqlExce.getOne(ctbl);

    ctbl = cData[0];
    agdPro.ai = ctbl.si;//日程ID
    agdPro.at = ctbl.sn;//主题
    agdPro.fc = ctbl.ui;//日程发送人用户ID 创建者
    agdPro.adt = ctbl.sd;//开始日期
    agdPro.st = ctbl.st;//开始时间
    //agdPro.ed = ctbl.ed;//结束日期
    agdPro.et = ctbl.et;//结束时间
    agdPro.ar = ctbl.rt;//重复
    agdPro.ap = ctbl.ji;//计划
    agdPro.aa = ctbl.tx;//提醒
    agdPro.am = ctbl.bz;//备注
    agdPro.pni = ctbl.pni;//重复类型日程的父ID

    if(type == "1"){
      //点击删除今天及以后所有日程  将当前数据的结束日期改为昨天
      ctbl.ed = moment(dt).subtract(1, 'days').format('YYYY/MM/DD'); // 日期转型  昨天 1
      await this.sqlExce.update(ctbl);//本地修改结束日程

      //restFul修改日程
      await this.agdRestful.save(agdPro);
    }else{
      // 非重复日程 直接删除
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
  tdl : PageRcData = new PageRcData();  //日程事件表信息


}
