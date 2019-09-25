import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatplan',
})
export class FormatPlanPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (args[0] == "color") {
      if (args.length == 2 ) {

        let plans = args[1];

        let plan = plans.find((val) => {
          return value == val.ji;
        });

        if (plan) {
          return plan.jc;
        } else {
          return "";
        }
      }

    }
    if (args[0] == "name") {

      if (value && typeof value !== 'string') {
        return value;
      }

      if (args.length == 3 ) {
        let defaultplan = args[1];
        let plans = args[2];

        if (!value) {
          return defaultplan;
        }

        let plan = plans.find((val) => {
          return value == val.ji;
        });

        if (plan) {
          return plan.jn;
        } else {
          return defaultplan;
        }
      }
    }
  }
}
