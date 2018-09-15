import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ScheduleRemindPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-remind',
  templateUrl: 'schedule-remind.html',
  providers: []
})
export class ScheduleRemindPage {

  scheduleName: string;
  remindTime: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleRemindPage');
  }

  setAralmClock() {
    this.remindTime = this.remindTime.replace("T", " ");
    this.remindTime = this.remindTime.replace(":00Z", "");

    this.viewCtrl.dismiss(this.remindTime);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
