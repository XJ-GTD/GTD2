import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import { RadioSelectComponent } from "../../components/radio-select/radio-select";

@IonicPage()
@Component({
  selector: 'page-cf',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>重复关闭。</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <radio-select [options]="items"></radio-select>
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

  constructor(public navCtrl: NavController,
              private keyboard: Keyboard) {
    this.items.push({value: "", caption: "关"});
    this.items.push({value: "day", caption: "每日"});
    this.items.push({value: "week", caption: "每周"});
    this.items.push({value: "month", caption: "每月"});
    this.items.push({value: "year", caption: "每年"});
  }

  ionViewDidEnter() {

  }

  close() {
    this.navCtrl.pop();
  }

}
