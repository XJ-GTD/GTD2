import {Injectable} from "@angular/core";
import {SqliteExec} from "./sqlite.exec";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {UtilService} from "./util.service";
import * as moment from "moment";
import {BsModel} from "../restful/out/bs.model";
import {ScdData} from "../../pages/tdl/tdl.service";

@Injectable()
export class AgdbusiService {
  get testMap(): Map<string, Array<ScdData>> {
    return this._testMap;
  }

  set testMap(value: Map<string, Array<ScdData>>) {
    this._testMap = value;
  }
  constructor(private sqlexec: SqliteExec, private util: UtilService
  ) {

  }

  //获取重复日程中与传入日期最近一次的日期
  nearAgdDate(date: string, cTbldata: CTbl): string {
    //日程开始日期
    let startD = moment(cTbldata.sd);
    //重复类型
    let type = cTbldata.rt;
    let cs: Array<CTbl> = [];
    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while (moment(date).isAfter(startD) || moment(date).isSame(startD)) {
      if (type == "1") {
        startD = startD.add(1, "d");
      } else if (type == "2") {

        startD = startD.add(1, "w");

      } else if (type == "3") {
        startD = startD.add(1, "M");

      } else if (type == "4") {
        startD = startD.add(1, "y");

      } else {
        return;
      }
    }
    return moment(startD).format("YYYY/MM/DD");
    ;

  }

  //重复日程中当前日期以前的所有日期
  getBeforeDtList(date: string, cTbldata: CTbl): Map<string, AgendaDtPro> {
    let ret = new Map<string, AgendaDtPro>();

    //日程开始日期
    let startD = moment(cTbldata.sd);
    //重复类型
    let type = cTbldata.rt;

    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while (moment(date).isAfter(startD)) {
      if (type == "1") {
        startD = startD.add(1, "d");
      } else if (type == "2") {

        startD = startD.add(1, "w");

      } else if (type == "3") {
        startD = startD.add(1, "M");

      } else if (type == "4") {
        startD = startD.add(1, "y");

      } else {
        return;
      }

      let ar = new AgendaDtPro();
      Object.assign(ar, cTbldata);
      ar.sd = moment(startD).format("YYYY/MM/DD");

      ret.set(ar.sd, ar);

    }
    return ret;

  }

  //当前日期是否在日程的日期中存在
  ishave(date: moment.Moment, cTbldata: CTbl): boolean {

    //日程开始日期
    let startD = moment(cTbldata.sd);

    //日程结束日期
    let endD = moment(cTbldata.ed);

    //重复类型
    let type = cTbldata.rt;

    //当前日期在开始日之前
    if (date.isBefore(startD)) {
      return false;
    }
    //当前日期在结束日之后
    if (cTbldata.ed != '9999/12/31' && date.isAfter(endD)) {
      return false;
    }
    //开始日累计日期在结束日之后
    if (cTbldata.ed != '9999/12/31' && moment(startD).isAfter(endD)) {
      return false;
    }

    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while (!startD.isBefore(date)) {
      if (type == "1") {
        startD = startD.add(1, "d");
      } else if (type == "2") {

        startD = startD.add(1, "w");

      } else if (type == "3") {
        startD = startD.add(1, "M");

      } else if (type == "4") {
        startD = startD.add(1, "y");

      } else if (type == "0") {
        return date.isSame(startD);

      } else {
        return false;
      }

      if (date.isSame(startD)) {
        return true;
      }
    }
    return false;

  }

