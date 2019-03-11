import {Injectable} from "@angular/core";
import {RestFulConfig} from "../../service/config/restful.config";
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SmsRestful} from "../../service/restful/smssev";
import {AuthRestful, LoginData} from "../../service/restful/authsev";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExce: SqliteExec,
  ) {
  }

  //登录
  login(lpdata: LpData): Promise<LpData> {
    console.log(lpdata.mobile + "////" + lpdata.password + "////");
    return new Promise((resolve, reject) => {
      let restloginData: LoginData = new LoginData();
      restloginData.reqPData.phoneno = lpdata.mobile;
      restloginData.reqPData.userpassword = lpdata.password;
      // 验证用户名密码
      this.authRestful.loginbypass(restloginData).then(data => {
        if (data.repData.code != null){
          throw  data.repData.message;
        }

        //获取登陆用户信息

        //更新用户表

        //更新账户表
        // 同步数据（调用brService方法恢复数据）
        //建立websoct连接（调用websoctService）
        resolve(lpdata)
      })
    });
  }
}

export class LpData {
  mobile: string;
  password: string;
  retData = {
    code: "",
    message: ""
  };
}
