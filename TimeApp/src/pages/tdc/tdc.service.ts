import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {AgdRestful} from "../../service/restful/agdsev";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {ScdData} from "../../data.mapping";

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
  save(rc: ScdData): Promise<any> {
    return this.pgbusiServ.save(rc);
  }


  /**
   * 获取日程详情
   * @param {string} si 日程id
   * @returns {Promise<BsModel<ScdData>>}
   */
  async get(si: string) {
    return await this.pgbusiServ.get(si);
  }

  /**
   * 获取共享日程详情
   * @param {string} si 日程id
   * @returns {Promise<BsModel<ScdData>>}
   */
  async getByRef(si: string) {
    return await this.pgbusiServ.get("",si);
  }

  /**
   * 获取日程参与人
   * @param {string} si 日程id
   * @returns {Promise<Array<FsData>>}
   */
  async getCalfriend(si: string) {
    return await this.pgbusiServ.getCalfriend(si);
  }

  /**
   * 获取日程参与人
   * @param {string} si 日程id
   * @returns {Promise<Array<FsData>>}
   */
  async getCrMan(si: string) {
    return await this.pgbusiServ.getCrMan(si);
  }

  //删除日程 type：1 删除当前以后所有 ，2 删除所有
  async delete(rcId: string, type: string, d: string) {
    return await this.pgbusiServ.delete(rcId, type, d);
  }


  //修改本地日程详情
  async updateDetail(scd: ScdData) {
    return this.pgbusiServ.updateDetail(scd);
  }

}
