import {Injectable} from '@angular/core';
import {isBoolean} from "ionic-angular/util/util";
import {
  CalendarOriginal,
  CalendarDay,
  CalendarMonth,
  CalendarModalOptions,
  CalendarResult,
  DayConfig
} from '../calendar.model'
import * as moment from 'moment';
import {defaults, pickModes} from "../config";
import {SqliteExec} from "../../../service/util-service/sqlite.exec";
import {LocalcalendarService} from "../../../service/cordova/localcalendar.service";

@Injectable()
export class CalendarService {

  constructor(private sqlite:SqliteExec,private readlocal:LocalcalendarService) {}

  safeOpt(calendarOptions: any): CalendarModalOptions {
    const _disableWeeks: number[] = [];
    const _daysConfig: DayConfig[] = [];
    const _dayMapConfig:Map<Date,DayConfig> = new Map<Date,DayConfig>();
    let {
      from = new Date(),
      to = 0,
      weekStart = 0,
      step = 3,
      id = '',
      cssClass = '',
      closeLabel = 'CANCEL',
      doneLabel = 'DONE',
      monthFormat = 'MMM YYYY',
      title = 'CALENDAR',
      defaultTitle = '',
      defaultSubtitle = '',
      autoDone = false,
      canBackwardsSelected = false,
      closeIcon = false,
      doneIcon = false,
      showYearPicker = false,
      isSaveHistory = false,
      pickMode = pickModes.SINGLE,
      color = defaults.COLOR,
      weekdays = defaults.WEEKS_FORMAT,
      daysConfig = _daysConfig,
      daysConfigCopy = _dayMapConfig,
      disableWeeks = _disableWeeks,
      showAdjacentMonthDay = true
    } = calendarOptions || {};

    return {
      id,
      from,
      to,
      pickMode,
      autoDone,
      color,
      cssClass,
      weekStart,
      closeLabel,
      closeIcon,
      doneLabel,
      doneIcon,
      canBackwardsSelected,
      isSaveHistory,
      disableWeeks,
      monthFormat,
      title,
      weekdays,
      daysConfig,
      step,
      showYearPicker,
      defaultTitle,
      defaultSubtitle,
      defaultScrollTo: calendarOptions.defaultScrollTo || from,
      defaultDate: calendarOptions.defaultDate || null,
      defaultDates: calendarOptions.defaultDates || null,
      defaultDateRange: calendarOptions.defaultDateRange || null,
      showAdjacentMonthDay
    }
  }

  createOriginalCalendar(time: number): CalendarOriginal {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeek = new Date(year, month, 1).getDay();
    const howManyDays = moment(time).daysInMonth();
    return {
      year,
      month,
      firstWeek,
      howManyDays,
      time: new Date(year, month, 1).getTime(),
      date: new Date(time)
    }
  }

  findDayConfig(day: any, opt: CalendarModalOptions): DayConfig {

    if (opt.daysConfig.length <= 0) return null;
    return opt.daysConfig.find((n) => day.isSame(n.date, 'day'))
  }


  createCalendarDay(time: number, opt: CalendarModalOptions, month?: number): CalendarDay {
    let _time = moment(time);
    let date = moment(time);
    let isToday = moment().isSame(_time, 'days');
    let dayConfig = this.findDayConfig(_time, opt);
    let _rangeBeg = moment(opt.from).valueOf();
    let _rangeEnd = moment(opt.to).valueOf();
    let isBetween = false;
    let disableWee = opt.disableWeeks.indexOf(_time.toDate().getDay()) !== -1;
    if (_rangeBeg > 0 && _rangeEnd > 0) {
      if (!opt.canBackwardsSelected) {
        isBetween = !_time.isBetween(_rangeBeg, _rangeEnd, 'days', '[]');
      } else {
        isBetween = moment(_time).isBefore(_rangeBeg) ? false : isBetween;
      }
    } else if (_rangeBeg > 0 && _rangeEnd === 0) {

      if (!opt.canBackwardsSelected) {
        let _addTime = _time.add(1, 'day');
        isBetween = !_addTime.isAfter(_rangeBeg);
      } else {
        isBetween = false;
      }
    }

    let _disable = false;

    if (dayConfig && isBoolean(dayConfig.disable)) {
      _disable = dayConfig.disable;
    } else {
      _disable = disableWee || isBetween;
    }

    let title = new Date(time).getDate().toString();
    if (dayConfig && dayConfig.title) {
      title = dayConfig.title
    } else if (opt.defaultTitle) {
      title = opt.defaultTitle
    }
    let subTitle = '';
    if (dayConfig && dayConfig.subTitle) {
      subTitle = dayConfig.subTitle
    } else if (opt.defaultSubtitle) {
      subTitle = opt.defaultSubtitle
    }

    return {
      time,
      isToday,
      title,
      subTitle,
      selected: false,
      isLastMonth: date.month() < month,
      isNextMonth: date.month() > month,
      marked: dayConfig ? dayConfig.marked || false : false,
      cssClass: dayConfig ? dayConfig.cssClass || '' : '',
      disable: _disable,
      isFirst: date.date() === 1,
      isLast: date.date() === date.daysInMonth(),
      hasting: dayConfig ? dayConfig.hasting || false : false,
      things: dayConfig ? dayConfig.things || 0 : 0,
      newmessage: dayConfig ? dayConfig.newmessage || 0 : 0,
      hassometing: dayConfig ? dayConfig.hassometing || false : false,
      busysometing: dayConfig ? dayConfig.busysometing || false : false,
    }
  }

