import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Scroll, ViewController} from 'ionic-angular';
import {ScrollSelectComponent} from "../../components/scroll-select/scroll-select";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {RtJson, TxJson} from "../../service/business/event.service";
import {MultiPicker} from "ion-multi-picker";

@IonicPage()
@Component({
  selector: 'page-remind',
  template: `
    <modal-box title="提醒" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
      <!--<scroll-select type="scroll-with-button" *ngFor="let remind of reminds"  [value]="remind.value" (changed)="onRemindChanged($event)">-->
      <!--<scroll-select-option value="">滑动以添加</scroll-select-option>-->
      <!--<scroll-select-option [value]="opt.value" *ngFor="let opt of selectOption">-->
      <!--{{opt.caption}}-->
      <!--</scroll-select-option>-->
      <!--</scroll-select>-->
      <ion-content>
        <button (click)="openselect()" ion-button>ddddd</button>
        <ion-item>
        <ion-multi-picker item-content #remindselect [multiPickerColumns]="dependentColumns"></ion-multi-picker>
        </ion-item>
      </ion-content>
    </modal-box>
  `
})
export class RemindPage {
  statusBarColor: string = "#3c4d55";
  @ViewChild("remindselect")
  remindselect:MultiPicker;

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  openselect(){
    this.remindselect.open();

  }

  @ViewChildren(ScrollSelectComponent)
  remindComponents: QueryList<ScrollSelectComponent>;

  selectOption: Array<any> = new Array<any>();
  reminds: Array<any> = new Array<any>();
  currentTx: TxJson;
  dependentColumns: any[];

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {

    this.dependentColumns = [
      {
        columnWidth: '100px',
        options: [
          {text: '提前', value: '1'}],
      },
      {
        columnWidth: '100px',
        options: [
          {text: '1天', value: '1d'},
          {text: '2天', value: '2d'},
          {text: '3天', value: '3d'},
          {text: '4天', value: '4d'},
          {text: '5天', value: '5d'},
          {text: '6天', value: '6d'},
          {text: '7天', value: '7d'},
          {text: '8天', value: '8d'},
          {text: '9天', value: '9d'},
          {text: '10天', value: '10d'}],
      },
      {
        columnWidth: '100px',
        options: [
          {text: '1小时', value: '1h'},
          {text: '2小时', value: '2h'},
          {text: '3小时', value: '3h'},
          {text: '4小时', value: '4h'},
          {text: '5小时', value: '5h'},
          {text: '6小时', value: '6h'},
          {text: '7小时', value: '7h'},
          {text: '8小时', value: '8h'},
          {text: '9小时', value: '9h'},
          {text: '10小时', value: '10h'},
          {text: '11小时', value: '11h'},
          {text: '12小时', value: '12h'},
          {text: '13小时', value: '13h'},
          {text: '14小时', value: '14h'},
          {text: '15小时', value: '15h'},
          {text: '16小时', value: '16h'}],
      },
      {
        columnWidth: '100px',
        options:
          [
            {text: '5分钟', value: '5m'},
            {text: '10分钟', value: '10m'},
            {text: '15分钟', value: '15m'},
            {text: '20分钟', value: '20m'},
            {text: '25分钟', value: '25m'},
            {text: '30分钟', value: '30m'},
            {text: '35分钟', value: '35m'},
            {text: '40分钟', value: '40m'},
            {text: '45分钟', value: '45m'},
            {text: '50分钟', value: '50m'},
            {text: '55分钟', value: '55m'}
          ]
      }
    ];

    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;
      //初始化选择项
      let arrOption = [5, 10, 15, 30, 60, 120, 180, 360, 720, 1440, 2880, 0];
      for (let j = 0, len = arrOption.length; j < len; j++) {
        this.selectOption.push({value: arrOption[j], caption: TxJson.caption(arrOption[j])});
      }

      if (value) {
        this.currentTx = new TxJson();
        Object.assign(this.currentTx, value);
        if (this.currentTx.reminds.length > 0) {

          for (let j = 0, len = this.currentTx.reminds.length; j < len; j++) {
            this.reminds.push({value: this.currentTx.reminds[j]});
          }
          this.reminds.push({value: ""});
        } else {
          this.reminds.push({value: ""});
        }
      }
    }
  }

  async ionViewWillEnter() {

  }

  save() {
    this.currentTx.reminds.length = 0;
    this.remindComponents.forEach((value, index, array) => {
      if (value.value != "") {
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
