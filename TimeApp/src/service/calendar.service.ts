import {EventEmitter, Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Ha01Page} from "../pages/ha01/ha01";
import {RcEntity} from "../entity/rc.entity";
import {RcpEntity} from "../entity/rcp.entity";
import {UtilService} from "./util-service/util.service";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";
import {PlayerService} from "./player.service";
import {BsModel} from "../model/out/bs.model";
import {UserService} from "./user.service";

/**
 * 页面ts传值(Calendar)
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class CalendarService {

  private selectDay: EventEmitter<any> = new EventEmitter();

  public setSelectDay($event){
    this.selectDay.emit($event);
  }

  public getSelectDay(obj:Ha01Page){
    this.selectDay.subscribe(($event)=>{
      obj.findTodaySchedule($event);
    })
  }

  constructor(private calendar: Calendar,
              private util:UtilService,
              private baseSqlite:BaseSqliteService,
              private userService:UserService,
              private playService:PlayerService) { }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      this.calendar.findEvent("", "", "", new Date("2018-12-01"), new Date("2118-12-31")).then(
        (msg) => {
          //alert(JSON.stringify(msg));
          resolve(msg);
        },
        (err) => {
          reject(err);
        }
      );
    })

  }

  //同步本地日历日程
  uploadLocal():Promise<BsModel>{

      // //查询用户
      // return this.userService.getUo().then(data=> {
      //   if (data && data.u && data.u.uI) {
      //     uI = data.u.uI;
      //   }
      // })

      return this.calendar.findEvent("", "", "", new Date("2018-12-01"), new Date("2118-12-31")).then((data)=>{
        let calendars=data;
        return this.playService.initfirst(calendars);
      });

  }

  //同步本地日历日程
  uploadLocal1():Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      //查询用户
      this.userService.getUo().then(data=>{
        let uI = ''
        if(data&&data.u&&data.u.uI){
          uI=data.u.uI;
        }
        this.findEvent().then(msg=>{

          let data=eval(msg);

          for(let i=0;i<data.length;i++) {

            this.playService.addPlayer(this.util.getUuid(),data[i].title,"",uI,data[i].startDate,data[i].endDate,this.util.getUuid(),data[i].title,"","",data[i].startDate,"",uI,"1").then(base=>{
              resolve(base);
            })
              .catch(e=>{
                reject(e);
              });

          }
        }).catch(err=>{
          //alert("err");
          //alert(err);
        });
      }).catch(ue=>{
        alert("CalendarService获取用户失败：" + ue.message);
      })

    })
    }

}
