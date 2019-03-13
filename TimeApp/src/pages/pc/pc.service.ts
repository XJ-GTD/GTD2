import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PcService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }

  //保存计划
  savePlan():Promise<BsModel<any>>{
    return new Promise<any>((resolve, reject) => {
      //保存本地计划
      let pjh = new PageJhPro();

      let jh = new JhTbl();
      jh.ji = this.util.getUuid();
      jh.ji = pjh.jc;
      jh.jg = pjh.jg;
      jh.jn = pjh.jn;
      jh.jt = "2";
      this.sqlExce.save(jh).then(data =>{
        let bsmodel = new BsModel();
        bsmodel.code = 0;
        resolve(bsmodel);
      })

    })
  }

}

export class PageJhPro{
  //计划名
  jn:string="";
  //计划描述
  jg:string="";
  //计划颜色标记
  jc:string="";
}
