import {Injectable} from "@angular/core";
import {SqliteExec} from "./sqlite.exec";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {UtilService} from "./util.service";
import * as moment from "moment";

@Injectable()
export class AgdbusiService {
  constructor( private sqlexec: SqliteExec,private util :UtilService
              ) {

  }

  //获取重复日程中与传入日期最近一次的日期
  nearAgdDate(date: string,cTbldata : CTbl):string{
    //日程开始日期
    let startD = moment(cTbldata.sd);
    //重复类型
    let type = cTbldata.rt;
    let cs:Array<CTbl> = [];
    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while(moment(date).isAfter(startD)|| moment(date).isSame(startD) ) {
      if (type == "1"){
        startD = startD.add(1,"d");
      }else if (type=="2"){

        startD =startD.add(1,"w");

      }else if (type=="3"){
        startD =startD.add(1,"M");

      }else if (type=="4"){
        startD = startD.add(1,"y");

      }else{
        return;
      }
    }
    return moment(startD).format("YYYY/MM/DD");;

  }

  //重复日程中当前日期以前的所有日期
  getBeforeDtList(date: string,cTbldata : CTbl):Map<string,AgendaDtPro>{
    let ret = new Map<string,AgendaDtPro>();

    //日程开始日期
    let startD = moment(cTbldata.sd);
    //重复类型
    let type = cTbldata.rt;

    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while(moment(date).isAfter(startD) ) {
      if (type == "1"){
        startD = startD.add(1,"d");
      }else if (type=="2"){

        startD =startD.add(1,"w");

      }else if (type=="3"){
        startD =startD.add(1,"M");

      }else if (type=="4"){
        startD = startD.add(1,"y");

      }else{
        return;
      }

      let ar = new AgendaDtPro();
      Object.assign(ar,cTbldata);
      ar.sd = moment(startD).format("YYYY/MM/DD");

      ret.set(ar.sd,ar);

    }
    return ret;

  }

  //当前日期是否在日程的日期中存在
  ishave(date: string,cTbldata : CTbl):boolean{

    //日程开始日期
    let startD = moment(cTbldata.sd);

    //日程结束日期
    let endD = moment(cTbldata.ed);

    //重复类型
    let type = cTbldata.rt;

    //当前日期在开始日之前
    if (moment(date).isBefore(startD)){
      return false;
    }
    //当前日期在结束日之后
    if (cTbldata.ed !='9999/12/31'  && moment(date).isAfter(endD)){
      return false;
    }

    //0：关闭，1：每日，2：每周，3：每月，4：每年
    while(moment(date).isAfter(startD)) {
      if (type == "1"){
        startD = startD.add(1,"d");
      }else if (type=="2"){

        startD =startD.add(1,"w");

      }else if (type=="3"){
        startD =startD.add(1,"M");

      }else if (type=="4"){
        startD = startD.add(1,"y");

      }else if (type=="0"){
        return moment(date).isSame(startD);

      }else{
        return false;
      }

      if (moment(date).isSame(startD)){
        return true;
      }

      //开始日累计日期在结束日之后
      if (cTbldata.ed !='9999/12/31'  && moment(startD).isAfter(endD)){
        return false;
      }
    }
    return false;

  }

}

//日程日期对象
export class  AgendaDtPro {
  si: string="";
  sn: string="";
  ui: string="";
  sd: string="";
  st: string="";
  ed: string="";
  et: string="";
  rt: string="";
  ji: string="";
  sr: string =""
  bz: string ="";
  wtt:string ="";
  tx:string="";

}
