import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController} from 'ionic-angular';
import { ScrollSelectComponent } from "../../components/scroll-select/scroll-select";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {RtJson, TxJson} from "../../service/business/event.service";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
  <modal-box title="提醒" (onClose)="close()">
    <scroll-select type="scroll-with-button" *ngFor="let remind of reminds" [value]="remind.value" (changed)="onRemindChanged($event)">
      <scroll-select-option value="">滑动以添加</scroll-select-option>
      <scroll-select-option value="5">5 分钟前</scroll-select-option>
      <scroll-select-option value="10">10 分钟前</scroll-select-option>
      <scroll-select-option value="15">15 分钟前</scroll-select-option>
      <scroll-select-option value="30">30 分钟前</scroll-select-option>
      <scroll-select-option value="60">1 小时前</scroll-select-option>
      <scroll-select-option value="120">2 小时前</scroll-select-option>
      <scroll-select-option value="180">3 小时前</scroll-select-option>
      <scroll-select-option value="360">6 小时前</scroll-select-option>
      <scroll-select-option value="720">12 小时前</scroll-select-option>
      <scroll-select-option value="1440">1 天前</scroll-select-option>
      <scroll-select-option value="2880">2 天前</scroll-select-option>
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
  currentTx: TxJson;

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value);
        if (this.currentTx.reminds.length > 0){
          this.reminds.push({value:""});
          for (let j = 0, len = this.currentTx.reminds.length ; j < len ; j++){
            this.reminds.push({value:this.currentTx.reminds[j]});
          }
        }else{
          this.reminds.push({value:""});
        }
      }
    }
  }

  async ionViewWillEnter(){

  }

  close() {
    this.currentTx.reminds.length = 0;
    for (let j = 0,len = this.reminds.length ; j < len ; j++){
      this.currentTx.reminds.push(this.reminds[j].value);
    }
    let data: Object = {txjson: this.currentTx};
    this.viewCtrl.dismiss(data);
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
