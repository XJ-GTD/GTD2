import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {RestFulConfig} from "../../service/config/restful.config";
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SmsRestful} from "../../service/restful/smssev";

@Injectable()
export class LpService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
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
}
