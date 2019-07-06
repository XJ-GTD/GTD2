import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { RadioSelectComponent } from "../../components/radio-select/radio-select";

@IonicPage()
@Component({
  selector: 'page-cf',
  template: `
  <ion-content>
    <ion-grid class="h100" align-items-center>
      <ion-row justify-content-center>
        <p>重复关闭。</p>
      </ion-row>
      <ion-row justify-content-center>
        <radio-select [options]="items" center="true"></radio-select>
      </ion-row>
      <ion-row justify-content-center>
        <ion-grid class="mh15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select label="1周" [options]="itemRanges"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center>
        <ion-grid class="mh15">
          <ion-row justify-content-start>
            <p>重复开启</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select [options]="itemRangeOptions"></radio-select>
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

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard) {
    this.items.push({value: "", caption: "关"});
    this.items.push({value: "day", caption: "每日"});
    this.items.push({value: "week", caption: "每周"});
    this.items.push({value: "month", caption: "每月"});
    this.items.push({value: "year", caption: "每年"});

    this.itemRanges.push({value: "substract", caption: "-"});
    this.itemRanges.push({value: "add", caption: "+"});

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

}
