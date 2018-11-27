import { Injectable } from '@angular/core';
import {RelmemSqliteService} from "./sqlite-service/relmem-sqlite.service";
import {RguEntity} from "../entity/rgu.entity";
import {RguoModel} from "../model/out/rguo.model";
import {BsModel} from "../model/out/bs.model";


/**
 * 授权联系人
 */
@Injectable()
export class RelmemService {

  constructor(private relmemSqlite: RelmemSqliteService) {}

  /**
   * 查询
   * @param {string} bi
   * @param {string} bmi
   * @returns {Promise<RguoModel>}
   */
  getRgu(bi:string,bmi:string):Promise<RguoModel>{
    return new Promise((resolve, reject) =>{
      let rgu=new RguEntity();
      rgu.bi=bi;
      rgu.bmi=bmi;
      let r=new RguoModel();
      this.relmemSqlite.getRgu(rgu).then(data=>{
        if(data&& data.rows && data.rows.length>0){
          let rgus=[];
          for(let i=0;i<data.rows.length;i++){
            rgus.push(data.rows.item(i));
          }
          r.rgus=rgus;
          r.code=0;
          r.message="成功"
          resolve(r);
        }else{
          r.code=2;
          r.message="暂无信息"
          resolve(r);
        }
      })
        .catch(e=>{
          r.code=1;
          r.message="系统错误"
          reject(r);
        })
    });

  }

  /**
   * 删除
   * @param {string} bi
   * @param {string} bmi
   * @returns {Promise<BsModel>}
   */
  delRgu(bi:string,bmi:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rgu=new RguEntity();
      rgu.bi=bi;
      rgu.bmi=bmi;
      let base=new BsModel();
      this.relmemSqlite.delRgu(rgu).then(data=>{
        base.code=0;
        base.message="success";
        resolve(base);
      })
        .catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

  /**
   * 添加
   * @param {string} bi
   * @param {string} bmi
   * @returns {Promise<BsModel>}
   */
  addRgu(bi:string,bmi:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rgu=new RguEntity();
      rgu.bi=bi;
      rgu.bmi=bmi;
      let base=new BsModel();
      this.relmemSqlite.addRgu(rgu).then(data=>{
        base.code=0;
        base.message="success";
        resolve(base);
      })
        .catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

  /**
   * 修改
   * @param {string} bi
   * @param {string} bmi
   * @returns {Promise<BsModel>}
   */
  updateRgu(bi:string,bmi:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rgu=new RguEntity();
      rgu.bi=bi;
      rgu.bmi=bmi;
      let base=new BsModel();
      this.relmemSqlite.updateRgu(rgu).then(data=>{
        base.code=0;
        base.message="success";
        resolve(base);
      })
        .catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

}
