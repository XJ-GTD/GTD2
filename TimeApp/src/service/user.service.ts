import {Injectable} from "@angular/core";
import {UserSqlite} from "./sqlite/user-sqlite";
import {UEntity} from "../entity/u.entity";
import {UModel} from "../model/u.model";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {BsModel} from "../model/out/bs.model";
import {PnRestful} from "./restful/pn-restful";
import {ReturnConfig} from "../app/return.config";
import {DataConfig} from "../app/data.config";
import {SyncSqlite} from "./sqlite/sync-sqlite";

/**
 * 用户sevice
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class UserService {
  constructor( private baseSqlite: BaseSqlite,
               private syncSqlite:SyncSqlite,
               private userSqlite:UserSqlite,
               private pnRestful:PnRestful) {
  }


  /**
   * 更新用户资料
   * @param {string} uI 用户UUID
   * @param {string} uN 用户名称
   * @param {string} hIU 用户头像
   * @param {string} biy 用户生日
   * @param {string} rn 用户真实姓名
   * @param {string} iC 用户身份证号
   * @param {string} uS 用户性别（性别0无 1男 2女）
   * @returns {Promise<any>}
   */

  upu(uI:string, uN:string, hIU:string, biy:string, rn:string, iC:string, uS:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let u = new UEntity();
      u.uI=uI;
      u.uN=uN;
      u.hIU=hIU;
      u.biy=biy;
      u.uS=uS;
      u.rn=rn;
      u.iC=iC;
      let bs = new BsModel();
      let rsData:any = null;
      console.log("------- 1.UserService restful upu user start --------");
      this.pnRestful.upu(uI,uN,hIU,biy,rn,iC,uS).then(data=>{
        console.log("------- 2.UserService restful upu user end: " + JSON.stringify(data));
        rsData = data;
        bs = data;
        return  this.userSqlite.update(u);
      }).then(data=>{
        console.log("------- 4.UserService sqlite upu user end: " + JSON.stringify(data));
        console.log("------- 用户更新成功，开始添加到同步表 ------- ");
        return  this.userSqlite.syncUTime(u,DataConfig.AC_T);
      }).then(data=>{
        console.log("------- 用户更新成功，用户添加到同步表结束：" + JSON.stringify(data));
        //同步上传服务器
        console.log("============ 更新联系人同步上传服务 ================");
        this.syncSqlite.syncUplaod();
        resolve(bs);
      }).catch(e=>{
        console.error("------- UserService upu user error: " + JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=ReturnConfig.ERR_MESSAGE;
        reject(bs);
      })

    })
  }

  /**
   * 查询用户资料
   * @returns {Promise<UModel>}
   */
  getUo(): Promise<UModel>{
    return new Promise((resolve, reject) =>{
      let op = new UModel();
      return this.userSqlite.getUo().then(data=>{
          if(data&& data.rows && data.rows.length>0){
            op=data.rows.item(0);
            resolve(op);
          }else{
            op.code=ReturnConfig.NULL_CODE;
            op.message=ReturnConfig.NULL_MESSAGE;
            resolve(op);
          }
        }).catch(e=>{
        op.code=ReturnConfig.ERR_CODE;
        op.message=ReturnConfig.ERR_MESSAGE;
        resolve(op);
      })
    })
  }
}
