import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { IonicPage, NavController, NavParams, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from '../../components/scroll-select/scroll-select';
import { RadioSelectComponent } from '../../components/radio-select/radio-select';
import {ScrollRangePickerComponent} from "../../components/scroll-range-picker/scroll-range-picker";
import {RcInParam, ScdData, ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";

@IonicPage()
@Component({
  selector: 'page-tdm',
  template: `
  <ion-content class="content-set">
    <ion-grid>
      <ion-row justify-content-center>
        <h1 class="mb-none mt-seven">{{day}}</h1>
      </ion-row>
      <ion-row justify-content-center>
        <p class="small mt-none">{{date}}</p>
      </ion-row>
      <ion-row justify-content-center>
        <div>
          <button ion-button clear class="text-btn">设置全天</button>
        </div>
        <div>
          <button ion-button clear class="text-btn" id="rangestart">3:00下午</button>
          →
          <button ion-button clear class="text-btn">{{rangeEnd}}</button>
        </div>
      </ion-row>
      <p padding></p>
      <ion-row class="full-width" justify-content-center>
        <scroll-range-picker max="24" min="5" value="18:00" (changed)="timechanged($event)"></scroll-range-picker>
      </ion-row>
      <ion-row justify-content-center>
        <ion-input type="text" value="" placeholder="喜马拉雅儿子的生日聚会" text-center></ion-input>
      </ion-row>
      <ion-row justify-content-center align-items-center>
        <div class="row-center">
        <i class="color-dot" [ngStyle]="{'background-color': defaultplan.jc }"></i>
        {{defaultplan.jn}}
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class TdmPage {
  day: string = "";
  date: string = "";
  defaultplan: any = {
    jn: "家庭",
    jc: `#881562`
  };
  rangeEnd: string = '4:30下午';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TdmPage');
    let currentday: moment.Moment = null;

    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      currentday = paramter.d;
    } else {
      currentday = moment();
    }

    this.day = this.util.showDate(currentday);
    this.date = currentday.format("MMMM D");
  }

  timechanged(changed) {
    if (changed !== undefined) {
      let src = changed.src;
      let dest = changed.dest;
      this.rangeEnd = dest;
    }
  }
}
