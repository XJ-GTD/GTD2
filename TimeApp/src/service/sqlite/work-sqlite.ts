import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {MsEntity} from "../../entity/ms.entity";
import {RuModel} from "../../model/ru.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {UtilService} from "../util-service/util.service";
import {RcModel} from "../../model/rc.model";
import {BsModel} from "../../model/out/bs.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqlite{

  constructor( private baseSqlite: BaseSqlite,
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
      if(this.baseSqlite.isMobile()){
        let sql = "";

        for(let i=0;i<rus.length;i++){
          let ru = rus[i];
          let sa = '0';
          if(ru.rI && ru.rI == rc.uI){
            sa='1';
            isTrue=true;
          }
          sql +='insert into GTD_D (pI,sI,son,sa,cd,pd,uI,rui) values("'+ this.util.getUuid()+'","'+ rc.sI+'","'
            + rc.sN+'","' +sa+ '","'+rc.sd+ '","'+rc.ed+ '","'+ ru.rI+'","'+ ru.id+'")';
        }
        return this.baseSqlite.importSqlToDb(sql)
      }else{
        let rcp = new RcpEntity();
        for(let i=0;i<rus.length;i++){
          rcp.pI = this.util.getUuid();
          rcp.uI =rus[i].rI;
          rcp.son=rc.sN;
          rcp.sI=rc.sI;
          rcp.cd=rc.sd;
          rcp.pd=rc.ed;
          rcp.rui=rus[i].id;
          if(rcp.uI == rc.uI){
            isTrue = true;
            rcp.sa='1'
          }else{
            rcp.sa='0'
          }
          this.baseSqlite.save(rcp);
        }
        rcp.pI = this.util.getUuid();
        return this.baseSqlite.save(rcp);
      }
    }

  }

  /**
   * 查询日程参与人
   * @param {string} sI 日程ID
   * @param {string} pI 日程参与人表主键
   */
  getRcps(sI:string,pI:string):Promise<any>{
    let sql = 'select * from GTD_D where 1=1';
    if(sI != null && sI !=''){
      sql = sql + ' and sI= "'+ sI +'"';
    }
    if(pI != null && pI !=''){
      sql = sql + ' and pI= "'+ pI +'"';
    }
    return this.baseSqlite.executeSql(sql,[])
  }

  /**
   * 删除日程关联表
   * @param {string} sI 日程ID
   */
  dRcps(sI:string):Promise<any>{
    let sql = 'delete from GTD_D where sI= "'+ sI +'"';
    return this.baseSqlite.executeSql(sql,[])
  }

  /**
   * 查询每月事件标识
   * @param ym 格式‘2018-01’
   */
  getMBstwo(ym:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql='select gc.* from GTD_C gc left join GTD_D gd on gc.sI=dg.sI where gc.sI != null and ' +
        '(substr(gc.sd,1,7) = "'+ym+'" or substr(gc.ed,1,7)= "'+ym+'"))';
      let bs = new BsModel();
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        let resL = new Array<any>()
        if(data&&data.rows&&data.rows.length>0){
          let ls = data.rows;
          for(let i=1;i<=31;i++){
            let day = ym+"-"+i;
            if(i<10){
              day = ym+'-0'+i
            }
            let count:number = 0;
            for(let j=0;j<ls.length;j++){
              if(ls.item(i).sd != null && ls.item(i).ed != null && ls.item(i).sd>=day && ls.item(i).sd<=day){
                count +=1;
              }
            }
            if(count>0){
              let res :any ;
              res.ymd = day;
              res.ct = count;
              resL.push(res)
            }
          }
        }
        bs.data=resL;
        resolve(bs)
      }).catch(e=>{
        bs.code=1
        bs.message=e.message
        reject(bs)
      })
    })
  }

  getMBs(ym:string,ui:string):Promise<any>{

    let sql='select substr(gd.dt,1,10) ymd,gh.mdn,count(*) ct from ' +
      '(select case when pd != null and pd != "null" then pd else cd end dt,gdd.* from GTD_D gdd where uI="'+ ui+'") gd ' +
      'left join (select substr(md,1,10) mdn from GTD_H where mt="0" group by substr(md,1,10)) gh on gh.mdn=substr(gd.dt,1,10) ' +
      'where  substr(gd.dt,1,7)="' + ym +'" GROUP BY substr(gd.dt,1,10),gh.mdn'
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string,ui:string):Promise<any>{
    let sql="select substr(dt,12,16) scheduleStartTime,gtdd.pI scheduleId,gtdd.son scheduleName,gtdd.* from " +
      "(select case when pd != null and pd != 'null' then pd else cd end dt,gdd.* from GTD_D gdd where uI='"+ ui+"')" +
      " gtdd where substr(dt,1,10)='" + d+"'";
      return this.baseSqlite.executeSql(sql,[]);
  }
  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOdTwo(d:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql='select gc.*,gd.san,gd.pI,gd.sa from GTD_C gc left join GTD_D gd on gc.sI=dg.sI where ' +
        '(substr(gc.sd,1,10) <= "'+d+'" or substr(gc.ed,1,10)>= "'+d+'"))';
      let bs = new BsModel();
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        let resL = new Array<any>()
        if(data&&data.rows&&data.rows.length>0){
          let ls = data.rows;
          for(let i=0;i<ls.length;i++){
            let res:any = ls.item(i);
            res.scheduleId = res.sI;
            res.scheduleName = res.sN;
            if(res.san != null){
              res.scheduleName =res.san;
            }
            if(res.sd.substr(0,10) == d){
              res.scheduleStartTime = res.sd.substr(12,16)
            }else if(res.ed.substr(0,10) == d){
              res.scheduleStartTime = res.ed.substr(12,16)
            }else{
              res.scheduleStartTime="08:00"
            }
            resL.push(res)
          }
        }
        bs.data=resL;
        resolve(bs)
      }).catch(e=>{
        bs.code=1
        bs.message=e.message
        reject(bs)
      })
    })
  }

  /**
   * 获取事件详情
   * @param pI 日程参与人ID
   */
  getds(sI:string):Promise<any>{
    let sql = "select jh.jn,gf.lan,gd.sa,gc.* from GTD_C gd left join GTD_D gc on gc.sI = gd.sI " +
      "left join GTD_J_H jh on jh.ji = gc.ji " +
      "left join GTD_F gf on gf.lai = gc.lI where gc.sI ='" + sI +"'"
    return this.baseSqlite.executeSql(sql,[])
  }
  /**
   * 获取事件参与人
   * @param pI 日程参与人ID
   */
  getdsRcps(sI:string,pI:string):Promise<any>{
    let sql = "select gb.* from GTD_D gd left join GTD_B gb on gb.id = gd.rui where gd.sI='" + sI +"'";
    if(pI != null && pI !=''){
      sql +=" and gd.pI='"+pI+"'";
    }
    return this.baseSqlite.executeSql(sql,[])
  }

  getdsRcps(){

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
  getwL(ct:string,sd:string,ed:string,lbI:string,lbN:string,jh:string):Promise<any>{
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
