import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

/**
 * Generated class for the FormatedatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatmonthstring',
})
export class FormatmonthstringPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    if (!value) {
      return value;
    }
    let formart = args[0];
    if (formart !="string") return value;
    let m = moment(value, "YYYY/MM").get('M') + 1;
    switch (m) {
      case 1:
        return "每一个成功者都有一个开始。勇于开始，才能找到成功的路。";
      case 2:
        return "世界会向那些有目标和远见的人让路。";
      case 3:
        return "若不给自己设限，则人生中就没有限制你发挥的藩篱。";
      case 4:
        return "赚钱之道很多，但是找不到赚钱的种子，便成不了事业家。";
      case 6:
        return "现在的努力，只是为了让你遇见更好的我，而我也期待遇见更让我心动的你24小时不停为我们工作。";
      case 7:
        return "别想一下造出大海，必须先由小河川开始。";
      case 8:
        return "你的脸是为了呈现上帝赐给人类最贵重的礼物——微笑，一定要成为你工作最大的资产。";
      case 9:
        return "莫找借口失败，只找理由成功。";
      case 10:
        return "当你感到悲哀痛苦时，最好是去学些什么东西。学习会使你永远立于不败之地。";
      case 11:
        return "一个能从别人的观念来看事情，能了解别人心灵活动的人，永远不必为自己的前途担心。 ";
      case 12:
        return "积极者相信只有推动自己才能推动世界，只要推动自己就能推动世界。";
      default:
        return "一个人最大的破产是绝望，最大的资产是希望。";
    }
  }
}
