import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";

@Injectable()
export class PlService {

  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }
  downloadPlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //restful获取计划日程
      //删除本地计划相关日程
      //插入获取的日程到本地（系统日程需要有特别的表示）
    })
  }

  //获取计划
  getPlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地计划

      //获取计划管理日程（日程数量）
    })
  }
}
//页面项目
export class PagePlPro{
  //计划名
  jn:string="";
  //计划描述
  jg:string="";
  //计划颜色标记
  jc:string="";
}
