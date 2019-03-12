import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {PersonData, PersonRestful} from "../../service/restful/personsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {WebsocketService} from "../../ws/websocket.service";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExce: SqliteExec,
              private personRestful: PersonRestful,
              private websocketService:WebsocketService
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
        uTbl.ui = data.repSelfData.data._id;
        uTbl.ai = data.repSelfData.data.openid;
        uTbl.un = data.repSelfData.data.nickname;
        uTbl.hiu = data.repSelfData.data.avatar;
        uTbl.us = data.repSelfData.data.sex;

        this.sqlExce.save(uTbl);
        let aTbl:ATbl = new ATbl();

        //更新账户表
        // 同步数据（调用brService方法恢复数据）
        //建立websoct连接（调用websoctService）
        this.websocketService.connect();
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
