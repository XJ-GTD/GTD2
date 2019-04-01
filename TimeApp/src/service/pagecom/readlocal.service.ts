import { Injectable } from '@angular/core';
import { Calendar } from "@ionic-native/calendar";
import {UtilService} from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import {ScdData} from "./pgbusi.service";
import {ScdlData} from "../../pages/tdl/tdl.service";

/**
 * 页面ts传值(Calendar)
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ReadlocalService {

  constructor(private calendar: Calendar,
              private util:UtilService ) { }
  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      console.log("执行查询本地日历")
      this.calendar.findEvent("", "", "", new Date("2000-01-01"), new Date()).then(
        (msg) => {
          console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg));
          console.log("getCalendarOptions::"+ JSON.stringify(this.calendar.getCalendarOptions()));
          resolve(msg);
        },
        (err) => {
          console.log("执行查询本地日历结束 err ::" + JSON.stringify(err));
          reject(err);
        }
      );
    })

  }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEventRc(tit:string,sd:Date,ed:Date):Promise<Array<ScdData>>{
    return new Promise((resolve, reject) => {
      console.log("执行查询本地日历");
      let rco = new Array<ScdData>();
      if(this.util.isMobile()){
        console.log("查询本地日历开始时间："+ sd+ ",结束时间:"+ed);
        this.calendar.findEvent(tit, "", "", sd, ed).then(
          (msg) => {
            console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg));
            console.log("getCalendarOptions::"+ JSON.stringify(this.calendar.getCalendarOptions()));
            if(msg.length>0){
              for(let i=0;i<msg.length;i++) {
                let rc:ScdData = new ScdData();
                rc.ui = UserConfig.account.id;
                rc.sn = msg[i].title;
                console.log("查询本地日历是否全天：" + msg[i].allday);
                if (msg[i].allday) {
                  rc.sd = msg[i].startDate.substr(0, 10);
                  rc.st = "00:01";
                  rc.ed = msg[i].endDate.substr(0, 10);
                  rc.et =  "23:59";
                } else {
                  rc.sd = msg[i].startDate.substr(0, 10);
                  rc.st = msg[i].startDate.substr(11, 5);
                  rc.ed = msg[i].endDate.substr(0, 10);
                  rc.et = msg[i].endDate.substr(11, 5);
                }
                console.log("查询本地日历开始时间：" + rc.sd + ",结束时间:" + rc.ed);
                console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg[i]));
                rc.ib = '1';
                rco.push(rc);
              }
            }
            resolve(rco);
          },
          (err) => {
            console.log("执行查询本地日历结束 err ::" + JSON.stringify(err));
            reject(rco);
          });
      }else{
        resolve(rco);
      }
    })

  }




}
