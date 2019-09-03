import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatuser',
})
export class FormatUserPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value || typeof value !== 'string') {
      return value;
    }

    if (args.length == 2 ) {
      let currentuser = args[0];
      let friends = args[1];

      if (value == currentuser) {
        return "";
      } else {
        let friend = friends.find((val) => {
          return value == val.ui;
        });

        if (friend) {
          return friend.ran;
        } else {
          return value;
        }
      }
    }

    return value;
  }
}
