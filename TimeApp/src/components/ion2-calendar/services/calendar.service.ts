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
import {AgdbusiService} from "../../../service/util-service/agdbusi.service";
import {ScdData} from "../../../pages/tdl/tdl.service";

@Injectable()
export class CalendarService {

  constructor(
    private busiService: AgdbusiService
  ) {

  }

  safeOpt(calendarOptions: any): CalendarModalOptions {
    const _disableWeeks: number[] = [];
    const _daysConfig: DayConfig[] = [];
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
    let isBetween = true;
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


  dayConfigMonth(start: string, end: string): Promise<Array<DayConfig>> {
    return new Promise<Array<DayConfig>>((resolve, reject) => {
      this.busiService.getRegionAgd(start, end).then(d => {
        let dayConfig: Array<DayConfig> = new Array<DayConfig>();
        d.data.forEach( (value, key, map) =>{
          dayConfig.push(this.traDayConfig(value, key.format("YYYY/MM/DD")));
        });
        resolve(dayConfig);
      })
    });
  }

  traDayConfig(s: Array<ScdData>, day): DayConfig {
    let dayConfig: DayConfig = new class implements DayConfig {
      busysometing: boolean;
      cssClass: string;
      date: Date;
      disable: boolean;
      hassometing: boolean;
      hasting: boolean;
      marked: boolean;
      newmessage: number;
      subTitle: string;
      things: number;
      title: string;
    }

    if (!s) {
      return dayConfig;
    }
    let thing: number = s.length;
    let cssClass: string = "";
    let newmessage: number = 0;
    if (thing > 0) {
      cssClass = "hassometing";
    } else if (thing > 5) {
      cssClass = "busysometing";
    }
    for (let scdData of s) {
      if (scdData.du == "0") {
        newmessage++;
      }
    }
    dayConfig.date = moment(day).toDate();
    dayConfig.disable = false;
    dayConfig.cssClass = cssClass;
    dayConfig.hasting = thing > 0;
    dayConfig.marked = false;
    dayConfig.newmessage = newmessage;
    dayConfig.subTitle = newmessage > 0 ? `\u2022` : "";
    dayConfig.things = thing;
    dayConfig.title = new Date(moment(day).valueOf()).getDate().toString();
    dayConfig.marked = false;
    dayConfig.busysometing = cssClass == "busysometing";
    dayConfig.hassometing = cssClass == "hassometing";
    return dayConfig;

  }


  // findDayEventForMonth(start: string, end: string): Promise<Array<CalendarDay>> {
  //   return new Promise<Array<CalendarDay>>((resolve, reject) => {
  //     this.busiService.getRegionAgd(start, end).then(d => {
  //       let calendardays: Array<CalendarDay> = new Array<CalendarDay>();
  //       d.data.forEach( (value, key, map) =>{
  //         calendardays.push(this.34(value, key.format("YYYY/MM/DD")));
  //       });
  //       resolve(calendardays);
  //     })
  //   });
  // }
  //
  // //参数 ‘YYYY/MM/DD’
  // findDayEventForDay(day: string): Promise<CalendarDay> {
  //   return new Promise<CalendarDay>((resolve, reject) => {
  //     this.busiService.getOdAgd(day).then(localDay => {
  //
  //       resolve(this.34(localDay.data, day));
  //     })
  //   });
  // }
  //
  // customCalendarDay(s: Array<ScdData>, day): CalendarDay {
  //   let calendarDay: CalendarDay = new class implements CalendarDay {
  //     busysometing: boolean;
  //     cssClass: string;
  //     disable: boolean;
  //     hassometing: boolean;
  //     hasting: boolean;
  //     isFirst: boolean;
  //     isLast: boolean;
  //     isLastMonth: boolean;
  //     isNextMonth: boolean;
  //     isToday: boolean;
  //     marked: boolean;
  //     newmessage: number;
  //     selected: boolean;
  //     style: { title?: string; subTitle?: string };
  //     subTitle: string;
  //     things: number;
  //     time: number;
  //     title: string;
  //   }
  //
  //   if (!s) {
  //     return calendarDay;
  //   }
  //   let thing: number = s.length;
  //   let cssClass: string = "";
  //   let newmessage: number = 0;
  //   if (thing > 0) {
  //     cssClass = "hassometing";
  //   } else if (thing > 5) {
  //     cssClass = "busysometing";
  //   }
  //   for (let scdData of s) {
  //     if (scdData.du == "0") {
  //       newmessage++;
  //     }
  //   }
  //   calendarDay.time = moment(day).valueOf();
  //   calendarDay.disable = false;
  //   calendarDay.cssClass = cssClass;
  //   calendarDay.hasting = thing > 0;
  //   calendarDay.marked = false;
  //   calendarDay.newmessage = newmessage;
  //   calendarDay.subTitle = newmessage > 0 ? `\u2022` : "";
  //   calendarDay.things = thing;
  //   calendarDay.title = new Date(moment(day).valueOf()).getDate().toString();
  //   calendarDay.isToday = moment().isSame(calendarDay.time, 'days');
  //   calendarDay.marked = false;
  //   calendarDay.busysometing = cssClass == "busysometing";
  //   calendarDay.hassometing = cssClass == "hassometing";
  //   return calendarDay;
  //
  // }


}
