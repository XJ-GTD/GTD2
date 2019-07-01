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
      <scroll-select-option>滑动以添加</scroll-select-option>
      <scroll-select-option>5 分钟前</scroll-select-option>
      <scroll-select-option>10 分钟前</scroll-select-option>
      <scroll-select-option>15 分钟前</scroll-select-option>
      <scroll-select-option>30 分钟前</scroll-select-option>
      <scroll-select-option>1 小时前</scroll-select-option>
      <scroll-select-option>2 小时前</scroll-select-option>
      <scroll-select-option>3 小时前</scroll-select-option>
      <scroll-select-option>6 小时前</scroll-select-option>
      <scroll-select-option>12 小时前</scroll-select-option>
      <scroll-select-option>1 天前</scroll-select-option>
      <scroll-select-option>2 天前</scroll-select-option>
    </scroll-select>
  </ion-content>
  `
})
export class TxPage {
}
