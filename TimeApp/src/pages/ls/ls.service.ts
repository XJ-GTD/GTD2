import {Injectable} from "@angular/core";
import {PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import {WebsocketService} from "../../ws/websocket.service";
import {AlService} from "../al/al.service";
import {PageLoginData} from "../../data.mapping";

@Injectable()
export class LsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExec: SqliteExec,
              private util: UtilService,
              private authRestful: AuthRestful,
              private userConfig: UserConfig,
              //private brService: BrService,
              private webSocketService:WebsocketService,
              private alService:AlService) {}

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

  //登陆
  login(lsData:PageLoginData):  Promise<any> {
    return new Promise((resolve, reject) => {
      //参考lp登陆方法 忘记密码会调用
      let loginData: LoginData = new LoginData();
      loginData.phoneno = lsData.phoneno;
      loginData.verifycode = lsData.verifycode;
      loginData.verifykey = lsData.verifykey;

      // 验证手机号及验证码
      this.authRestful.loginbypass(loginData).then(data => {
        if(!data || data.code != 0)
          throw  data;

        resolve(data);
      }).catch(error=>{
        reject(error)
      })
    });
  }

  //账户用户信息
  getPersonMessage(data:any):Promise<any>{
    return new Promise((resolve ,reject) => {
      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();
      let yTbl:YTbl = new YTbl();

      //获得token，放入头部header登录
      this.personRestful.getToken(data.data.code).then(data=>{
        if(data && data.unionid != undefined && data.unionid != null && data.unionid != ""){
          //账户表赋值
          aTbl.ai = data.openid;  //openid
          aTbl.an = data.nickname;
          aTbl.am = data.phoneno;
          aTbl.ae = UserConfig.getDeviceId();
          aTbl.at = data.access_token;
          aTbl.aq = data.cmq;

          //用户表赋值
          uTbl.ai = data.openid;  //openid
          uTbl.ui = data.unionid; //unionid
          uTbl.un = data.nickname; //用户名（昵称）
          uTbl.rn = data.realname == undefined || data.realname == "" ? data.nickname : data.realname; //真实姓名
          uTbl.us = data.sex == undefined || data.sex == "" ? "0" : data.sex; //性别
          uTbl.biy = data.birthday == undefined || data.birthday == "" ? "" : data.birthday;  //出生日期
          uTbl.ic = data.ic == undefined || data.ic == "" ? "" : data.ic;  //身份证
          uTbl.uct = data.contact== undefined || data.contact == "" ? "" : data.contact;//  联系方式

          if (data && data.secrets && data.secrets.github) {
            yTbl.yi = this.util.getUuid();
            yTbl.yt = DataConfig.SYS_FOGHSECRET;
            yTbl.ytn = "项目跟进 github 安全令牌";
            yTbl.yn = "项目跟进";
            yTbl.yk = DataConfig.SYS_FOGHSECRET;
            yTbl.yv = data.secrets.github;
          }

          return this.personRestful.getself(data.unionid);
        }else{
          throw  "-1";
        }
      }).then(data=>{
        if(data && data.avatarbase64 != undefined && data.avatarbase64 != null && data.avatarbase64 != ""){
          uTbl.hiu = data.avatarbase64;//头像
          //删除账户表
          return this.sqlExec.delete(new ATbl());
        }else{
          throw  "-1";
        }
      }).then(data=>{
        if (yTbl.yi) {
          return this.sqlExec.save(yTbl);
        } else {
          return {};
        }
      }).then(data=>{
        return this.sqlExec.save(aTbl);
      }).then(data=>{
        //删除用户表
        return this.sqlExec.delete(new UTbl());
      }).then(data=>{
        return this.sqlExec.save(uTbl);
      }).then(data=>{
        resolve(data)
      }).catch(error=>{
        reject(error)
      })
    });
  }

  //设置备份信息
  getOther():Promise<any>{
    return new Promise((resolve, reject) => {
      this.alService.setSetting().then(data=>{
        // 同步数据（调用brService方法恢复数据）
        //return this.brService.recover(0);
        //建立websoct连接（调用websoctService）
        return this.webSocketService.connect();
      }).then(data=>{
        resolve(data)
      }).catch(error=>{
        reject(error)
      })
    })
  }

}
