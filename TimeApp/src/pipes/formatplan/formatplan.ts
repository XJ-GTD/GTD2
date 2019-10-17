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

    if (args[0] == "summary") {
      if (args.length == 3) {
        let defaultcolor = args[1];
        let plans = args[2];

        // 数据不存在或者数据不是数组或者数组长度为0，返回默认颜色
        if (!value || !(value instanceof Array) || (value instanceof Array && value.length <= 0)) {
          return defaultcolor;
        }

        let total: number = 0;

        let summary: Map<string, number> = value.reduce((target, element) => {
          let ji: string = element.ji;
          let key: string = defaultcolor;

          if (ji && ji != "") {
            let plan = plans.find((val) => {
              return ji == val.ji;
            });

            if (plan) {
              key = plan.jc;
            }
          }
          let count: number = target.get(key) || 0;

          count++;
          total++;

          target.set(key, count);

        }, new Map<string, number>());

        // linear-gradient(to right,red 10% 40%, blue 40%);
        let gradient: string = "linear-gradient(to right";
        let pre: string = "0%";
        let sum: number = 0;
        summary.forEach((value, key) => {
          sum += value;   // 累计数量
          let percent: number = (Math.round((sum / total) * 10000)/100).toFixed(0); // 百分比

          if (pre == "0%") {
            gradient += ", ";
            gradient += key;
            gradient += " ";
            gradient += pre;
          } else {
            gradient += " ";
            gradient += pre;
            gradient += ", ";
            gradient += key;
            gradient += " ";
            gradient += pre;
          }

          pre = percent + "%";
        });

        gradient += ")";

        return gradient;
      } else {
        return "#fff";
      }
    }
  }
}
