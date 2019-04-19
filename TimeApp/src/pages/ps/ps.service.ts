import {Injectable} from "@angular/core";
import {PersonOutData, PersonRestful} from "../../service/restful/personsev";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UTbl} from "../../service/sqlite/tbl/u.tbl";
import {UserConfig} from "../../service/config/user.config";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";

@Injectable()
export class PsService {
  constructor(private personRestful: PersonRestful,
              private sqlExec: SqliteExec,
              private userConfig:UserConfig) {
  }

  async findPerson(uid :string ){

    let data:PersonOutData = await this.personRestful.getself(uid);

    let uTbl:UTbl = new UTbl();
    uTbl.ai = data.openid;  //openid
    uTbl.ui = data.unionid; //unionid
    uTbl.un = data.nickname; //用户名（昵称）
    uTbl.rn = data.name == undefined || data.name == "" ? data.nickname : data.name; //真实姓名
    uTbl.us = data.sex == undefined || data.sex == "" ? "0" : data.sex; //性别
    uTbl.biy = data.birthday == undefined || data.birthday == "" ? "" : data.birthday;  //出生日期
    uTbl.ic = data.ic == undefined || data.ic == "" ? "" : data.ic;  //身份证
    uTbl.uct = data.contact== undefined || data.contact == "" ? "" : data.contact;//  联系方式
    uTbl.hiu = data.avatarbase64;//头像

    await this.sqlExec.update(uTbl);

    //刷新用户静态变量设置
    await this.userConfig.RefreshUTbl();
  }

  //保存用户信息
  saveUser(id:string,inData:any):Promise<any>{
    return new Promise((resolve, reject) => {
      this.personRestful.updateself(inData,id).then(data=>{
        resolve(data);
      }).catch(error=>{
        resolve(error);
      });
    })
  }

  //修改密码
  editPass(pw : string , unionid :string ):Promise<any>{
    return new Promise((resolve, reject) => {
      //restFul更新用户密码（服务器更新token并返回，清空该用户服务其他token）
      let per = {password:""};
      per.password = pw;
      this.personRestful.updatepass(per,unionid).then(data=>{
        //刷新系统全局用户静态变量
        resolve(data);
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



