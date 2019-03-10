import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";

@Injectable()
export class PdService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }

  //获取计划
  getPlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地计划
      //获取计划管理日程（重复日程处理等）
      //获取计划管理特殊日程（重复日程处理等）
    })
  }

  //分享计划
  sharePlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地计划日程
      //restful上传计划
    })
  }

  //删除计划
  deletePlan(pid:string):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地计划日程
      //删除本地计划日程关联
      //删除本地计划
      //restful删除分享计划
    })
  }
}
