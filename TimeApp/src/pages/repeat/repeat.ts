import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { DatePickerComponent } from "../../components/date-picker/date-picker";
import * as moment from "moment";
import {RtJson} from "../../service/business/event.service";
import {CycleType, OverType} from "../../data.enum";
import {UtilService} from "../../service/util-service/util.service";

@IonicPage()
@Component({
  selector: 'page-repeat',
  template: `
    <modal-box title="重复" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()" [enableEdit]="enableEdit">
      <div class="itemwarp" >
        <radio-select   [options]="items" full="true" center =  "true" [(ngModel)]="cfType" (onChanged)="onTypeChanged($event)" button5></radio-select>
      </div>

      <div class="repeattitle ">
        <p>从{{startDate | formatedate :"CYYYY/MM/DD W"}}开始</p>
      </div>
      

      <ng-template  [ngIf]="cfType == 'day'">

        <div class="itemwarp">
          <p>重复周期</p>
          <radio-spinner  label="天" [options]="itemRanges" [(ngModel)]="cfDayOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
        </div>
        <div class="itemwarp">
          <p>结束</p>
          <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfDayOptions.endType" (ionChange)="onEndTypeChanged($event)">
            <!--<ion-item >
              <ion-radio value="never" item-start></ion-radio>
              <ion-label>默认(1年)</ion-label>
            </ion-item>-->
            <ion-item>
              <ion-radio value="aftertimes" item-start></ion-radio>
              <ion-label class="inline">
                <div *ngIf="cfDayOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                <radio-spinner label="次后" *ngIf="cfDayOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfDayOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-radio  (ionSelect)="openUntilEndDate('d')" value="tosomeday" item-start>

              </ion-radio>
              <ion-label>直到{{cfDayOptions.toSomeDay | formatedate : 'CYYYY/MM/DD W'}}</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ng-template>

      <ng-template  [ngIf]="cfType == 'week'">

        <div class="itemwarp">
          <p>重复周期</p>
          <radio-spinner label="周" [options]="itemRanges" [(ngModel)]="cfWeekOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
        </div>
        <div class="itemwarp font-normal">
          <p>重复开启</p>
          <radio-select [options]="itemRangeOptions"  multiple="true" [(ngModel)]="cfWeekOptions.freqOption" (onChanged)="onFreqOptionChanged($event)" button7></radio-select>
        </div>

        <div class="itemwarp">
          <p>结束</p>
          <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfWeekOptions.endType" (ionChange)="onEndTypeChanged($event)">
            <!--<ion-item>
              <ion-radio  value="never"  item-start></ion-radio>
              <ion-label>默认(2年)</ion-label>
            </ion-item>-->
            <ion-item>
              <ion-radio  value="aftertimes"  item-start></ion-radio>
              <ion-label class="inline">
                <div *ngIf="cfWeekOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                <radio-spinner label="次后" *ngIf="cfWeekOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfWeekOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-radio (ionSelect)="openUntilEndDate('w')"  value="tosomeday"  item-start></ion-radio>
              <ion-label>直到{{cfWeekOptions.toSomeDay | formatedate : 'CYYYY/MM/DD W'}}</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ng-template>

      <ng-template  [ngIf]="cfType == 'month'">

        <div class="itemwarp">
          <p>重复周期</p>
          <radio-spinner label="月" [options]="itemRanges" [(ngModel)]="cfMonthOptions.frequency" (onChanged)="onFreqChanged($event)" ></radio-spinner>
        </div>
        <div class="itemwarp">
          <p>重复开启</p>
          <radio-select [options]="itemMonthDayRangeOptions" multiple="true" [(ngModel)]="cfMonthOptions.freqOption" (onChanged)="onFreqOptionChanged($event)" button7></radio-select>
        </div>

        <div class="itemwarp">
          <p>结束</p>
          <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfMonthOptions.endType" (ionChange)="onEndTypeChanged($event)">
            <!--<ion-item>
              <ion-radio item-start value="never"></ion-radio>
              <ion-label>默认(3年)</ion-label>
            </ion-item>-->
            <ion-item>
              <ion-radio item-start value="aftertimes"></ion-radio>
              <ion-label class="inline">
                <div *ngIf="cfMonthOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                <radio-spinner label="次后" *ngIf="cfMonthOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfMonthOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-radio (ionSelect)="openUntilEndDate('m')" item-start value="tosomeday"></ion-radio>
              <ion-label>直到{{cfMonthOptions.toSomeDay | formatedate : 'CYYYY/MM/DD W'}}</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ng-template>

      <ng-template  [ngIf]="cfType == 'year'">

        <div class="itemwarp">
          <p>重复周期</p>
          <radio-spinner label="年" [options]="itemRanges" [(ngModel)]="cfYearOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
        </div>
        <div class="itemwarp">
          <p>结束</p>          
          <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfYearOptions.endType" (ionChange)="onEndTypeChanged($event)">
            <!--<ion-item>
              <ion-radio item-start value="never"></ion-radio>
              <ion-label>默认(20年)</ion-label>
            </ion-item>-->
            <ion-item>
              <ion-radio item-start value="aftertimes"></ion-radio>
              <ion-label class="inline">
                <div *ngIf="cfYearOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                <radio-spinner label="次后" *ngIf="cfYearOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfYearOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-radio (ionSelect)="openUntilEndDate('y')" item-start value="tosomeday"></ion-radio>
              <ion-label>直到{{cfYearOptions.toSomeDay | formatedate : 'CYYYY/MM/DD W'}}</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </ng-template>

    </modal-box>

    <div style="display: none">
      <date-picker  #utilEndDateD [(ngModel)]="cfDayOptions.toSomeDay"
                    pickerFormat="YYYY ,MM DD"
                    cancelText="取消" doneText="选择" (ngModelChange)="dtselect('d')"
                    min="{{minDate}}" max="2059-01-01"
      ></date-picker>
      <date-picker  #utilEndDateW [(ngModel)]="cfWeekOptions.toSomeDay"
                    pickerFormat="YYYY ,MM DD"
                    cancelText="取消" doneText="选择" (ngModelChange)="dtselect('w')"
                    min="{{minDate}}" max="2059-01-01"
      ></date-picker>
      <date-picker  #utilEndDateM [(ngModel)]="cfMonthOptions.toSomeDay"
                    pickerFormat="YYYY ,MM DD"
                    cancelText="取消" doneText="选择" (ngModelChange)="dtselect('m')"
                    min="{{minDate}}" max="2059-01-01"
      ></date-picker>
      <date-picker  #utilEndDateY [(ngModel)]="cfYearOptions.toSomeDay"
                    pickerFormat="YYYY ,MM DD"
                    cancelText="取消" doneText="选择" (ngModelChange)="dtselect('y')"
                    min="{{minDate}}" max="2059-01-01"
      ></date-picker>
    </div>
  `
})
export class RepeatPage {

