import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { XiaojiAlarmclockService } from "../../service/xiaoji-alarmclock.service";
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';


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
  providers: []
})
export class HomeCalendarPage {

  private date: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private xiaojiAlarmclockService: XiaojiAlarmclockService,
              private localNotification: PhonegapLocalNotification) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeCalendarPage');
  }

  setAlarmClock() {
    this.localNotification.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {

          let notification = new Notification("My title", {
            tag: "message1",
            body: "My body"
          });
          notification.onclick = function() { alert("phonegap") };
          // // Create the notification
          // this.localNotification.create('My Title', {
          //   tag: 'message1',
          //   body: 'My body',
          //   icon: 'assets/icon/favicon.ico'
          // });

        }
      }
    );

    this.date = this.date.replace("T", " ");
    alert(this.date);
    this.xiaojiAlarmclockService.setAlarmClock(this.date);

  }

}
