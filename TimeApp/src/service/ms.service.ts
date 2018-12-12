import {Injectable} from "@angular/core";
import {MsSqlite} from "./sqlite/ms-sqlite";
import {BsModel} from "../model/out/bs.model";
import {UEntity} from "../entity/u.entity";
import {MsEntity} from "../entity/ms.entity";
import {UoModel} from "../model/out/uo.model";
import {BaseModel} from "../model/base.model";
import {MsoModel} from "../model/out/mso.model";

/**
 * message sevice
 *
 * create by hjd on 2018/11/23
 */
@Injectable()
export class MsService {
  constructor( private msSqlite:MsSqlite){ }

  /**
   * 添加message消息
   * @param {string} mn
   * @param {string} md
   * @param {string} mt
   * @returns {Promise<BsModel>}
   */
  addMs( mn:string,md: string,mt: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let ms = new MsEntity();
      ms.mn=mn;
      ms.md=md;
      ms.mt=mt;
      let base = new BsModel();

      this.msSqlite.addMs(ms).then(data=>{
        base.code=0;
        base.message="success"
        resolve(base)
      }).catch(e=>{
        base.code=1;
        base.message=e.message;
        reject(base)
      })
    })
  }

  /**
   *查询Message消息
   * @returns {Promise<MsoModel>}
   */
  getMs(mi: number, mn:string,md: string,mt: string): Promise<MsoModel>{
    return new Promise((resolve, reject) =>{
      let op = new MsoModel();
      let ms = new MsEntity();
      ms.mi=mi;
      ms.mn=mn;
      ms.md=md;
      ms.mt=mt;
      this.msSqlite.getMs(ms)
        .then(data=>{
          if(data&& data.rows && data.rows.length>0){
            op.mes=data.rows.item(0);
            op.code=0;
            op.message="成功"
            resolve(op);
          }else{
            op.code=2;
            op.message="暂无信息"
            resolve(op);
          }
        }).catch(e=>{
        op.code=1;
        op.message="系统错误"
        reject(op);
      })
    })
  }

  /**
   * 修改message消息
   * @param {number} mi
   * @param {string} mn
   * @param {string} md
   * @param {string} mt
   * @returns {Promise<BsModel>}
   */
  updateMs(mi: number, mn:string,md: string,mt: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let ms = new MsEntity();
      ms.mi=mi;
      ms.mn=mn;
      ms.md=md;
      ms.mt=mt;
      let base = new BsModel();

      this.msSqlite.updateMs(ms).then(data=>{
        base.code=0;
        base.message="success"
        resolve(base)
      }).catch(e=>{
        base.code=1;
        base.message=e.message;
        reject(base)
      })
    })
  }

  /**
   * 删除message消息
   * @param {number} mi
   * @param {string} mn
   * @param {string} md
   * @param {string} mt
   * @returns {Promise<BsModel>}
   */
  delMs(mi: number, mn:string,md: string,mt: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let ms = new MsEntity();
      ms.mi=mi;
      ms.mn=mn;
      ms.md=md;
      ms.mt=mt;
      let base = new BsModel();

      this.msSqlite.deletMs(ms).then(data=>{
        base.code=0;
        base.message="success"
        resolve(base)
      }).catch(e=>{
        base.code=1;
        base.message=e.message;
        reject(base)
      })
    })
  }

}
