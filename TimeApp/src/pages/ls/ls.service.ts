import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsData, SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {AuthRestful, LoginData} from "../../service/restful/authsev";

@Injectable()
export class LsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
              private authRestful: AuthRestful,
  ) {
  }

  //获取验证码
  getSMSCode(mobile:string): Promise<any> {

    return new Promise((resolve, reject) => {
      //check是否可以二次发送
      //restFul发送验证码
      //倒计时
      console.log(mobile + "////");
      return new Promise((resolve, reject) => {
        let smsData:SmsData = new SmsData();
        smsData.reqData.phoneno = mobile;
        this.smsRestful.getcode(smsData).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err);
        })
      });


    });
  }

  //登陆
  login(lsData:LsData): Promise<any> {
    console.log(lsData.mobile + "////" + lsData.authCode + "////");
    return new Promise((resolve, reject) => {
      //参考lp登陆方法
      let restloginData: LoginData = new LoginData();
      restloginData.reqAData.phoneno = lsData.mobile;
      restloginData.reqAData.authCode = lsData.authCode;
      // 验证用户名密码
      this.authRestful.loginbypass(restloginData).then(data => {
        if (data.repData.code != null){
          throw  data.repData.errmsg;
        }

        //获取登陆用户信息

        //更新用户表

        //更新账户表
        // 同步数据（调用brService方法恢复数据）
        //建立websoct连接（调用websoctService）
        resolve(lsData)
      })
    });
  }
}
export class LsData {
  mobile: string;
  authCode: string;
  retData = {
    code: "",
    message: ""
  };
}
