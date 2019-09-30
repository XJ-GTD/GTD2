import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-dtselect',
  template: `
    <modal-box title="活动日期" [buttons]="buttons" (onSave)="save()" (onCancel)="close()">
      <div class="itemwarp selectype">
        <ion-toolbar>
          <ion-buttons item-start>
            <button clear ion-button [class.noselect]="pagedata.type == '1'" (click)="changeType('0')">
              <ion-icon class="fal fa-arrow-alt-from-left"></ion-icon>
              设置开始日期
            </button>
            <button clear ion-button [class.noselect]="pagedata.type == '0'" (click)="changeType('1')">
              <ion-icon class="fal fa-arrow-alt-from-right"></ion-icon>
              设置截止日期
            </button>
          </ion-buttons>
        </ion-toolbar>
      </div>


      <div ion-item no-border no-padding no-lines no-margin class="itemwarp" *ngIf="pagedata.type==0">
        <date-picker  #startDate item-content [ngModel]="pagedata.sd"
                      pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日"
                      cancelText="取消" doneText="选择" (ionChange) = "calcCt()"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-calendar-alt"></ion-icon>开始日期</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp" *ngIf="pagedata.type==0">
        <date-picker #startTime  [ngModel]="pagedata.st" item-content pickerFormat="A hh mm  " displayFormat="A hh 点 mm 分" (ionChange) = "calcCt()"
                     doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>开始时间</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
        <date-picker  #endDate item-content [ngModel]="pagedata.ed"
                      pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日" (ionChange) = "calcCt()"
                      cancelText="取消" doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-calendar-alt"></ion-icon>结束日期</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
        <date-picker #endTime [ngModel]="pagedata.et" item-content pickerFormat="A hh 点 mm 分" (ionChange) = "calcCt()"
                     doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>结束时间</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp" *ngIf="pagedata.type==0">
        <ion-label>时长{{pagedata.ct | formatedate:"duration"}}</ion-label>
      </div>
     
    </modal-box>
  `
})
export class DtSelectPage {


  pagedata = {
    ct: 0,
    ed: '',
    et: '',
    sd: '',
    st: '',
    type:'1'
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
      this.pagedata.ct = this.navParams.data.ct;
      this.pagedata.ed =  moment(this.navParams.data.ed).format("YYYY-MM-DD");
      this.pagedata.et = this.navParams.data.et?this.navParams.data.et:"08:00";
      this.pagedata.sd = moment(this.navParams.data.sd).format("YYYY-MM-DD");
      this.pagedata.st = this.navParams.data.st?this.navParams.data.st:"08:00";
    }
  }

  close() {
    this.navCtrl.pop();
  }

  save() {
    this.viewCtrl.dismiss(this.pagedata);
  }

  calcCt(){
    console.log("ssssss");
    if (this.pagedata.sd && this.pagedata.st && this.pagedata.ed && this.pagedata.et){
      let startm = moment(this.pagedata.sd + "T"+ this.pagedata.st);
      let endm = moment(this.pagedata.ed + "T"+ this.pagedata.et);
      this.pagedata.ct = endm.diff(startm, 'm');
    }
  }

  changeType(type){
    this.pagedata.type = type;
  }
}
