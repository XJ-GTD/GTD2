import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController, DateTime} from 'ionic-angular';
import {ScrollSelectComponent} from "../../components/scroll-select/scroll-select";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {RtJson, TxJson} from "../../service/business/event.service";
import {MultiPicker} from "ion-multi-picker";
import * as moment from "moment";
import * as anyenum from "../../data.enum";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
    <modal-box title="提醒" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
      <!--<scroll-select type="scroll-with-button" *ngFor="let remind of reminds"  [value]="remind.value" (changed)="onRemindChanged($event)">-->
      <!--<scroll-select-option value="">滑动以添加</scroll-select-option>-->
      <!--<scroll-select-option [value]="opt.value" *ngFor="let opt of selectOption">-->
      <!--{{opt.caption}}-->ioni
      <!--</scroll-select-option>-->
      <!--</scroll-select>-->
      <ion-content>
        <button (click)="openRemindTiqian()" ion-button>提前提醒</button>
        <button (click)="openRemindDt()" ion-button>日期提醒</button>
        <ion-item>
        <ion-multi-picker #remindTiqian [(ngModel)]="tiqianvalue" 
                          (ngModelChange)="tiqianselect()" [multiPickerColumns]="dependentColumns"
                          cancelText="取消" doneText="确认"></ion-multi-picker>
          <div>
            <ion-datetime #remindDt displayFormat="YYYY年MM月DD日 HH:mm"
                          pickerFormat="YYYY MM DD HH mm" color="light"
                          [(ngModel)]="dtvalue" (ngModelChange)="dtselect()"
                          min="1999-01-01" max="2039-12-31" cancelText="取消" doneText="确认"
            ></ion-datetime>
          </div>
        </ion-item>
        <ion-list no-lines  class="reind-list">
          <ion-item class="plan-list-item"  *ngFor="let remind of reminds; let idx = index" >
            <div class="color-dot"  item-start></div>
            <ion-label>{{remind.datename}}</ion-label>
            <button ion-button color="danger" (click)="delRemind(idx)" clear item-end>
              <img class="content-gc" src="./assets/imgs/sc.png">
            </button>
          </ion-item>
        </ion-list>
      </ion-content>
    </modal-box>
  `
})
export class RemindPage {

  @ViewChild("remindTiqian")
  remindTiqian:MultiPicker;

  @ViewChild("remindDt")
  remindDt:DateTime;

  statusBarColor: string = "#3c4d55";

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  dtvalue : string;
  tiqianvalue : string;

  evdatetime ; string;

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
          {text: '10小时', value:this.h2min(10)},
          {text: '11小时', value:this.h2min(11)},
          {text: '12小时', value:this.h2min(12)},
          {text: '13小时', value:this.h2min(13)},
          {text: '14小时', value:this.h2min(14)},
          {text: '15小时', value:this.h2min(15)},
          {text: '16小时', value:this.h2min(16)}],
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

    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value.txjson);
        if (this.currentTx.reminds.length > 0) {

          if (value.al == anyenum.IsWholeday.NonWhole) {
            this.evdatetime = moment(value.evd + " " + value.evt).format("YYYY/MM/DD HH:mm");

          } else {
            this.evdatetime = moment(value.evd + " " + "08:00").format("YYYY/MM/DD HH:mm");

          }
          for (let j = 0, len = this.currentTx.reminds.length; j < len; j++) {
            this.reminds.push(
              {
                datename:this.getShowDateName(this.currentTx.reminds[j]) ,
                value: this.currentTx.reminds[j]
              });
          }
        }

      }

    }
  }

  save() {
    this.currentTx.reminds.length = 0;
    for (let j = 0,len = this.reminds.length; j < len ; j++){
        this.currentTx.reminds.push(this.reminds[j].value);
    }

    let data: Object = {txjson: this.currentTx};
    this.viewCtrl.dismiss(data);
  }

  getShowDateName(time){
    let ret : string;
    ret = moment(this.evdatetime).subtract(time, 'm').format("YYYY/MM/DD HH:mm");

    ret = ret + "(" +TxJson.caption(time) + ")";

    return ret;
  }

  cancel() {
    this.navCtrl.pop();
  }

  openRemindTiqian(){
    this.remindTiqian.open();

  }
  openRemindDt(){
    this.remindDt.open();

  }

  tiqianselect(){

    if (!this.tiqianvalue){
      return;
    }
    let dtsplit = new Array<string>();
    let time;
    let dt;
    dtsplit = this.tiqianvalue.split(" ");
    if (dtsplit.length < 4){
      return;
    }

    time =  parseInt(dtsplit[1]) + parseInt(dtsplit[2]) + parseInt(dtsplit[3]);
    dt = moment(this.evdatetime).subtract(time,'m');
    this.reminds.push(
      {
        datename:moment(this.evdatetime).subtract(time, 'm').format("YYYY/MM/DD HH:mm")
        + "(" +TxJson.caption(time) + ")",
        value:time
      });
  }

  dtselect(){

    let dt = this.dtvalue.replace("T"," ");
    dt = dt.replace("Z","");
    let time = moment(this.evdatetime).diff(dt,'m');
    this.reminds.push(
      {
        datename:moment(dt).format("YYYY/MM/DD HH:mm") + "(" +TxJson.caption(time) + ")",
        value:time
      });
  }

  day2min(d){
    return d * 24 * 60;
  }

  h2min(h){
    return h * 60;
  }

  delRemind(index){
    this.reminds.splice(index,1);
  }
}
