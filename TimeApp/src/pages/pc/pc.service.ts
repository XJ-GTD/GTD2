import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {PagePcPro} from "../../data.mapping";

@Injectable()
export class PcService {
  constructor(
              private sqlExce: SqliteExec,
              private util: UtilService,
  ) {
  }

  //保存计划
  savePlan(pcData:PagePcPro):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //保存本地计划
      let jh = new JhTbl();
      jh.ji = this.util.getUuid();
      jh.jc = pcData.jc;
      jh.jg = pcData.jg;
      jh.jn = pcData.jn;
      jh.jt = "2";
      this.sqlExce.save(jh).then(data =>{
        resolve(data);
      })

    })
  }

}
