import {Injectable} from "@angular/core";
import {UserSqlite} from "./sqlite/user-sqlite";
import {UEntity} from "../entity/u.entity";
import {UModel} from "../model/u.model";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {BsModel} from "../model/out/bs.model";
import {PnRestful} from "./restful/pn-restful";
import {ReturnConfig} from "../app/return.config";

/**
 * 用户sevice
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class UserService {
  constructor( private baseSqlite: BaseSqlite,
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
        rsData = data
        bs = data;
        if(rsData && rsData.code == 0){
          console.log("------- 3.UserService sqlite upu user start --------");
          return  this.baseSqlite.update(u)
        }
      }).then(data=>{
        console.log("------- 4.UserService sqlite upu user end: " + JSON.stringify(data));
        resolve(bs);
      }).catch(e=>{
        console.error("------- UserService upu user error: " + JSON.stringify(e));
        bs.code=1;
        bs.message=e.message;
        reject(bs)
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
