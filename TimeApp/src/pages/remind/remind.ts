import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from "../../components/scroll-select/scroll-select";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
  <modal-box title="提醒" (onClose)="close()">
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
      <scroll-select-option value="0">当事件开始</scroll-select-option>
    </scroll-select>
  </modal-box>
  `
})
export class RemindPage {
  statusBarColor: string = "#3c4d55";

  @ViewChildren(ScrollSelectComponent)
  remindComponents: QueryList<ScrollSelectComponent>;

  reminds: Array<any> = new Array<any>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.reminds.push({value: ""});
      }
    }
  }

  close() {
    this.navCtrl.pop();
  }

  onRemindChanged(value) {
    console.log(value);

    if (value) {
      //选择或修改提醒
      let hasEmpty = this.remindComponents.some((value, index, array) => {
        return value.value == "";
      });

      if (!hasEmpty) {
        this.reminds.push({value: ""});
      }
    } else {
      //取消提醒
      let forRemoved: Array<number> = new Array<number>();

      this.remindComponents.forEach((item, index) => {
        if (item.value == "") forRemoved.push(index);
      });

      let results: Array<any> = this.reminds.filter((element, index) => {
        return forRemoved.indexOf(index) < 0;
      });

      if (!results)
        results = new Array<any>();

      results.push({value: ""});

      this.reminds = results;
    }
  }
}
