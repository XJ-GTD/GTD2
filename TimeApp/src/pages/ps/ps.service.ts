import {Injectable} from "@angular/core";
import {PersonInData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private sqlExec: SqliteExec,
              private userConfig:UserConfig) {
  }

  //保存用户信息
  saveUser(pu:any,type:string):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      //保存本地用户信息
      let u = new UTbl();
      u.ui = pu.user.id;
      if(type == "name"){
        u.un = pu.user.name;
      }else if(type == "both"){
        u.biy = pu.user.bothday;
      }else if(type == "ic"){
        u.ic = pu.user.No;
      }else if(type == "sex"){
        u.us = pu.user.sex;
      }else if(type == "contact") {
        u.uct = pu.user.contact;
      }
      this.sqlExec.update(u).then(data=>{

        let inDataName:InDataName = new InDataName();
        let inDataSex:InDataSex = new InDataSex();
        let inDataBoth:InDataBoth = new InDataBoth();
        let inDataContact:InDataContact = new InDataContact();
        let inDataIC:InDataIC = new InDataIC();

        //restFul保存用户信息
        //return this.personRestful.updateself(pu,pu.user.id);
        if(type == "name"){
          inDataName.nickname = pu.user.name;
          return this.personRestful.updateself(inDataName,pu.user.id);
        }else if(type == "both"){
          inDataBoth.birthday = pu.user.bothday;
          return this.personRestful.updateself(inDataBoth,pu.user.id);
        }else if(type == "ic"){
          inDataIC.ic = pu.user.No;
          return this.personRestful.updateself(inDataIC,pu.user.id);
        }else if(type == "sex"){
          inDataSex.sex = pu.user.sex;
          return this.personRestful.updateself(inDataSex,pu.user.id);
        }else if(type == "contact") {
          inDataContact.contact = pu.user.contact;
          return this.personRestful.updateself(inDataContact,pu.user.id);
        }
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
  editPass(pw : string , unionid :string ):Promise<BsModel<any>>{
    return new Promise<BsModel<any>>((resolve, reject) => {
      //restFul更新用户密码（服务器更新token并返回，清空该用户服务其他token）
      let bs = new BsModel<any>();
      let per = new InDataPassword();
      per.password = pw;
      this.personRestful.updatepass(per,unionid).then(data=>{
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

export class InDataName{
  nickname: string = "";   //姓名
}

export class InDataPassword{
  password: string = "";   //密码
}

export class InDataSex{
  sex: "0";      //性别 0 未知, 1 男性, 2 女性 Enum: [ 0, 1, 2 ]
}

export class InDataIC{
  ic: string = "";     //身份证号码
}

export class InDataAvatar{
  avatar: string = "";     //头像
}

export class InDataBoth{
  birthday: string = ""; //出生日期  2019-03-11
}

export class InDataContact{
  contact: string = ""; //联系电话
}



