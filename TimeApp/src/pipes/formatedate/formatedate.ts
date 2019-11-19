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
    let m = moment(value);
    if (!m.isValid()) {
      m = moment(value, "YYYY/MM")
    }
    if (!m.isValid()) {
      m = moment(value, "YYYYMM")
    }
    if (!m.isValid() || args.length < 1) {
      return "";
    }
    let formart = args[0];
    switch (formart) {
      case "ADD7CYYYY/MM/DD":
        return m.add(7, "days").format("YYYY年MM月DD日");
      case "CYYYY/MM/DD W":
        return m.format("YYYY年MM月DD日 ddd");
      case "CYYYY/MM/DD":
        return m.format("YYYY年MM月DD日");
      case "CYYYY/MM/ND":
        return m.locale("en").format("MMM .YYYY");
      case "YYYYMM":
        return m.format("YYYYMM");
      case "YYYY":
        return m.format("YYYY");
      case "CMM":
        return m.format("M月");
      case "CMM/DD":
        return m.format("MM月DD");
      case "MM-DD":
        return m.format("MM-DD");
      case "CWEEK":
        return m.locale("cn").localeData().weekdays(m);
      case "DWEEK":
        return m.weekday();
      case "CDD":
        return m.isSame(moment(),"date")? "今" :m.format("D");
      default:
        return m.format(formart)?m.format(formart):"" ;
    }
  }
}
