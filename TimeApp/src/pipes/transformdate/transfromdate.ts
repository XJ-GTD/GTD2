import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'transfromdate',
})
export class TransFromDatePipe implements PipeTransform {


  rang: number = 1000 * 60 * 60 * 24;

  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {

    let formart = args[0];
    if (formart == "duration") {
      return moment.duration(value, "minutes").humanize() ? moment.duration(value, "minutes").humanize() : "";
    }
    let m = moment(value);
    if (!m.isValid()) {
      m = moment(value, "YYYY/MM")
    }
    if (!m.isValid()) {
      m = moment(value, "YYYYMM")
    }
    if (!m.isValid() || args.length < 1) {
      return value;
    }

    if (formart == "CSSMM") {
      switch (m.format("M")) {
        case "1":
          return "month1";
        case "2":
          return  "month2";
        case "3":
          return "month3";
        case "4":
          return  "month4";
        case "5":
          return  "month5";
        case "6":
          return  "month6";
        case "7":
          return  "month7";
        case "8":
          return "month8";
        case "9":
          return "month9";
        case "10":
          return "month10";
        case "11":
          return "month11";
        case "12":
          return "month12";
        default:
          return "month6";
      }
    }

    if (formart == "CYYYY年MM月DD日 A h:mm") {
      let currentDay = m;
      let today = moment();
      let yestoday = moment().subtract(1, "days");
      let tomorrow = moment().add(1, "days");

      //today
      if (today.format("YYYY/MM/DD") == currentDay.format("YYYY/MM/DD")) {
        return currentDay.format("A h:mm");
      }

      //yestoday
      if (yestoday.format("YYYY/MM/DD") == currentDay.format("YYYY/MM/DD")) {
        return "昨天 " + currentDay.format("A h:mm");
      }

      //tomorrow
      if (tomorrow.format("YYYY/MM/DD") == currentDay.format("YYYY/MM/DD")) {
        return "明天 " + currentDay.format("A h:mm");
      }

      //sameyear
      if (today.format("YYYY") == currentDay.format("YYYY")) {
        return currentDay.format("M月D日 A h:mm");
      }

      //otheryear
      if (today.format("YYYY") != currentDay.format("YYYY")) {
        return currentDay.format("YYYY年M月D日 A h:mm");
      }
    }

    if (formart == "withNow") {
      if (m.diff(moment()) > 0) {
        return m.fromNow(true) + "后";
      } else if (m.diff(moment()) < 0) {
        return m.toNow(true) + "前";
      } else {
        return m.toNow(true);
      }
    }

    if (formart == "withNowcss") {

      let n = moment().diff(m);

      if (n > this.rang) {
        return "fal fa-hourglass-start after";
      } else if (n < this.rang * -1) {
        return "fal fa-hourglass-end before";
      } else {
        return "fal fa-hourglass-half current";
      }
    }

  }
}
