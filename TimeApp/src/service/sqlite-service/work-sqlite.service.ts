import { Injectable } from '@angular/core';
import {Platform, Events, List} from 'ionic-angular';
import {BaseSqliteService} from "./base-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UoModel} from "../../model/out/uo.model";
import {MsEntity} from "../../entity/ms.entity";
import {MbsoModel} from "../../model/out/mbso.model";
import {MbsModel} from "../../model/mbs.model";
import {RcpoModel} from "../../model/out/rcpo.model";
import {RcpModel} from "../../model/rcp.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqliteService {

  constructor( private baseSqlite: BaseSqliteService) {

  }

  /**
   * 查询每月事件标识
   * @param ym 格式‘2018-01’
   */
  getMBs(ym){
    let sql='select substr(gd.pD,1,10) ymd,gh.mdn,count(*) ct from GTD_D gd ' +
      'left outer join (select substr(md,1,10) mdn from GTD_H where mt="0" group by substr(md,1,10)) gh on gh.mdn=substr(gd.pD,1,10) ' +
      'where  substr(gd.pD,1,7)="' + ym +'" GROUP BY substr(gd.pD,1,10),gh.mdn'
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string){
    let sql="select substr(pd,12,16) tm,gtdd.* from GTD_D" +
      " gtdd where substr(pd,1,10)='" + d+"'";
      return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 获取事件详情
   * @param d 'yyyy-MM-dd'
   */
  getsd(d:string){

  }


  test() {
    let ms = new MsEntity();
    ms.mn='test';
    ms.md='2018-11-18 20:12';
    ms.mt='0';
    //插入消息
    this.baseSqlite.save(ms).then(data=>{
      console.log(data);
    })
    let sqlStr = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('24314','12424','2018-11-18 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr, []).then(data => {
      console.log(data)
    }).catch(e => {
      console.log(e)
    })

    let sqlStr3 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243143','12424','2018-11-17 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr3,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr4 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243144','12424','2018-11-15 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr4,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr5 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243145','12424','2018-11-22 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr5,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })
  }
}
