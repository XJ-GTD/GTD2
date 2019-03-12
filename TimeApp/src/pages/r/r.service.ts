import {Injectable} from "@angular/core";
import {PersonRestful, SignupData} from "../../service/restful/personsev";
import {SmsData, SmsRestful} from "../../service/restful/smssev";
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
      restData.reqData.phoneno = rdata.mobile;
      restData.reqData.verifycode = rdata.authCode;
      restData.reqData.userpassword = rdata.password;
      restData.reqData.verifykey = rdata.verifykey;
      restData.reqData.username = rdata.username;
      return this.personRestful.signup(restData).then(data => {
        if (data.repData.code != "0")
          reject(data.repData.message);

        console.log("注册输出 text :"+ JSON.stringify(data));
        //登陆(密码)service登陆逻辑
        let lpdata: LpData = new LpData();
        lpdata.mobile = rdata.mobile;
        lpdata.password = rdata.password;

        return this.lpService.login(lpdata);

      }).then(data => {
        console.log("testful text:"+ JSON.stringify(data));
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
  sc(rdata: RData): Promise<SmsData> {
    console.log(rdata.mobile + "////");
    return new Promise((resolve, reject) => {
      let smsData:SmsData = new SmsData();
      smsData.reqData.phoneno = rdata.mobile;
      this.smsRestful.getcode(smsData).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
    });
  }
}

export class RData {
  mobile: string = "";
  password: string = "";
  authCode: string = "";
  verifykey:string = "";
  username:string="";
}
