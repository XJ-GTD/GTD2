import { Injectable } from '@angular/core';
import {RemindSqlite} from "./sqlite/remind-sqlite";
import {ReEntity} from "../entity/re.entity";
import {BsModel} from "../model/out/bs.model";
import {ReoModel} from "../model/out/reo.model";


/**
 * 闹铃
 */
@Injectable()
export class RemindService {

  constructor(private remindSqlite: RemindSqlite) { }

  /**
   * 添加提醒时间
   * @param {string} ri
   * @param {string} sI
   * @param {string} rd
   * @returns {Promise<BsModel>}
   */
  addRe(ri:string,sI:string,rd:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let re=new ReEntity();
      re.ri=ri;
      re.sI=sI;
      re.rd=rd;
      let base=new BsModel();
      this.remindSqlite.addRe(re).then(data=>{
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
   * 删除提醒时间
   * @param {string} ri
   * @param {string} sI
   * @param {string} rd
   * @returns {Promise<BsModel>}
   */
  delRe(ri:string,sI:string,rd:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let re=new ReEntity();
      re.ri=ri;
      re.sI=sI;
      re.rd=rd;
      let base=new BsModel();
      this.remindSqlite.delRe(re).then(data=>{
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
   * 修改提醒时间
   * @param {string} ri
   * @param {string} sI
   * @param {string} rd
   * @returns {Promise<BsModel>}
   */
  updateRe(ri:string,sI:string,rd:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let re=new ReEntity();
      re.ri=ri;
      re.sI=sI;
      re.rd=rd;
      let base=new BsModel();
      this.remindSqlite.updateRe(re).then(data=>{
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
   * 查询所有提醒时间
   * @param {string} ri
   * @param {string} sI
   * @param {string} rd
   * @returns {Promise<GetOutModel>}
   */
  getRe(ri:string,sI:string,rd:string):Promise<ReoModel>{
    return new Promise((resolve, reject) =>{
      let re=new ReEntity();
      re.ri=ri;
      re.sI=sI;
      re.rd=rd;
      let reo=new ReoModel();
      let data=[];
      this.remindSqlite.getRe(re).then(msg=>{
        if(msg&& msg.rows && msg.rows.length>0){
          for(let i=0;i<msg.rows.length;i++){
            data.push(msg);
          }
          reo.res=data;
          reo.code=0;
          reo.message="success";
          resolve(reo);
        }else{
          reo.code=2;
          reo.message="暂无信息"
          resolve(reo);
        }
      })
        .catch(e=>{
          reo.code=1;
          reo.message=e.message;
          reject(reo);
        })
    })
  }

}
