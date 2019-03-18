import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  date: string;
  type: 'string';  
  optionsRange: CalendarComponentOptions = {
      monthFormat: 'YYYY',
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      showToggleButtons: false,
      showMonthPicker: false,
      color: 'dark'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  onChange($event) {
    console.log($event);
  }
}
