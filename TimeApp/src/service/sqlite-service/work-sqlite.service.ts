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
import {RuModel} from "../../model/ru.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {UtilService} from "../util-service/util.service";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqliteService {

  constructor( private baseSqlite: BaseSqliteService,
            private util:UtilService) {

  }

  /**
   * 保存日程参与人信息
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  sRcps(rc:RcEntity,rus:Array<RuModel>){
    let sqlStr = "";
    let isTrue = false;
    if(rus != null && rus.length>0){

      for(let i=0;i<rus.length;i++){
        let rcp = new RcpEntity();
        rcp.pI = this.util.getUuid();
        rcp.uI =rus[i].rI;
        rcp.son=rc.sN;
        rcp.sI=rc.sI;
        rcp.cd=rc.sd;
        rcp.pd=rc.ed;
        rcp.rui=rus[i].id;
        if(rcp.uI == rc.uI){
          isTrue = true;
        }
        this.baseSqlite.save(rcp);
      }
    }
    if(!isTrue){
      let rcp2 = new RcpEntity();
      rcp2.pI = this.util.getUuid();
      rcp2.uI =rc.uI;
      rcp2.son=rc.sN;
      rcp2.sI=rc.sI;
      rcp2.cd=rc.sd;
      rcp2.pd=rc.ed;
      this.baseSqlite.save(rcp2);
    }
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
   * @param sI 日程主键
   */
  getds(sI:string){
    let sql = "select jh.jn,gf.lan,gc.* from GTD_C gc " +
      "left join GTD_J_H jh on jh.ji = gc.ji " +
      "left join GTD_F gf on gf.lai = gc.lI where gc.sI =?"
    return this.baseSqlite.executeSql(sql,[sI])
  }

  /**
   * 根据条件查询日程
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} lbN 标签名称
   * @param {string} jh 计划名称
   */
  getwL(ct:string,sd:string,ed:string,lbI:string,lbN:string,jh:string){
    let sql ="select gd.* from GTD_D gd " +
      "left join GTD_C gc on gc.sI = gd.sI " +
      "left join GTD_F gf on gf.lai = gc.lI " +
      "left join GTD_J_H jh on jh.ji = gc.ji " +
      "where 1=1";
    if(ct != null && ct != ""){
      sql = sql + " and gd.son like '%" + ct +"%'"
    }
    if(sd != null && sd != ""){
      sql = sql + " and gc.sd >= '" + sd +"' and gc.ed >= '" + sd +"'";
    }
    if(ed != null && ed != ""){
      sql = sql + " and gc.sd <= '" + ed +"' and gc.ed <= '" + ed +"'";
    }
    if(lbI != null && lbI != ""){
      sql = sql + " and gf.lan like '%" + lbI +"%'"
    }
    if(jh != null && jh != ""){
      sql = sql + " and jh.jn like '%" + jh +"%'"
    }
    return this.baseSqlite.executeSql(sql,[]);
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
