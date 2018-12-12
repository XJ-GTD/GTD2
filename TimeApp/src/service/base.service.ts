import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import {BaseSqlite} from "./sqlite/base-sqlite";
import {BsModel} from "../model/out/bs.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class BaseService {

  database: SQLiteObject;
  win: any = window;//window对象
  constructor( private baseSqlite: BaseSqlite) { }

  save(param:any):Promise<BsModel>{
    let bs=new BsModel();
    return new Promise((resolve, reject) =>{
      this.baseSqlite.save(param)
        .then(data=>{
          bs.code = 0;
          bs.message="添加成功";
          resolve(bs);
        }).catch(e=>{
          bs.code = 1;
          bs.message=e.message;
          reject(bs);
      })
    });
  }
  /**
   * 更新
   */
  update(param:any): Promise<BsModel>{
    let bs=new BsModel();
    return new Promise((resolve, reject) =>{
      this.baseSqlite.update(param)
        .then(data=>{
          bs.code = 0;
          bs.message="更新成功";
          resolve(bs);
        }).catch(e=>{
        bs.code = 1;
        bs.message=e.message;
        reject(bs);
      })

    });
  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(param:any): Promise<BsModel>{
    let bs=new BsModel();
    return new Promise((resolve, reject) =>{
      this.baseSqlite.delete(param)
        .then(data=>{
          bs.code = 0;
          bs.message="删除成功";
          resolve(bs);
        }).catch(e=>{
        bs.code = 1;
        bs.message=e.message;
        reject(bs);
      })
    });
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne<T>(et:any): Promise<T>{
    return new Promise((resolve, reject) =>{
      this.baseSqlite.getOne(et)
        .then(data=>{
          if(data && data.rows && data.rows.length>0){
            resolve(data.rows.item(0));
          }else{
            reject(null);
          }
        }).catch(e=>{
          reject(e);
      })
    });
  }


}
