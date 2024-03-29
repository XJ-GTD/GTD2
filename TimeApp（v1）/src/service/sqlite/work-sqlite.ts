import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RuModel} from "../../model/ru.model";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {UtilService} from "../util-service/util.service";
import {RcModel} from "../../model/rc.model";
import {BsModel} from "../../model/out/bs.model";
import {DataConfig} from "../../app/data.config";
import {ReturnConfig} from "../../app/return.config";
import {MsSqlite} from "./ms-sqlite";
import {SyncModel} from "../../model/sync.model";
import {RcbModel} from "../../model/rcb.model";
import {SyncEntity} from "../../entity/sync.entity";
import {ReadlocalService} from "../readlocal.service";
import * as moment from "moment";
import {RcoModel} from "../../model/out/rco.model";
import {SyncSqlite} from "./sync-sqlite";
import {RcbSqlite} from "./rcb-sqlite";
import {XiaojiAlarmclockService} from "../util-service/xiaoji-alarmclock.service";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqlite{

  constructor( private baseSqlite: BaseSqlite,
            private msSqlite:MsSqlite,
            private readlocal:ReadlocalService,
            private xiaoji: XiaojiAlarmclockService,
            private sync:SyncSqlite,
            private util:UtilService) {

  }

  /**
   * 保存日程参与人信息
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  save(rc:RcEntity):Promise<any>{
    return new Promise((resolve, reject) => {
      //添加本地日程
      this.baseSqlite.save(rc).then(data=>{
        //添加本地日程到同步表
        console.log('------------- WorkSqlite save 同步表--------------')
        this.syncRcTime(rc,DataConfig.AC_O);
        resolve(data);
      }).catch(e=>{
        console.log('------------- WorkSqlite save Error：' + JSON.stringify(e));
        reject(e);
      })
    })
  }

  /**
   * 保存日程参与人信息
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  update(rc:RcEntity):Promise<any>{
    return new Promise((resolve, reject) => {
      //添加本地日程
      this.baseSqlite.update(rc).then(data=>{
        //添加本地日程到同步表
        console.log('------------- WorkSqlite save 同步表--------------')
        this.syncRcTime(rc,DataConfig.AC_T);
        resolve(data);
      }).catch(e=>{
        console.log('------------- WorkSqlite save Error：' + JSON.stringify(e));
        reject(e);
      })
    })
  }

  /**
   * 删除日程
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  delete(rc:RcEntity):Promise<any>{
    return new Promise((resolve, reject) => {
      //添加本地日程
      this.baseSqlite.delete(rc).then(data=>{
        //添加本地日程到同步表
        console.log('------------- WorkSqlite save 同步表--------------')
        return this.syncRcTime(rc,DataConfig.AC_D);
      }).then(data=>{
        resolve(data);
      }).catch(e=>{
        console.log('------------- WorkSqlite save Error：' + JSON.stringify(e));
        reject(e);
      })
    })
  }

  /**
   * 保存日程参与人信息
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  sRcps(rc:RcEntity,rus:Array<RuModel>):Promise<any>{
    return new Promise((resolve, reject) => {
      let sql = "";
      let rcpL = new Array<RcpEntity>();
      let isMe:boolean = false;
      for (let i = 0; i < rus.length; i++) {
        let ru = rus[i];
        let rgc = new RcpEntity();
        if(ru.pI== '' || ru.pI == null){
          rgc.pI = this.util.getUuid();
        }else{
          rgc.pI=ru.pI;
          continue;
        }
        rgc.sI = rc.sI;
        rgc.son = rc.sN;
        let sa = '0';
        if (ru.rI && ru.rI == rc.uI) {
          rgc.sa = '1';
          isMe = true;
        }
        rgc.cd = rc.sd;
        rgc.pd = rc.ed;
        rgc.uI = ru.rI;
        rgc.rui = ru.id;
        if (!ru.sdt) {
          ru.sdt = 0;
        }
        rgc.sdt = ru.sdt;
        sql += rgc.rpsq;
        rcpL.push(rgc);
      }
      if(sql != ''){
        this.baseSqlite.importSqlToDb(sql).then(data=>{
          return this.syncRgcTime(rcpL,DataConfig.AC_O)
        }).then(data=>{
          resolve(data);
        }).catch(e=>{
          reject(e);
        })
      }else{
        resolve(rcpL);
      }

    })
  }

  /**
   * 删除日程参与人信息
   * @param {RcEntity} rc
   * @param {Array<RuModel>} rcps
   */
  dRcps(rc:RcEntity,rus:Array<RuModel>):Promise<any>{
    return new Promise((resolve, reject) => {
      let sql = "";
      let rcpL = new Array<RcpEntity>();
      let isMe:boolean = false;
      for (let i = 0; i < rus.length; i++) {
        let ru = rus[i];
        let rgc = new RcpEntity();
        rgc.pI = ru.pI;
        rgc.sI = rc.sI;
        sql += rgc.dsq;
        rcpL.push(rgc);
      }
      this.baseSqlite.importSqlToDb(sql).then(data=>{
        return this.syncRgcTime(rcpL,DataConfig.AC_D);
      }).then(data=>{
        resolve(data);
      }).catch(e=>{
        reject(e);
      })
    })
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
  dRcpBysI(sI:string):Promise<any>{
    let sql = 'delete from GTD_D where sI= "'+ sI +'"';
    return this.baseSqlite.executeSql(sql,[])
  }

  /**
   * 查询每月事件标识
   * @param ym 格式‘2018/01’
   */
  getMBs(ym:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      // or gc.uI= "'+ui+'"
      let sql= this.getRcSql('') +
        ' where (gd.uI = "'+ui+ '" or gc.uI= "'+ui+'") and ' +
        '(substr(gc.sd,1,7) <= "'+ym+'" and substr(gc.ed,1,7)>= "'+ym+'")';
      let bs = new BsModel();
      let resL = new Array<any>();
      let rcL = new Array<RcModel>();
      console.log(' ---- WorkSqlite getMBs 查询sqlite日历数据开始 =：'+sql);
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        console.log(' ---- WorkSqlite getMBs 查询sqlite日历数据 ---- ');
        if(data && data.rows && data.rows.length>0){
          for (let i = 0; i < data.rows.length; i++) {
            rcL.push(data.rows.item(i))
          }
        }
        console.log(' ---- WorkSqlite getMBs 查询本地日历数据 ---- ');
        let date = new Date(ym+'/01');
        let sd = UtilService.getCurrentMonthFirst(date);
        let ed = UtilService.getCurrentMonthLast(date);
        ed = new Date(ed.getTime() + 23*59*60*1000);
        return this.readlocal.findEventRc('',sd,ed,rcL);
      }) .then(data=>{
        if(data.rcL.length>0){
          for(let i=1;i<=31;i++){
            let day = ym+"/"+i;
            if(i<10){
              day = ym+'/0'+i;
            }
            let count:number = 0;
            for (let j = 0; j < rcL.length; j++) {
              if (this.isymwd(rcL[j].cft, day, rcL[j].sd, rcL[j].ed)) {
                count += 1;
              }
            }
            //  TODO
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
        }
        //查询Message
        return this.msSqlite.getMonthMs(ym);
      }).then(data=>{
        if(data&&data.rows&&data.rows.length>0){
          //判断是否有消息
          for(let j=0;j<data.rows.length;j++){
            let bool = true; //判断当前日是否存在
            for(let i=0;i<resL.length;i++){
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
   * @param d 'yyyy/MM/dd'
   */
  getOd(d:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let sql= this.getRcSql('mf,gf.lau,') + ' left join GTD_F gf on gf.lai=gc.lI '+
        'left join (select substr(md,1,10) md,mf,rI from GTD_H where mf="0" and mt="0" and substr(md,1,10) = "'+ d+
        '" group by substr(md,1,10),mf,rI) gh on gc.sI=gh.rI ' +
      ' where (substr(gc.sd,1,10) <= "'+d+'" and substr(gc.ed,1,10)>= "'+d+'") ' +
      ' and (gd.uI = "'+ui+'" or gc.uI= "'+ui+'") order by substr(gc.sd,12,5)';
      let bs = new BsModel();
      let resL = new Array<any>();
      let rcL = new Array<RcModel>();
      console.log(' ---- WorkSqlite getOd 查询sqlite日历数据 ：'+ sql);
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        let localIds:string[] = [];
        console.log(' ---- WorkSqlite getOd 查询sqlite日历数据 ---- ');
        if(data && data.rows && data.rows.length>0){
          for (let i = 0; i < data.rows.length; i++) {
            let rc:RcModel = new RcModel();
            Object.assign(rc,data.rows.item(i));
            rcL.push(rc);
          }
        }
        console.log(' ---- WorkSqlite getMBs 查询本地日历数据 ---- ');
        let sd = new Date(d + ' 00:00');
        let ed = new Date(d + ' 23:59');
        return this.readlocal.findEventRc('',sd,ed,rcL);
      }).then(data=>{
        if(data.rcL.length>0){
          for(let i=0;i<rcL.length;i++){
            let res:any = rcL[i];
            if(this.isymwd(res.cft,d,res.sd,res.ed)){
              res.scheduleId = res.sI;
              res.scheduleName = res.sN;
              if(!res.sI || res.sI== '' || res.sI == null){
                res.scheduleIsLocal = true;
              }else{
                res.scheduleIsLocal = false;
              }
              if(res.san != null){
                res.scheduleName =res.son;
              }
              // if(res.sd.substr(0,10) == d){
              //   res.scheduleStartTime = res.sd.substr(11,16);
              // }else if(res.ed.substr(0,10) == d){
              //   res.scheduleStartTime = res.ed.substr(11,16);
              // }else{
                res.scheduleStartTime=res.sTime;
                res.scheduleStartDate=res.sDate;
              // }
              if(res.lau){
                res.labelColor = res.lau;
              }
              //判断别人还是自己的
              if(res.uI==DataConfig.uInfo.uI){
                res.scheduleType = '1';
              }else{
                res.scheduleType = '2';
              }
              //是否新消息
              if(res.mf && res.mf=='0'){
                res.isMessage=true;
              }else{
                res.isMessage=false;
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
   * 查询当前需设置的闹铃
   * @param mm 提前mm分钟提醒
   */
  setColckWork(mm:number):Promise<RcoModel>{
    return new Promise((resolve, reject) => {
      let date = new Date().getTime(); //当前日期时间
      let agodate = date - mm * 60 * 1000;
      let today = moment(date).format('YYYY/MM/DD'); //当前日期
      let dt = moment(date).format('YYYY/MM/DD HH:mm').substr(11,16); //当前日期时间
      let agodt = moment(agodate).format('YYYY/MM/DD HH:mm').substr(11,16); //mm分钟前
      let sql= this.getRcSql('gf.lau,') + ' left join GTD_F gf on gf.lai=gc.lI '+
        ' where (substr(gc.sd,1,10) <= "'+today+'" and substr(gc.ed,1,10)>= "'+today+'") ' +
        ' and gd.uI = "'+DataConfig.uInfo.uI+'" '
        +  ' and (substr(lbd.dt,12,5) >= "'+agodt+'" and substr(lbd.dt,12,5)<= "'+dt+'") ';
      let rco = new RcoModel();
      let rcL = new Array<RcModel>();
      rco.rcL = rcL;
      console.log(' ---- WorkSqlite getOd 查询sqlite日历数据 ：'+ sql);
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        let localIds:string[] = [];
        console.log(' ---- WorkSqlite getOd 查询sqlite日历数据 ---- ');
        if(data && data.rows && data.rows.length>0){
          for (let i = 0; i < data.rows.length; i++) {
            let res:RcModel = data.rows.item(i);
            //设置闹铃
            if(this.isymwd(res.cft,today,res.sd,res.ed) && res.dt != '' && res.dt !=null){
              res.dt = today + res.dt.substr(10,6);
              console.log("设置闹铃主题："+res.sN+ ",闹铃时间："+res.dt);
              this.xiaoji.setAlarmClock(res.dt,res.sN);
            }

          }
        }
        rco.rcL=rcL;
        resolve(rco);
      }).catch(e=>{
        console.error("查询"+mm+"分钟前的日程失败ERROR：" + JSON.stringify(e));
        console.error("查询"+mm+"分钟前的日程失败ERROR：" + e.toString());
        rco.code=ReturnConfig.ERR_CODE;
        rco.message=ReturnConfig.ERR_MESSAGE;
        reject(rco)
      })
    })
  }

  /**
   * 日程查询SQL
   * @returns {string}
   */
  getRcSql(param:string):string{
    let sql= 'select gc.*,' +param+
      'lbd.cft,lbd.wd,lbd.ac,lbd.fh,lbd.tk,lbd.rm,lbd.dt,lbd.subId from GTD_C gc ' +
      'left join (select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_BO ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_C ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_RC ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_JN ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_MO) lbd on lbd.sI = gc.sI ' +
      'left join (select sI,uI from GTD_D where uI ="'+DataConfig.uInfo.uI+'" group by sI,uI) gd on gc.sI=gd.sI ';
    return sql;
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
    sd = moment(sd).format('YYYY/MM/DD');
    ed = moment(ed).format('YYYY/MM/DD');
    if(cft && cft != null && cft !='undefined'){
      if(cft=='1'){//年
        sd = sd.substr(4,6);
        if(sd == day.substr(4,6)){
          isTrue = true;
        }
      }else if(cft=='2'){ //月
        sd = sd.substr(8,2);
        if(sd<= day && sd== day.substr(8,2) && day<=ed){
          isTrue = true;
        }
      }else if(cft=='3'){ //周
        let sdz = new Date(sd).getDay();
        let dayz = new Date(day).getDay();
        if(sd<=day && sdz == dayz  && day<=ed){
          isTrue = true;
        }
      }else if(cft=='4'){ //日
        if(sd<=day && ed>=day){
          isTrue = true;
        }
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
    let sql = "select jh.jn,gf.lan,gf.lau,gc.*,gb.*," +
      "lbd.cft,lbd.wd,lbd.ac,lbd.fh,lbd.tk,lbd.rm,lbd.dt,lbd.subId from GTD_C gc " +
      'left join (select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_BO ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_C ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_RC ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_JN ' +
      'union select sI,cft,wd,ac,fh,tk,rm,dt,id subId from GTD_C_MO) lbd on lbd.sI = gc.sI ' +
      "left join GTD_B gb on gc.uI = gb.rI " +
      "left join GTD_J_H jh on jh.ji = gc.ji " +
      "left join GTD_F gf on gf.lai = gc.lI where gc.sI ='" + sI +"'";
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
    let sql ='select gc.*,gf.lan,jh.jn,lbd.* from GTD_C gc ' +
      'left join (select sI ssI,cft,cf,ac,fh,tk from GTD_C_BO ' +
      'union select sI ssI,cft,cf,ac,fh,tk from GTD_C_C ' +
      'union select sI ssI,cft,cf,ac,fh,tk from GTD_C_RC ' +
      'union select sI ssI,cft,cf,ac,fh,tk from GTD_C_JN ' +
      'union select sI ssI,cft,cf,ac,fh,tk from GTD_C_MO) lbd on lbd.ssI = gc.sI ' +
      //'left join GTD_D gd on gc.sI = gd.sI ' +
      'left join GTD_F gf on gf.lai = gc.lI ' +
      'left join GTD_J_H jh on jh.ji = gc.ji ' +
     // 'where gd.uI="'+DataConfig.uInfo.uI+'"';
      'where 1=1';
    if(ct && ct != null && ct != ""){
      sql = sql + " and gd.son like '%" + ct +"%'"
    }
    if(sd && sd != null && sd != ""){
      let sdl = sd.length;
      sql = sql + " and substr(gc.sd,1,"+sdl+") <= '" + sd +"'";
    }
    if(ed && ed != null && ed != ""){
      let edl = ed.length;
      sql = sql + " and substr(gc.ed,1,"+edl+") >= '" + ed +"'";
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
   * 未发送日程查询SQL
   * @returns {string}
   */
  getNoSendRc():Promise<any>{
      let sql= this.getRcSql('')+'where gc.fi !="0"';
      return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 未发送日程参与人查询SQL
   * @returns {string}
   */
  getNoSendRgc():Promise<any>{
    let sql= 'select gb.* from GTD_D gd left join GTD_C gc on gc.sI= gd.sI ' +
      'left join GTD_B gb on gb.id = gd.rui where gb.rel = "0" and ' +
      'gc.fi != "0" and gd.uI !="'+DataConfig.uInfo.uI+'"';
    return this.baseSqlite.executeSql(sql,[]);
  }



  /**
   * 服务器同步日程表转sql
   * @param {Array<SyncModel>} syncs
   */
  syncToRcSql(syncs:Array<SyncModel>){
    let sql = '';
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new RcEntity();
        if(sync.tableA && sync.tableA != '' && sync.tableA != null){
          en.sI = sync.tableA;
        }else{
          continue;
        }
        en.sN = sync.tableB;
        en.lI = sync.tableC;
        en.uI = sync.tableD;
        en.ji = sync.tableE;
        en.sd = sync.tableF;
        en.ed = sync.tableG;
        en.sd = en.sd.replace(new RegExp('-','g'),'/');
        en.ed= en.ed.replace(new RegExp('-','g'),'/');
        if (sync.action == '2') {
          sql += en.dsq;
        } else {
          sql += en.rpsq;
        }
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
    if(syncs != null && syncs.length>0) {
      for (let i = 0; i < syncs.length; i++) {
        let sync = syncs[i];
        let en = new RcpEntity();
        if(sync.tableA && sync.tableA != '' && sync.tableA != null){
          en.pI = sync.tableA;
        }else{
          continue;
        }
        en.sI = sync.tableB;
        en.son = sync.tableC;
        if(sync.tableD != '' && sync.tableD != null){
          en.sdt = Number(sync.tableD);
        }
        en.sa = sync.tableE;
        en.uI = sync.tableF;
        en.rui = sync.tableG;
        if (sync.action == '2') {
          sql += en.dsq;
        } else {
          sql += en.rpsq;
        }
      }
    }
    return sql;
  }

  /**
   * 服务器定时同步日程表
   * @param {RcEntity} en
   * @param {string} ac 执行动作0添加，1更新，2删除
   */
  syncRcTime(en:RcEntity,ac:string): Promise<any> {
    let sql = '';
    let sync = new SyncEntity();
    sync.tableA = en.sI ;
    sync.tableB = en.sN;
    sync.tableC = en.lI;
    sync.tableD = en.uI;
    sync.tableE = en.ji;
    sync.tableF = moment(en.sd).format('YYYY-MM-DD HH:mm');
    sync.tableG = moment(en.ed).format('YYYY-MM-DD HH:mm');
    sync.action= ac;
    sync.tableName = DataConfig.GTD_C;
    return this.sync.save(sync.isq);
  }

  /**
   * 服务器定时同步参与人表
   * @param {RcEntity} en
   * @param {string} ac 执行动作0添加，1更新，2删除
   */
  syncRgcTime(ens:Array<RcpEntity>,ac:string): Promise<any> {
    let sql = '';
    for (let en of ens){
      let sync = new SyncEntity();
      sync.tableA = en.pI ;
      sync.tableB = en.sI;
      sync.tableC = en.son;
      sync.tableD = en.sa;
      sync.tableE = en.sdt+'';
      sync.tableF = en.uI;
      sync.tableG = en.rui;
      sync.action= ac;
      sync.tableName = DataConfig.GTD_D;
      sql+=sync.isq;
    }
    return this.sync.save(sql);
  }
}
