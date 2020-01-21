import {Injectable} from "@angular/core";
import * as moment from "moment";
import {SyncRestful} from "../../service/restful/syncsev";

@Injectable()
export class HService {
  constructor() {
    moment.locale('zh-cn');
  }

  //更新每小时天气位置信息
  putHourlyWeather(userId: string) {
    // this.syncRestful.putHourlyWeather(userId);
  }

  // centerShow(select: CalendarDay): Promise<HData> {
  //
  //   return new Promise<HData>((resolve, reject) => {
  //     let hdata: HData = new HData();
  //     hdata.selectDay = select;
  //     if (!select) {
  //       hdata.isShow = false;
  //     } else {
  //       hdata.isShow = true;
  //       //
  //       // this.pgservice.getHomDayData(moment(select.time)).then(data=>{
  //       //   hdata.showDay =  moment(data.sd).format('dddd MM月DD日');
  //       //   hdata.showDay2 = this.countDay(select.time);
  //       //   hdata.newmessge = data.news;
  //       //   hdata.things = data.scds;
  //       //   let bk:number = 0;
  //       //   for (let jt of data.jtL) {
  //       //     hdata.jtl.push(jt);
  //       //     if (bk > 2) break;
  //       //     bk++;
  //       //   }
  //       // });
  //     }
  //     resolve(hdata);
  //   })
  //
  // }

  /**
   * 显示选中日期对应类型
   * @param {string} day 格式（YYYY-MM-DD）
   * @returns {string}
   */
  private countDay(day: number): string {
    let date = moment(day);
    let str = '今天';
    let nowDate = moment(moment(new Date()).format("YYYY/MM/DD"));
    let days = date.diff(nowDate, 'days');
    let months = date.diff(nowDate, 'months');
    let years = date.diff(nowDate, 'years');
    if (years > 0) {
      str = years + '年后'
    } else if (years <= -1) {
      str = Math.abs(years) + '年前'
    } else if (months > 0) {
      str = months + '月后';
    } else if (months < 0) {
      str = Math.abs(months) + '月前'
    } else if (days == 0) {
      str = '今天';
    } else if (days == 1) {
      str = '明天'
    } else if (days == 2) {
      str = '后天'
    } else if (days >= 3) {
      str = days - 1 + '天后'
    } else if (days == -1) {
      str = '昨天'
    } else if (days == -2) {
      str = '前天'
    } else if (days <= -3) {
      str = Math.abs(days) - 1 + '天前'
    }
    return str;
  }

}
