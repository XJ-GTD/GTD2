import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController, DateTime} from 'ionic-angular';
import {TxJson} from "../../service/business/event.service";
import {MultiPicker} from "ion-multi-picker";
import * as moment from "moment";
import * as anyenum from "../../data.enum";
import {Moment} from "moment";
import {UtilService} from "../../service/util-service/util.service";

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
          <button clear (click)="openRemindTiqian()" [disabled]="disTiqian" ion-button>设定提醒</button>
          <button clear (click)="openRemindDt()" ion-button>指定日期</button>
        </ion-buttons>
      </ion-toolbar>
      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            剩余 <span class="count">{{tixinnum}}</span> 条提醒
          </ion-list-header>
          <ion-item *ngFor="let remind of reminds; let idx = index;" [hidden]="remind.disTixin"  >
            <ion-label>{{remind.datename}}</ion-label>
            <button [disabled]="remind.disTixin" ion-button (click)="delRemind(idx)" clear item-end>
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
                   [(ngModel)]="datevalue" (ngModelChange)="timeOpen()"
                   cancelText="取消" doneText="选择时间"
      ></date-picker>
        <ion-multi-picker #remindTime [(ngModel)]="timevalue"
                          (ngModelChange)="timeselect();" (ionCancel)="openRemindDt()" [multiPickerColumns]="timeColumns"
                           doneText="设定"></ion-multi-picker>

    </div>

  `
})
export class RemindPage {

  @ViewChild("remindTiqian")
  remindTiqian: MultiPicker;

  @ViewChild("remindDt")
  remindDt: DateTime;

  @ViewChild("remindTime")
  remindTime: MultiPicker;

  minDate : string = moment().format("YYYY-MM-DD");
  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  datevalue: string;
  timevalue: string;
  tiqianvalue: string;
  evdatetime: string;

  disTiqian : boolean = false;
  tixinnum : number = 0;

  reminds: Array<any> = new Array<any>();
  currentTx: TxJson;
  dependentColumns: any[];
  timeColumns : any[]
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private util : UtilService,) {

    let ampmArray = [
      {text: '上午', value: '1'},
      {text: '下午', value: '2'}
    ];
    let hourArray = [
      {text: '00点', value: '100' ,parentVal:'1'},
      {text: '01点', value: '101',parentVal:'1' },
      {text: '02点', value: '102',parentVal:'1' },
      {text: '03点', value: '103',parentVal:'1' },
      {text: '04点', value: '104',parentVal:'1' },
      {text: '05点', value: '105',parentVal:'1' },
      {text: '06点', value: '106',parentVal:'1' },
      {text: '07点', value: '107',parentVal:'1' },
      {text: '08点', value: '108',parentVal:'1' },
      {text: '09点', value: '109',parentVal:'1' },
      {text: '10点', value: '110',parentVal:'1'},
      {text: '11点', value: '111',parentVal:'1'},
      {text: '12点', value: '112',parentVal:'1'},
      {text: '01点', value: '01',parentVal:'2' },
      {text: '02点', value: '02',parentVal:'2' },
      {text: '03点', value: '03',parentVal:'2' },
      {text: '04点', value: '04',parentVal:'2' },
      {text: '05点', value: '05',parentVal:'2' },
      {text: '06点', value: '06',parentVal:'2' },
      {text: '07点', value: '07',parentVal:'2' },
      {text: '08点', value: '08',parentVal:'2' },
      {text: '09点', value: '09',parentVal:'2' },
      {text: '10点', value: '10',parentVal:'2'},
      {text: '11点', value: '11',parentVal:'2'},
    ];

    let minArray = [];
    for ( let h of hourArray){
      let loopmin = 0;
      let loopnum = 0;
      while (loopmin < 55){

        loopmin = loopnum * 5;
        let val = (loopmin + "").length == 1 ? "0"+loopmin : loopmin+ "";
        let min ={
          text: val + "分",
          value:val,
          parentVal:h.value
        }
        minArray.push(min);
        loopnum = loopnum + 1;
      }

    }

    this.timeColumns = [
      {
        columnWidth: '100px',
        options: ampmArray,
      },
      {
        columnWidth: '100px',
        options: hourArray,
      },
      {
        columnWidth: '100px',
        options: minArray,
      }
    ];

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
            {text: '', value: 0},
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

    this.tiqianvalue = "1 0 0 5";

    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value.txjson);
        this.evdatetime = value.evd + " " + value.evt;

        if (moment().isAfter(moment(this.evdatetime, "YYYY/MM/DD HH:mm", true))) {
          this.disTiqian = true;
        }else{
          this.disTiqian = false;
        }

        if (this.currentTx.reminds.length > 0) {

          for (let j = 0, len = this.currentTx.reminds.length; j < len; j++) {
            this.reminds.push(
              {
                datename: this.getShowDateName(this.currentTx.reminds[j]),
                value: this.currentTx.reminds[j],
                disTixin : TxJson.getDisTixin(this.evdatetime,this.currentTx.reminds[j])
              });
          }
        }
        this.setTixinnum();
      }

    }
  }

  save() {
    this.currentTx.reminds.length = 0;
    for (let j = 0, len = this.reminds.length; j < len; j++) {
      if (!TxJson.getDisTixin(this.evdatetime,this.reminds[j].value)){
        this.currentTx.reminds.push(this.reminds[j].value);
      }
    }

    let data: Object = {txjson: this.currentTx};
    this.viewCtrl.dismiss(data);
  }


  getShowDateName(time) {
    let ret: string;
    if (time >= 0){
      ret = moment(this.evdatetime, "YYYY/MM/DD HH:mm", true).subtract(time, 'm').format("MM月DD HH:mm");
      ret = "" + TxJson.caption(time) + "- -" + ret;
    }else{
      ret = "" + TxJson.caption(time);
    }

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
    this.remindDt.max = moment(this.evdatetime, "YYYY/MM/DD HH:mm", true).add(1, "y").format("YYYY-MM-DD");
    this.remindDt.open();

  }

  tiqianselect() {

    if (!this.tiqianvalue) {
      return;
    }
    let dtsplit = new Array<string>();
    let time;
    if (this.tiqianvalue == "1 0 0 0"){
      return;
    }

    dtsplit = this.tiqianvalue.split(" ");
    if (dtsplit.length < 4) {
      return;
    }

    time = parseInt(dtsplit[1]) + parseInt(dtsplit[2]) + parseInt(dtsplit[3]);
    if (moment().isAfter(moment(this.evdatetime, "YYYY/MM/DD HH:mm", true).subtract(time, 'm'))){
      this.util.toastStart("请选择今日以后提醒", 3000);
      return;
    }

    let hav = this.reminds.findIndex((value, index, arr) => {
      return value.value == time;
    })
    if (hav != -1) {
      this.reminds.splice(hav,1);
    }
    this.reminds.push(
      {
        datename: this.getShowDateName(time),
        value: time,
        disTixin : false
      });
    this.setTixinnum();

  }

  timeOpen() {
    this.remindTime.cancelText = "选择日期 " + moment(this.datevalue, "YYYY-MM-DD", true).format("YYYY年MM月DD日");
    this.remindTime.open();
  }

  timeselect() {

    let tm = "";
    if (!this.timevalue) {
      return;
    }
    let dtsplit = new Array<string>();
    let ampm;
    dtsplit = this.timevalue.split(" ");
    if (dtsplit.length < 3) {
      return;
    }
    if (dtsplit[0] == "1"){
      dtsplit[1] = dtsplit[1].substring(1);
      tm =  dtsplit[1] + ":" + dtsplit[2];
    }else{
      tm =  (parseInt(dtsplit[1])+ 12) + ":" + dtsplit[2];
    }
    let dt = this.datevalue + " " + tm;

    if (moment().isAfter(moment(dt, "YYYY-MM-DD HH:mm",true)) ||
          moment(this.evdatetime ,"YYYY/MM/DD HH:mm",true).isAfter(moment(dt, "YYYY-MM-DD HH:mm",true))){
      this.util.toastStart("请选择今日以及开始日以后提醒", 3000);
      return;
    }

    let time = -1 * parseInt(moment(dt, "YYYY-MM-DD HH:mm",true).format("YYYYMMDDHHmm"));
    let hav = this.reminds.findIndex((value, index, arr) => {
      return value.value == time;
    })
    if (hav != -1) {
      this.reminds.splice(hav,1);
    }


    this.reminds.push(
      {
        datename: this.getShowDateName(time),
        value: time,
        disTixin: false
      });
    this.setTixinnum();
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

  setTixinnum() {
    this.tixinnum = 0;
    for (let j = 0, len = this.reminds.length; j < len; j++) {
      if (!TxJson.getDisTixin(this.evdatetime,this.reminds[j].value)){
        this.tixinnum = this.tixinnum + 1;
      }
    }
  }
}
