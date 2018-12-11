import {Injectable} from "@angular/core";
import {UserSqliteService} from "./sqlite-service/user-sqlite.service";
import {UoModel} from "../model/out/uo.model";
import {UEntity} from "../entity/u.entity";
import {UModel} from "../model/u.model";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";
import {BsModel} from "../model/out/bs.model";
import {AppConfig} from "../app/app.config";

/**
 * 用户sevice
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class UserService {
  userSqlite:UserSqliteService;
  constructor( private baseSqlite: BaseSqliteService) {
    this.userSqlite=new UserSqliteService(baseSqlite);
  }

  /**
   * 更新用户资料
   * @param {string} uI 用户uuID
   * @param {string} uN 昵称
   * @param {string} hIU 头像URL
   * @param {string} biy 生日
   * @param {string} uS 性别
   * @param {string} uCt 联系方式
   * @param {string} aQ 消息队列
   * @param {string} uT token
   * @param {string} uty 0游客1正式用户
   *
   */
  upu(uI: string, oUI:string,uN: string,hIU: string,biy: string,uS: string,
          uCt: string, aQ: string, uT:string,uty:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let u = new UEntity();
      u.uI=uI;
      u.oUI=oUI;
      u.uN=uN;
      u.hIU=hIU;
      u.biy=biy;
      u.uS=uS;
      u.uCt=uCt;
      u.aQ=aQ;
      u.uty=uty;
      if(uT != null && uT!=''){
        u.uT=uT;
        AppConfig.Token=uT;
      }
      let bs = new BsModel();
      this.baseSqlite.update(u).then(data=>{
          bs.code=0;
          bs.message='成功';
          resolve(bs);
      }).catch(e=>{
          bs.code=1;
          bs.message=e.message;
          alert('更新用户资料失败：'+e.message)
          reject(bs)
      })
    })
  }

  /**
   * 查询用户资料
   * @returns {Promise<UModel>}
   */
  getUo(): Promise<UoModel>{
    return new Promise((resolve, reject) =>{
      let op = new UoModel();
      return this.userSqlite.getUo()
        .then(data=>{
          if(data&& data.rows && data.rows.length>0){
            op.u=data.rows.item(0);
            op.code=0;
            op.message="成功"
            resolve(op);
          }else{
            op.code=2;
            op.message="暂无用户信息"
            resolve(op);
          }
        }).catch(e=>{
        op.code=1;
        op.message="系统错误"
        resolve(op);
      })
    })
  }
}
