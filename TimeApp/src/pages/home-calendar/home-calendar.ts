import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var cordova: any;

/**
 * Generated class for the HomeCalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-calendar',
  templateUrl: 'home-calendar.html',
})
export class HomeCalendarPage {

  private hour: any;
  private minute: any;
  private success: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeCalendarPage');
  }

  setAlarmClock() {
    // set wakeup timer
    cordova.plugins.wakeuptimer.wakeup( result => {
      if (result != "OK") {
        alert("设定成功1: " + result);
        this.success = JSON.stringify(result);
        alert("设定成功3: " + this.success);
      } else {

        alert("设定成功2: " + result);
      }


      },
      err => {
        alert("设定失败: " + err.toString());
      },
      // a list of alarms to set
      {
        alarms : [{
          type : 'onetime',
          time : { hour : this.hour, minute : this.minute },
          extra : { message : '不能调用声音吗' },
          message : 'Alarm has expired!'
        }]
      }
    );
  }

}
