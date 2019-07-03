import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tx',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>提醒</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <scroll-select type="scroll-with-button">
      <scroll-select-option value="">滑动以添加</scroll-select-option>
      <scroll-select-option value="5m">5 分钟前</scroll-select-option>
      <scroll-select-option value="10m">10 分钟前</scroll-select-option>
      <scroll-select-option value="15m">15 分钟前</scroll-select-option>
      <scroll-select-option value="30m">30 分钟前</scroll-select-option>
      <scroll-select-option value="1h">1 小时前</scroll-select-option>
      <scroll-select-option value="2h">2 小时前</scroll-select-option>
      <scroll-select-option value="3h">3 小时前</scroll-select-option>
      <scroll-select-option value="6h">6 小时前</scroll-select-option>
      <scroll-select-option value="12h">12 小时前</scroll-select-option>
      <scroll-select-option value="1d">1 天前</scroll-select-option>
      <scroll-select-option value="2d">2 天前</scroll-select-option>
    </scroll-select>
  </ion-content>
  `
})
export class TxPage {
}
