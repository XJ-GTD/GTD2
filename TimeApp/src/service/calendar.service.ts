import {EventEmitter, Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Ha01Page} from "../pages/ha01/ha01";
import {UtilService} from "./util-service/util.service";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {PlayerService} from "./player.service";
import {BsModel} from "../model/out/bs.model";
import {UserService} from "./user.service";
import {RcEntity} from "../entity/rc.entity";
import {RcpEntity} from "../entity/rcp.entity";

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
   * 同步本地日历入库
   * @returns {Promise<BsModel>}
   */
  uploadLocal():Promise<BsModel>{
    return new Promise((resolve,reject)=>{
      let uI = '';
      let model = new BsModel();
      let rcs = new Array<RcEntity>();
      let rcps = new Array<RcpEntity>();
      this.userService.getUo().then(data=>{
        console.log("calendarService ::"+"查询用户信息成功");
        if(data&&data.u&&data.u.uI){
          uI=data.u.uI;
        }
        return this.findEvent();
      }).then(data=>{
        console.log("calendarService ::"+"查询本地日历成功");
        //this.findEvent返回msg
        let arr = [];
        for(let i=0;i<data.length;i++) {
          //判断是否存在 rcp 与 rc
          //逻辑 查rcp 查rc 改rc 改 rcp
          arr.push(this.checkInfo(uI,data[i].id,data[i].title,data[i].startDate,data.endDate));
        }
        return Promise.all(arr);
      }).then(data=>{
        console.log("calendarService ::"+"导入本地日历成功");
        console.log("calendarService ::" + JSON.stringify(data));
        resolve(model);
      }).catch(err => {
        console.log("calendarService ::"+"导入本地日历失败");
        model.code = 1;
        model.message = "失败";
        reject(model);
      })
    })
  }

  checkInfo(uI:string,id:string,title:string,startDate:string,endDate:string):Promise<any>{
    return new Promise((resolve ,reject)=>{
      this.playService.getPlayer(null,null,null,uI,null,null,null,null,null,null,null,null,null,"1",id).then(data=>{
        let rcps = [];
        if(data.code == 0){
          rcps = data.rcps;
          if( rcps.length > 0){
            //存在相同的数据
            let rcp:RcpEntity = rcps[0];
            return this.playService.updatePlayer(rcp.sI,title,"",uI,startDate,endDate,this.util.getUuid(),
              title,rcp.sa,rcp.ps,startDate,rcp.pd,uI,"1",id);

          }else{
            return this.playService.addPlayer(this.util.getUuid(),title,"",uI,startDate,endDate,this.util.getUuid(),
              title,"","",startDate,"",uI,"1",id);
          }
        }

      }).then(data=>{
        resolve(data)
      }).catch(reason => {
        reject(reason)
      })
    })
  }

}
