import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { RadioSelectComponent } from "../../components/radio-select/radio-select";

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
        <radio-select [options]="items" center="true" (onChanged)="onTypeChanged($event)"></radio-select>
      </ion-row>
      <!-- 每日 -->
      <ion-row justify-content-center *ngIf="cfType == 'day'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复周期</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select label="1天" [options]="itemRanges"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'day'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfEndType">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div class="inlabel">一定次数后</div>
                  <radio-select *ngIf="cfEndType == 'aftertimes'" [options]="itemRanges"></radio-select>
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
            <radio-select label="1周" [options]="itemRanges"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'week'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>重复开启</p>
          </ion-row>
          <ion-row justify-content-start>
            <radio-select [options]="itemRangeOptions"></radio-select>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row justify-content-center *ngIf="cfType == 'week'">
        <ion-grid class="ph15">
          <ion-row justify-content-start>
            <p>结束</p>
          </ion-row>
          <ion-row justify-content-start>
            <ion-list class="endwith" radio-group no-lines [(ngModel)]="cfEndType">
              <ion-item>
                <ion-radio item-start value="never"></ion-radio>
                <ion-label>永远不</ion-label>
              </ion-item>
              <ion-item>
                <ion-radio item-start value="aftertimes"></ion-radio>
                <ion-label class="inline">
                  <div class="inlabel">一定次数后</div>
                  <radio-select *ngIf="cfEndType == 'aftertimes'" [options]="itemRanges"></radio-select>
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
  cfEndType: string = "never";

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard) {
    this.items.push({value: "", caption: "关"});
    this.items.push({value: "day", caption: "每日"});
    this.items.push({value: "week", caption: "每周"});
    this.items.push({value: "month", caption: "每月"});
    this.items.push({value: "year", caption: "每年"});

    this.itemRanges.push({value: "substract", icon: "remove"});
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

  onTypeChanged(value) {
    this.cfType = value;
  }

  onEndTypeChanged(value) {
    this.cfEndType = value;
  }
}
