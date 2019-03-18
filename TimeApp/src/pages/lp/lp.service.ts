import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {PersonRestful} from "../../service/restful/personsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {WebsocketService} from "../../ws/websocket.service";
import {UtilService} from "../../service/util-service/util.service";
import {BrService} from "../br/br.service";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExce: SqliteExec,
              private personRestful: PersonRestful,
              private websocketService:WebsocketService,
              private util: UtilService,
              //private brService: BrService,
              ) {
  }

  //登录
  login(lpdata: PageLpData): Promise<PageLpData> {
    return new Promise((resolve, reject) => {
      let loginData: LoginData = new LoginData();
      loginData.phoneno = lpdata.mobile;
      loginData.userpassword = lpdata.password;

      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();
      // 验证用户名密码
      this.authRestful.loginbypass(loginData).then(data => {
        if (data.code != 0)
          throw  data;

        //获得token，放入头部header登录码
        let code = data.data.code;
        return this.personRestful.getToken(code);
      }).then(data=>{
        //更新账户表

        //账户表赋值
        aTbl.an = data.nickname;
        aTbl.am = data.openid;
        aTbl.ae = "";
        aTbl.at = data.access_token;
        aTbl.aq = data.cmq;

        //用户表赋值
        uTbl.ai = aTbl.ai;
        uTbl.un = data.nickname; //用户名
        uTbl.hiu = data.avatar;
        uTbl.biy = "";
        uTbl.rn = data.nickname; //真实姓名
        uTbl.ic = "";
        uTbl.us = data.sex;
        uTbl.uct = "";

        //查询账户表
        let aTbl1:ATbl = new ATbl();
        aTbl1.clp();
        return this.sqlExce.getList<ATbl>(aTbl1);
      }).then(data=>{
        let atbls:Array<ATbl> = data;

        if (atbls.length > 0 ){//更新账户表
          aTbl.ai = atbls[0].ai;
          return this.sqlExce.update(aTbl);
        }else{//保存账户表
          aTbl.ai = this.util.getUuid();
          return this.sqlExce.save(aTbl);
        }

      }).then(data=>{
        //查询用户表
        let uTbl1:UTbl = new UTbl();
        uTbl1.clp();
        return this.sqlExce.getList<UTbl>(uTbl1);
      }).then(data=>{
        let utbls:Array<UTbl> = data;

        if (utbls.length > 0 ){//更新用户表
          uTbl.ui = utbls[0].ai;
          return this.sqlExce.update(uTbl);
        }else{//保存用户表
          uTbl.ui = this.util.getUuid();
          return this.sqlExce.save(uTbl);
        }
      }).then(data=>{
        // 同步数据（调用brService方法恢复数据）
        //return this.brService.recover(0);
        //建立websoct连接（调用websoctService）
        return this.websocketService.connect();
      }).then(data=>{
        // 同步数据（调用brService方法恢复数据）
        //return this.brService.recover(0);
        //建立websoct连接（调用websoctService）
        resolve(lpdata)
      }).catch(error=>{
        resolve(error)
      })
    });
  }

  checkPhone(mobile:string):number{
      return this.util.checkPhone(mobile);
  }
}

export class PageLpData {
  mobile: string = "";
  password: string = "";
  code: number = 0;
  message: string = "";
}
