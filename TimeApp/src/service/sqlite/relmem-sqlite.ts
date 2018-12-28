import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RguEntity} from "../../entity/rgu.entity";
import {RuEntity} from "../../entity/ru.entity";
import {BsModel} from "../../model/out/bs.model";

/**
 * 授权联系人
 */
@Injectable()
export class RelmemSqlite {

  constructor(private baseSqlite: BaseSqlite) {}

  /**
   * 添加授权联系人
   */
  aru(ru:RuEntity):Promise<BsModel>{
    return this.baseSqlite.save(ru);
  }

  /**
   * 更新授权联系人
   */
  uru(ru:RuEntity):Promise<any>{
    return this.baseSqlite.update(ru);
  }

  /**
   * 查询授权联系人
   * @param {string} id 主键
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rC 手机号
   * @param {string} rel  0联系人,1群组
   */
  getrus(id:string,ran:string,rN:string,rC:string,rel:string):Promise<any>{
    let sql="SELECT * FROM GTD_B where 1=1";
    if(id != null && id !=''){
      sql = sql + " and id='"+id+"'";
    }
    if(rel != null && rel !=''){
      sql = sql + " and rel='"+rel+"'";
    }
    if(ran != null && ran !=''){
      sql = sql + " and ran like '%"+ran+"%'";
    }
    if(rN != null && rN !=''){
      sql = sql + " and rN like '%"+rN+"%'";
    }
    if(rC != null && rC !=''){
      sql = sql + " and rC like '%"+rC+"%'";
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 删除授权联系人
   * @param {RuEntity} ru
   * @returns {Promise<any>}
   */
  dru(ru:RuEntity):Promise<any>{
    return this.baseSqlite.delete(ru);
  }

  /**
   * 根据ID查询
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  getOne(rgu:RguEntity):Promise<any>{
    return this.baseSqlite.getOne(rgu);
  }

  /**
   * 添加群组人员
   * @param {RguEntity} rgu
   * @returns {Promise<any>}
   */
  addRgu(rgu:RguEntity):Promise<any>{
    return this.baseSqlite.save(rgu);
  }
  /**
   * 查询群组人员
   * @param @param {string} id 群组主键
   * @returns {Promise<any>}
   */
  getRgus(id:string):Promise<any>{
    let sql="SELECT gb.* FROM GTD_B gb " +
      "left join GTD_B_X bs on bs.bmi = gb.id where bs.bi='" + id +"'";
    return this.baseSqlite.executeSql(sql,[]);
  }


  /**
   * 删除群组人员
   * @param {string} bi 群组主键ID
   * @param {string} bmi 关系人ID
   * @returns {Promise<any>}
   */
  delRgu(bi:string,bmi:string):Promise<any>{
    let sql = "delete from GTD_B_X where bmi = '"+bmi+"' and bi='"+bi+"'";
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 根据日程ID获取相关参与人
   * @param {string} sI
   * @returns {Promise<any>}
   */
  getRgusBySi(sI:string):Promise<any>{
    let sql = 'select gb.*,gd.uI,gd.sdt from GTD_D gd left join GTD_B gb on gd.rui = gb.id where gd.sI="'+sI+'"';
    return this.baseSqlite.executeSql(sql,[]);
  }

  xfGetRu(py:string):Promise<any>{
    let pyL = py.split(",");
    let sql = "select * from  GTD_B where ";
    let ranpy = ''
    let rNpy=''
    for(let i=0;i<pyL.length;i++){
      if(pyL[i] != ''){
        if(ranpy==''){
          ranpy="ranpy in ('"+pyL[i]+"'"
        }else{
          ranpy=ranpy + ",'"+pyL[i]+"'"
        }
        if(rNpy==''){
          rNpy="rNpy in ('"+pyL[i]+"'"
        }else{
          ranpy=rNpy + ",'"+pyL[i]+"'"
        }
      }
    }
    sql = sql + ranpy + ") or " + rNpy +")";
    return this.baseSqlite.executeSql(sql,[]);
  }

}