  /**
   * 查询当天的日程
   * @param {string} day  YYYY/MM/DD
   * @returns {Promise<BsModel<Array<ScdData>>>}
   */
  getOdAgd(day: string): Promise<BsModel<Array<ScdData>>> {
    return new Promise((resolve, reject) => {
      let sql = 'select si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,tx from gtd_c gc  ' +
        'where gc.sd ="' + day + '"';
      let bs = new BsModel<Array<ScdData>>();
      this.sqlexec.execSql(sql).then(data => {
        if (data && data.rows && data.rows.length > 0) {
          let scdL = new Array<ScdData>();
          for (let i = 0, len = data.rows.length; i < len; i++) {
            let sp: ScdData = data.rows.item(i);
            let cTbldata: CTbl = new CTbl();
            Object.assign(cTbldata, sp);
            if (this.ishave(moment(day), cTbldata)) {
              scdL.push(sp);
            }
          }
          bs.data = scdL;
        }
        resolve(bs);
      }).catch(e => {
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }

  /**
   * 查询整月的日程
   * @param {string} day  YYYY/MM/DD
   * @returns {Promise<BsModel<Array<ScdData>>>}
   */
  getRegionAgd(start: string, end: string): Promise<BsModel<Map<moment.Moment, Array<ScdData>>>> {
    return new Promise((resolve, reject) => {
      let sql = 'select si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,tx from gtd_c gc  ' +
        'where (gc.sd <="' + end + '" and gc.ed >= "' + start + '" and rt != "0") ' +
        ' or (gc.sd >="' + start + '" and gc.sd <="' + end + '") order by gc.sd;';
      let bs = new BsModel<Map<moment.Moment, Array<ScdData>>>();
      this.sqlexec.execSql(sql).then(data => {
        console.log("查询结束")
        let d = moment(start).daysInMonth();
        let dm = moment(start).format("YYYY/MM");
        let m: Map<moment.Moment, Array<ScdData>> = new Map<moment.Moment, Array<ScdData>>();
        //循环当月第一天到最后一天
        for (let dd = 1; dd <= d; dd++) {
          let day: moment.Moment = moment(dm + "/" + dd);
          let scdL = new Array<ScdData>();
          m.set(day, scdL);
          if (data && data.rows && data.rows.length > 0) {
            for (let i = 0, len = data.rows.length; i < len; i++) {
              let sp: ScdData = data.rows.item(i);
              let cTbldata: CTbl = new CTbl();
              Object.assign(cTbldata, sp);
              if (this.ishave(day, cTbldata)) {
                scdL.push(sp);
              }
            }
          }
        }
        bs.data = m;
        resolve(bs);
      }).catch(e => {
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }



  //缓存存储按天存储
  private _testMap:Map<string,Array<ScdData>> = new Map<string, Array<ScdData>>();


  getOdAgdtoCache(day:string):Promise<BsModel<Array<ScdData>>>{
    return new Promise((resolve, reject) => {
      let sql = 'select si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,tx from gtd_c gc  ' +
        'where gc.sd ="' + day + '"';
      let bs = new BsModel<Array<ScdData>>();
      this.sqlexec.execSql(sql).then(data=>{
        if(data && data.rows && data.rows.length>0){
          let scdL = new Array<ScdData>();
          for(let i=0,len=data.rows.length;i<len;i++){
            let sp:ScdData = data.rows.item(i);
            let cTbldata : CTbl = new CTbl();
            Object.assign(cTbldata,sp);
            if(this.ishave(moment(day),cTbldata)){
              scdL.push(sp);
            }
          }
          this._testMap.set(day,scdL);
          bs.data = scdL;
        }
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }

  getOdAgdfromCache(day:string):Promise<BsModel<Array<ScdData>>>{
    return new Promise((resolve, reject) => {

      let bs = new BsModel<Array<ScdData>>();
      bs.data = this._testMap.get(day);
      resolve(bs);
    })
  }

}

//日程日期对象
export class AgendaDtPro {
  si: string = "";
  sn: string = "";
  ui: string = "";
  sd: string = "";
  st: string = "";
  ed: string = "";
  et: string = "";
  rt: string = "";
  ji: string = "";
  sr: string = ""
  bz: string = "";
  wtt: string = "";
  tx: string = "";

}
