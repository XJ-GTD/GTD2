import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatstring',
})
export class FormatstringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value || typeof value !== 'string') {
      return value;
    }


    if (args[0] == "maskphone") {
      let start = args[1];
      let len = args[2];
      if (value && value.length > (start + len)) {
        return value.substring(0, start) + ("*".repeat(len)) + value.substring(start + len, value.length);
      } else {
        return value;
      }
    }

    if (args.length == 2 ) {
      if (args[0] == "mask" && args[1] == true) {
        return new Array(value.length).join('*');
      }
    }

    return value;
  }
}
