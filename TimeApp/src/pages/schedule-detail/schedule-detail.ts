import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { ScheduleModel } from "../../model/schedule.model";
import {XiaojiAlarmclockService} from "../../service/xiaoji-alarmclock.service";

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

  schedule: ScheduleModel;
  date: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleDetailPage');
  }

}
