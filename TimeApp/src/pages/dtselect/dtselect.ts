import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";
import * as anyenum from "../../data.enum";
import {MultiPicker} from "ion-multi-picker";
import {TxJson} from "../../service/business/event.service";

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
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" (click)="openStartime()"  *ngIf="settype=='0'">
        <ion-multi-picker #startTime [(ngModel)]="stval.value"
                          (ngModelChange)="stselect();seteddate();" [multiPickerColumns]="dependentColumns"
                          cancelText="取消" doneText="设定"></ion-multi-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>开始时间</ion-label>
        <ion-label class = "timedisplay">{{stval.displayname}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='1'">
        <date-picker  #endDate item-content [(ngModel)]="pagedata.ed"
                      pickerFormat="YYYY ,MM DD" displayFormat="YYYY 年 MM 月 DD 日"
                      min="{{minDate}}" max="2059-01-01" cancelText="取消" doneText="选择"
        ></date-picker>
        <ion-label><ion-icon class="fal fa-calendar-alt"></ion-icon>结束日期</ion-label>
      </div>
      
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" (click)="openEndtime()"  *ngIf="settype=='1'">
        <ion-multi-picker #endTime [(ngModel)]="etval.value"
                          (ngModelChange)="etselect();" [multiPickerColumns]="dependentColumns2"
                          cancelText="取消" doneText="设定"></ion-multi-picker>
        <ion-label><ion-icon class="fal fa-clock"></ion-icon>结束时间</ion-label>
        <ion-label class = "timedisplay">{{etval.displayname}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal" *ngIf="settype=='0'">
        <ion-label>时长{{pagedata.ct | transfromdate:"duration"}}</ion-label>
      </div>
     
    </modal-box>
  `
})
export class DtSelectPage {

  @ViewChild("startTime")
  startTime: MultiPicker;
  @ViewChild("endTime")
  endTime: MultiPicker;

  stval = {
    displayname:"",
    value:""
  };

  etval = {
    displayname:"",
    value:""
  };

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

  dependentColumns: any[];

  dependentColumns2: any[];

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

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

    this.dependentColumns = [
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

    this.dependentColumns2 = [
      {
        columnWidth: '100px',
        options:ampmArray,
      },
      {
        columnWidth: '100px',
        options: hourArray,
      },
      {
        columnWidth: '100px',
        options:minArray
      }
    ];

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
      this.setTimeValue(this.pagedata.st,this.pagedata.et);
    }
  }

  private setTimeValue(st,et){
    let tmpval  = new Array<any>();

    tmpval = st.split(":");
    if (tmpval && tmpval.length == 2){

      if (parseInt(tmpval[0]) > 12){
        this.stval.value = "2" + " " + (parseInt(tmpval[0])- 12) + " " + tmpval[1];
        this.stval.displayname = "下午" + " " + (parseInt(tmpval[0]) - 12) + " 点 " + tmpval[1] + " 分";
      }else{
        this.stval.value = "1" + " 1" + tmpval[0] + " " + tmpval[1];
        this.stval.displayname = "上午" + " " + tmpval[0] + " 点 " + tmpval[1] + " 分";
      }
    }
    tmpval = et.split(":");
    if (tmpval && tmpval.length == 2){

      if (parseInt(tmpval[0]) > 12){
        this.etval.value = "2" + " " + (parseInt(tmpval[0])- 12) + " " + tmpval[1];
        this.etval.displayname = "下午" + " " + (parseInt(tmpval[0]) - 12) + " 点 " + tmpval[1] + " 分";
      }else{
        this.etval.value = "1" + " 1" + tmpval[0] + " " + tmpval[1];
        this.etval.displayname = "上午" + " " + tmpval[0] + " 点 " + tmpval[1] + " 分";
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
    this.pagedata.ed = moment(this.pagedata.sd + " " + this.pagedata.st).
      add(this.pagedata.ct, 'm').format("YYYY-MM-DD");
    this.pagedata.et = moment(this.pagedata.sd + " " + this.pagedata.st).
      add(this.pagedata.ct, 'm').format("HH:mm");
    this.setTimeValue(this.pagedata.st,this.pagedata.et);
  }

  private openStartime(){
    this.startTime.open();
  }

  private openEndtime(){
    this.endTime.open();
  }

  stselect() {

    if (!this.stval.value) {
      return;
    }
    let dtsplit = new Array<string>();
    let ampm;
    dtsplit = this.stval.value.split(" ");
    if (dtsplit.length < 3) {
      return;
    }
    if (dtsplit[0] == "1"){
      ampm = "上午";
      dtsplit[1] = dtsplit[1].substring(1);
    }else{
      ampm = "下午";
    }
    this.stval.displayname = ampm + " " + dtsplit[1] + " 点 " + dtsplit[2] + " 分";
    if (dtsplit[0] == "1"){
      this.pagedata.st =  dtsplit[1] + ":" + dtsplit[2];
    }else{
      this.pagedata.st =  (parseInt(dtsplit[1])+ 12) + ":" + dtsplit[2];
    }

  }

  etselect() {

    if (!this.etval.value) {
      return;
    }
    let dtsplit = new Array<string>();
    let ampm;
    dtsplit = this.etval.value.split(" ");
    if (dtsplit.length < 3) {
      return;
    }
    if (dtsplit[0] == "1"){
      dtsplit[1] = dtsplit[1].substring(1);
      ampm = "上午";
    }else{
      ampm = "下午";
    }
    this.etval.displayname = ampm + " " + dtsplit[1] + " 点 " + dtsplit[2] + " 分";
    if (dtsplit[0] == "1"){
      this.pagedata.et =  dtsplit[1] + ":" + dtsplit[2];
    }else{
      this.pagedata.et =  (parseInt(dtsplit[1])+ 12) + ":" + dtsplit[2];
    }

  }
}
