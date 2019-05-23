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
  transform(value: string, ...args) {
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
    }
    return value;
  }


}
