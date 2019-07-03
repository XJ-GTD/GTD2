import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from "../../components/scroll-select/scroll-select";

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
    <scroll-select type="scroll-with-button" *ngFor="let remind of reminds" [value]="remind.value" (changed)="onRemindChanged($event)">
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

  @ViewChildren(ScrollSelectComponent)
  remindComponents: QueryList<ScrollSelectComponent>;

  reminds: Array<any> = new Array<any>();

  constructor() {
    this.reminds.push({value: ""});
  }

  onRemindChanged(value) {
    console.log(value);

    if (value) {
      let hasEmpty: boolean = false;
      for (let remind: ScrollSelectComponent of this.remindComponents.toArray()) {
        if (remind.value == "") {
          hasEmpty = true;
          break;
        }
      }

      if (hasEmpty) {
        this.reminds.push({value: ""});
      }
    } else {

    }
  }
}
