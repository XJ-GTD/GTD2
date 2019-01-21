import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the SdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sd',
  // templateUrl: 'sd.html',
  providers: [],
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar>\n' +
  '    <ion-title>Sd</ion-title>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '\n' +
  '  <ion-list radio-group [(ngModel)]="remindText" (ionChange)="checked()">\n' +
  '    <ion-item>\n' +
  '      <ion-label>无</ion-label>\n' +
  '      <ion-radio value="null" item-end></ion-radio>\n' +
  '    </ion-item>\n' +
  '    <ion-item>\n' +
  '      <ion-label>任务发生当天</ion-label>\n' +
  '      <ion-radio value="zero" item-end></ion-radio>\n' +
  '    </ion-item>\n' +
  '    <ion-item>\n' +
  '      <ion-label>一天前</ion-label>\n' +
  '      <ion-radio value="one" item-end></ion-radio>\n' +
  '    </ion-item>\n' +
  '    <ion-item>\n' +
  '      <ion-label>两天前</ion-label>\n' +
  '      <ion-radio value="two" item-end></ion-radio>\n' +
  '    </ion-item>\n' +
  '    <ion-item>\n' +
  '      <ion-label>一周前</ion-label>\n' +
  '      <ion-radio value="week" item-end></ion-radio>\n' +
  '    </ion-item>\n' +
  '  </ion-list>\n' +
  '\n' +
  '  <ion-item>\n' +
  '    <ion-label>提醒时间</ion-label>\n' +
  '    <ion-datetime displayFormat="HH:mm" [(ngModel)]="remindTime"></ion-datetime>\n' +
  '  </ion-item>\n' +
  '\n' +
  '  <button ion-button color="danger" (click)="setAralmClock()">确定</button><button ion-button (click)="dismiss()">取消</button>\n' +
  '\n' +
  '</ion-content>',
})
export class SdPage {

  scheduleName: string;
  remindTime: string;

  remindText:string = "null";

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SdPage');
  }

  setAralmClock() {
    this.remindTime = this.remindTime.replace("T", " ");
    this.remindTime = this.remindTime.replace(":00Z", "");
    this.viewCtrl.dismiss(this.remindTime);
  }

  checked(){
    console.log(this.remindText)
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
