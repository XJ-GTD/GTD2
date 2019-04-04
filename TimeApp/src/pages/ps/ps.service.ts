import {Injectable} from "@angular/core";
import {PersonInData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private sqlExce: SqliteExec,
              private userConfig:UserConfig) {
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
      u.hiu = pu.user.avatar;
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
        //UserConfig.user = pu.user;
        //刷新用户静态变量设置
        this.userConfig.RefreshUTbl();
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
    avatar: "",
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


