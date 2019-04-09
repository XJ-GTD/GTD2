import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";
import { AgdRestful} from "../../service/restful/agdsev";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";

@Injectable()
export class TdcService {
  constructor(private sqlExce: SqliteExec,private util: UtilService,private agdRest: AgdRestful,
              private pgbusiServ:PgBusiService) {
  }



  //获取计划列表
  getPlans():Promise<any>{
    return new Promise((resolve, reject) => {
      //获取本地计划列表
      let jhtbl:JhTbl = new JhTbl();
      jhtbl.jt = "2";
      this.sqlExce.getList<JhTbl>(jhtbl).then(data=>{
        resolve(data)
      }).catch(error=>{
        resolve(error)
      })
    });
  }

  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc : ScdData):Promise<BsModel<any>>{
    return this.pgbusiServ.save(rc);
  }

  //删除日程 type：1 删除当前以后所有 ，2 删除所有
  async delete(rcId:string){
    return await this.pgbusiServ.delete(rcId,"2","");
  }


  //修改本地日程详情
  async updateDetail(scd:ScdData){
    return this.pgbusiServ.updateDetail(scd);
  }

}
