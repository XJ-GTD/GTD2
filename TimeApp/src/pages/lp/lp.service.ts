import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {PersonData, PersonRestful} from "../../service/restful/personsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {WebsocketService} from "../../ws/websocket.service";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExce: SqliteExec,
              private personRestful: PersonRestful,
              private websocketService:WebsocketService,
              private util: UtilService,
  ) {
  }

  //登录
  login(lpdata: LpData): Promise<LpData> {
    return new Promise((resolve, reject) => {
      let restloginData: LoginData = new LoginData();
      restloginData.reqPData.phoneno = lpdata.mobile;
      restloginData.reqPData.userpassword = lpdata.password;

      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();
      // 验证用户名密码
      this.authRestful.loginbypass(restloginData).then(data => {
        if (data.repData.errcode != "0"){ //data.repData.errcode == 0 为登陆成功状态
          throw  data.repData.errmsg;
        }
        //获得token，放入头部header登录码
        let code = data.repData.code;
        return this.personRestful.getToken(code);
      }).then(data=>{
        //更新账户表

        //账户表赋值
        aTbl.ai = this.util.getUuid();
        aTbl.an = data.repTokenData.nickname;
        aTbl.am = data.repTokenData.openid;
        aTbl.ae = "";
        aTbl.at = data.repTokenData.access_token;
        aTbl.aq = "";

        //用户表赋值
        uTbl.ui = this.util.getUuid();
        uTbl.ai = aTbl.ai;
        uTbl.un = data.repTokenData.nickname; //用户名
        uTbl.hiu = data.repTokenData.avatar;
        uTbl.biy = "";
        uTbl.rn = data.repTokenData.nickname; //真实姓名
        uTbl.ic = "";
        uTbl.us = data.repTokenData.sex;
        uTbl.uct = "";

        return this.sqlExce.save(aTbl);
      }).then(data=>{
        //更新用户表
        return this.sqlExce.save(uTbl);
      }).then(data=>{
        // 同步数据（调用brService方法恢复数据）
        //建立websoct连接（调用websoctService）
        //this.websocketService.connect();
        resolve(lpdata)
      }).catch(error=>{
        resolve(error)
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
