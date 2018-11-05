import {EventEmitter, Injectable} from '@angular/core';
import {HomeWorkListPage} from "../pages/home-work-list/home-work-list";
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
}