  @ViewChild("utilEndDateD")
  utilEndDateD: DatePickerComponent;
  @ViewChild("utilEndDateW")
  utilEndDateW: DatePickerComponent;
  @ViewChild("utilEndDateM")
  utilEndDateM: DatePickerComponent;
  @ViewChild("utilEndDateY")
  utilEndDateY: DatePickerComponent;

  startDate:string;

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  originRepeat: RtJson;
  currentRepeat: RtJson;

  items: Array<any> = new Array<any>();
  itemRanges: Array<any> = new Array<any>();
  itemRangeOptions: Array<any> = new Array<any>();
  itemMonthDayRangeOptions: Array<any> = new Array<any>();

  title: string = "";
  cfType: string = "";
  minDate : string = moment().format("YYYY-MM-DD");
  //每日选择参数
  cfDayOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "tosomeday",
    afterTimes: 1,
    toSomeDay: ""
  };
  //每周选择参数
  cfWeekOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "tosomeday",
    afterTimes: 1,
    toSomeDay: ""
  };
  //每月选择参数
  cfMonthOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "tosomeday",
    afterTimes: 1,
    toSomeDay: ""
  };
  //每年选择参数
  cfYearOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "tosomeday",
    afterTimes: 1,
    toSomeDay: ""
  };

  optionCaptions: any = {
    sunday: "星期日",
    monday: "星期一",
    tuesday: "星期二",
    wednesday: "星期三",
    thursday: "星期四",
    friday: "星期五",
    saturday: "星期六",
  };

  enableEdit : boolean = false;

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams,private util : UtilService,
              private changeDetectorRef: ChangeDetectorRef,) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;
      this.startDate =  this.navParams.data.sd;
      this.enableEdit = this.navParams.data.enableEdit;
      if (!this.enableEdit){
        this.buttons.save = false;
      }
      if (value) {

        this.originRepeat = value;
        this.currentRepeat = new RtJson();
        this.util.cloneObj(this.currentRepeat, this.originRepeat);

      }
    }
    this.items.push({value: "", caption: "关闭"});
    this.items.push({value: "day", caption: "每日"});
    this.items.push({value: "week", caption: "每周"});
    this.items.push({value: "month", caption: "每月"});
    this.items.push({value: "year", caption: "每年"});

    this.itemRanges.push({value: "subtract", icon: "fa-minus"});
    this.itemRanges.push({value: "add", icon: "fa-plus"});

    this.itemRangeOptions.push({value: "sunday", caption: "日"});
    this.itemRangeOptions.push({value: "monday", caption: "一"});
    this.itemRangeOptions.push({value: "tuesday", caption: "二"});
    this.itemRangeOptions.push({value: "wednesday", caption: "三"});
    this.itemRangeOptions.push({value: "thursday", caption: "四"});
    this.itemRangeOptions.push({value: "friday", caption: "五"});
    this.itemRangeOptions.push({value: "saturday", caption: "六"});

    for (let day = 1; day <= 31; day++) {
      this.itemMonthDayRangeOptions.push({value: `${day}`, caption: `${day}`});
    }

    this.initRepeatShow();
  }

  ionViewDidEnter() {

  }

  save() {
    this.util.cloneObj(this.originRepeat, this.currentRepeat);
    let data: Object = {rtjson: this.originRepeat};
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }

  private getFreqTitle(title: string, option: any) {
    let freqtitle = title;

    if (option.frequency) {
      freqtitle = (option.frequency == 1? "" : option.frequency) + freqtitle;

      if (option.freqOption) {
        let caption = this.optionCaptions[option.freqOption];
        freqtitle += " " + (caption? caption : "");
      }
    }

    return freqtitle;
  }

  private getEndTitle(option: any) {
    let endtitle = "永不";

    switch (option.endType) {
      case "never":
        endtitle = "永不";
        break;
      case "aftertimes":
        endtitle = option.afterTimes + "次";
        break;
      case "tosomeday":
        endtitle = "直到 " + option.toSomeDay;
        break;
      default:
        break;
    }

    return endtitle;
  }

  resetTitle(cfType: string) {
    switch (cfType) {
      case "day":
        this.title = "重复周期 " + this.getFreqTitle("日", this.cfDayOptions) + ", " + this.getEndTitle(this.cfDayOptions);
        break;
      case "week":
        this.title = "重复周期 " + this.getFreqTitle("周", this.cfWeekOptions) + ", " + this.getEndTitle(this.cfWeekOptions);
        break;
      case "month":
        this.title = "重复周期 " + this.getFreqTitle("月", this.cfMonthOptions) + ", " + this.getEndTitle(this.cfMonthOptions);
        break;
      case "year":
        this.title = "重复周期 " + this.getFreqTitle("年", this.cfYearOptions) + ", " + this.getEndTitle(this.cfYearOptions);
        break;
      default:
        this.title = "";
        break;
    }
  }

  initRepeatShow() {
    switch(this.currentRepeat.cycletype) {
      case CycleType.day:
        this.cfType = "day";
        this.cfDayOptions.frequency = this.currentRepeat.cyclenum;
        switch(this.currentRepeat.over.type) {
          case OverType.fornever:
            this.cfDayOptions.endType = "never";
            break;
          case OverType.times:
            this.cfDayOptions.endType = "aftertimes";
            this.cfDayOptions.afterTimes = this.currentRepeat.over.value;
            break;
          case OverType.limitdate:
            this.cfDayOptions.endType = "tosomeday";
            this.cfDayOptions.toSomeDay = moment(this.currentRepeat.over.value, "YYYY/MM/DD").format("YYYY-MM-DD");
            break;
          default:
            break;
        }
        break;
      case CycleType.week:
        this.cfType = "week";
        this.cfWeekOptions.frequency = this.currentRepeat.cyclenum;
        if (this.currentRepeat.openway && this.currentRepeat.openway.length > 0) {
          this.cfWeekOptions.freqOption = new Array<any>();
          this.cfWeekOptions.freqOption = this.itemRangeOptions.reduce((target, val, index) => {
            if (this.currentRepeat.openway.indexOf(index) >= 0) {
              target.push(val.value);
            } else {
              target.push(null);
            }

            return target;
          }, this.cfWeekOptions.freqOption);
        }
        switch(this.currentRepeat.over.type) {
          case OverType.fornever:
            this.cfWeekOptions.endType = "never";
            break;
          case OverType.times:
            this.cfWeekOptions.endType = "aftertimes";
            this.cfWeekOptions.afterTimes = this.currentRepeat.over.value;
            break;
          case OverType.limitdate:
            this.cfWeekOptions.endType = "tosomeday";
            this.cfWeekOptions.toSomeDay = moment(this.currentRepeat.over.value, "YYYY/MM/DD").format("YYYY-MM-DD");
            break;
          default:
            break;
        }
        break;
      case CycleType.month:
        this.cfType = "month";
        this.cfMonthOptions.frequency = this.currentRepeat.cyclenum;
        if (this.currentRepeat.openway && this.currentRepeat.openway.length > 0) {
          this.cfMonthOptions.freqOption = new Array<any>();
          this.cfMonthOptions.freqOption = this.itemMonthDayRangeOptions.reduce((target, val, index) => {
            if (this.currentRepeat.openway.indexOf(index) >= 0) {
              target.push(val.value);
            } else {
              target.push(null);
            }

            return target;
          }, this.cfMonthOptions.freqOption);
        }
        switch(this.currentRepeat.over.type) {
          case OverType.fornever:
            this.cfMonthOptions.endType = "never";
            break;
          case OverType.times:
            this.cfMonthOptions.endType = "aftertimes";
            this.cfMonthOptions.afterTimes = this.currentRepeat.over.value;
            break;
          case OverType.limitdate:
            this.cfMonthOptions.endType = "tosomeday";
            this.cfMonthOptions.toSomeDay = moment(this.currentRepeat.over.value, "YYYY/MM/DD").format("YYYY-MM-DD");
            break;
          default:
            break;
        }
        break;
      case CycleType.year:
        this.cfType = "year";
        this.cfYearOptions.frequency = this.currentRepeat.cyclenum;
        switch(this.currentRepeat.over.type) {
          case OverType.fornever:
            this.cfYearOptions.endType = "never";
            break;
          case OverType.times:
            this.cfYearOptions.endType = "aftertimes";
            this.cfYearOptions.afterTimes = this.currentRepeat.over.value;
            break;
          case OverType.limitdate:
            this.cfYearOptions.endType = "tosomeday";
            this.cfYearOptions.toSomeDay = moment(this.currentRepeat.over.value, "YYYY/MM/DD").format("YYYY-MM-DD");
            break;
          default:
            break;
        }
        break;
      default:
        this.cfType = "";
        break;
    }
  }

  resetValueWithType(rtjson: RtJson, cfType: string, target: string = "cycletype", value: any = undefined): RtJson {
    switch (cfType) {
      case "day":
        if (target == "cycletype") rtjson.cycletype = CycleType.day;
        if (target == "cyclenum" || target == "cycletype") rtjson.cyclenum = this.cfDayOptions.frequency;
        if (target == "over" || target == "cycletype") {
          switch (this.cfDayOptions.endType) {
            case "never":
              rtjson.over.type = OverType.fornever;
              this.cfDayOptions.toSomeDay = "";
              break;
            case "aftertimes":
              rtjson.over.type = OverType.times;
              rtjson.over.value = this.cfDayOptions.afterTimes;
              this.cfDayOptions.toSomeDay = "";
              break;
            case "tosomeday":
              rtjson.over.type = OverType.limitdate;
              if (this.cfDayOptions.toSomeDay == ""){
                this.cfDayOptions.toSomeDay =  moment().add(1,'y').format("YYYY-MM-DD");
              }
              rtjson.over.value = moment(this.cfDayOptions.toSomeDay, "YYYY-MM-DD").format("YYYY/MM/DD");

              break;
            default:
              break;
          }
        }
        break;
      case "week":
        if (target == "cycletype") rtjson.cycletype = CycleType.week;
        if (target == "cyclenum" || target == "cycletype") rtjson.cyclenum = this.cfWeekOptions.frequency;
        if (target == "openway" || target == "cycletype") {
          rtjson.openway.length = 0;

          if (this.cfWeekOptions.freqOption && this.cfWeekOptions.freqOption instanceof Array) {
            rtjson.openway = this.cfWeekOptions.freqOption.reduce((target, val, index) => {
              if (val) {
                target.push(index);
              }

              return target;
            }, rtjson.openway);
          }
        }
        if (target == "over" || target == "cycletype") {
          switch (this.cfWeekOptions.endType) {
            case "never":
              rtjson.over.type = OverType.fornever;
              this.cfWeekOptions.toSomeDay = "";
              break;
            case "aftertimes":
              rtjson.over.type = OverType.times;
              rtjson.over.value = this.cfWeekOptions.afterTimes;
              this.cfWeekOptions.toSomeDay = "";
              break;
            case "tosomeday":
              rtjson.over.type = OverType.limitdate;
              if (this.cfWeekOptions.toSomeDay == ""){
                this.cfWeekOptions.toSomeDay =  moment().add(2,'y').format("YYYY-MM-DD");
              }
              rtjson.over.value = moment(this.cfWeekOptions.toSomeDay, "YYYY-MM-DD").format("YYYY/MM/DD");

              break;
            default:
              break;
          }
        }
        break;
      case "month":
        if (target == "cycletype") rtjson.cycletype = CycleType.month;
        if (target == "cyclenum" || target == "cycletype") rtjson.cyclenum = this.cfMonthOptions.frequency;
        if (target == "openway" || target == "cycletype") {
          rtjson.openway.length = 0;

          if (this.cfMonthOptions.freqOption && this.cfMonthOptions.freqOption instanceof Array) {
            rtjson.openway = this.cfMonthOptions.freqOption.reduce((target, val, index) => {
              if (val) {
                target.push(index);
              }

              return target;
            }, rtjson.openway);
          }
        }
        if (target == "over" || target == "cycletype") {
          switch (this.cfMonthOptions.endType) {
            case "never":
              rtjson.over.type = OverType.fornever;
              this.cfMonthOptions.toSomeDay = "";
              break;
            case "aftertimes":
              rtjson.over.type = OverType.times;
              rtjson.over.value = this.cfMonthOptions.afterTimes;
              this.cfMonthOptions.toSomeDay = "";
              break;
            case "tosomeday":
              rtjson.over.type = OverType.limitdate;
              if (this.cfMonthOptions.toSomeDay == ""){
                this.cfMonthOptions.toSomeDay =  moment().add(3,'y').format("YYYY-MM-DD");
              }
              rtjson.over.value = moment(this.cfMonthOptions.toSomeDay, "YYYY-MM-DD").format("YYYY/MM/DD");

              break;
            default:
              break;
          }
        }
        break;
      case "year":
        if (target == "cycletype") rtjson.cycletype = CycleType.year;
        if (target == "cyclenum" || target == "cycletype") rtjson.cyclenum = this.cfYearOptions.frequency;
        if (target == "over" || target == "cycletype") {
          switch (this.cfYearOptions.endType) {
            case "never":
              rtjson.over.type = OverType.fornever;
              this.cfYearOptions.toSomeDay = "";
              break;
            case "aftertimes":
              rtjson.over.type = OverType.times;
              rtjson.over.value = this.cfYearOptions.afterTimes;
              this.cfYearOptions.toSomeDay = "";
              break;
            case "tosomeday":
              rtjson.over.type = OverType.limitdate;
              if (this.cfYearOptions.toSomeDay == ""){
                this.cfYearOptions.toSomeDay =  moment().add(20,'y').format("YYYY-MM-DD");
              }
              rtjson.over.value = moment(this.cfYearOptions.toSomeDay, "YYYY-MM-DD").format("YYYY/MM/DD");

              break;
            default:
              break;
          }
        }
        break;
      default:
        if (target == "cycletype") rtjson.cycletype = CycleType.close;
        break;
    }

    return rtjson;
  }

  onTypeChanged(value) {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, value);
    this.title = this.currentRepeat.text();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  onFreqChanged() {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "cyclenum");
    this.title = this.currentRepeat.text();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  onFreqOptionChanged() {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "openway");
    this.title = this.currentRepeat.text();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  onEndTypeChanged(value) {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "over");
    this.title = this.currentRepeat.text();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  onEndAfterTimesChanged(value) {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "over");
    this.title = this.currentRepeat.text();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  openUntilEndDate(type){
    switch (type) {
      case 'd':
        setTimeout(()=>{

          this.utilEndDateD.open();
        },100);

        break;
      case 'w':
        setTimeout(()=>{

          this.utilEndDateW.open();
        },100);
        break;
      case 'm':
        setTimeout(()=>{

          this.utilEndDateM.open();
        },100);
        break;
      case 'y':
        setTimeout(()=>{

          this.utilEndDateY.open();
        },100);
        break;
      default:
        break;
    }

  }

  dtselect() {
    this.onEndTypeChanged(null);

  }
}
