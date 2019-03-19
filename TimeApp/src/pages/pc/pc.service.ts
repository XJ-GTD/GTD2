import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PcService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
  ) {
  }

  //保存计划
  savePlan(pcData:PagePcPro):Promise<BsModel<any>>{
    return new Promise<any>((resolve, reject) => {
      //保存本地计划
      let jh = new JhTbl();
      jh.ji = this.util.getUuid();
      jh.jc = pcData.jc;
      jh.jg = pcData.jg;
      jh.jn = pcData.jn;
      jh.jt = "2";
      this.sqlExce.save(jh).then(data =>{
        let bsmodel = new BsModel();
        bsmodel.code = 0;
        resolve(bsmodel);
      })

    })
  }

}
//页面项目
export class PagePcPro{
  //计划名
  jn:string="";
  //计划描述
  jg:string="";
  //计划颜色标记
  jc:string="";
}
