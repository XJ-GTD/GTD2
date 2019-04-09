import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import { AgdRestful, ContactPerPro} from "../../service/restful/agdsev";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";

@Injectable()
export class TddiService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig,
    private util: UtilService,
    private agdRestful:AgdRestful,
    private pgbusiServ : PgBusiService) {
  }



  //删除日程 type：1 删除当前以后所有 ，2 删除所有
  async delete(rcId:string,type :string,d:string){
    return await this.pgbusiServ.delete(rcId,type,d);
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
    return this.pgbusiServ.updateDetail(scd);
  }

  /**
   * 获取日程详情
   * @param {string} si 日程id
   * @returns {Promise<BsModel<ScdData>>}
   */
  async get(si:string){
    return await this.pgbusiServ.get(si);
  }
}

export class PageTddIData{
  tdl : ScdData = new ScdData();  //日程事件表信息


}
