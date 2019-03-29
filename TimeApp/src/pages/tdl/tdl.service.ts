import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import * as moment from "moment";
import {DTbl} from "../../service/sqlite/tbl/d.tbl";
import {FsData, ScdData} from "../../service/pagecom/pgbusi.service";

@Injectable()
export class TdlService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig: UserConfig) {
  }
  /**
   * （每次返回30条数据，下拉返回日期之前）
   * @param {string} next
   * @returns {Promise<ScdlData[]>}
   */
  async down(next:string,maxn){
    let mpL = new Array<ScdlData>();
    if(next != null && next !=""){

      //获取本地日程jn jg jc jt
      let sqll="select gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st," +
        "jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn from gtd_c gc " +
        "inner join gtd_sp sp on sp.si = gc.si " +
        "left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji  " +
        "where sp.sd<='"+ next+"' order by sp.sd desc limit 300";
      let rclL = await this.sqlExce.execSql(sqll);
      if(rclL && rclL.rows && rclL.rows.length>0){
        let len = rclL.rows.length-1;
        let i=0;
        let d=0;
        next = rclL.rows.item(0).sd;
        //循环获取30条数据
        while(i<maxn && d<100){
          let day = moment(next).subtract(d,'d').format("YYYY/MM/DD");
          let mp:ScdlData = new ScdlData();
          for(let j=0;j<rclL.rows.length;j++){
            let sc:ScdData = new ScdData();
            Object.assign(sc,rclL.rows.item(j));
            if(moment(day).isAfter(sc.sd)){
              break;
            }else if(sc.sd == day){
              let dt = new DTbl();
              dt.si = sc.si;
              let fsL = await this.sqlExce.getList<FsData>(dt);
              sc.fss = fsL;
              Object.assign(sc.fs,rclL.rows.item(j));
              Object.assign(sc.p,rclL.rows.item(j));
              mp.scdl.push(sc);
              i++;
            }
          }
          d++;
          if(mp.scdl.length>0){
            mp.d = day;
            mpL.push(mp);
          }
        }
      }
      mpL.reverse();
    }
    return mpL;
  }

  /**
   * （每次返回60条数据，上推返回日期之后）
   * @param {string} next
   * @returns {Promise<ScdlData[]>}
   */
  async up(next:string,maxn){
    let mpL = new Array<ScdlData>();

    if(next != null && next !=""){
      //正序查出比当前日期大的日程
      let sql="select gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st," +
        "jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn from gtd_c gc " +
        "inner join gtd_sp sp on sp.si = gc.si " +
        "left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji  " +
        "where sp.sd>='"+ next+"' order by sp.sd,sp.st asc limit 300";
      let rcnL = await this.sqlExce.execSql(sql);
      if(rcnL && rcnL.rows && rcnL.rows.length>0){
        let len = rcnL.rows.length-1;
        let i=0;
        let d=0;
        next = rcnL.rows.item(0).sd;
        //循环获取60条数据
        while(i<=maxn && d<365){
          let day = moment(next).add(d,'d').format("YYYY/MM/DD");
          let mp:ScdlData = new ScdlData();
          for(let j=0;j<rcnL.rows.length;j++){
            let sc:ScdData = new ScdData();
            Object.assign(sc,rcnL.rows.item(j));
            if(moment(sc.sd).isAfter(day)){
              break;
            }else if(sc.sd == day){
              let dt = new DTbl();
              dt.si = sc.si;
              let fsL = await this.sqlExce.getList<FsData>(dt);
              sc.fss = fsL;

              Object.assign(sc.fs,rcnL.rows.item(j));
              Object.assign(sc.p,rcnL.rows.item(j));
              mp.scdl.push(sc);
              i++;
            }
          }
          d++;
          if(mp.scdl.length>0){
            mp.d = day;
            mpL.push(mp);
          }
        }
      }

    }
    return mpL;
  }

  //获取日程 （每次返回30条数据，下拉返回日期之前，上推返回日期之后）
  async get(next:string){
    let mpL = new Array<ScdlData>();

    if(next != null && next !=""){

      //获取本地日程jn jg jc jt
      let sqll="select gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st," +
        "jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn from gtd_c gc " +
        "inner join gtd_sp sp on sp.si = gc.si " +
        "left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji  " +
        "where sp.sd<'"+ next+"' order by sp.sd,sp.st desc limit 300";
      let rclL = await this.sqlExce.execSql(sqll);
      if(rclL && rclL.rows && rclL.rows.length>0){
        let len = rclL.rows.length-1;
        let i=0;
        let d=0;
        //循环获取30条数据
        while(i<30 && d<365){
          let day = moment(next).subtract(d,'d').format("YYYY/MM/DD");
          let mp:ScdlData = new ScdlData();
          for(let j=0;j<rclL.rows.length;j++){
            let sc:ScdData = new ScdData();
            Object.assign(sc,rclL.rows.item(j));
            if(moment(sc.sd).isAfter(day)){
              break;
            }else if(sc.sd == day){
              let dt = new DTbl();
              dt.si = sc.si;
              // let fsL = await this.sqlExce.getList<fsData>(dt);
              // sc.fss = fsL;

              Object.assign(sc.fs,rclL.rows.item(j));
              Object.assign(sc.p,rclL.rows.item(j));
              mp.scdl.push(sc);
              i++;
            }
          }
          d++;
          if(mp.scdl.length>0){
            mp.d = day;
            mpL.push(mp);
          }

        }
      }
      mpL.reverse()
      //mpL.sort();
      //正序查出比当前日期大的日程
      let sql="select gc.si,gc.sn,gc.ui,gc.gs,sp.sd,sp.st," +
        "jh.jn,jh.jg,jh.jc,jh.jt,gb.pwi,gb.ran,gb.ranpy,gb.hiu,gb.rn from gtd_c gc " +
        "inner join gtd_sp sp on sp.si = gc.si " +
        "left join gtd_b gb on gb.ui = gc.ui left join gtd_j_h jh on jh.ji = gc.ji " +
        "where sp.sd>='"+ next+"' order by sp.sd,sp.st asc limit 300";
      let rcnL = await this.sqlExce.execSql(sql);
      if(rcnL && rcnL.rows && rcnL.rows.length>0){
        let len = rcnL.rows.length-1;
        let i=0;
        let d=0;
        //循环获取60条数据
        while(i<=60 && d<100){
          let day = moment(next).add(d,'d').format("YYYY/MM/DD");
          let mp:ScdlData = new ScdlData();
          for(let j=0;j<rcnL.rows.length;j++){
            let sc:ScdData = new ScdData();
            Object.assign(sc,rcnL.rows.item(j));
            if(moment(sc.sd).isAfter(day)){
              break;
            }else if(sc.sd == day){
              let dt = new DTbl();
              dt.si = sc.si;
              // let fsL = await this.sqlExce.getList<fsData>(dt);
              // sc.fss = fsL;

              Object.assign(sc.fs,rcnL.rows.item(j));
              Object.assign(sc.p,rcnL.rows.item(j));
              mp.scdl.push(sc);
              i++;
            }
          }
          d++;
          if(mp.scdl.length>0){
            mp.d = day;
            mpL.push(mp);
          }
        }
      }

    }
    return mpL;
      //获取日程对应参与人或发起人

      //获取计划对应色标

  }

  /**
   * 查询当天的日程
   * @param {string} day  YYYY/MM/DD
   * @returns {Promise<BsModel<any>>}
   */
  getOneDayRc(day:string):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let sql = 'select si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,tx,gs from gtd_c gc  ' +
        'where (gc.sd <="' + day +'" and gc.ed is null ) or (gc.sd <="' + day +'" and gc.ed>='+day+'")';
      let bs = new BsModel<Array<ScdData>>();
      this.sqlExce.execSql(sql).then(data=>{
        if(data && data.rows && data.rows.length>0){
          let spl = new Array<ScdData>();
          for(let i=0,len=data.rows.length;i<len;i++){
            let sp:ScdData = data.rows.item(i);
            if(this.isymwd(sp.rt,day,sp.sd,sp.ed)){
              spl.push(sp);
            }
          }
          bs.data = spl;
        }
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
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
    if(ed == '' || ed == null){
      ed = null;
    }
    if(cft && cft != null && cft !='undefined'&&cft != '0'){
      if(cft=='4'){//年
        sd = sd.substr(4,6);
        if(sd == day.substr(4,6)){
          isTrue = true;
        }
      }else if(cft=='3'){ //月
        sd = sd.substr(8,2);
        if(sd<= day && sd== day.substr(8,2) && day<=ed){
          isTrue = true;
        }
      }else if(cft=='2'){ //周
        let sdz = new Date(sd).getDay();
        let dayz = new Date(day).getDay();
        if(sd<=day && sdz == dayz  && day<=ed){
          isTrue = true;
        }
      }else if(cft=='1'){ //日
        if(sd<=day && ed>=day){
          isTrue = true;
        }
      }
    }else if(sd ==day){
      isTrue = true;
    }
    return isTrue;
  }

}

export class ScdlData{
  d :string;
  scdl:Array<ScdData> = new Array<ScdData>();

}






