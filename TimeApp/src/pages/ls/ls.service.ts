import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";

@Injectable()
export class LsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }

  //获取验证码
  getSMSCode(): Promise<any> {

    return new Promise((resolve, reject) => {
      //check是否可以二次发送
      //restFul发送验证码
      //倒计时
    });
  }

  //登陆
  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      //参考lp登陆方法
    });
  }
}
