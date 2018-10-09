import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import { WebsocketService } from "../../service/websocket.service";
import {ParamsService} from "../../service/params.service";
import {XiaojiAlarmclockService} from "../../service/xiaoji-alarmclock.service";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {RemindModel} from "../../model/remind.model";
import {TimeModel} from "../../model/time.model";
import {TimeService} from "../../service/time.service";
import {ScheduleModel} from "../../model/schedule.model";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {CalendarModel} from "../../model/calendar.model";

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
  //@ViewChild(Slides) slides: Slides;

  tab1Root = 'SpeechPage';
  data: any;
  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  calendarList: Array<CalendarModel>;
  calendar: CalendarModel;
  weekFlag: boolean = false;
  year: number;
  month: number;

  scheduleList: Array<ScheduleModel>;
  schedule: ScheduleModel;
  findSchedule: ScheduleOutModel; //查询日程条件

  constructor(public navCtrl: NavController, public navParams: NavParams,
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

    this.calendarControl();


    let today = new Date();
    this.findTodaySchedule( today.getFullYear(), today.getMonth() + 1, today.getDate());
  }

  calendarControl() {
    //初始化加载日历控件
    this.calendar = new CalendarModel();

    this.calendar = this.timeService.calendarInit();
    this.year = this.calendar.year;
    this.month = this.calendar.month;
  }

  slidesNext() {
    if (this.weekFlag == true) {
      console.log('星期向后');
      let startDate = this.calendar.dayList[0].date[0];
      let endDate = this.calendar.dayList[0].date[6];
      this.calendar = this.timeService.nextOrPrevWeek(2, startDate, endDate);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    } else {
      console.log('月份向后');
      let year = this.calendar.year;
      let month = this.calendar.month;
      this.calendar = this.timeService.nextOrPrev(2, year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
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
    } else {
      console.log('月份向前');
      let year = this.calendar.year;
      let month = this.calendar.month;
      this.calendar = this.timeService.nextOrPrev(1, year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    }


    //this.slides.update();
  }

  goBackToday() {
    if (this.weekFlag == true) {
      let date = new Date();
      this.calendar = this.timeService.getCalendarOfWeek(date.getFullYear(), date.getMonth() + 1);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    } else {
      this.calendar = this.timeService.calendarInit();
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    }

  }

  switchMonthOrWeek(year, month) {
    if (this.weekFlag == true) {
      this.calendar = this.timeService.getCalendarOfWeek(year, month);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    } else {
      this.calendar = this.timeService.nextOrPrev(2, year, month - 1);
      this.year = this.calendar.year;
      this.month = this.calendar.month;
    }
  }

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
  findTodaySchedule(year, month, day) {
    this.year = year;
    this.month = month;

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
    this.navCtrl.push("ScheduleDetailPage");
  }

  openVoice() {
    this.navCtrl.push(this.tab1Root);
  }
}
