import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  weekDay: Array<string> = ["日","一","二","三","四","五","六"];   //周标识
  year: number;
  month: number;
  time: Array<TimeModel>;
  scheduleList: Array<ScheduleModel>;
  findSchedule: ScheduleOutModel; //查询日程条件

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private webSocketService: WebsocketService,
              private http: HttpClient,
              private timeService: TimeService,
              private paramsService: ParamsService,
              private alarmClock: XiaojiAlarmclockService) {

    this.init();
    //消息队列接收
    this.webSocketService.connect(this.paramsService.user.accountQueue);

    this.setAlarmList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  init() {
    //初始化加载日历控件
    var today = new Date();

    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;

    this.time = [];
    this.time = this.timeService.getCalendar(today.getFullYear(), today.getMonth() + 1)

    this.findTodaySchedule(this.year, this.month, today.getDate());
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

  openVoice() {
    this.navCtrl.push(this.tab1Root);
  }
}
