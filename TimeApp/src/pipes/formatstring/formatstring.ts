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

    if (args.length == 2 ) {
      if (args[0] == "mask" && args[1] == true) {
        return new Array(value.length).join('*');
      }
    }

    return value;
  }
}
