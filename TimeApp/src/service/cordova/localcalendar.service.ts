import { EventEmitter, Injectable } from '@angular/core';
import { Calendar } from "@ionic-native/calendar";
import {UtilService} from "../util-service/util.service";
import {ScdData} from "../pagecom/pgbusi.service";
import {UserConfig} from "../config/user.config";
import * as moment from "moment";

/**
 * 页面ts传值(Calendar)
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class LocalcalendarService {

  constructor(private calendar: Calendar,private util:UtilService ) { }
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
  findEventRc(tit:string,sd:moment.Moment,ed:moment.Moment):Promise<Array<ScdData>>{
    return new Promise((resolve, reject) => {
      //ed = ed.add(1,'d');
      let rco = new Array<ScdData>();
      if(this.util.isMobile()){
        this.calendar.findEvent(tit, "", "", sd.toDate(), ed.add(1,"d").toDate()).then(
          (msg) => {
            //TODO 本地日历问题很多，先注释
            // if(msg.length>0){
            //   for(let i=0;i<msg.length;i++) {
            //     let rc:ScdData = new ScdData();
            //     rc.ui = UserConfig.account.id;
            //     rc.sn = msg[i].title;
            //     if (msg[i].allday) {
            //       if (msg[i].startDate) {
            //         rc.sd = msg[i].startDate.substr(0, 10).replace(new RegExp('-','g'),'/');
            //         rc.st = "99:99";
            //       }
            //       if (msg[i].endDate) {
            //         rc.ed = msg[i].endDate.substr(0, 10).replace(new RegExp('-','g'),'/');
            //         rc.et =  "99:99";
            //       }
            //       if (msg[i].startDate && !msg[i].endDate) {
            //         rc.ed = rc.sd;
            //         rc.et = "99:99";
            //       }
            //       if (!msg[i].startDate && msg[i].endDate) {
            //         rc.sd = rc.ed;
            //         rc.st = "99:99";
            //       }
            //     } else {
            //       if (msg[i].startDate) {
            //         rc.sd = msg[i].startDate.substr(0, 10).replace(new RegExp('-','g'),'/');
            //         rc.st = msg[i].startDate.substr(11, 5);
            //       }
            //       if (msg[i].endDate) {
            //         rc.ed = msg[i].endDate.substr(0, 10).replace(new RegExp('-','g'),'/');
            //         rc.et = msg[i].endDate.substr(11, 5);
            //       }
            //       if (msg[i].startDate && !msg[i].endDate) {
            //         rc.ed = rc.sd;
            //         rc.et = "24:00";
            //       }
            //       if (!msg[i].startDate && msg[i].endDate) {
            //         rc.sd = rc.ed;
            //         rc.st = "00:00";
            //       }
            //     }
            //     rc.ib = '1';
            //     rc.gs='2';
            //     rco.push(rc);
            //   }
            // }
            resolve(rco);
          },
          (err) => {
            resolve(rco);
          });
      }else{
        resolve(rco);
      }
    })

  }


}
