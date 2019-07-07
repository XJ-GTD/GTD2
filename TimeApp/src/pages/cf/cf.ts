import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { RadioSelectComponent } from "../../components/radio-select/radio-select";
import { RadioSpinnerComponent } from "../../components/radio-spinner/radio-spinner";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-cf',
  template: `
  <ion-content>
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
            <radio-select [options]="itemRangeOptions" [(ngModel)]="cfWeekOptions.freqOption"></radio-select>
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
            <radio-select [options]="itemRangeOptions" [(ngModel)]="cfMonthOptions.freqOption"></radio-select>
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
        </ion-grid>
      </ion-row>
    </ion-grid>
  </ion-content>

  <ion-footer class="foot-set">
    <ion-toolbar>
    <button ion-button full (click)="close()">
      关闭
    </button>
    </ion-toolbar>
  </ion-footer>
  `
})
export class CfPage {
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

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard) {
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
    this.navCtrl.pop();
  }

  private getFreqTitle(title: string, option: any) {
    let freqtitle = title;

    if (option.frequency) {
      freqtitle = option.frequency + freqtitle;

      if (option.freqOption) {
        freqtitle += " " + option.freqOption;
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
        endtitle = "直到 2020年2月28日";
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
        this.title = "重复周期 " + this.getFreqTitle("周", this.cfDayOptions) + ", " + this.getEndTitle(this.cfWeekOptions);
        break;
      case "month":
        this.title = "重复周期 " + this.getFreqTitle("月", this.cfDayOptions) + ", " + this.getEndTitle(this.cfMonthOptions);
        break;
      case "year":
        this.title = "重复周期 " + this.getFreqTitle("年", this.cfDayOptions) + ", " + this.getEndTitle(this.cfYearOptions);
        break;
      default:
        this.title = "重复关闭。";
        break;
    }
  }

  onTypeChanged(value) {
    this.resetTitle(value);
  }

  onFreqChanged() {
    this.resetTitle(this.cfType);
  }

  onFreqOptionChanged() {
    this.resetTitle(this.cfType);
  }

  onEndTypeChanged(value) {
    this.resetTitle(this.cfType);
  }

  onEndAfterTimesChanged(value) {
    this.resetTitle(this.cfType);
  }
}
