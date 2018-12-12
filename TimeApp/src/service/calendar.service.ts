import {EventEmitter, Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Ha01Page} from "../pages/ha01/ha01";
import {UtilService} from "./util-service/util.service";
import {BaseSqlite} from "./sqlite/base-sqlite";
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
              private baseSqlite:BaseSqlite,
              private userService:UserService,
              private playService:PlayerService) { }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      console.log("执行查询本地日历")
      this.calendar.findEvent("", "", "", new Date("2018-12-01"), new Date("2118-12-31")).then(
        (msg) => {
          console.log("执行查询本地日历结束");
          resolve(msg);

        },
        (err) => {
          console.log("执行查询本地日历结束B::" + JSON.stringify(err));
          reject(err);
        }
      );
    })

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


  /**
   * 同步本地日历日程
   *
   */
  uploadLocal2():Promise<BsModel>{
    return new Promise((resolve,reject)=>{
      let uI = '';
      let model = new BsModel();
      this.userService.getUo().then(data=>{
        console.log("calendarService ::"+"查询用户信息成功");
        console.log(1);
        if(data&&data.u&&data.u.uI){
          uI=data.u.uI;
        }
        return this.findEvent()
      }).then(data=>{
        console.log("calendarService ::"+"查询本地日历成功");
        console.log(2);
        //this.findEvent返回msg
        let arr = [];
        for(let i=0;i<data.length;i++) {
          arr.push(this.playService.addPlayer(this.util.getUuid(),data[i].title,"",uI,data[i].startDate,data[i].endDate,this.util.getUuid(),data[i].title,"","",data[i].startDate,"",uI,"1"));
        }
        return Promise.all(arr);
      }).then(data=>{
        console.log("calendarService ::"+"导入本地日历成功");
        console.log(3);
        console.log(JSON.stringify(data));
        resolve(model);
      }).catch(err => {
        console.log("calendarService ::"+"导入本地日历失败");
        model.code = 1;
        model.message = "失败";
        resolve(model);
      });
      return;
    });
  }
}
