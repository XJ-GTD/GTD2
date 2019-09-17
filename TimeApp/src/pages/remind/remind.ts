import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController} from 'ionic-angular';
import { ScrollSelectComponent } from "../../components/scroll-select/scroll-select";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {RtJson, TxJson} from "../../service/business/event.service";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
  <modal-box title="提醒" (onSave)="save()" (onCancel)="cancel()">
    <scroll-select type="scroll-with-button" *ngFor="let remind of reminds"  [value]="remind.value" (changed)="onRemindChanged($event)">
      <scroll-select-option value="">滑动以添加</scroll-select-option>
      <scroll-select-option [value]="opt.value" *ngFor="let opt of selectOption">
        {{opt.caption}}
      </scroll-select-option>
    </scroll-select>
  </modal-box>
  `
})
export class RemindPage {
  statusBarColor: string = "#3c4d55";

  @ViewChildren(ScrollSelectComponent)
  remindComponents: QueryList<ScrollSelectComponent>;

  selectOption : Array<any> = new Array<any>();
  reminds: Array<any> = new Array<any>();
  currentTx: TxJson;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;
      //初始化选择项
      let arrOption = [5, 10,15,30,60,120,180,360,720,1440,2880,0];
      for (let j = 0,len  = arrOption.length; j < len ; j++){
        this.selectOption.push({value : arrOption[j],caption : TxJson.caption(arrOption[j])});
      }

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value);
        if (this.currentTx.reminds.length > 0){

          for (let j = 0, len = this.currentTx.reminds.length ; j < len ; j++){
            this.reminds.push({value:this.currentTx.reminds[j]});
          }
          this.reminds.push({value:""});
        }else{
          this.reminds.push({value:""});
        }
      }
    }
  }

  async ionViewWillEnter(){

  }

  save() {
    this.currentTx.reminds.length = 0;
    this.remindComponents.forEach((value,index,array)=>{
      if (value.value !=""){
        this.currentTx.reminds.push(value.value);
      }
    })

    let data: Object = {txjson: this.currentTx};
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }

  onRemindChanged(value1) {
    console.log(value1);

    if (value1) {
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
