import {Injectable} from "@angular/core";
import {PersonRestful, SignData} from "../../service/restful/personsev";
import {InData, SmsRestful} from "../../service/restful/smssev";
import {LpService, PageLpData} from "../lp/lp.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class RService {

  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private lpService: LpService,
              private util: UtilService,) {
  }

  //注册
  signup(rdata: PageRData): Promise<PageRData> {

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
          throw  data;

        //登陆(密码)service登陆逻辑
        let lpdata: PageLpData = new PageLpData();
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
  sc(rdata: PageRData): Promise<BsModel<any>> {

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


  checkPhone(mobile:string):number{
    return this.util.checkPhone(mobile);
  }
}

export class PageRData {
  mobile: string = "";
  password: string = "";
  authCode: string = "";
  verifykey:string = "";
  username:string = "";
  code: number = 0;
  message: string = "";
}
