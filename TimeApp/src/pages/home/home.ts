import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { WebsocketService } from "../../service/websocket.service";
import {ParamsService} from "../../service/params.service";
import {XiaojiAlarmclockService} from "../../service/xiaoji-alarmclock.service";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {RemindModel} from "../../model/remind.model";

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

  data: any;
  tab1Root = 'SpeechPage';
  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间
  monthDay: Array<string>;    //月日期
  weekDay: Array<string>;   //周标识
  year: number;
  month: number;
  day: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private webSocketService: WebsocketService,
              private http: HttpClient,
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
    var today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth() + 1;
    this.day = today.getDay();
    this.monthDay = [];
    this.weekDay = ["日","一","二","三","四","五","六"];

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

  openVoice() {
    this.navCtrl.push(this.tab1Root);
  }
}
