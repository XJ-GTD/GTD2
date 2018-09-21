import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Navbar, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiAlarmclockService } from "../../service/xiaoji-alarmclock.service";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";

/**
 * Generated class for the ScheduleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-detail',
  templateUrl: 'schedule-detail.html',
  providers: []
})
export class ScheduleDetailPage {
  @ViewChild(Navbar) navBar: Navbar;

  data: any;
  schedule: ScheduleModel;
  updateSchedule: ScheduleOutModel; //更新日程状态

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private http: HttpClient,
              public modalCtrl: ModalController,
              private alarmClock: XiaojiAlarmclockService) {

    this.init();
  }

  init() {
    this.schedule = new ScheduleModel();
    this.schedule = this.paramsService.schedule;
    /*时间格式规整*/
    if (this.schedule.scheduleStartTime != null && this.schedule.scheduleStartTime != "") {
      this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace(" ", "T");
      // this.schedule.scheduleStartTime = this.schedule.scheduleStartTime.replace(":00Z", "");
    }
    if (this.schedule.scheduleDeadline != null && this.schedule.scheduleDeadline != "") {
      this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace(" ", "T");
      // this.schedule.scheduleDeadline = this.schedule.scheduleDeadline.replace(":00Z", "");
    }
  }

  //设置闹钟
  setAlarm() {
    let myModal = this.modalCtrl.create('ScheduleRemindPage');
    myModal.onDidDismiss(data => {

      console.log("remindTime" + data);
      this.alarmClock.setAlarmClock(data, this.schedule.scheduleName);

    });
    myModal.present();
  }

  //日程完成状态改变
  changeState() {
    this.updateSchedule = new ScheduleOutModel();
    this.updateSchedule.scheduleId;
    this.updateSchedule.playersStatus = 0;
    this.updateSchedule.userId = this.paramsService.user.userId;
    this.http.post(AppConfig.SCHEDULE_UPDATE_STATE_URL, this.updateSchedule, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log("日程完成状态：" + this.data);
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleDetailPage');
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }

}
