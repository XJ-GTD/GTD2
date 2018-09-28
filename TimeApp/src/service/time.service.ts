import {Injectable} from "@angular/core";
import {TimeModel} from "../model/time.model";
import {CalendarModel} from "../model/calendar.model";


/**
 * 首页日历方法
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class TimeService {

  list: Array<TimeModel>;
  timeModel: TimeModel;

  calendarList: Array<CalendarModel>;
  calendar: CalendarModel;

  constructor(){
  }

  calendarInit() {
    //初始化加载日历控件
    let today = new Date();

    this.calendar = new CalendarModel();

    this.calendar.year = today.getFullYear();
    this.calendar.month = today.getMonth() + 1;

    this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);

    return this.calendar;
  }

  nextOrPrev(flag, year, month) {

    if (flag == 1) {
      if (this.calendar.month == 1) {
        this.calendar.year = this.calendar.year - 1;
        this.calendar.month = this.calendar.month + 11;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      } else {
        this.calendar.month = this.calendar.month - 1;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      }
    } else if (flag == 2) {
      if (this.calendar.month == 12) {
        this.calendar.year = this.calendar.year + 1;
        this.calendar.month = this.calendar.month - 11;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      } else {
        this.calendar.month = this.calendar.month + 1;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      }
    }

    return this.calendar;
  }

  //获取日历
  private getCalendar(year, month) {

    let time = [];

    const daySum = TimeService.mGetDate(year, month);
    console.log("daySum:" + daySum);

    const dayByWeek = TimeService.getWeekByDay(year.toString() + "-" + month.toString() + "-" + "1");
    console.log("dayByWeek:" + dayByWeek);

    this.addDayOfMonth(daySum, dayByWeek);
    console.log("list:" + this.list);

    time = this.list;

    return time;
  }

  //获取当月总天数
  private static mGetDate(year, month){
    console.log("year:" + year + "| month:" + month);
    var d = new Date(year, month, 0);
    return d.getDate();
  }

  //获取1号为星期几
  private static getWeekByDay(dayValue){ //dayValue=“2014-01-01”
    console.log("dayvalue:" + dayValue);
    var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
    var today = ["日","一","二","三","四","五","六"]; //创建星期数组
    return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日
  }

  //添加日期
  private addDayOfMonth(daySum, dayByWeek) {

    this.list = [];
    let count;
    this.timeModel = new TimeModel();

    switch (dayByWeek) {
      case "日":
        this.timeModel.day = [];
        count = 0;
        break;
      case "一":
        this.timeModel.day = [" "];
        count = 1;
        break;
      case "二":
        this.timeModel.day = [" "," "];
        count = 2;
        break;
      case "三":
        this.timeModel.day = [" "," "," "];
        count = 3;
        break;
      case "四":
        this.timeModel.day = [" "," "," "," "];
        count = 4;
        break;
      case "五":
        this.timeModel.day = [" "," "," "," "," "];
        count = 5;
        break;
      case "六":
        this.timeModel.day = [" "," "," "," "," "," "];
        count = 6;
        break;
    }

    for (var i = 1; i <= daySum; i++) {

      this.timeModel.day.push(i.toString());
      count++;
      if (i == daySum) {
        this.list.push(this.timeModel);
      }
      if (count > 6) {
        count = 0;
        this.list.push(this.timeModel);
        this.timeModel = new TimeModel();
      }

    }

  }

  getOtherMonth(dayByWeek) {


  }

  /**=========================== ===== 周===================================**/

  getCalendarOfWeek(daySum, dayByWeek) {
    this.list = [];
    let count;
    this.timeModel = new TimeModel();
    switch (dayByWeek) {
      case "日":
        this.timeModel.day = [];
        count = 0;
        break;
      case "一":
        this.timeModel.day = [" "];
        count = 1;
        break;
      case "二":
        this.timeModel.day = [" "," "];
        count = 2;
        break;
      case "三":
        this.timeModel.day = [" "," "," "];
        count = 3;
        break;
      case "四":
        this.timeModel.day = [" "," "," "," "];
        count = 4;
        break;
      case "五":
        this.timeModel.day = [" "," "," "," "," "];
        count = 5;
        break;
      case "六":
        this.timeModel.day = [" "," "," "," "," "," "];
        count = 6;
        break;
    }

    for (var i = 1; i <= daySum; i++) {

      this.timeModel.day.push(i.toString());
      count++;
      if (i == daySum) {
        this.list.push(this.timeModel);
      }
      if (count > 6) {
        count = 0;
        this.timeModel = new TimeModel();
      }

    }
  }

}
