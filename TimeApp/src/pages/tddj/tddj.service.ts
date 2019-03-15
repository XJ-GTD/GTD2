import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {fsData, ScdData} from "../tdl/tdl.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BsModel} from "../../service/restful/out/bs.model";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";

@Injectable()
export class TddjService {
  constructor(private sqlExce: SqliteExec,
              private userConfig: UserConfig) {
  }

  //获取日程
  async get(si: string,type:string) {
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
      let fsd= new fsData();
      Object.assign(fsd,dList[j]);
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

  //修改本地日程
  update(): Promise<any> {
    return new Promise((resolve, reject) => {

      //修改本地本地日程

      //删除本地提醒表

      //插入本地提醒表

      //restFul修改日程

    });
  }


  //获取计划列表
  getPlans(): Promise<any> {
    return new Promise((resolve, reject) => {

      //获取本地计划列表

    });
  }
}
