import {Injectable} from "@angular/core";
import {DateModel, TimeModel} from "../model/time.model";
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

  currentDay: number;   //当前月日期
  weekDay: number;    //非当前月日期

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
    this.calendar = new CalendarModel();

    if (flag == 1) {
      if (month == 1) {
        this.calendar.year = year - 1;
        this.calendar.month = month + 11;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      } else {
        this.calendar.year = year;
        this.calendar.month = month - 1;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      }
    } else if (flag == 2) {
      if (month == 12) {
        this.calendar.year = year + 1;
        this.calendar.month = month - 11;
        this.calendar.dayList = this.getCalendar(this.calendar.year, this.calendar.month);
      } else {
        this.calendar.year = year;
        this.calendar.month = month + 1;
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

    this.addDayOfMonth(daySum, dayByWeek, year, month);
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
    let day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化
    let today = ["日","一","二","三","四","五","六"]; //创建星期数组
    return today[day.getDay()];  //返一个星期中的某一天，其中0为星期日
  }

  //添加日期
  private addDayOfMonth(daySum, dayByWeek, year, month) {

    this.list = [];
    let count;
    this.timeModel = new TimeModel();

    switch (dayByWeek) {
      case "日":
        count = 0;
        this.timeModel.date = [];
        break;
      case "一":
        count = 1;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "二":
        count = 2;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "三":
        count = 3;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "四":
        count = 4;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "五":
        count = 5;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "六":
        count = 6;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
    }

    for (var i = 1; i <= daySum; i++) {

      let day = new DateModel();
      day.day = i;
      day.month = month;
      day.year = year;

      day.isMonth = day.month == (new Date().getMonth() + 1);
      if (day.day == new Date().getDate()) {
        day.isToday = true;
        day.isActivity = true;
      } else {
        day.isToday = false;
        day.isActivity = false;
      }

      this.timeModel.date.push(day);
      if (i == daySum) {
        this.list.push(TimeService.completionDate(2, count, year, month, this.timeModel));
        break;
      }
      count++;
      if (count > 6) {
        count = 0;
        this.list.push(this.timeModel);
        this.timeModel = new TimeModel();
      }

    }

  }

  /**
   *
   * @param flag 1是向上月补全，2是向下月补全
   * @param count 0-6对应7天
   */
  private static completionDate(flag, count, year, month, timeModel: TimeModel) {

    let completion = new TimeModel();
    let daySum;
    let num;
    let yearCopy;
    let monthCopy;

    let date = new Date();

    if (flag == 1) {

      if (month == 1) {
        yearCopy = year - 1;
        monthCopy = month + 11;
        daySum = TimeService.mGetDate(yearCopy, monthCopy);
      } else {
        yearCopy = year;
        monthCopy = month - 1;
        daySum = TimeService.mGetDate(yearCopy, monthCopy);
      }
      for (let i = 0; i < count; i++) {
        num = daySum - (count - i - 1);
        let day = new DateModel();
        day.day = num;
        day.month = monthCopy;
        day.year = yearCopy;

        day.isMonth = day.month == (date.getMonth() + 1);
        if (day.day == date.getDate()) {
          day.isToday = true;
          day.isActivity = true;
        } else {
          day.isToday = false;
          day.isActivity = false;
        }

        completion.date.push(day);
      }

    } else if (flag == 2 && timeModel != null) {
      if (month == 12) {
        yearCopy = year + 1;
        monthCopy = month - 11;
      } else {
        yearCopy = year;
        monthCopy = month + 1;
      }
      for (let i = 0; i < (6 - count); i++) {
        num = i + 1;
        let day = new DateModel();
        day.day = num;
        day.month = monthCopy;
        day.year = yearCopy;

        day.isMonth = day.month == (date.getMonth() + 1);
        if (day.day == date.getDate()) {
          day.isToday = true;
          day.isActivity = true;
        } else {
          day.isToday = false;
          day.isActivity = false;
        }

        timeModel.date.push(day);
      }
      completion = timeModel;
    }
    return completion;
  }
  /**=========================== ===== 周 ===== start ==== ===================================**/

  getCalendarOfWeek(year, month) {

    this.calendar = new CalendarModel();

    this.weekDay = 1;
    this.currentDay = new Date().getDate();
    this.calendar.year = year;
    this.calendar.month = month;
    this.calendar.dayList = this.getWeekCalendar(this.calendar.year, this.calendar.month);

    return this.calendar;
  }

  nextOrPrevWeek(flag, startDate: DateModel, endDate: DateModel) {
    this.calendar = new CalendarModel();

    //1前2后
    if (flag == 1) {
      if(startDate.day == 1) {    //开始日期是否是1号
        if (startDate.month == 1) {   //开始月份是否是1月
          this.calendar.year = startDate.year - 1;
        } else {
          this.calendar.year = startDate.year;
        }
        this.calendar.month = startDate.month - 1;
        this.weekDay = TimeService.mGetDate(this.calendar.year, this.calendar.month);
        this.currentDay = TimeService.mGetDate(this.calendar.year, this.calendar.month);
      } else {
        this.weekDay = startDate.day - 1;
        this.currentDay = startDate.day - 1;
        this.calendar.year = startDate.year;
        this.calendar.month = startDate.month;
      }

      this.calendar.dayList = this.getWeekCalendar(this.calendar.year, this.calendar.month);
    } else if (flag == 2) {
      if (endDate.day == TimeService.mGetDate(endDate.year, endDate.month)) { //结束日期是否是最后一天
        if (endDate.month == 12) {    //开始月份是否是12月
          this.calendar.year = endDate.year + 1;
        } else {
          this.calendar.year = endDate.year;
        }
        this.weekDay = 1;
        this.currentDay = 1;
        this.calendar.month = endDate.month + 1;
      } else {
        this.weekDay = endDate.day + 1;
        this.currentDay = endDate.day + 1;
        this.calendar.year = endDate.year;
        this.calendar.month = endDate.month;
      }

      this.calendar.dayList = this.getWeekCalendar(this.calendar.year, this.calendar.month);
    }

    return this.calendar;
  }

  //获取日历
  private getWeekCalendar(year, month) {

    let time = [];

    const daySum = TimeService.mGetDate(year, month);
    console.log("daySum:" + daySum);

    const dayByWeek = TimeService.getWeekByDay(year.toString() + "-" + month.toString() + "-" + "1");
    console.log("dayByWeek:" + dayByWeek);

    this.addDayOfWeek(daySum, dayByWeek, year, month);
    console.log("list:" + this.list);

    time = this.list;

    return time;
  }

  //添加日期
  private addDayOfWeek(daySum, dayByWeek, year, month) {

    this.list = [];
    let month_sys = new Date().getMonth() + 1;
    let count;
    this.timeModel = new TimeModel();
    let flag = false;
    let flagWeek = false;

    switch (dayByWeek) {
      case "日":
        count = 0;
        this.timeModel.date = [];
        break;
      case "一":
        count = 1;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "二":
        count = 2;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "三":
        count = 3;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "四":
        count = 4;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "五":
        count = 5;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
      case "六":
        count = 6;
        this.timeModel = TimeService.completionDate(1, count, year, month, null);
        break;
    }

    for (var i = 1; i <= daySum; i++) {

      let day_date = new DateModel();
      day_date.day = i;
      day_date.month = month;
      day_date.year = year;
      if (i == this.currentDay && month == month_sys) {
        flag = true;
      }
      if (i == this.weekDay && month != month_sys) {
        flagWeek = true;
      }

      day_date.isMonth = day_date.month == (new Date().getMonth() + 1);
      if (day_date.day == new Date().getDate()) {
        day_date.isToday = true;
        day_date.isActivity = true;
      } else {
        day_date.isToday = false;
        day_date.isActivity = false;
      }

      this.timeModel.date.push(day_date);
      if (i == daySum) {
        this.list.push(TimeService.completionDate(2, count, year, month, this.timeModel));
        break;
      }
      count++;
      if (count > 6) {
        count = 0;
        if (flagWeek == true) {
          this.list.push(this.timeModel);
          this.timeModel = new TimeModel();
          break;
        }
        if (flag == true) {
          this.list.push(this.timeModel);
          this.timeModel = new TimeModel();
          break;
        }
        this.timeModel = new TimeModel();
      }

    }

  }
}
