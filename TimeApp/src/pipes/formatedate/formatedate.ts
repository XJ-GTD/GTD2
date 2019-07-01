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
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (moment(value)+"" == "NaN"){
      return value;
    }

    if (args.length ==1 ){
      if (args[0] == "CYYYY/MM/DD"){
        return moment(value).format("YYYY年MM月DD日");
      }
      if (args[0] == "CYYYY/M/DD"){
        return moment(value).format("YYYY年M月DD日");
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
    }
    return value;
  }


}
