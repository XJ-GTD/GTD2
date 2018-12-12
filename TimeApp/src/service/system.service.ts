import { Injectable } from '@angular/core';
import {SystemSqlite} from "./sqlite/system-sqlite";
import {StEntity} from "../entity/st.entity";
import {StoModel} from "../model/out/sto.model";
import {BsModel} from "../model/out/bs.model";



/**
 * 系统设置
 */
@Injectable()
export class SystemService {

  constructor(private systemSqlite: SystemSqlite) {

  }

  /**
   * 查询系统设置 （参数为空则查所有）
   * @param {string} si 主键
   * @param {string} sn 名称
   */
  getStl(si:string,sn:string):Promise<StoModel>{
    return new Promise((resolve, reject) =>{
      let st=new StEntity();
      st.si=Number.parseInt(si);
      st.sn=sn;
      let s=new StoModel();
      this.systemSqlite.getSt(st).then(data=>{
        if(data&& data.rows && data.rows.length>0){
          s.st=data.rows.item(0);
          let sts=[];
          for(let i=0;i<data.rows.length;i++){
            sts.push(data.rows.item(i));
          }
          s.sts=sts;
          s.code=0;
          s.message="成功"
          resolve(s);
        }else{
          s.code=2;
          s.message="暂无信息"
          resolve(s);
        }
      })
    .catch(e=>{
        s.code=1;
        s.message="系统错误"
        resolve(s);
      })
    });

  }

  /**
   * 添加
   * @param {string} sn
   * @param {string} ss
   * @param {string} st
   * @returns {Promise<BsModel>}
   */
  addStl(sn: string, ss:string,st: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let s = new StEntity();
      s.sn=sn;
      s.ss=ss;
      s.st=st;

      let base = new BsModel();

      this.systemSqlite.addSt(s).then(data=>{
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
   * 修改
   * @param {number} si
   * @param {string} sn
   * @param {string} ss
   * @param {string} st
   * @returns {Promise<BsModel>}
   */
  updateStl(si:number,sn: string, ss:string,st: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let s = new StEntity();
      s.si=si;
      s.sn=sn;
      s.ss=ss;
      s.st=st;

      let base = new BsModel();

      this.systemSqlite.updateSt(s).then(data=>{
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
   * 删除
   * @param {number} si
   * @param {string} sn
   * @param {string} ss
   * @param {string} st
   * @returns {Promise<BsModel>}
   */
  delStl(si:number,sn: string, ss:string,st: string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let s = new StEntity();
      s.si=si;
      s.sn=sn;
      s.ss=ss;
      s.st=st;

      let base = new BsModel();

      this.systemSqlite.delSt(s).then(data=>{
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
