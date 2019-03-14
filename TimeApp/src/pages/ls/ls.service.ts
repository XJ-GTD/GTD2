import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {InData, SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {BrService} from "../br/br.service";
import {WebsocketService} from "../../ws/websocket.service";

@Injectable()
export class LsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
              private authRestful: AuthRestful,
              //private brService: BrService,
              private websocketService:WebsocketService,
  ) {
  }

  //获取验证码
  getSMSCode(mobile:string): Promise<any> {

    return new Promise((resolve, reject) => {
      let inData:InData = new InData();
      inData.phoneno = mobile;
      this.smsRestful.getcode(inData).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
      //check是否可以二次发送
      //restFul发送验证码
      //倒计时

    });
  }

  //登陆
  login(lsData:LsData): Promise<any> {
    console.log(lsData.mobile + "////" + lsData.authCode + "////");
    return new Promise((resolve, reject) => {
      //参考lp登陆方法
      let loginData: LoginData = new LoginData();
      loginData.phoneno = lsData.mobile;
      loginData.verifycode = lsData.authCode;
      loginData.verifykey = lsData.verifykey;

      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();

      // 验证手机号及验证码
      this.authRestful.loginbycode(loginData).then(data => {
        if (data.code != 0)
          throw  data.message;

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
        this.websocketService.connect();
        resolve(lsData)
      }).catch(error=>{
        resolve(error)
      })
    });
  }
}
export class LsData {
  mobile: string = "";
  authCode: string = "";
  verifykey:string = "";
}
