import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatrepeat',
})
export class FormatRepeatPipe implements PipeTransform {
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
        repeat = "每天重复";
        break;
      case "2" :
        repeat = "每周重复";
        break;
      case "3" :
        repeat = "每月重复";
        break;
      case "4" :
        repeat = "每年重复";
        break;
      default :
        repeat = "不可用";
    }

    return repeat;
  }
}
