import {Injectable} from "@angular/core";
import {UserSqliteService} from "./sqlite-service/user-sqlite.service";
import {UoModel} from "../model/out/uo.model";
import {UEntity} from "../entity/u.entity";

/**
 * 用户sevice
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class UserService {
  constructor( private userSqlite: UserSqliteService) { }

  /**
   * 添加用户
   * @param {string} _uI 用户uuID
   * @param {string} _uN 昵称
   * @param {string} _hIU 头像URL
   * @param {string} _biy 生日
   * @param {string} _uS 性别
   * @param {string} _uCt 联系方式
   * @param {string} _aQ 消息队列
   * @param {string} _uT token
   * @param _uty 0游客1正式用户
   */
  addu(uI: string, oUI:string,uN: string,hIU: string,biy: string,uS: string,
          uCt: string, aQ: string, uT:string,uty:string){
    return new Promise((resolve, reject) =>{

    })
  }
  getUo(): Promise<UoModel>{
    return new Promise((resolve, reject) =>{
      let op = new UoModel();
      this.userSqlite.getUo()
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
