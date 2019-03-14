import {Injectable} from "@angular/core";
import {PersonInData, PersonRestful} from "../../service/restful/personsev";
import {SmsRestful} from "../../service/restful/smssev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {RestFulConfig} from "../../service/config/restful.config";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private smsRestful: SmsRestful,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig: RestFulConfig,
  ) {
  }

  //获取用户信息
  getUser():Promise<PageUData>{
    return new Promise<PageUData>((resolve, reject) => {
      //获取本地用户信息（系统静态变量获取）
      let pu = new PageUData();
      this.sqlExce.getOne<UTbl>(new UTbl()).then(data =>{
        if(data != null){
          pu.user.id = data.ui;
          pu.user.name=data.un;
          pu.user.realname = data.rn;
          pu.user.aevter=data.hiu;
          pu.user.bothday = data.biy;
          pu.user.No=data.ic;
          pu.user.sex = data.us;
          pu.user.contact=data.uct;
          UserConfig.user = pu.user;
          return this.sqlExce.getOne<ATbl>(new ATbl())
        }
      }).then(data=>{
        if(data && data != null){
          pu.account.id = data.ai;
          pu.account.name=data.an;
          pu.account.phone = data.am;
          pu.account.device=data.ae;
          pu.account.token = data.at;
          pu.account.mq=data.aq;
          UserConfig.account = pu.account;
        }
        resolve(pu);
      }).catch(e=>{
        resolve(pu);
      })
    })
  }

  //保存用户信息
  saveUser(pu:PageUData):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      //保存本地用户信息
      let u = new UTbl();
      u.ui = pu.user.id;
      u.un = pu.user.name;
      u.rn =  pu.user.realname;
      u.hiu = pu.user.aevter;
      u.biy = pu.user.bothday;
      u.ic = pu.user.No;
      u.us = pu.user.sex;
      u.uct = pu.user.contact;
      this.sqlExce.update(u).then(data=>{
        let per = new PersonInData();
        Object.assign(per,pu.user);
        per.unionid = pu.user.id;
        per.nickname =pu.user.name;
        per.phoneno = pu.user.contact;
        //restFul保存用户信息
        return this.personRestful.updateself(per)
      }).then(data=>{
        //刷新系统全局用户静态变量
        UserConfig.user = pu.user;
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })


    })
  }

  //修改密码
  editPass(pw : string):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject) => {
      //restFul更新用户密码（服务器更新token并返回，清空该用户服务其他token）
      let bs = new BsModel<any>();
      let per = new PersonInData();
      per.password = pw;
      this.personRestful.updatepass(per).then(data=>{
        //刷新系统全局用户静态变量
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }
}

export class PageUData{
  user = {
    //账户ID
    id: "",
    //用户名
    name: "",
    //用户头像
    aevter: "",
    //出生日期
    bothday: "",
    //真实姓名
    realname: "",
    //身份证
    No: "",
    //性别
    sex: "",
    //联系方式
    contact: "",
  };
  account = {
    // 账户ID
    id: "",
    // 账户名
    name: "",
    // 手机号
    phone: "",
    // 设备号
    device: "",
    // token
    token: "",
    // 账户消息队列
    mq: "",
  }
}


