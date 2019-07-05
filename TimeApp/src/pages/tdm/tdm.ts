import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from '../../components/scroll-select/scroll-select';
import { RadioSelectComponent } from '../../components/radio-select/radio-select';
import {ScrollRangePickerComponent} from "../../components/scroll-range-picker/scroll-range-picker";
import {RcInParam, ScdData, ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import * as moment from "moment";
import {Keyboard} from "@ionic-native/keyboard";
import {DataConfig} from "../../service/config/data.config";
import {PlService} from "../pl/pl.service";
import {SsService} from "../ss/ss.service";

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
          <button ion-button clear class="text-btn" small>设置全天</button>
        </div>
        <div align-items-center>
          <button ion-button clear class="text-btn" id="rangestart" small>{{rangeStartT}} <small>{{rangeStartTAMPM}}</small></button>
        </div>
      </ion-row>
      <ion-row class="full-width" justify-content-center>
        <scroll-range-picker max="24" min="5" value="18:00" (changed)="timechanged($event)"></scroll-range-picker>
      </ion-row>
      <ion-row justify-content-center>
        <ion-textarea type="text" class="w80" placeholder="喜马拉雅儿子的生日聚会" [(ngModel)]="title" autosize maxHeight="200" text-center #titleRef></ion-textarea>
      </ion-row>
      <ion-row justify-content-center align-items-center (click)="goJh()">
        <div class="row-center">
        <i class="color-dot" [ngStyle]="{'background-color': defaultplan.jc }"></i>
        {{defaultplan.jn}}
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>
  <ion-footer class="foot-set">
    <ion-toolbar>
      <ion-buttons full>
        <button ion-button block icon-only (click)="cancel()" start>
          <ion-icon name="close"></ion-icon>
        </button>

        <button ion-button block (click)="goShare()">发送</button>

        <button ion-button block icon-only (click)="save()" end>
          <ion-icon name="checkmark"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
  `
})
export class TdmPage {

  @ViewChild("titleRef", {read: ElementRef})
  _titleRef: ElementRef;
  title: string = "";

  day: string = "";
  date: string = "";
  defaultplan: any = {
    jn: "家庭",
    jc: `#881562`
  };
  rangeEnd: string = '4:30下午';
  rangeStartT: string = '4:30';
  rangeStartTAMPM: string = '下午';
  currentday: moment.Moment = null;
  currenttime: string = "12:00";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private plService: PlService,
              private ssService: SsService,
              private keyboard: Keyboard,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TdmPage');

    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      this.currentday = paramter.d;
    } else {
      this.currentday = moment();
    }

    this.getDefaultJh();

    this.day = this.util.showDate(this.currentday);
    this.date = this.currentday.format("MMMM D");

  }

  ionViewDidEnter() {
    setTimeout(() => {
      let el = this._titleRef.nativeElement.querySelector('textarea');
      el.focus();
      this.keyboard.show();   //for android
    }, 500);

  }

  timechanged(changed) {
    if (changed !== undefined) {
      let src = changed.src;
      let dest = changed.dest;
      this.rangeStartT = moment.unix(dest).format("h:mm");
      this.rangeStartTAMPM = moment.unix(dest).format("A");
      this.currenttime = moment.unix(dest).format("HH:mm");
    }
  }

  async getDefaultJh() {
    this.defaultplan = await this.ssService.getDefaultJh();
  }

  cancel() {
    this.navCtrl.pop();
  }

  checkInput(): boolean {
    if (this.title && this.currentday && this.currenttime) {
      return true;
    } else {
      return false;
    }
  }

  save(): Promise<ScdData> {
    return new Promise<ScdData>(async (resolve, reject) => {
      if (!this.checkInput()) {
        return;
      }

      this.navCtrl.pop();

      let data: ScdData = new ScdData();
      data.sn = this.title;
      data.st = this.currenttime;
      data.sd = this.currentday.format("YYYY/MM/DD");
      this.modalCtrl.create(DataConfig.PAGE._TDME_PAGE, data).present();
    });
  }

  async goShare() {
  }

  goJh() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._JH_PAGE, this.defaultplan);
    modal.onDidDismiss((data)=>{
      this.defaultplan = data.jh;
    });
    modal.present();
  }
}
