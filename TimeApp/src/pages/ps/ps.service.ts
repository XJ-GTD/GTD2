import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }

  //获取用户信息
  getUser():Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //获取本地用户信息（系统静态变量获取）
    })
  }

  //保存用户信息
  saveUser(user:any):Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //保存本地用户信息
      //restFul保存用户信息
      //刷新系统全局用户静态变量
    })
  }

  //修改密码
  editPass():Promise<any>{
    return new Promise<any>((resolve, reject) => {
      //restFul更新用户密码（服务器更新token并返回，清空该用户服务其他token）
      //刷新系统全局用户静态变量
    })
  }
}
