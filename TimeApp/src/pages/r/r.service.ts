import {Injectable} from "@angular/core";
import {SmsRestful} from "../../service/restful/smssev";
import {LpService} from "../lp/lp.service";
import {PageLoginData} from "../../data.mapping";
import {AuthRestful, LoginData} from "../../service/restful/authsev";

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
      let loginData: LoginData = new LoginData();
      Object.assign(loginData,rdata);
      return this.authRestful.signup(loginData).then(data => {
        if (data.code != 0)
          throw  data;

        //登陆(密码)service登陆逻辑
        return this.lpService.login(rdata);
      }).then(data => {
        if(!data || data.code != 0)
          throw  data;

        return this.lpService.getPersonMessage(data);
      }).then(data=>{
        if (data == "-1")
          throw data;

        return this.lpService.getOther();
      }).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
    });
  }


  //获取验证码
  getSMSCode(mobile:string):  Promise<any> {
    return new Promise((resolve, reject) => {
      this.smsRestful.getcode(mobile).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
    });
  }

}
