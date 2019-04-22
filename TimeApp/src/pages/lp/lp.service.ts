import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {AuthRestful, LoginData} from "../../service/restful/authsev";
import {PersonRestful} from "../../service/restful/personsev";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {WebsocketService} from "../../ws/websocket.service";
import {UtilService} from "../../service/util-service/util.service";
import {AlService} from "../al/al.service";
import {PageLoginData} from "../../data.mapping";

@Injectable()
export class LpService {
  constructor(private authRestful: AuthRestful,
              private sqlExec: SqliteExec,
              private personRestful: PersonRestful,
              private webSocketService:WebsocketService,
              private util: UtilService,
              //private brService: BrService,
              private alService:AlService,) {}

  //登录
  login(lpdata: PageLoginData): Promise<any> {
    return new Promise((resolve, reject) => {
      let loginData: LoginData = new LoginData();
      loginData.phoneno = lpdata.mobile;
      loginData.userpassword = lpdata.password;

      // 验证用户名密码
      this.authRestful.loginbypass(loginData).then(data => {
        if (data.code != 0)
          throw  data;

        resolve(data)
      }).catch(error=>{
        resolve(error)
      })
    });
  }

  //账户用户信息
  getPersonMessage(data:any):Promise<any>{
    return new Promise((resolve ,reject) => {
      let aTbl:ATbl = new ATbl();
      let uTbl:UTbl = new UTbl();

      //获得token，放入头部header登录
      this.personRestful.getToken(data.data.code).then(data=>{
        //账户表赋值
        aTbl.ai = data.openid;  //openid
        aTbl.an = data.nickname;
        aTbl.am = data.phoneno;
        aTbl.ae = this.util.deviceId();
        aTbl.at = data.access_token;
        aTbl.aq = data.cmq;

        //用户表赋值
        uTbl.ai = data.openid;  //openid
        uTbl.ui = data.unionid; //unionid
        uTbl.un = data.nickname; //用户名（昵称）
        uTbl.rn = data.name == undefined || data.name == "" ? data.nickname : data.name; //真实姓名
        uTbl.us = data.sex == undefined || data.sex == "" ? "0" : data.sex; //性别
        uTbl.biy = data.birthday == undefined || data.birthday == "" ? "" : data.birthday;  //出生日期
        uTbl.ic = data.ic == undefined || data.ic == "" ? "" : data.ic;  //身份证
        uTbl.uct = data.contact== undefined || data.contact == "" ? "" : data.contact;//  联系方式

        return this.personRestful.getself(data.unionid);
      }).then(data=>{
        uTbl.hiu = data.avatarbase64;//头像
        //删除账户表
        return this.sqlExec.delete(new ATbl());
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
        resolve(error)
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
        resolve(error)
      })
    })
  }

}
