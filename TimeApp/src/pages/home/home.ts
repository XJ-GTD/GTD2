import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { WebsocketService } from "../../service/websocket.service";
import { ParamsService } from "../../service/params.service";
import { XiaojiAlarmclockService } from "../../service/xiaoji-alarmclock.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { RemindModel } from "../../model/remind.model";
import { TimeService } from "../../service/time.service";
import { ScheduleModel } from "../../model/schedule.model";
import { ScheduleOutModel } from "../../model/out/schedule.out.model";
import { CalendarModel } from "../../model/calendar.model";
import { CalendarComponentOptions } from "../../components/ion2-calendar/index";
import { TimeModel } from "../../model/time.model";



/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: []
})
export class HomePage {

  tab1Root = 'SpeechPage';
  data: any;
  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  calendarList: Array<CalendarModel>;
  calendar: CalendarModel = new CalendarModel();    //当前
  lastCalendar: CalendarModel;  //上一个
  nextCalendar: CalendarModel;  //下一个

  weekFlag: boolean = false;
  year: number;
  month: number;
  dayList: TimeModel;

  scheduleList: Array<ScheduleModel>;
  schedule: ScheduleModel;
  findSchedule: ScheduleOutModel; //查询日程条件

  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from:new Date(1975, 0, 1),
    daysConfig:[]
  };


  constructor(public navCtr: NavController,  public navParams: NavParams,
              public modalCtr: ModalController,
              private webSocketService: WebsocketService,
              private http: HttpClient,
              private timeService: TimeService,
              private paramsService: ParamsService,
              private alarmClock: XiaojiAlarmclockService) {

    this.init();
    this.setAlarmList();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');

  }

  init() {

    //消息队列接收
    this.webSocketService.connect(this.paramsService.user.accountQueue);

    this.scheduleList = [];

    // this.calendarControl();
    // let today = new Date();
    // this.findTodaySchedule( today.getFullYear(), today.getMonth() + 1, today.getDate());

  }

  discernTags($event) {

    console.log($event);
    let eventDate = new Date($event);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
    this.calendar.userId = this.paramsService.user.userId;
    this.calendar.year = year;
    this.calendar.month = month;
    this.calendar.daySum = TimeService.mGetDate(year, month);
    this.http.post(AppConfig.SCHEDULE_CALENDAR_MARK_URL, this.calendar, AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        this.data = data;
        console.log("tags data: " + this.data.data);

        if (this.data.code == 0) {
          this.dayList = new TimeModel();
          this.dayList.date = this.data.data.resultList;
          console.log("dayList: " + this.dayList);

          let _daysConfig = [];
          for (let i = 0; i < this.dayList.date.length; i++) {
            if (this.dayList.date[i].flag == '1') {
              _daysConfig.push({
                date: new Date(this.dayList.date[i].date),
                subTitle: `\u25B2`
              });
            }
          }
          this.options.daysConfig = _daysConfig;

        } else {
          console.log("tags error!");
        }
      })
  }

  /*calendarControl() {
    //初始化加载日历控件
    this.calendar = new CalendarModel();

    this.calendar = this.timeService.calendarInit();
    this.year = this.calendar.year;
    this.month = this.calendar.month;

    this.lastCalendar = this.timeService.nextOrPrev(1, this.year, this.month);
    this.nextCalendar = this.timeService.nextOrPrev(2, this.year, this.month);
  }

  slidesNext() {
    if (this.weekFlag == true) {
      console.log('星期向后');
      let startDate = this.calendar.dayList[0].date[0];
      let endDate = this.calendar.dayList[0].date[6];
      this.calendar = this.timeService.nextOrPrevWeek(2, startDate, endDate);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      let startDateCopy = this.calendar.dayList[0].date[0];
      let endDateCopy = this.calendar.dayList[0].date[6];
      this.lastCalendar = this.timeService.nextOrPrevWeek(1, startDateCopy, endDateCopy);
      this.nextCalendar = this.timeService.nextOrPrevWeek(2, startDateCopy, endDateCopy);
    } else {
      console.log('月份向后');
      let year = this.calendar.year;
      let month = this.calendar.month;
      this.calendar = this.timeService.nextOrPrev(2, year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      this.lastCalendar = this.timeService.nextOrPrev(1, this.year, this.month);
      this.nextCalendar = this.timeService.nextOrPrev(2, this.year, this.month);
    }


    //this.slides.update();
  }

  slidesPrev() {
    if (this.weekFlag == true) {
      console.log('星期向前');
      let year = this.calendar.year;
      let month = this.calendar.month;
      let startDate = this.calendar.dayList[0].date[0];
      let endDate = this.calendar.dayList[0].date[6];
      this.calendar = this.timeService.nextOrPrevWeek(1, startDate, endDate);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      let startDateCopy = this.calendar.dayList[0].date[0];
      let endDateCopy = this.calendar.dayList[0].date[6];
      this.lastCalendar = this.timeService.nextOrPrevWeek(1, startDateCopy, endDateCopy);
      this.nextCalendar = this.timeService.nextOrPrevWeek(2, startDateCopy, endDateCopy);
    } else {
      console.log('月份向前');
      let year = this.calendar.year;
      let month = this.calendar.month;
      this.calendar = this.timeService.nextOrPrev(1, year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      this.lastCalendar = this.timeService.nextOrPrev(1, this.year, this.month);
      this.nextCalendar = this.timeService.nextOrPrev(2, this.year, this.month);
    }


    //this.slides.update();
  }

  goBackToday() {
    if (this.weekFlag == true) {
      let date = new Date();
      this.calendar = this.timeService.getCalendarOfWeek(date.getFullYear(), date.getMonth() + 1);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      let startDateCopy = this.calendar.dayList[0].date[0];
      let endDateCopy = this.calendar.dayList[0].date[6];
      this.lastCalendar = this.timeService.nextOrPrevWeek(1, startDateCopy, endDateCopy);
      this.nextCalendar = this.timeService.nextOrPrevWeek(2, startDateCopy, endDateCopy);
    } else {
      this.calendarControl();
    }

  }

  switchMonthOrWeek(year, month) {
    if (this.weekFlag == true) {
      this.calendar = this.timeService.getCalendarOfWeek(year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      let startDateCopy = this.calendar.dayList[0].date[0];
      let endDateCopy = this.calendar.dayList[0].date[6];
      this.lastCalendar = this.timeService.nextOrPrevWeek(1, startDateCopy, endDateCopy);
      this.nextCalendar = this.timeService.nextOrPrevWeek(2, startDateCopy, endDateCopy);
    } else {
      this.calendar = this.timeService.nextOrPrev(2, year, month - 1);
      this.year = this.calendar.year;
      this.month = this.calendar.month;

      this.lastCalendar = this.timeService.nextOrPrev(1, this.year, this.month);
      this.nextCalendar = this.timeService.nextOrPrev(2, this.year, this.month);
    }
  }*/

  //设置当天全部提醒
  setAlarmList() {

    this.http.post(AppConfig.SCHEDULE_TODAY_REMIND_URL, {
      userId: this.paramsService.user.userId
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log( this.data);

        if (this.data.code == 0) {
          this.remindScheduleList = [];
          this.remindScheduleList = this.data.data.remindList;
          for(let i = 0; i < this.remindScheduleList.length; i++) {
            this.alarmClock.setAlarmClock(this.remindScheduleList[i].remindDate, this.remindScheduleList[i].scheduleName);
          }
        }

      })

  }

  //查询当天日程
  findTodaySchedule($event) {

    console.log($event);
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth()+1;
    let day = eventDate.getDate();

    this.findSchedule = new ScheduleOutModel();
    this.findSchedule.scheduleStartTime = year + "-" + month + "-" + day + " 00:00";
    this.findSchedule.scheduleDeadline = year + "-" + month + "-" + day + " 23:59";
    console.log("scheduleStartTime:" + this.findSchedule.scheduleStartTime + " | scheduleDeadline:" + this.findSchedule.scheduleDeadline);
    this.findSchedule.userId = this.paramsService.user.userId;
    this.http.post(AppConfig.SCHEDULE_FIND_URL, this.findSchedule, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log("data:" + this.data.toString());

        if (this.data.code == 0) {
          this.scheduleList = this.data.data.scheduleJoinList;
          console.log("data:" + this.data.data);
        } else {
          console.log("error message:" + this.data.message);
        }
      })
  }

  //展示数据详情
  showScheduleDetail(schedule){
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtr.push("ScheduleDetailPage");
  }

  showUserDetail() {
    console.log("跳转user" );
    this.navCtr.push("UserDetailPage");
  }

  openVoice() {
    let tab1RootModal  = this.modalCtr.create("SpeechPage");
    tab1RootModal.present();
  }
}
