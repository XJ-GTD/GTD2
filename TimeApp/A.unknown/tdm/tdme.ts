import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, Scroll } from 'ionic-angular';
import { ScrollSelectComponent } from '../../../components/scroll-select/scroll-select';
import { RadioSelectComponent } from '../../../components/radio-select/radio-select';
import { ScrollRangePickerComponent } from "../../../components/scroll-range-picker/scroll-range-picker";
import { SpeechBubbleComponent } from "../../../components/speech-bubble/speech-bubble";
import { FsData, RcInParam, ScdData, ScdPageParamter, SpecScdData } from "../../../data.mapping";
import { DataConfig } from "../../../service/config/data.config";
import { MapOptions } from 'angular2-baidu-map';
import {JhTbl} from "../../../service/sqlite/tbl/jh.tbl";
import {MessageSendComponent} from "../../../components/message-send/message-send";
import {RecordingComponent} from "../../../components/recording/recording";
import {RestFulConfig} from "../../../service/config/restful.config";
import {PgBusiService} from "../../../service/pagecom/pgbusi.service";
import {UtilService} from "../../../service/util-service/util.service";
import {FeedbackService} from "../../../service/cordova/feedback.service";
import * as moment from "moment";

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
      <ion-row justify-content-center align-items-center (click)="goJh(agenda.ji)">
        <div class="row-center">
        <i class="color-dot" [ngStyle]="{'background-color': defaultplan.jc }"></i>
        </div>
      </ion-row>

      <!-- 地址 -->
      <ion-row justify-content-center *ngIf="display">
        <baidu-map [options]="options" (click)="goDz()"></baidu-map>
      </ion-row>
      <ion-row justify-content-center *ngIf="display">
        <h5 class="mb-none" (click)="goDz()">地址</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="display">
      <p class="x-small mt-none" (click)="goDz()">说"地址是上海市东方明珠塔" 或 点击以添加</p>
      </ion-row>

      <!-- 人员 -->
      <ion-row justify-content-center *ngIf="!agenda.fss || agenda.fss.length <= 0">
        <h5 class="mb-none">人员</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="!agenda.fss || agenda.fss.length <= 0">
      <p class="x-small mt-none">说"发给小明" 或 点击以添加</p>
      </ion-row>

      <ion-row justify-content-center *ngIf="agenda.fss && agenda.fss.length > 0">
        <p class="x-small x-title mb-none">人员</p>
      </ion-row>
      <ion-row justify-content-center *ngIf="agenda.fss && agenda.fss.length > 0">
        <div class="avatars mt-none">
          <div *ngFor="let share of agenda.fss">
            <ion-avatar>
              <img [src]="share.bhiu">
            </ion-avatar>
            {{share.ran || share.rn}}
          </div>
        </div>
      </ion-row>

      <!-- 提醒 -->
      <ion-row justify-content-center *ngIf="!agenda.tx">
        <h5 class="mb-none" (click)="goTx()">提醒</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="!agenda.tx">
      <p class="x-small mt-none" (click)="goTx()">说"提前15分钟提醒我" 或 点击以添加</p>
      </ion-row>

      <ion-row justify-content-center *ngIf="agenda.tx">
        <p class="x-small x-title mb-none" (click)="goTx(agenda.tx)">提醒</p>
      </ion-row>
      <ion-row justify-content-center *ngIf="agenda.tx">
        <p class="mt-none" (click)="goTx(agenda.tx)">{{agenda.tx | formatremind}}</p>
      </ion-row>

      <!-- 重复 -->
      <ion-row justify-content-center *ngIf="!agenda.rt">
        <h5 class="mb-none" (click)="goCf()">重复</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="!agenda.rt">
        <p class="x-small mt-none" (click)="goCf()">说"每周重复" 或 点击以添加</p>
      </ion-row>

      <ion-row justify-content-center *ngIf="agenda.rt">
        <p class="x-small x-title mb-none" (click)="goCf(agenda.rt)">重复</p>
      </ion-row>
      <ion-row justify-content-center *ngIf="agenda.rt">
        <p class="mt-none" (click)="goCf(agenda.rt)">{{agenda.rt | formatrepeat}}</p>
      </ion-row>

      <!-- 备注 -->
      <ion-row justify-content-center *ngIf="!agenda.bz">
        <h5 class="mb-none" (click)="goBz()">备注</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="!agenda.bz">
        <p class="x-small mt-none" (click)="goBz()">说"备注当天要带上生日礼物" 或 点击以添加</p>
      </ion-row>

      <ion-row justify-content-center *ngIf="agenda.bz">
        <p class="x-small x-title mb-none" (click)="goBz(agenda.bz)">备注</p>
      </ion-row>
      <ion-row justify-content-center *ngIf="agenda.bz">
        <p class="mt-none memo" (click)="goBz(agenda.bz)">{{agenda.bz}}</p>
      </ion-row>

      <!-- 语音记录 -->
      <ion-row justify-content-center *ngIf="display">
        <speech-bubble seconds="12"></speech-bubble>
      </ion-row>

      <!-- 倒计时 -->
      <ion-row justify-content-center *ngIf="display">
        <h5 class="mb-none">倒计时</h5>
      </ion-row>
      <ion-row justify-content-center *ngIf="display">
      <p class="x-small mt-none">说"设置倒计时" 或 点击以添加</p>
      </ion-row>
    </ion-grid>
  </ion-content>

  <!-- 录音状态提示 -->
  <recording [active]="isRecording"></recording>

  <ion-footer class="foot-set">
    <message-send [mobile]="isMobile" (startRecord)="record()" (endRecord)="stop()"></message-send>
  </ion-footer>
  `
})
export class TdmePage {
  statusBarColor: string = "#3c4d55";

  agenda: ScdData = new ScdData();
  defaultplan: any = {
    jn: "家庭",
    jc: `#881562`
  };
  isMobile: boolean = true;
  isRecording: boolean = false;
  options: MapOptions;  //百度地图选项
  display: boolean = false;
  removeOptionButtons;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,
              private util: UtilService,
              private busiServ: PgBusiService,
              private feekback: FeedbackService) {
    if (this.navParams && this.navParams.data) {
      this.agenda = this.navParams.data;

      // 初始化计划
      let plan: JhTbl = new JhTbl();
      Object.assign(plan, this.agenda.p);
      this.defaultplan = plan;
    }

    //百度地图设置
    this.options = {
      centerAndZoom: {
        lat: RestFulConfig.geo.latitude || 39.920116,
        lng: RestFulConfig.geo.longitude || 116.403703,
        zoom: 8
      },
      enableKeyboard: true
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TdmePage');
  }

  remove() {
    let d = moment(this.agenda.sd + " " + this.agenda.st).format("YYYY/MM/DD");

    if (this.agenda.rt != "0" && this.agenda.sd != d) {
      //重复日程删除
      this.removeOptionButtons = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '删除今后所有日程',
            role: 'destructive',
            cssClass: 'btn-del',
            handler: () => {
              this.util.alterStart("2", () => {
                this.util.loadingStart();
                this.busiServ.delRcBySiAndSd(this.agenda.si, d).then(data => {
                  this.feekback.audioDelete();
                  this.util.loadingEnd();
                  this.goBack();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              });
            }
          }, {
            text: '删除所有日程',
            cssClass: 'btn-delall',
            handler: () => {
              this.util.alterStart("2", () => {
                this.util.loadingStart();
                this.busiServ.delRcBySi(this.agenda.si).then(data => {
                  this.feekback.audioDelete();
                  this.util.loadingEnd();
                  this.goBack();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              });
            }
          }, {
            text: '取消',
            role: 'cancel',
            cssClass: 'btn-cancel',
            handler: () => {

            }
          }
        ]
      });
      this.removeOptionButtons.present();
    } else {
      //非重复日程删除
      this.util.alterStart("2", () => {
        this.util.loadingStart();
        this.busiServ.delRcBySi(this.agenda.si).then(data => {
          this.feekback.audioDelete();
          this.util.loadingEnd();
          this.goBack();
        }).catch(err => {
          this.util.loadingEnd();
        });
      });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  goTx(value) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._TX_PAGE, {value: value});
    modal.onDidDismiss(async (data)=>{
    });
    modal.present();
  }

  goCf(value) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._CF_PAGE, {value: value});
    modal.onDidDismiss(async (data)=>{
    });
    modal.present();
  }

  goBz(value) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._BZ_PAGE, {value: value});
    modal.onDidDismiss(async (data)=>{
      this.agenda.bz = data.bz;

      // 保存
      let rcin: RcInParam = new RcInParam();
      Object.assign(rcin, this.agenda);
      await this.busiServ.saveOrUpdate(rcin);
    });
    modal.present();
  }

  goJh(value) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._JH_PAGE, {ji: value});
    modal.onDidDismiss(async (data)=>{
      this.agenda.ji = data.jh.ji;
      this.defaultplan = data.jh;

      // 保存
      let rcin: RcInParam = new RcInParam();
      Object.assign(rcin, this.agenda);
      await this.busiServ.saveOrUpdate(rcin);

    });
    modal.present();
  }

  goDz(value) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._DZ_PAGE, {value: value});
    modal.onDidDismiss(async (data)=>{
    });
    modal.present();
  }

  record() {
    this.isRecording = true;
  }

  stop() {
    this.isRecording = false;
  }
}