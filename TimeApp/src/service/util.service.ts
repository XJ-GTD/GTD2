import {Injectable} from "@angular/core";
import {DateModel, TimeModel} from "../model/time.model";
import {CalendarModel} from "../model/calendar.model";


/**
 * 公共方法
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class UtilService {
   rand( min, max ) {
    return Math.random() * ( max - min ) + min;
  }

   randInt( min, max ) {
    return Math.floor( min + Math.random() * ( max - min + 1 ) );
  };
}
