import {Injectable} from "@angular/core";
import * as moment from "moment";
import {CalendarDay} from "../../components/ion2-calendar";
import { RcInParam, ScdData } from "../../data.mapping";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {AssistantService} from "../../service/cordova/assistant.service";

@Injectable()
export class DaService {
  constructor(private pgservice:PgBusiService,
              private assistantService: AssistantService) {
    moment.locale('zh-cn');
  }

  currentShow(select: number): Promise<Array<ScdData>> {
    return new Promise<Array<ScdData>>((resolve, reject) => {
      let query: RcInParam = new RcInParam();

      query.sd = moment(select).format('YYYY/MM/DD');
      query.ed = moment(select).format('YYYY/MM/DD');

      this.pgservice.getList(query).then(data => {
        //增加排序处理
        if (data && data.length > 1) {
          let sortedData = data.sort((a, b) => {

            if (a.st != '99:99' && b.st == '99:99') {
              return 1;
            }

            if (a.st == '99:99' && b.st != '99:99') {
              return -1;
            }

            if (a.st > b.st) {
              return 1;
            }

            if (a.st < b.st) {
              return -1;
            }

            return 0;
          });
        }

        resolve(data);
      });

    })

  }

  speakDailySummary(currentday: moment.Moment, scdlist: Array<ScdData>) {
    let currentdaystring = currentday.format("YYYY/MM/DD");
    let speak = currentday.format("M月D日");
    speak = speak + " " + currentday.format('dddd') + "。";

    let timeRange = "";
    for (let scd of scdlist) {
      let scdtime = moment(currentdaystring + " " + (scd.st == "99:99"? "00:00" : scd.st) + ":00");
      let scdtimeA = (scd.st != "99:99"? scdtime.format("A") : "");

      if (timeRange != (scdtimeA + scd.st)) {
        speak = speak + " " + scdtimeA + " " + (scd.st == "99:99"? "" : scdtime.format("h点m分")) + "，";
      }
      speak = speak + " " + scd.sn + "。";

      timeRange = (scdtimeA + scd.st);
    }

    this.assistantService.pureSpeakText(speak);
  }

  stopSpeak() {
    this.assistantService.stopSpeak(false);
  }

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
