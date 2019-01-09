import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {MsEntity} from "../../entity/ms.entity";
import {RuModel} from "../../model/ru.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {UtilService} from "../util-service/util.service";
import {RcModel} from "../../model/rc.model";
import {BsModel} from "../../model/out/bs.model";
import {DataConfig} from "../../app/data.config";
import {ReturnConfig} from "../../app/return.config";
import {MsSqlite} from "./ms-sqlite";
import {ScheduleModel} from "../../model/schedule.model";
import {SyncModel} from "../../model/sync.model";
import {RcbModel} from "../../model/rcb.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqlite{

  constructor( private baseSqlite: BaseSqlite,
            private msSqlite:MsSqlite,
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
    // if(rus != null && rus.length>0){
    // if(DataConfig.IS_MOBILE){
      let sql = "";

      for(let i=0;i<rus.length;i++){
        let ru = rus[i];
        let sa = '0';
        if(ru.rI && ru.rI == rc.uI){
          sa='1';
          isTrue=true;
        }
        if(!ru.sdt){
          ru.sdt=0;
        }
        sql +='insert into GTD_D (pI,sI,son,sa,cd,pd,uI,rui,sdt) values("'+ this.util.getUuid()+'","'+ rc.sI+'","'
          + rc.sN+'","' +sa+ '","'+rc.sd+ '","'+rc.ed+ '","'+ ru.rI+'","'+ ru.id+'",'+ ru.sdt+');';
      }
      return this.baseSqlite.importSqlToDb(sql)
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
  getMBs(ym:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql='select gc.*,lbd.* from GTD_C gc ' +
        'left join (select sI,cft,cf,ac,fh from GTD_C_BO ' +
        'union select sI,cft,cf,ac,fh from GTD_C_C ' +
        'union select sI,cft,cf,ac,fh from GTD_C_RC ' +
        'union select sI,cft,cf,ac,fh from GTD_C_JN ' +
        'union select sI,cft,cf,ac,fh from GTD_C_MO) lbd on lbd.sI = gc.sI ' +
        'left join GTD_D gd on gc.sI=gd.sI and gd.uI = "' +ui+'" where ' +
        '(substr(gc.sd,1,7) = "'+ym+'" or substr(gc.ed,1,7)= "'+ym+'")';
      let bs = new BsModel();
      let resL = new Array<any>();
      this.baseSqlite.executeSql(sql,[])
        .then(data=>{
          let ls = data.rows;
          for(let i=1;i<=31;i++){
            let day = ym+"-"+i;
            if(i<10){
              day = ym+'-0'+i;
            }

            let count:number = 0;
            for (let j = 0; j < ls.length; j++) {
              if (this.isymwd(ls.item(j).cft, day, ls.item(j).sd, ls.item(j).ed)) {
                count += 1;
              }

            }
 //           TODO
            if(count>0){
              let res:any={};
              res.ymd = day;
              res.ct = count;
              resL.push(res)
            }
          // if(UtilService.randInt(0,1)>0){
          //     let res:any={};
          //     res.ymd = day;
          //     res.ct = UtilService.randInt(0,10);
          //     resL.push(res);
          //   }
          }

        return this.msSqlite.getMonthMs(ym);
      }).then(data=>{
        if(data&&data.rows&&data.rows.length){
          //判断是否有消息
          for(let j=0;j<=data.rows.length;j++){
            let bool = true; //判断当前日是否存在
            for(let i=0;i<=resL.length;i++){
              if(resL[i].ymd== data.rows.item(j).md){
                resL[i].mdn=1;
                bool = false;
                break;
              }
            }
            if(bool){
              let res:any={};
              res.ymd = data.rows.item(j).md;
              res.ct = 0;
              res.mdn=1;
              resL.push(res);
            }
          }
        }
        bs.data=resL;
        resolve(bs);
      }).catch(e=>{
        console.error("WorkSqlite arc() Error : " +JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql='select gc.*,gd.son,gd.pI,gd.sa,lbd.*,gf.* from GTD_C gc ' +
        'left join (select sI,cft,cf,ac,fh from GTD_C_BO ' +
        'union select sI,cft,cf,ac,fh from GTD_C_C ' +
        'union select sI,cft,cf,ac,fh from GTD_C_RC ' +
        'union select sI,cft,cf,ac,fh from GTD_C_JN ' +
        'union select sI,cft,cf,ac,fh from GTD_C_MO) lbd on lbd.sI = gc.sI ' +
        'left join GTD_F gf on gf.lai=gc.lI '+
        'left join GTD_D gd on gc.sI=gd.sI ' +
        'left join (select substr(md,1,10) md,mf,rI from GTD_H where mf="0" and substr(md,1,10) = "'+ d+
        '" group by substr(md,1,10),mf,rI) gh on gc.sI=gh.rI '
      'and gd.uI ="'+ui+'" where (substr(gc.sd,1,10) <= "'+d+'" and substr(gc.ed,1,10)>= "'+d+'") ';
       // +'and (gd.pI is null or gd.uI ="'+DataConfig.uInfo.uI+'")';
      let bs = new BsModel();
      let resL = new Array<any>();
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        if(data&&data.rows&&data.rows.length>0){
          let ls = data.rows;
          for(let i=0;i<ls.length;i++){
            if(this.isymwd(ls.item(i).cft,d,ls.item(i).sd,ls.item(i).ed)){
              let res:any = ls.item(i);
              res.scheduleId = res.sI;
              res.scheduleName = res.sN;
              if(res.san != null){
                res.scheduleName =res.son;
              }
              if(res.sd.substr(0,10) == d){
                res.scheduleStartTime = res.sd.substr(11,16);
              }else if(res.ed.substr(0,10) == d){
                res.scheduleStartTime = res.ed.substr(11,16);
              }else{
                res.scheduleStartTime="08:00";
              }
              if(res.lau){
                res.labelColor = res.lau;
              }
              //判断别人还是自己的
              if(res.uI==DataConfig.uInfo.uI){
                res.scheduleType = '\u25BA';
              }else{
                res.scheduleType = '\u25C4';
              }
              //是否新消息
              if(res.mf && res.mf=='0'){
                res.isMessage='·';
              }
              resL.push(res);
            }
          }
        }
        // let r = 0;
        // for (r=0;r<10;r++){
        //   let res:ScheduleModel = new ScheduleModel();
        //   res.scheduleId = "1111";
        //   res.scheduleName = "***" +　r +　"***我在想可以做什么呢？是不是很有意思呢。哈哈哈哈";
        //   res.scheduleStartTime = "15:30";
        //   res.scheduleType = "\u25C4";
        //   res.labelColor = "red";
        //   resL.push(res);
        // }
        let ms = new MsEntity();
        ms.md=d;
        return this.msSqlite.updateMs(ms);
      }).then(data=>{
        bs.data=resL;
        resolve(bs);
      }).catch(e=>{
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs)
      })
    })
  }

  /**
   * 判断当前日期是否对应重复类型
   * @param {string} cft 重复类型
   * @param {string} day 当前日期
   * @param {string} sd 开始日期
   * @param {string} ed 结束日期
   * @returns {boolean}
   */
  isymwd(cft:string,day:string,sd:string,ed:string):boolean{
    let isTrue = false;
    sd = sd.substr(0,10);
    ed= ed.substr(0,10);
    if(cft && cft != null && cft !='undefined'){
      if(cft=='1'){//年
        if(sd.substr(4,10)== day.substr(4,10)){
          isTrue = true;
        }
      }else if(cft=='2'){ //月
        if(sd.substr(4,6)== day.substr(4,6)){
          isTrue = true;
        }
      }else if(cft=='3'){ //周
        let sdz = new Date(sd.replace('-','/')).getDay();
        let dayz = new Date(day.replace('-','/')).getDay();
        if(sd<=day && sdz == dayz){
          isTrue = true;
        }
      }else if(cft=='4'){ //周
        if(sd<=day && ed>=day){
          isTrue = true;
        }
        isTrue = true;
      }
    }else if(sd<=day && ed>=day){
      isTrue = true;
    }
    return isTrue;
  }

  /**
   * 获取事件详情
   * @param pI 日程参与人ID
   */
  getds(sI:string):Promise<any>{
    let sql = "select jh.jn,gf.lan,gd.sa,gc.*,lbd.* from GTD_C gc " +
      'left join (select sI,cft,cf,ac,fh from GTD_C_BO ' +
      'union select sI,cft,cf,ac,fh from GTD_C_C ' +
      'union select sI,cft,cf,ac,fh from GTD_C_RC ' +
      'union select sI,cft,cf,ac,fh from GTD_C_JN ' +
      'union select sI,cft,cf,ac,fh from GTD_C_MO) lbd on lbd.sI = gc.sI ' +
      "left join GTD_D gd on gc.sI = gd.sI " +
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
    let sql ="select gc.*,gf.lan,jh.jn from GTD_C gc " +
      "left join GTD_D gd on gc.sI = gd.sI " +
      "left join GTD_F gf on gf.lai = gc.lI " +
      "left join GTD_J_H jh on jh.ji = gc.ji " +
      "where gd.uI='"+DataConfig.uInfo.uI+"'";
    if(ct != null && ct != ""){
      sql = sql + " and gd.son like '%" + ct +"%'"
    }
    if(sd != null && sd != ""){
      sql = sql + " and substr(gc.sd,1,10) <= '" + sd +"'";
    }
    if(ed != null && ed != ""){
      sql = sql + " and substr(gc.ed,1,10) >= '" + ed +"'";
    }
    if(lbI != null && lbI != ""){
      sql = sql + " and gf.lan like '%" + lbI +"%'"
    }
    if(jh != null && jh != ""){
      sql = sql + " and jh.jn like '%" + jh +"%'"
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 添加对应标签表数据
   * @param {string} sI 日程主键
   * @param {string} tk 标签类型
   * @param {string} cft 重复类型
   * @param {string} rm 备注
   * @param {string} ac 闹铃类型
   * @param {string} fh 是否完成0未完成，1完成
   * @returns {Promise<any>}
   */
  addLbData(sI:string,tk:string,cft:string,rm:string,ac:string,fh:string):Promise<any>{
    let id = this.util.getUuid();
    let tn='GTD_C_BO';
    let cf='0'
    if(cft != null && cft !=''){
      cf='1'
    }
    if(tk == '1'){
      tn='GTD_C_BO'
    }else if(tk >= '2' && tk <= '3'){
      tn='GTD_C_C'
    }else if(tk >= '4' && tk <= '8'){
      tn='GTD_C_RC'
    }else if(tk == '9'){
      tn='GTD_C_JN'
    }else if(tk >= '10'){
      tn='GTD_C_MO'
    }
    let sql ='insert into ' + tn +
      '(sI,id,tk,cft,rm,ac,fh) values("'+ sI+'","'+ id+'","'+tk+ '","'+cft+ '","'+ rm+'","'+ ac+'","'+ fh+'")';
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 更新对应标签表数据
   * @param {string} sI 日程主键
   * @param {string} tk 标签类型
   * @param {string} cft 重复类型
   * @param {string} rm 备注
   * @param {string} ac 闹铃类型
   * @param {string} fh 是否完成0未完成，1完成
   * @returns {Promise<any>}
   */
  updateLbData(sI:string,tk:string,cft:string,rm:string,ac:string,fh:string):Promise<any>{
    let tn='GTD_C_BO';
    let cf='0'
    if(cft != null && cft !=''){
      cf='1'
    }
    if(tk == '1'){
      tn='GTD_C_BO'
    }else if(tk >= '2' && tk <= '3'){
      tn='GTD_C_C'
    }else if(tk >= '4' && tk <= '8'){
      tn='GTD_C_RC'
    }else if(tk == '9'){
      tn='GTD_C_JN'
    }else if(tk >= '10'){
      tn='GTD_C_MO'
    }
    let sql ='update ' + tn +
      'set ';
    if(tk != null && tk !=''){
      sql=sql + 'tk="'+tk+'",'
    }
    if(cft != null && cft !=''){
      sql=sql + 'cft="'+cft+'",'
    }
    if(rm != null && rm !=''){
      sql=sql + 'rm="'+rm+'",'
    }
    if(ac != null && ac !=''){
      sql=sql + 'ac="'+ac+'",'
    }
    if(fh != null && fh !=''){
      sql=sql + 'fh="'+fh+'",'
    }
    let str = sql.substr(sql.length-1,sql.length);
    if(str == ','){
      sql = sql.substr(0,sql.length-1);
    }
    sql = sql + ' where sI="'+ sI+'"';
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 服务器同步日程表转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToRcSql(syncs:Array<SyncModel>){
    let sql = '';
    for(let i=0;i<syncs.length;i++){
      let sync = syncs[i];
      let en = new RcEntity();
      en.sI=sync.tableA;
      en.sN=sync.tableB;
      en.lI=sync.tableC;
      en.uI=sync.tableD;
      en.ji=sync.tableE;
      en.sd=sync.tableF;
      en.ed=sync.tableG;
      if(sync.action=='2'){
        sql+=en.dsq;
      }else{
        sql+=en.rpsq;
      }
    }
    return sql;
  }
  /**
   * 服务器同步日程参与人表转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToRcpSql(syncs:Array<SyncModel>){
    let sql = '';
    for(let i=0;i<syncs.length;i++){
      let sync = syncs[i];
      let en = new RcpEntity();
      en.pI=sync.tableA;
      en.sI=sync.tableB;
      en.son=sync.tableC;
      en.sa=sync.tableD;
      en.uI=sync.tableE;
      en.rui=sync.tableF;
      if(sync.action=='2'){
        sql+=en.dsq;
      }else{
        sql+=en.rpsq;
      }
    }
    return sql;
  }

  /**
   * 服务器同步日程子表转sql
   * @param {Array<SyncModel>} syncs
   * @param {string} tn 子表名
   */
  syncToRcbSql(syncs:Array<SyncModel>,tn:string){
    let sql = '';
    for(let i=0;i<syncs.length;i++){
      let sync = syncs[i];
      let en = new RcbModel();
      en.id=sync.tableA;
      en.sI=sync.tableB;
      en.rm=sync.tableC;
      en.cft=sync.tableD;
      en.ac=sync.tableE;
      en.dt=sync.tableF;
      en.fh=sync.tableG;
      en.wd=sync.tableH;
      en.tn=tn;
      if(sync.action=='2'){
        sql+=en.dsq;
      }else{
        sql+=en.rpsq;
      }
    }
    return sql;
  }
}
