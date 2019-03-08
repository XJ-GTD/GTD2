import {Injectable} from "@angular/core";
import {PermissionsService} from "../../service/util-service/permissions.service";
import {SqliteInit} from "../../service/sqlite/sqlite.init";
import {SqliteConfig} from "../../service/config/sqlite.config";
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {PersonRestful} from "../../service/restful/personsev";
import {RestFulConfig, RestFulHeader} from "../../service/config/restful.config";
import {SmsRestful} from "../../service/restful/smssev";
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";

@Injectable()
export class RService {

  constructor(private personRestful: PersonRestful,
                private smsRestful: SmsRestful,
                private sqlExce: SqliteExec,
                private util: UtilService,
                private restfulConfig: RestFulConfig,
                ) {
  }

  //注册
  signup(accountMobile:string,accountPassword:string,authCode:any): Promise<string> {
    console.log(accountMobile+"////"+accountPassword+"////"+authCode);
    return new Promise((resolve, reject) => {
      this.personRestful.signup().then(data=>{
        // TODO 注册
        resolve(data)
      })
    });
  }

  //登录
  login(accountMobile:string,accountPassword:string): Promise<string> {
    console.log(accountMobile+"////"+accountPassword+"////");
    return new Promise((resolve, reject) => {
      this.personRestful.signup().then(data=>{
        // TODO 登录
        resolve(data)
      })
    });
  }

//短信验证码
  sc(accountMobile:string): Promise<string> {
    console.log(accountMobile+"////");
    return new Promise((resolve, reject) => {
      this.smsRestful.getcode().then(data=>{
        // TODO 短信验证码
        resolve(data)
      })
    });
  }

//保存创建用户的信息
  createSystemData(body:any): Promise<string> {
    return new Promise((resolve, reject) => {
      //数据
      let aTbl: ATbl = new ATbl();
      this.restfulConfig.createHeader().then(data=>{
        aTbl.aI = data.ai;
        aTbl.aN = "时光旅行者"+body.accountMobile;
        aTbl.aM = body.accountMobile;
        aTbl.aE = data.di;
        aTbl.aT = '';
        aTbl.aQ = '';
      }).then(data=>{
        this.sqlExce.replaceT(aTbl).then(data => {
          console.log(data);
          resolve("保存成功");

        }).catch(err => {
          resolve("保存失败");
        })
      })


    })
  }

}
