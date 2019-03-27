import {Injectable} from "@angular/core";
import * as moment from "moment";
import {CalendarDay, DayConfig} from "../../components/ion2-calendar";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {StTbl} from "../../service/sqlite/tbl/st.tbl";
import {SqliteExec} from "../../service/util-service/sqlite.exec";

@Injectable()
export class HService {
  constructor(private feekback: FeedbackService,private sqliteExec:SqliteExec
  ) {
    moment.locale('zh-cn');
  }

  //  configDay():Promise<Array<DayConfig>> {
  //   return new Promise<Array<DayConfig>>((resolve, reject) => {
  //     let sts:StTbl = new StTbl();
  //     let days:Array<DayConfig> = new Array<DayConfig>();
  //     this.sqliteExec.getList<StTbl>(sts).then(sts=>{
  //       for(let st of sts){
  //         let day:DayConfig = new class implements DayConfig {
  //           busysometing: boolean;
  //           cssClass: string;
  //           date: Date;
  //           disable: boolean;
  //           hassometing: boolean;
  //           hasting: boolean;
  //           marked: boolean;
  //           newmessage: number;
  //           subTitle: string;
  //           things: number;
  //           title: string;
  //         };
  //         day.things = st.c;
  //         day.hassometing = st.c < 3;
  //         day.busysometing = st.c >= 3;
  //         day.newmessage = st.n;
  //         day.hasting = st.c > 0;
  //         day.date = moment(st.d).toDate();
  //         day.subTitle = st.n > 0? `\u2022`: "";
  //         day.marked = false;
  //         days.push(day);
  //       }
  //       resolve(days);
  //     })
  //
  //   })
  //
  // }

  centerShow(select: CalendarDay): Promise<HData> {

    return new Promise<HData>((resolve, reject) => {
      let hdata: HData = new HData();
      hdata.selectDay = select;
      if (!select) {
        hdata.isShow = false;
      } else {
        hdata.isShow = true;
        hdata.showDay = moment(select.time).format('dddd MM月DD日');
        hdata.showDay2 = this.countDay(select.time)
        hdata.newmessge = select.newmessage;
        hdata.things = select.things;
      }
      this.feekback.audioBass().then(d => {
        resolve(hdata);
      }).catch(e=>{
        resolve(hdata);
      })
    })

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


  //首页显示 参数月：YYYY/MM
  // async showHomePage(m) {
  //   let ret = new Map<string, Array<ScdData>>();
  //   let sday = m + "/" + "01";
  //   let nday = moment(m, "YYYY/MM").daysInMonth();
  //   let eday = m + "/" + nday;
  //
  //   //获取计划信息
  //   let jh = new JhTbl();
  //   let jhList = new Array<JhTbl>()
  //   jhList = await this.sqlexec.getList<JhTbl>(jh);
  //
  //   //获取时间段内日程信息
  //   let sql = 'select * from gtd_c  where ' +
  //     ' (ed <> "9999/12/31" and sd <= "' + eday + '" and ed >= "' + sday + '" ) ' +
  //     ' or (ed = "9999/12/31" and sd <= "' + eday + '")';
  //
  //   let data = new Array<CTbl>();
  //   data = await this.sqlexec.getExtList<CTbl>(sql);
  //
  //
  //   //加载月份里每条日期所包含的日程
  //   let curDate = sday;
  //   for (let i = 0, len = nday; i < len; i++) {
  //     let ishave = false;
  //     let scdList = new Array<ScdData>();
  //     for (let j = 0, len = data.length; j < len; j++) {
  //       //当期日期是否在日程中存在
  //       ishave = this.agdbusi.ishave(curDate, data[j]);
  //       if (ishave) {
  //         let scd = new ScdData();
  //         Object.assign(scd, data[j]);
  //
  //         //获取相应计划内容
  //         for (let k = 0, len = jhList.length; k < len; k++) {
  //           if (scd.ji == jhList[k].ji) {
  //             scd.p.ji = jhList[k].ji;
  //             scd.p.jn = jhList[k].jn;
  //             scd.p.jg = jhList[k].jg;
  //             scd.p.jc = jhList[k].jc;
  //             scd.p.jt = jhList[k].jt;
  //             scd.p.wtt = jhList[k].wtt;
  //             break;
  //           }
  //         }
  //         scdList.push(scd);
  //       }
  //     }
  //
  //     ret.set(curDate, scdList);
  //     curDate = moment(curDate).add(1, 'd').format('YYYY/MM/DD');
  //   }
  //
  //   let bs = new BsModel();
  //   bs.code = 0;
  //   bs.data = ret;
  //   return bs;
  // }
}

export class HData {
  isShow: boolean = false;
  showDay: string = "";
  showDay2: string = "";
  newmessge: number = 0;
  things: number = 0;
  selectDay: CalendarDay;
}
