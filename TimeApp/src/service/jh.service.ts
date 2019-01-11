import { Injectable } from '@angular/core';
import { BaseSqlite } from "./sqlite/base-sqlite";
import { JhSqlite } from "./sqlite/jh-sqlite";
import { UtilService } from "./util-service/util.service";
import { JhEntity } from "../entity/jh.entity";
import { BsModel } from "../model/out/bs.model";
import { JhoModel } from "../model/out/jho.model";
import { JhModel } from "../model/jh.model";
import {ReturnConfig} from "../app/return.config";
import {DataConfig} from "../app/data.config";


/**
 * 计划
 */
@Injectable()
export class JhService {
  constructor(private jhSqlite: JhSqlite,
                private util:UtilService) {
  }

  /**
   * 添加计划
   * @param {string} jn 计划名
   * @param {string} jg 计划描述
   * @returns {Promise<BsModel>}
   */
  ajh(jn:string,jg:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let jh = new JhEntity();
      jh.ji = this.util.getUuid();
      jh.jn = jn;
      jh.jg = jg;
      let bs=new BsModel();
      console.log('---------JhService:ajh 开始添加计划 ----------');
      this.jhSqlite.ajh(jh).then(data=>{
        console.log('---------JhService:ajh 开始添加计划成功，开始添加同步库 ----------');
        return this.jhSqlite.syncJhTime(jh,DataConfig.AC_O);
      }).then(data=>{
        console.log('--------- JhService:ajh 计划添加同步库结束 ----------');
        resolve(bs)
      }).catch(e=>{
        console.error('---------JhService:ajh 添加计划 ERROR: '+ JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 更新计划
   * @param {string} ji 计划ID
   * @param {string} jn 计划名
   * @param {string} jg 计划描述
   * @returns {Promise<BsModel>}
   */
  ujh(ji:string,jn:string,jg:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let jh = new JhEntity();
      jh.ji = ji;
      jh.jn = jn;
      jh.jg = jg;
      let bs=new BsModel();
      console.log('---------JhService:ujh 更新计划 start----------');
      this.jhSqlite.ujh(jh).then(data=>{
        console.log('---------JhService:ujh 更新计划 Success，开始添加同步库 ----------');
        return this.jhSqlite.syncJhTime(jh,DataConfig.AC_T);
      }).then(data=>{
        console.log('--------- JhService:ujh 计划更新同步库结束 ----------');
        resolve(bs)
      }).catch(e=>{
        console.error('---------JhService:ujh 更新计划 ERROR: '+ JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 查询计划
   * @param {string} jn 计划名
   */
  getJhs(jn:string):Promise<JhoModel>{
    return new Promise((resolve, reject) => {
      let jho = new JhoModel();
      this.jhSqlite.getJhs(jn).then(data=>{
        let jhs = new Array<JhModel>()
        if(data && data.rows&&data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            jhs.push(data.rows.item(i))
          }
        }
        jho.jhs=jhs;
        resolve(jho)
      }).catch(e=>{
        jho.code=ReturnConfig.ERR_CODE
        jho.message=e.message;
        reject(jho);
      })
    })
  }

  /**
   * 根据ID删除计划
   * @param {String} ji
   * @returns {Promise<any>}
   */
  djh(ji:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let jh = new JhEntity();
      jh.ji = ji;
      let bs=new BsModel();
      console.log('---------JhService:djh 删除计划 start----------');
      this.jhSqlite.djh(jh).then(data=>{
        console.log('---------JhService:djh 删除计划 Success，开始添加同步库 ----------');
        return this.jhSqlite.syncJhTime(jh,DataConfig.AC_D);
      }).then(data=>{
        console.log('--------- JhService:djh 计划删除同步库结束 ----------');
        resolve(bs)
      }).catch(e=>{
        console.error('---------JhService:djh 删除计划 ERROR: '+ JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 根据ID查询计划
   * @param {string} ji
   * @returns {Promise<any>}
   */
  getOne(ji:string):Promise<JhModel>{
    return new Promise((resolve, reject) => {
      let jh = new JhModel();
      this.jhSqlite.getOne(ji).then(data=>{
        if(data && data.rows&&data.rows.length>0){
          jh=data.rows.item(0)
        }
        resolve(jh)
      }).catch(e=>{
        jh.code=ReturnConfig.ERR_CODE
        jh.message=e.message;
        reject(jh);
      })
    })
  }

}
