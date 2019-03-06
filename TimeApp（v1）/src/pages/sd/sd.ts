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
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>Sd</ion-title>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <ion-list radio-group [(ngModel)]="remindText" (ionChange)="checked()">' +
  '    <ion-item>' +
  '      <ion-label>无</ion-label>' +
  '      <ion-radio value="null" item-end></ion-radio>' +
  '    </ion-item>' +
  '    <ion-item>' +
  '      <ion-label>任务发生当天</ion-label>' +
  '      <ion-radio value="zero" item-end></ion-radio>' +
  '    </ion-item>' +
  '    <ion-item>' +
  '      <ion-label>一天前</ion-label>' +
  '      <ion-radio value="one" item-end></ion-radio>' +
  '    </ion-item>' +
  '    <ion-item>' +
  '      <ion-label>两天前</ion-label>' +
  '      <ion-radio value="two" item-end></ion-radio>' +
  '    </ion-item>' +
  '    <ion-item>' +
  '      <ion-label>一周前</ion-label>' +
  '      <ion-radio value="week" item-end></ion-radio>' +
  '    </ion-item>' +
  '  </ion-list>' +
  '  <ion-item>' +
  '    <ion-label>提醒时间</ion-label>' +
  '    <ion-datetime displayFormat="HH:mm" [(ngModel)]="remindTime"></ion-datetime>' +
  '  </ion-item>' +
  '  <button ion-button color="danger" (click)="setAralmClock()">确定</button><button ion-button (click)="dismiss()">取消</button>' +
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
