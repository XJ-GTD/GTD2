import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";
import * as anyenum from "../../data.enum";

@IonicPage()
@Component({
  selector: 'page-dtselect',
  template: `
    <modal-box title="活动日期" [buttons]="buttons" (onSave)="save()" (onCancel)="close()">
      <div >
        <ion-toolbar>
          <ion-buttons item-start>
            <button clear ion-button [class.noselect]="settype == '1'" (click)="changeType('0')" class="font-normal">
              <ion-icon class="fal fa-arrow-alt-from-left"></ion-icon>
              设置开始日期
            </button>
            <button [disabled]="pagedata.rfg == '1'" clear ion-button [class.noselect]="settype == '0'" (click)="changeType('1')" class="font-normal">
              <ion-icon class="fal fa-arrow-alt-from-right"></ion-icon>
              设置截止日期
            </button>
          </ion-buttons>
        </ion-toolbar>
      </div>


      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='0'">
        <date-picker  #startDate item-content [(ngModel)]="pagedata.sd"
                      pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日"
                      min="{{minDate}}" max="2059-01-01" cancelText="取消" doneText="选择"  (ionChange) = "seteddate()"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-calendar-alt"></ion-icon>开始日期</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='0'">
        <date-picker #startTime  [(ngModel)]="pagedata.st" item-content pickerFormat="A hh mm  " displayFormat="A hh 点 mm 分"
                     cancelText="取消"  doneText="选择" (ionChange) = "seteddate()"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>开始时间</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='1'">
        <date-picker  #endDate item-content [(ngModel)]="pagedata.ed"
                      pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日"
                      min="{{minDate}}" max="2059-01-01" cancelText="取消" doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-calendar-alt"></ion-icon>结束日期</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='1'">
        <date-picker #endTime [(ngModel)]="pagedata.et" item-content pickerFormat="A hh 点 mm 分"
                     cancelText="取消"   doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>结束时间</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='0'">
        <ion-label>时长{{pagedata.ct | transfromdate:"duration"}}</ion-label>
      </div>
     
    </modal-box>
  `
})
export class DtSelectPage {

  minDate : string = moment().format("YYYY-MM-DD");
  pagedata = {
    evd:moment().format("YYYY/MM/DD"),
    ct: 0,
    ed: moment().format("YYYY-MM-DD"),
    et: '',
    sd: moment().format("YYYY-MM-DD"),
    st: '',
    rfg:''
  };
  retdata = {
    sd:'',
    ed:'',
    evd:'',
    evt:'',
    al:'',
    ct: 0,
    et: '',
    st: '',
  };
  settype = '0';

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {



    if (this.navParams && this.navParams.data) {

      this.pagedata.ct = this.navParams.data.ct;

      this.pagedata.rfg = this.navParams.data.rfg;
      this.pagedata.evd = this.navParams.data.evd;
      if ( this.navParams.data.al == anyenum.IsWholeday.StartSet ){
        this.settype = '0';
        this.pagedata.sd = moment(this.navParams.data.evd).format("YYYY-MM-DD");
        this.pagedata.ed =  moment(this.navParams.data.evd + " " + this.navParams.data.evt).
        add(this.navParams.data.ct,'m').format("YYYY-MM-DD");
        this.pagedata.st = this.navParams.data.evt;
        this.pagedata.et = moment(this.navParams.data.evd + " " + this.navParams.data.evt).
        add(this.navParams.data.ct,'m').format("HH:mm");

      }else if(this.navParams.data.al == anyenum.IsWholeday.EndSet){
        this.settype = '1';
        this.pagedata.sd = moment(this.navParams.data.evd).format("YYYY-MM-DD");
        this.pagedata.ed =  moment(this.navParams.data.evd).format("YYYY-MM-DD");
        this.pagedata.st = this.navParams.data.evt;
        this.pagedata.et = this.navParams.data.evt;
      }else{
        this.iniTime();
      }
    }
  }

  close() {
    this.navCtrl.pop();
  }

  save() {
    if (this.settype == '0'){
      this.retdata.al = anyenum.IsWholeday.StartSet;
      this.retdata.sd = moment(this.pagedata.sd).format("YYYY/MM/DD");
      this.retdata.st = this.pagedata.st;
      this.retdata.ct = this.pagedata.ct ;

      this.retdata.evd = this.retdata.sd;
      this.retdata.evt = this.retdata.st;
      this.retdata.ed =  moment(this.retdata.sd + " " + this.retdata.st).
        add(this.retdata.ct, 'm').format("YYYY/MM/DD");
      this.retdata.et = moment(this.retdata.sd + " " + this.retdata.st).
        add(this.retdata.ct, 'm').format("HH:mm");
    }else{
      this.retdata.al = anyenum.IsWholeday.EndSet;
      this.retdata.ed = moment(this.pagedata.ed).format("YYYY/MM/DD");
      this.retdata.et = this.pagedata.et;
      this.retdata.ct = 0;

      this.retdata.evd = this.retdata.ed;
      this.retdata.evt = this.retdata.et;
      this.retdata.sd = this.retdata.ed;
      this.retdata.st = this.retdata.et;

    }
    this.viewCtrl.dismiss(this.retdata);
  }

  changeType(type){
    this.settype = type;
  }

  private iniTime() {
    this.settype = "0";
    this.pagedata.sd = moment(this.navParams.data.evd).format("YYYY-MM-DD");
    if (moment().isBefore(moment(moment().format("YYYY/MM/DD") + " " + "08:00"))) {
      this.pagedata.st = "08:00";
    } else {
      this.pagedata.st = moment().format("HH:mm");
    }
    this.pagedata.ct = 60;
    this.pagedata.ed = moment(this.pagedata.sd).add(this.pagedata.ct, 'm').format("YYYY-MM-DD");
    this.pagedata.et = moment(this.pagedata.sd + " " + this.pagedata.st).
    add(this.pagedata.ct, 'm').format("HH:mm");
  }

  private seteddate(){
    this.pagedata.ed = moment(this.pagedata.sd + "T" + this.pagedata.st).
      add(this.pagedata.ct, 'm').format("YYYY-MM-DD");
    this.pagedata.et = moment(this.pagedata.sd + "T" + this.pagedata.st).
      add(this.pagedata.ct, 'm').format("HH:mm");
  }
}