  createCalendarMonth(original: CalendarOriginal, opt: CalendarModalOptions): CalendarMonth {
    let days: Array<CalendarDay> = new Array(6).fill(null);
    let len = original.howManyDays;
    for (let i = original.firstWeek; i < len + original.firstWeek; i++) {
      let itemTime = new Date(original.year, original.month, i - original.firstWeek + 1).getTime();
      days[i] = this.createCalendarDay(itemTime, opt);
    }

    let weekStart = opt.weekStart;

    if (weekStart === 1) {
      if (days[0] === null) {
        days.shift();
      } else {
        days.unshift(...new Array(6).fill(null));
      }
    }

    if (opt.showAdjacentMonthDay) {
      const _booleanMap = days.map(e => !!e);
      const thisMonth = moment(original.time).month();
      let startOffsetIndex = _booleanMap.indexOf(true) - 1;
      let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
      for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
        const dayBefore = moment(days[startOffsetIndex + 1].time).clone().subtract(1, 'd');
        days[startOffsetIndex] = this.createCalendarDay(dayBefore.valueOf(), opt, thisMonth);
      }

      if (!(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])) {
        for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
          const dayAfter = moment(days[endOffsetIndex - 1].time).clone().add(1, 'd');
          days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);
        }
      }
      //补齐6行 by zhangjy
      // if (days.length == 35){
      //   for (endOffsetIndex; endOffsetIndex < 35 +  7; endOffsetIndex++) {
      //     const dayAfter = moment(days[endOffsetIndex - 1].time).clone().add(1, 'd');
      //     days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);
      //   }
      // }
    }

    return {
      days,
      original: original
    }

  }

  createMonthsByPeriod(startTime: number, monthsNum: number, opt: CalendarModalOptions): Array<CalendarMonth> {
    let _array: Array<CalendarMonth> = [];

    let _start = new Date(startTime);
    let _startMonth = new Date(_start.getFullYear(), _start.getMonth(), 1).getTime();

    for (let i = 0; i < monthsNum; i++) {
      let time = moment(_startMonth).add(i, 'M').valueOf();
      let originalCalendar = this.createOriginalCalendar(time);
      _array.push(this.createCalendarMonth(originalCalendar, opt))
    }

    return _array;
  }

  wrapResult(original: CalendarDay[], pickMode: string) {
    let result: any;
    switch (pickMode) {
      case pickModes.SINGLE:
        result = this.multiFormat(original[0].time);
        break;
      case pickModes.RANGE:
        result = {
          from: this.multiFormat(original[0].time),
          to: this.multiFormat(original[1].time)
        };
        break;
      case pickModes.MULTI:
        result = original.map(e => this.multiFormat(e.time));
        break;
      default:
        result = original;
    }
    return result;
  }

  multiFormat(time: number): CalendarResult {
    const _moment = moment(time);
    return {
      time: _moment.valueOf(),
      unix: _moment.unix(),
      dateObj: _moment.toDate(),
      string: _moment.format(defaults.DATE_FORMAT),
      years: _moment.year(),
      months: _moment.month() + 1,
      date: _moment.date()
    }
  }



  async getMonthData(month:CalendarMonth){

    let _start = new Date(month.original.time);
    let _startMonth = moment(moment(_start).format("YYYY/MM/") + "1");
    let _endMonth = moment(moment(_start).format("YYYY/MM/") + _startMonth.daysInMonth());

    let sql:string = "select sd,count(*) scds,sum(itx) news from gtd_sp where sd>='" + moment(_startMonth).format("YYYY/MM/DD")+ "' and sd<='" +  moment(_endMonth).format("YYYY/MM/DD") + "' group by sd";

    let local = await this.readlocal.findEventRc('',_startMonth,_endMonth);
    this.sqlite.getExtList<MonthData>(sql).then(data=>{

      //本地日历加入主页日历显示中
      for(let lo of local){
        let md:MonthData = data.find((n) => moment(lo.sd).isSame(moment(n.sd), 'day'));
        if (md){
          md.scds = md.scds + 1;
        }else{
          md = new MonthData();
          md.sd=lo.sd;
          md.scds=1;
          md.news=0;
          data.push(md);
        }
      }
      for (let d of data){
        let calendarDay:CalendarDay = month.days.find((n) => moment(d.sd).isSame(moment(n.time), 'day'));

        calendarDay.things = d.scds;
        calendarDay.hassometing = d.scds < 3;
        calendarDay.busysometing = d.scds >= 3;
        calendarDay.newmessage = d.news
        calendarDay.hasting = d.scds > 0;
        //calendarDay.subTitle = d.news > 0? `\u2022`: "";
        calendarDay.marked = false;
      }
    })
  }


}
class MonthData{
 sd:string;
 scds:number;
 news:number;
}
