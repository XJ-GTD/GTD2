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
      if (args[0] == "YYYY-MM"){
        return moment(value).format("YYYY-MM");
      }
      if (args[0] == "DD"){
        return moment(value).format("DD");
      }
    }
    return value;
  }


}
