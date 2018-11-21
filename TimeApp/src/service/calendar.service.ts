import {EventEmitter, Injectable} from '@angular/core';
import {HomeWorkListPage} from "../pages/home-work-list/home-work-list";
import {Calendar} from "@ionic-native/calendar";

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

  public getSelectDay(obj:HomeWorkListPage){
    this.selectDay.subscribe(($event)=>{
      obj.findTodaySchedule($event);
    })
  }

  constructor(private calendar: Calendar) { }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      this.calendar.findEvent("", "", "", new Date("1900-01-01"), new Date("2118-12-31")).then(
        (msg) => {
          alert(JSON.stringify(msg));
          resolve(msg);
        },
        (err) => {
          reject(err);
        }
      );
    })

  }
}
