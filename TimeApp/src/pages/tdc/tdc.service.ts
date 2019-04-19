import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {AgdRestful} from "../../service/restful/agdsev";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {FsData, ScdData} from "../../data.mapping";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";

@Injectable()
export class TdcService {
  constructor(private sqlExce: SqliteExec, private util: UtilService, private agdRest: AgdRestful,
              private pgbusiServ: PgBusiService) {
  }


  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc: ScdData): Promise<CTbl> {
    return this.pgbusiServ.save(rc);
  }


  /**
   * 获取日程详情
   * @param {string} si 日程id
   * @returns {Promise<BsModel<ScdData>>}
   */
   get(si: string):Promise<ScdData> {
    return  this.pgbusiServ.get(si);
  }

  /**
   * 获取共享日程详情
   * @param {string} si 日程id
   * @returns {Promise<BsModel<ScdData>>}
   */
   getByRef(si: string):Promise<ScdData> {
    return  this.pgbusiServ.get("",si);
  }

  /**
   * 获取日程参与人
   * @param {string} si 日程id
   * @returns {Promise<Array<FsData>>}
   */
   getCalfriend(si: string): Promise<Array<FsData>>{
    return  this.pgbusiServ.getCalfriend(si);
  }

  /**
   * 获取日程参与人
   * @param {string} si 日程id
   * @returns {Promise<Array<FsData>>}
   */
   getCrMan(si: string): Promise<FsData>{
    return  this.pgbusiServ.getCrMan(si);
  }

  //删除日程 type：1 删除当前以后所有 ，2 删除所有
   delete(rcId: string, type: string, d: string): Promise<CTbl>  {
    return  this.pgbusiServ.delete(rcId, type, d);
  }


  //修改本地日程详情
   updateDetail(scd: ScdData):Promise<ScdData> {
    return this.pgbusiServ.updateDetail(scd);
  }

}
