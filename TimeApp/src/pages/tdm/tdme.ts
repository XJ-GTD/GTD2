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
      <ion-row justify-content-center align-items-center>
        <div class="row-center" (click)="goJh()">
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

  repeats: any = [{value: 0, caption: '关闭'}, {value: 1, caption: '每天'}, {value: 2, caption: '每周'}, {value: 3, caption: '每月'}, {value: 4, caption: '每年'}];
  labels: any = [{value:0,caption:'工作'}, {value:1,caption:'个人'}];
  months: any = [{value:'01',caption:'一月'}, {value:'02',caption:'二月'}, {value:'03',caption:'三月'}, {value:'04',caption:'四月'}, {value:'05',caption:'五月'}, {value:'06',caption:'六月'}, {value:'07',caption:'七月'}, {value:'08',caption:'八月'}, {value:'09',caption:'九月'}, {value:'10',caption:'十月'}, {value:'11',caption:'十一月'}, {value:'12',caption:'十二月'}];
  years: any = [];
  rangeEnd: string = '4:30下午';
  motions: any = [
    {value:'Anxious',caption:`<img class="image-option" src="../assets/imgs/Anxious.png">`},
    {value:'Birthday',caption:`<img class="image-option" src="../assets/imgs/Birthday.png">`},
    {value:'Celebration',caption:`<img class="image-option" src="../assets/imgs/Celebration.png">`},
    {value:'Competition',caption:`<img class="image-option" src="../assets/imgs/Competition.png">`},
    {value:'Excited',caption:`<img class="image-option" src="../assets/imgs/Excited.png">`},
    {value:'Party',caption:`<img class="image-option" src="../assets/imgs/Party.png">`},
    {value:'Romance',caption:`<img class="image-option" src="../assets/imgs/Romance.png">`},
    {value:'Sport',caption:`<img class="image-option" src="../assets/imgs/Sport.png">`},
    {value:'Study',caption:`<img class="image-option" src="../assets/imgs/Study.png">`},
    {value:'Travel',caption:`<img class="image-option" src="../assets/imgs/Travel.png">`}
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController) {
    if (this.navParams && this.navParams.data) {
      this.agenda = this.navParams.data;
    }

    for (let year = 2009; year <= 2029; year++) {
      this.years.push({value:year.toString(),caption:year.toString()});
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
    console.log('ionViewDidLoad NewAgendaPage');
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
