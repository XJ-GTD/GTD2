import {Injectable} from "@angular/core";
import {PersonInData, PersonOutData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {PageUData} from "../../data.mapping";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private sqlExec: SqliteExec,
              private userConfig:UserConfig) {
  }

  async findPerson(uid :string ){

    let data:BsModel<PersonOutData> = await this.personRestful.getself(uid);

    let uTbl:UTbl = new UTbl();
    uTbl.ai = data.data.openid;  //openid
    uTbl.ui = data.data.unionid; //unionid
    uTbl.un = data.data.nickname; //用户名（昵称）
    uTbl.rn = data.data.name == undefined || data.data.name == "" ? data.data.nickname : data.data.name; //真实姓名
    uTbl.us = data.data.sex == undefined || data.data.sex == "" ? "0" : data.data.sex; //性别
    uTbl.biy = data.data.birthday == undefined || data.data.birthday == "" ? "" : data.data.birthday;  //出生日期
    uTbl.ic = data.data.ic == undefined || data.data.ic == "" ? "" : data.data.ic;  //身份证
    uTbl.uct = data.data.contact== undefined || data.data.contact == "" ? "" : data.data.contact;//  联系方式
    uTbl.hiu = data.data.avatarbase64;//头像

    await this.sqlExec.update(uTbl);

    //刷新用户静态变量设置
    await this.userConfig.RefreshUTbl();
  }

  //保存用户信息
  saveUser(pu:PageUData,type:string):Promise<any>{
    return new Promise<BsModel<any>>((resolve, reject) => {
      let bs = new BsModel<any>();
      //保存本地用户信息
      let u = new UTbl();
      Object.assign(u,pu.user);
      u.ui = pu.user.id;            //用户ID
      u.ai = pu.user.aid;           //账户ID
      u.un = pu.user.name;          //用户名
      u.hiu = pu.user.avatar;       //用户头像
      u.biy = pu.user.bothday;      //出生日期
      u.rn = pu.user.realname;      //真实姓名
      u.ic = pu.user.No;            //身份证
      u.us = pu.user.sex;           //性别
      u.uct = pu.user.contact;      //联系方式
      this.sqlExec.update(u).then(data=>{

        let inDataName = {nickname:""};
        let inDataSex = {sex:""};
        let inDataBoth = {birthday:""};
        let inDataContact = {contact:""};
        let inDataIC = {ic:""};

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
      let per = {password:""};
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

  // 清除账户信息和用户信息
  deleteUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      //查询账户表
      let aTbl1:ATbl = new ATbl();
      this.sqlExec.getList<ATbl>(aTbl1).then(data=>{
        let atbls:Array<ATbl> = data;

        if (atbls.length > 0 ) {//清除账户表
          let daSql = "delete from gtd_a";
          this.sqlExec.execSql(daSql);
        }

        //查询用户表
        let uTbl1:UTbl = new UTbl();
        return this.sqlExec.getList<UTbl>(uTbl1);
      }).then(data=>{
        let utbls:Array<UTbl> = data;

        if (utbls.length > 0 ) {//清除账户表
          let duSql = "delete from gtd_u";
          this.sqlExec.execSql(duSql);
        }

        resolve(data);
      }).catch(error=>{
        resolve(error);
      })
    })
  }
}



