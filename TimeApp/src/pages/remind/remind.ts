import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController, DateTime} from 'ionic-angular';
import {TxJson} from "../../service/business/event.service";
import {MultiPicker} from "ion-multi-picker";
import * as moment from "moment";
import * as anyenum from "../../data.enum";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
    <modal-box title="提醒" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
      <ion-toolbar>
        <ion-buttons item-start>
          <button clear ion-button *ngIf="true">
            <ion-icon class="fal fa-bell-slash"></ion-icon>
            开启
          </button>
          <button clear ion-button *ngIf="false">
            <ion-icon class="fal fa-bell"></ion-icon>
            关闭
          </button>
        </ion-buttons>
        <ion-buttons end>
          <button clear (click)="openRemindTiqian()" ion-button>设定提醒</button>
          <button clear (click)="openRemindDt()" ion-button>指定日期</button>
        </ion-buttons>
      </ion-toolbar>
      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            剩余 <span class="count">{{reminds.length}}</span> 条提醒
          </ion-list-header>
          <ion-item *ngFor="let remind of reminds">
            <ion-label>{{remind.datename}}</ion-label>
            <button ion-button (click)="delRemind(idx)" clear item-end>
              <ion-icon class="fal fa-minus-circle"></ion-icon>
            </button>
          </ion-item>
        </ion-list>
      </ion-scroll>
    </modal-box>
    <div style="display: none">
      <ion-multi-picker #remindTiqian [(ngModel)]="tiqianvalue"
                        (ngModelChange)="tiqianselect()" [multiPickerColumns]="dependentColumns"
                        cancelText="取消" doneText="设定"></ion-multi-picker>
      <date-picker #remindDt
                   pickerFormat="YYYY ,MM DD"
                   [(ngModel)]="datevalue" (ngModelChange)="dtselect()"
                   cancelText="取消" doneText="选择时间"
      ></date-picker>
      <date-picker #remindTime pickerFormat="A hh mm"
                   [(ngModel)]="timevalue" (ngModelChange)="timeselect()" (ionCancel)="openRemindDt()"
                   doneText="设定"
      ></date-picker>
    </div>

  `
})
export class RemindPage {

  @ViewChild("remindTiqian")
  remindTiqian: MultiPicker;

  @ViewChild("remindDt")
  remindDt: DateTime;

  @ViewChild("remindTime")
  remindTime: DateTime;


  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  datevalue: string;
  timevalue: string;
  tiqianvalue: string;

  evdatetime;
  string;

  reminds: Array<any> = new Array<any>();
  currentTx: TxJson;
  dependentColumns: any[];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

    this.dependentColumns = [
      {
        columnWidth: '100px',
        options: [
          {text: '提前', value: '1'}],
      },
      {
        columnWidth: '100px',
        options: [
          {text: '', value: this.day2min(0)},
          {text: '1天', value: this.day2min(1)},
          {text: '2天', value: this.day2min(2)},
          {text: '3天', value: this.day2min(3)},
          {text: '4天', value: this.day2min(4)},
          {text: '5天', value: this.day2min(5)},
          {text: '6天', value: this.day2min(6)},
          {text: '7天', value: this.day2min(7)},
          {text: '8天', value: this.day2min(8)},
          {text: '9天', value: this.day2min(9)},
          {text: '10天', value: this.day2min(10)}],
      },
      {
        columnWidth: '100px',
        options: [
          {text: '', value: this.h2min(0)},
          {text: '1小时', value: this.h2min(1)},
          {text: '2小时', value: this.h2min(2)},
          {text: '3小时', value: this.h2min(3)},
          {text: '4小时', value: this.h2min(4)},
          {text: '5小时', value: this.h2min(5)},
          {text: '6小时', value: this.h2min(6)},
          {text: '7小时', value: this.h2min(7)},
          {text: '8小时', value: this.h2min(8)},
          {text: '9小时', value: this.h2min(9)},
          {text: '10小时', value: this.h2min(10)},
          {text: '11小时', value: this.h2min(11)},
          {text: '12小时', value: this.h2min(12)},
          {text: '13小时', value: this.h2min(13)},
          {text: '14小时', value: this.h2min(14)},
          {text: '15小时', value: this.h2min(15)},
          {text: '16小时', value: this.h2min(16)}],
      },
      {
        columnWidth: '100px',
        options:
          [
            {text: '5分钟', value: 5},
            {text: '10分钟', value: 10},
            {text: '15分钟', value: 15},
            {text: '20分钟', value: 20},
            {text: '25分钟', value: 25},
            {text: '30分钟', value: 30},
            {text: '35分钟', value: 35},
            {text: '40分钟', value: 40},
            {text: '45分钟', value: 45},
            {text: '50分钟', value: 50},
            {text: '55分钟', value: 55}
          ]
      }
    ];

    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value.txjson);
        if (this.currentTx.reminds.length > 0) {

          this.evdatetime = moment(value.evd + " " + value.evt).format("YYYY/MM/DD HH:mm");

          for (let j = 0, len = this.currentTx.reminds.length; j < len; j++) {
            this.reminds.push(
              {
                datename: this.getShowDateName(this.currentTx.reminds[j]),
                value: this.currentTx.reminds[j]
              });
          }
        }

      }

    }
  }

  save() {
    this.currentTx.reminds.length = 0;
    for (let j = 0, len = this.reminds.length; j < len; j++) {
      this.currentTx.reminds.push(this.reminds[j].value);
    }

    let data: Object = {txjson: this.currentTx};
    this.viewCtrl.dismiss(data);
  }


  getShowDateName(time) {
    let ret: string;
    ret = moment(this.evdatetime).subtract(time, 'm').format("MM月DD HH:mm");

    ret = "" + TxJson.caption(time) + "- -" + ret;

    return ret;
  }

  cancel() {
    this.navCtrl.pop();
  }

  openRemindTiqian() {
    this.remindTiqian.open();

  }

  openRemindDt() {
    this.remindDt.min = moment().format("YYYY-MM-DD");
    this.remindDt.max = moment(this.evdatetime).add(2, "M").format("YYYY-MM-DD");
    this.remindDt.open();

  }

  tiqianselect() {

    if (!this.tiqianvalue) {
      return;
    }
    let dtsplit = new Array<string>();
    let time;
    let dt;
    dtsplit = this.tiqianvalue.split(" ");
    if (dtsplit.length < 4) {
      return;
    }

    time = parseInt(dtsplit[1]) + parseInt(dtsplit[2]) + parseInt(dtsplit[3]);
    dt = moment(this.evdatetime).subtract(time, 'm');
    this.reminds.push(
      {
        datename: "" + TxJson.caption(time) + "- -" + moment(this.evdatetime).subtract(time, 'm').format("MM月DD HH:mm"),
        value: time
      });
  }

  dtselect() {
    this.remindTime.cancelText = "选择日期 " + moment(this.datevalue).format("YYYY年MM月DD日");
    this.remindTime.open();
  }

  timeselect() {
    let dt = this.datevalue + " " + this.timevalue;
    let time = moment(this.evdatetime).diff(dt, 'm');
    this.reminds.push(
      {
        datename: "" + TxJson.caption(time) + " -- " + moment(dt).format("MM月DD HH:mm"),
        value: time
      });
  }

  day2min(d) {
    return d * 24 * 60;
  }

  h2min(h) {
    return h * 60;
  }

  delRemind(index) {
    this.reminds.splice(index, 1);
  }
}
