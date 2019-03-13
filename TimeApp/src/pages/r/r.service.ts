import {Injectable} from "@angular/core";
import {PersonRestful, SignData} from "../../service/restful/personsev";
import {InData, SmsRestful} from "../../service/restful/smssev";
import {LpData, LpService} from "../lp/lp.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {OutData} from "../../service/restful/authsev";

@Injectable()
export class RService {

  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private lpService: LpService,) {
  }

  //注册
  signup(rdata: RData): Promise<RData> {

    return new Promise((resolve, reject) => {
      //restful 注册用户
      let restData: SignData = new SignData();
      restData.phoneno = rdata.mobile;
      restData.verifycode = rdata.authCode;
      restData.userpassword = rdata.password;
      restData.verifykey = rdata.verifykey;
      restData.username = rdata.username;
      return this.personRestful.signup(restData).then(data => {
        if (data.code != 0)
          reject(data.message);

        //登陆(密码)service登陆逻辑
        let lpdata: LpData = new LpData();
        lpdata.mobile = rdata.mobile;
        lpdata.password = rdata.password;
        return this.lpService.login(lpdata);

      }).then(data => {
        console.log("注册跳转登录成功"+ JSON.stringify(data));
        resolve(rdata)
      }).catch(err => {
        reject(err);
      })
    });

  }


//短信验证码
  sc(rdata: RData): Promise<BsModel<any>> {

    return new Promise((resolve, reject) => {
      let inData:InData = new InData();
      inData.phoneno = rdata.mobile;
      this.smsRestful.getcode(inData).then(data => {
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
  username:string ="";
}
