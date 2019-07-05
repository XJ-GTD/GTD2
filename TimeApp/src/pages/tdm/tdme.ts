import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from '../../components/scroll-select/scroll-select';
import { RadioSelectComponent } from '../../components/radio-select/radio-select';
import { ScrollRangePickerComponent } from "../../components/scroll-range-picker/scroll-range-picker";
import { SpeechBubbleComponent } from "../../components/speech-bubble/speech-bubble";
import { FsData, RcInParam, ScdData, ScdPageParamter, SpecScdData } from "../../data.mapping";
import { DataConfig } from "../../service/config/data.config";
import { MapOptions } from 'angular2-baidu-map';

@Component({
  selector: 'page-tdme',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back-white.png">
        </button>
      </ion-buttons>
      <ion-title>{{agenda.sn}}</ion-title>
      <ion-buttons right>
        <button ion-button icon-only (click)="remove()">
          <img class="img-header-right" src="./assets/imgs/del.png">
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="content-set">
    <ion-grid>
      <ion-row justify-content-center>
        <h5 class="mb-none">{{(agenda.sd + " " + agenda.st)| formatedate:"h:mm A"}}</h5>
      </ion-row>
      <ion-row justify-content-center>
        <p class="x-small mt-none mb-none">{{(agenda.sd + " " + agenda.st)| formatedate:"dddd MMMM D"}}</p>
      </ion-row>
      <ion-row justify-content-center align-items-center (click)="goJh()">
        <div class="row-center">
        <i class="color-dot" [ngStyle]="{'background-color': defaultplan.jc }"></i>
        </div>
      </ion-row>
      <ion-row justify-content-center>
        <baidu-map [options]="options" (click)="goDz()"></baidu-map>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none" (click)="goDz()">地址</h5>
      </ion-row>
      <ion-row justify-content-center>
      <p class="x-small mt-none" (click)="goDz()">说"地址是上海市东方明珠塔" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none">人员</h5>
      </ion-row>
      <ion-row justify-content-center>
      <p class="x-small mt-none">说"发给小明" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none" (click)="goTx()">提醒</h5>
      </ion-row>
      <ion-row justify-content-center>
      <p class="x-small mt-none" (click)="goTx()">说"提前15分钟提醒我" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none">重复</h5>
      </ion-row>
      <ion-row justify-content-center>
        <p class="x-small mt-none">说"每周重复" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none">倒计时</h5>
      </ion-row>
      <ion-row justify-content-center>
      <p class="x-small mt-none">说"设置倒计时" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <h5 class="mb-none" (click)="goBz()">备注</h5>
      </ion-row>
      <ion-row justify-content-center>
      <p class="x-small mt-none" (click)="goBz()">说"备注当天要带上生日礼物" 或 点击以添加</p>
      </ion-row>
      <ion-row justify-content-center>
        <speech-bubble seconds="12"></speech-bubble>
      </ion-row>
    </ion-grid>
  </ion-content>

  <ion-footer class="foot-set" *ngIf="isMobile">
    <ion-toolbar>
    <button ion-button *ngIf="isMobile && !speaking" icon-only full (click)="record()">
      <ion-icon name="mic" color="white"></ion-icon>
    </button>
    <button ion-button *ngIf="isMobile && speaking" icon-only full (click)="pause()">
      <ion-icon name="pause" color="white"></ion-icon>
    </button>
    </ion-toolbar>
  </ion-footer>
  `
})
export class TdmePage {
  agenda: ScdData = new ScdData();
  defaultplan: any = {
    jn: "家庭",
    jc: `#881562`
  };
  isMobile: boolean = true;
  speaking: boolean = false;
  options: MapOptions;  //百度地图选项

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController) {
    if (this.navParams && this.navParams.data) {
      this.agenda = this.navParams.data;
    }

    //百度地图设置
    this.options = {
      centerAndZoom: {
        lat: 39.920116,
        lng: 116.403703,
        zoom: 8
      },
      enableKeyboard: true
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TdmePage');
  }

  timechanged(changed) {
    if (changed !== undefined) {
      let src = changed.src;
      let dest = changed.dest;
      this.rangeEnd = dest;
    }
  }

  remove() {

  }

  goBack() {
    this.navCtrl.pop();
  }

  goTx() {
    this.modalCtrl.create(DataConfig.PAGE._TX_PAGE, {}).present();
  }

  goBz() {
    this.modalCtrl.create(DataConfig.PAGE._BZ_PAGE, {}).present();
  }

  goJh() {
    this.modalCtrl.create(DataConfig.PAGE._JH_PAGE, {}).present();
  }

  goDz() {
    this.modalCtrl.create(DataConfig.PAGE._DZ_PAGE, {}).present();
  }

  record() {}

  pause() {}
}
