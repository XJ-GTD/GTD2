import {Injectable} from "@angular/core";
import {RestFulConfig} from "../../service/config/restful.config";
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {SmsRestful} from "../../service/restful/smssev";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {PersonData, PersonRestful} from "../../service/restful/personsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExce: SqliteExec,
              private personRestful: PersonRestful
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
        if (data.repData.errcode != "0"){ //data.repData.errcode == 0 为登陆成功状态
          throw  data.repData.errmsg;
        }
        //获取登陆用户信息
        let personData: PersonData = new PersonData();
        personData.reqSelf.unionid = data.repData.unionid;
        return this.personRestful.getself(personData);
      }).then(data=>{
        //更新用户表
        let uTbl:UTbl = new UTbl();
        uTbl.uI = data.repSelfData.data._id;
        uTbl.aI = data.repSelfData.data.openid;
        uTbl.uN = data.repSelfData.data.nickname;
        uTbl.hIU = data.repSelfData.data.avatar;
        uTbl.uS = data.repSelfData.data.sex;

        this.sqlExce.save(uTbl);
        let aTbl:ATbl = new ATbl();

        //更新账户表
        // 同步数据（调用brService方法恢复数据）
        //建立websoct连接（调用websoctService）
        resolve(lpdata)
      }).catch(error=>{

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
