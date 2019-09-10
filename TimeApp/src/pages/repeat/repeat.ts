import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { RadioSelectComponent } from "../../components/radio-select/radio-select";
import { RadioSpinnerComponent } from "../../components/radio-spinner/radio-spinner";
import { DatePickerComponent } from "../../components/date-picker/date-picker";
import * as moment from "moment";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {RtJson} from "../../service/business/event.service";
import {CycleType, RtOver, OverType} from "../../data.enum";

@IonicPage()
@Component({
  selector: 'page-repeat',
  template: `
  <modal-box title="重复" (onClose)="close()">
    <ion-grid class="h100">
      <ion-row justify-content-center>
        <p class="title">{{title}}</p>
      </ion-row>
      <ion-row justify-content-center>
        <radio-select [options]="items" center="true" [(ngModel)]="cfType" (onChanged)="onTypeChanged($event)"></radio-select>
      </ion-row>
      <!-- 每日 -->
      <ion-row justify-content-center *ngIf="cfType == 'day'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-spinner label="天" [options]="itemRanges" [(ngModel)]="cfDayOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'day'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfDayOptions.endType" (ionChange)="onEndTypeChanged($event)">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div *ngIf="cfDayOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                  <radio-spinner label="次后" *ngIf="cfDayOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfDayOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="tosomeday"></ion-radio>
                <ion-label>直到某一天</ion-label>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
      </ion-row>
      <!-- 每周 -->
      <ion-row justify-content-center *ngIf="cfType == 'week'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-spinner label="周" [options]="itemRanges" [(ngModel)]="cfWeekOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'week'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复开启</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select [options]="itemRangeOptions"  multiple="true" [(ngModel)]="cfWeekOptions.freqOption" (onChanged)="onFreqOptionChanged($event)"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'week'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfWeekOptions.endType" (ionChange)="onEndTypeChanged($event)">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div *ngIf="cfWeekOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                  <radio-spinner label="次后" *ngIf="cfWeekOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfWeekOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="tosomeday"></ion-radio>
                <ion-label>直到某一天</ion-label>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
      </ion-row>
      <!-- 每月 -->
      <ion-row justify-content-center *ngIf="cfType == 'month'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-spinner label="月" [options]="itemRanges" [(ngModel)]="cfMonthOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'month'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复开启</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select [options]="itemRangeOptions" multiple="true" [(ngModel)]="cfMonthOptions.freqOption" (onChanged)="onFreqOptionChanged($event)"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'month'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfMonthOptions.endType" (ionChange)="onEndTypeChanged($event)">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div *ngIf="cfMonthOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                  <radio-spinner label="次后" *ngIf="cfMonthOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfMonthOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="tosomeday"></ion-radio>
                <ion-label>直到某一天</ion-label>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
      </ion-row>
      <!-- 每年 -->
      <ion-row justify-content-center *ngIf="cfType == 'year'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-spinner label="年" [options]="itemRanges" [(ngModel)]="cfYearOptions.frequency" (onChanged)="onFreqChanged($event)"></radio-spinner>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'year'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfYearOptions.endType" (ionChange)="onEndTypeChanged($event)">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div *ngIf="cfYearOptions.endType != 'aftertimes'" class="inlabel">一定次数后</div>
                  <radio-spinner label="次后" *ngIf="cfYearOptions.endType == 'aftertimes'" [options]="itemRanges" [(ngModel)]="cfYearOptions.afterTimes" (onChanged)="onEndAfterTimesChanged($event)"></radio-spinner>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="tosomeday"></ion-radio>
                <ion-label>直到某一天</ion-label>
              </ion-item>
            </ion-list>
          </ion-row>
          <ion-row justify-content-start *ngIf="cfYearOptions.endType == 'tosomeday'">
            <date-picker min="2019/7/9" max="2020/12/31"></date-picker>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
  </modal-box>
  `
})
export class RepeatPage {
  statusBarColor: string = "#3c4d55";

  originRepeat: RtJson;
  currentRepeat: RtJson;

