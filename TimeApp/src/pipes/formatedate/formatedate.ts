import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatedate',
})
export class FormatedatePipe implements PipeTransform {


  rang:number = 1000*60*60*24;
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (moment(value)+"" == "NaN"){
      return value;
    }

    if (args.length ==1 ){
      if (args[0] == "ADD7CYYYY/MM/DD") {
        return moment(value).add(7, "days").format("YYYY年MM月DD日");
      }
      if (args[0] == "YYYYMMDD") {
        return moment(value).format("YYYYMMDD");
      }
      if (args[0] == "YYYYMM") {
        return moment(value + "/01").format("YYYYMM");
      }

      if (args[0] == "CYYYY/MM/DD"){
        return moment(value).format("YYYY年MM月DD日");
      }
      if (args[0] == "CYYYY/M/DD"){
        return moment(value).format("YYYY年M月DD日");
      }

      if (args[0] == "CYYYY/MM"){
        return moment(value).format("YYYY年MM月");
      }
      if (args[0] == "CMM"){
        return moment(value).format("MM月");
      }
      if (args[0] == "CSSMM"){
        let ret;
        switch (moment(value,"YYYYMM").format("M")) {
          case "1":
            ret = "month1";
            break;
          case "2":
            ret =  "month2";
            break;
          case "3":
            ret =  "month3";
            break;
          case "4":
            ret =  "month4";
            break;
          case "5":
            ret =  "month5";
            break;
          case "6":
            ret =  "month6";
            break;
          case "7":
            ret = "month7";
            break;
          case "8":
            ret =  "month8";
            break;
          case "9":
            ret =  "month9";
            break;
          case "10":
            ret =  "month10";
            break;
          case "11":
            ret =  "month11";
            break;
          case "12":
            ret =  "month12";
            break;
          default:
            ret =  "month6";

        }
        return ret;
      }
      if (args[0] == "CYYYY/MM/ND"){
        return moment(value+"/01").locale("en").format("MMM .YYYY");
      }
      if (args[0] == "CWEEK"){
        let d =  moment(value).format("d");
        let ret = "";

        switch (d) {
          case "1":
            ret = "星期一";
            break;
          case "2":
            ret =  "星期二";
            break;
          case "3":
            ret =  "星期三";
            break;
          case "4":
            ret =  "星期四";
            break;
          case "5":
            ret =  "星期五";
            break;
          case "6":
            ret =  "星期六";
            break;
          default:
            ret =  "星期日";
        };

        return ret;
      }
      if (args[0] == "DWEEK") {
        let d = moment(value).format("d");
        let ret = "";

        switch (d) {
          case "1":
            ret = "1";
            break;
          case "2":
            ret = "2";
            break;
          case "3":
            ret = "3";
            break;
          case "4":
            ret = "4";
            break;
          case "5":
            ret = "5";
            break;
          case "6":
            ret = "6";
            break;
          default:
            ret = "7";
        }

        return ret;
      }
      if (args[0] == "CYYYY年MM月DD日 A h:mm") {
        let currentDay = moment(value);
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
      if (args[0] == "withNow"){
        if (moment(value).diff(moment()) > 0) {
          return moment(value).fromNow(true) + "后";
        } else if (moment(value).diff(moment()) < 0) {
          return moment(value).toNow(true) + "前";
        } else {
          return moment(value).toNow(true);
        }
      }
      if (args[0] == "withNowcss"){

        let n = moment().diff(value);

        if (n  > this.rang) {
          return "fal fa-hourglass-start after";
        } else if (n  < this.rang * -1 ) {
          return "fal fa-hourglass-end before";
        } else {
          return "fal fa-hourglass-half current";
        }
      }

      if (args[0] == "YYYY年M月D日"){
        return moment(value).format("YYYY年M月D日");
      }
      if (args[0] == "YYYY"){
        return moment(value).format("YYYY");
      }
      if (args[0] == "MM-DD"){
        return moment(value).format("MM-DD");
      }
      if (args[0] == "DD"){
        return moment(value).format("DD");
      }
      if (args[0] == "CMM/DD"){
        return moment(value).format("MM月DD");
      }
      if (args[0] == "HH:mm"){
        return moment(value).format("HH:mm");
      }
      if (args[0] == "A"){
        return moment(value).format("A");
      }
      if (args[0] == "h:mm A") {
        return moment(value).format("h:mm A")
      }
      if (args[0] == "A h:mm") {
        return moment(value).format("A h:mm")
      }
      if (args[0] == "dddd MMMM D") {
        return moment(value).format("dddd MMMM D")
      }
      if (args[0] == "duration") {
        return moment.duration(value, "minutes").humanize();
      }
    }
    return value;
  }


}
