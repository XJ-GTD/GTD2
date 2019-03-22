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
    if (args.length ==1 ){
      if (args[0] == "CYYYY/MM/DD"){
        return moment(value).format("YYYY年MM月DD日");
      }
      if (args[0] == "CWEEK"){
        let d =  moment(value).format("d");
        let ret = "";

        switch (d) {
          case "1":
            ret = "周一";
          case "2":
            ret =  "周二";
          case "3":
            ret =  "周三";
          case "4":
            ret =  "周四";
          case "5":
            ret =  "周五";
          case "6":
            ret =  "周六";
          default:
            ret =  "周日";
        };

        return ret;
      }
      if (args[0] == "YYYY"){
        return moment(value).format("YYYY");
      }
      if (args[0] == "MM-DD"){
        return moment(value).format("MM-DD");
      }
    }
    return value;
  }


}
