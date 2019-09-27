import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-dtselect',
  template: `
    <modal-box title="活动日期" [buttons]="buttons" (onSave)="save()" (onCancel)="close()">
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
        <date-picker item-content [ngModel]="pagedata.sd"
                     pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日"
                     cancelText="取消" doneText="选择时间"
        ></date-picker>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
        <div item-content radio-group class="selectype" [(ngModel)]="selected" >
          <div class="waper" ion-item float-lg-left>
            <ion-radio value="0"></ion-radio>
            <ion-label>开始</ion-label>
          </div>
          <div class="waper" ion-item float-lg-right>
            <ion-radio  value="1"></ion-radio>
            <ion-label>截止</ion-label>
          </div>
        </div>
      </div>
      
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
        <ion-label *ngIf="pagedata.isall">全天</ion-label>
        <ion-label *ngIf="!pagedata.isall">时长{{pagedata.ct}}</ion-label>
        <ion-toggle [(ngModel)]="pagedata.isall"></ion-toggle>
      </div>
      <div ion-item no-border no-padding no-lines no-margin *ngIf="!pagedata.isall" class="itemwarp">
        <ion-label>开始时间</ion-label>
        <date-picker [ngModel]="pagedata.st" item-content pickerFormat="A hh mm  " displayFormat="A hh 点 mm 分"
                     doneText="设定"
        ></date-picker>
      </div>
      <div ion-item no-border no-padding no-lines no-margin *ngIf="!pagedata.isall" class="itemwarp">
        <ion-label>结束时间</ion-label>
        <date-picker [ngModel]="pagedata.et" item-content pickerFormat="A hh 点 mm 分"
                     doneText="设定"
        ></date-picker>
      </div>
    </modal-box>
  `
})
export class DtSelectPage {


  pagedata = {
    al: '',
    ct: 0,
    ed: '',
    et: '',
    sd: '',
    st: '',
    type:'',
    isall: false
  };

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
      this.pagedata.al = this.navParams.data.al;
      this.pagedata.ct = this.navParams.data.ct;
      this.pagedata.ed = this.navParams.data.ed;
      this.pagedata.et = this.navParams.data.et;
      this.pagedata.sd = moment(this.navParams.data.sd).format("YYYY-MM-DD");
      this.pagedata.st = this.navParams.data.st;
      this.pagedata.isall = this.pagedata.al == "1";
    }
  }

  close() {
    this.navCtrl.pop();
  }

  save() {
    this.pagedata.al = this.pagedata.isall ? "1" : "0";
    this.viewCtrl.dismiss(this.pagedata);
  }
}