  items: Array<any> = new Array<any>();
  itemRanges: Array<any> = new Array<any>();
  itemRangeOptions: Array<any> = new Array<any>();

  title: string = "重复关闭。";
  cfType: string = "";
  //每日选择参数
  cfDayOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "never",
    afterTimes: 1,
    toSomeDay: moment().format("YYYY年M月D日")
  };
  //每周选择参数
  cfWeekOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "never",
    afterTimes: 1,
    toSomeDay: moment().format("YYYY年M月D日")
  };
  //每月选择参数
  cfMonthOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "never",
    afterTimes: 1,
    toSomeDay: moment().format("YYYY年M月D日")
  };
  //每年选择参数
  cfYearOptions: any = {
    frequency: "",
    freqOption: "",
    endType: "never",
    afterTimes: 1,
    toSomeDay: moment().format("YYYY年M月D日")
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

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.originRepeat = value;
        this.currentRepeat = new RtJson();
        Object.assign(this.currentRepeat, this.originRepeat);
      }
    }
    this.items.push({value: "", caption: "关"});
    this.items.push({value: "day", caption: "每日"});
    this.items.push({value: "week", caption: "每周"});
    this.items.push({value: "month", caption: "每月"});
    this.items.push({value: "year", caption: "每年"});

    this.itemRanges.push({value: "subtract", icon: "remove"});
    this.itemRanges.push({value: "add", icon: "add"});

    this.itemRangeOptions.push({value: "sunday", caption: "日"});
    this.itemRangeOptions.push({value: "monday", caption: "一"});
    this.itemRangeOptions.push({value: "tuesday", caption: "二"});
    this.itemRangeOptions.push({value: "wednesday", caption: "三"});
    this.itemRangeOptions.push({value: "thursday", caption: "四"});
    this.itemRangeOptions.push({value: "friday", caption: "五"});
    this.itemRangeOptions.push({value: "saturday", caption: "六"});
  }

  ionViewDidEnter() {

  }

  close() {
    Object.assign(this.originRepeat, this.currentRepeat);
    let data: Object = {rtjson: this.originRepeat};
    this.viewCtrl.dismiss(data);
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
        this.title = "重复关闭。";
        break;
    }
  }

  resetValueWithType(rtjson: RtJson, cfType: string, target: string = "cycletype", value: any): RtJson {
    switch (cfType) {
      case "day":
        if (target == "cycletype") rtjson.cycletype = CycleType.day;
        if (target == "cyclenum") rtjson.cyclenum = this.cfDayOptions.frequency;
        break;
      case "week":
        if (target == "cycletype") rtjson.cycletype = CycleType.week;
        if (target == "cyclenum") rtjson.cyclenum = this.cfWeekOptions.frequency;
        if (target == "openway") rtjson.openway = this.cfDayOptions.frequency;
        break;
      case "month":
        if (target == "cycletype") rtjson.cycletype = CycleType.month;
        if (target == "cyclenum") rtjson.cyclenum = this.cfMonthOptions.frequency;
        if (target == "openway") rtjson.openway = this.cfDayOptions.frequency;
        break;
      case "year":
        if (target == "cycletype") rtjson.cycletype = CycleType.year;
        if (target == "cyclenum") rtjson.cyclenum = this.cfYearOptions.frequency;
        break;
      default:
        if (target == "cycletype") rtjson.cycletype = CycleType.close;
        break;
    }

    return rtjson;
  }

  onTypeChanged(value) {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, value);
    this.resetTitle(value);
  }

  onFreqChanged() {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "cyclenum");
    this.resetTitle(this.cfType);
  }

  onFreqOptionChanged() {
    this.currentRepeat = this.resetValueWithType(this.currentRepeat, this.cfType, "openway");
    this.resetTitle(this.cfType);
  }

  onEndTypeChanged(value) {
    this.resetTitle(this.cfType);
  }

  onEndAfterTimesChanged(value) {
    this.resetTitle(this.cfType);
  }
}
