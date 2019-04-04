import {Injectable} from "@angular/core";
import {PersonInData, PersonRestful} from "../../service/restful/personsev";
import {InData, SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {WebsocketService} from "../../ws/websocket.service";
import {AlService} from "../al/al.service";

@Injectable()
export class LsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private authRestful: AuthRestful,
              //private brService: BrService,
              private websocketService:WebsocketService,
              private alService:AlService
  ) {
  }

  //获取验证码
  getSMSCode(mobile:string):  Promise<any> {

    return new Promise((resolve, reject) => {
      let inData:InData = new InData();
      inData.phoneno = mobile;
      this.smsRestful.getcode(inData).then(data => {
        resolve(data)
      }).catch(err => {
        reject(err);
      })
    });
  }

  //登陆
  login(lsData:PageLsData):  Promise<any> {
    return new Promise((resolve, reject) => {
      //参考lp登陆方法
      let loginData: LoginData = new LoginData();
      loginData.phoneno = lsData.mobile;
      loginData.verifycode = lsData.authCode;
      loginData.verifykey = lsData.verifykey;

      // 验证手机号及验证码
      this.authRestful.loginbypass(loginData).then(data => {
        if (data.code != 0)
          throw  data;

        resolve(data);
      }).catch(error=>{
        resolve(error)
      })
    });
  }

  get(data:any):Promise<any>{
    return new Promise((resolve, reject) => {
      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();
      let unionId = data.data.unionid;

      //获得token，放入头部header登录
      let code = data.data.code;
      this.personRestful.getToken(code).then(data=>{
        //账户表赋值
        aTbl.an = data.nickname;
        aTbl.am = data.openid;
        aTbl.ae = this.util.deviceId();
        aTbl.at = data.access_token;
        aTbl.aq = data.cmq;

        //用户表赋值
        uTbl.un = data.nickname; //用户名
        uTbl.hiu = data.avatar;
        uTbl.rn = data.nickname; //真实姓名
        uTbl.us = data.sex;

        let personInData:PersonInData = new PersonInData();
        personInData.unionid = unionId;
        return this.personRestful.getself(personInData);
      }).then(data=>{
        uTbl.hiu = data.data.avatarbase64;//头像
        //查询账户表
        let aTbl1:ATbl = new ATbl();
        return this.sqlExce.getList<ATbl>(aTbl1);
      }).then(data=>{
        let atbls:Array<ATbl> = data;

        if (atbls.length > 0 ){//更新账户表
          aTbl.ai = atbls[0].ai;
          uTbl.ai = aTbl.ai;
          return this.sqlExce.update(aTbl);
        }else{//保存账户表
          aTbl.ai = this.util.getUuid();
          uTbl.ai = aTbl.ai;
          return this.sqlExce.save(aTbl);
        }

      }).then(data=>{
        //查询用户表
        let uTbl1:UTbl = new UTbl();
        return this.sqlExce.getList<UTbl>(uTbl1);
      }).then(data=>{
        let utbls:Array<UTbl> = data;

        if (utbls.length > 0 ){//更新用户表
          uTbl.ui = utbls[0].ui;
          return this.sqlExce.update(uTbl);
        }else{//保存用户表
          uTbl.ui = unionId;
          return this.sqlExce.save(uTbl);
        }

      }).then(data=>{
        return this.alService.setSetting();
      }).then(data=>{
        // 同步数据（调用brService方法恢复数据）
        //return this.brService.recover(0);
        //建立websoct连接（调用websoctService）
        return this.websocketService.connect();
      }).then(data=>{
        resolve(data)

      }).catch(error=>{
        resolve(error)
      })
    })
  }

}
export class PageLsData {
  mobile: string = "";
  authCode: string = "";
  verifykey:string = "";
}
