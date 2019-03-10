import {Injectable} from "@angular/core";
import {PersonRestful, SignupData} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {LpData, LpService} from "../lp/lp.service";

@Injectable()
export class RService {

  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private lpService: LpService,
  ) {
  }

  //注册
  signup(rdata: RData): Promise<RData> {
    console.log(rdata.mobile + "////" + rdata.password + "////" + rdata.authCode);
    return new Promise((resolve, reject) => {

      //restful 注册用户
      let restData: SignupData = new SignupData();
      restData.reqData.mobile = rdata.mobile;
      restData.reqData.authCode = rdata.authCode;
      restData.reqData.password = rdata.password;
      return this.personRestful.signup(restData).then(data => {
        if (data.repData.code != "0")
          throw data.repData.message;

        //登陆(密码)service登陆逻辑
        let lpdata: LpData = new LpData();
        lpdata.mobile = rdata.mobile;
        lpdata.password = rdata.password;

        return this.lpService.login(lpdata);

      }).then(data => {

        if (data.retData.code == "0") {
          resolve(rdata)
        } else {
          throw data.retData.message;
        }

      }).catch(err => {
        reject(err);
      })
    });
  }


//短信验证码
  sc(rdata: RData): Promise<RData> {
    console.log(rdata.mobile + "////");
    return new Promise((resolve, reject) => {
      this.smsRestful.getcode().then(data => {
        // TODO 短信验证码
        resolve(rdata)
      })
    });
  }
}

export class RData {
  mobile: string = "";
  password: string = "";
  authCode: string = "";
}
