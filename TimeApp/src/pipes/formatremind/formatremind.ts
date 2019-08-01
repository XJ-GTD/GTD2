import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatremind',
})
export class FormatRemindPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (value == "" || value == "0"){
      return value;
    }

    let repeat: string = "不可用";

    switch(value) {
      case "1" :
        repeat = "提前10分钟提醒";
        break;
      case "2" :
        repeat = "提前30分钟提醒";
        break;
      case "3" :
        repeat = "提前1小时提醒";
        break;
      case "4" :
        repeat = "提前4小时提醒";
        break;
      case "5" :
        repeat = "提前1天提醒";
        break;
      default :
        repeat = "不可用";
    }

    return repeat;
  }
}
