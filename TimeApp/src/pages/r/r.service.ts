import {Injectable} from "@angular/core";
import {InData, SmsRestful} from "../../service/restful/smssev";
import {LpService} from "../lp/lp.service";
import {PageLoginData} from "../../data.mapping";
import {AuthRestful,LoginData} from "../../service/restful/authsev";

@Injectable()
export class RService {

  constructor(private authRestful: AuthRestful,
              private smsRestful: SmsRestful,
              private lpService: LpService,) {
  }

  //注册
  register(rdata: PageLoginData): Promise<any> {
    return new Promise((resolve, reject) => {
      //restful 注册用户
      let restData: LoginData = new LoginData();
      restData.phoneno = rdata.mobile;
      restData.verifycode = rdata.authCode;
      restData.userpassword = rdata.password;
      restData.verifykey = rdata.verifykey;
      restData.username = rdata.username;
      return this.authRestful.signup(restData).then(data => {
        if (data.code != 0)
          throw  data;

        //登陆(密码)service登陆逻辑
        /*let lpdata: PageLoginData = new PageLoginData();
        lpdata.mobile = rdata.mobile;
        lpdata.password = rdata.password;*/
        return this.lpService.login(rdata);
      }).then(data => {
        if (data.code && data.code != 0)
          throw  data;

        return this.lpService.getPersonMessage(data);
      }).then(data=>{
        return this.lpService.getOther();
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
    });
  }


//短信验证码
  sc(rdata: PageLoginData): Promise<any> {
    return new Promise((resolve, reject) => {
      let inData:InData = new InData();
      inData.phoneno = rdata.mobile;
      this.smsRestful.getcode(inData).then(data => {
        resolve(data)
      }).catch(error => {
        resolve(error)
      })
    });
  }

}
