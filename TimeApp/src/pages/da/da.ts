import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { DaService } from "./da.service";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 每天日程一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-da',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back-white.png">
          </button>
        </ion-buttons>
        <ion-title>{{currentdayofweek}}<br/><small>{{currentdayshow}}</small></ion-title>
        <ion-buttons right>
          <button ion-button icon-only color="danger">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
    <ion-grid class="h70">
      <ion-row class="h100" align-items-center>
        <ion-grid>
          <ion-row justify-content-center>
            <small *ngIf="todaylist && todaylist.length > 0">当天</small>
            <ng-container *ngFor="let scd of todaylist">
            <ion-card *ngIf="scd.gs == '3' || scd.gs == '4'" (click)="gotoDetail(scd)">
              <div class="card-title">{{scd.sn}}</div>
              <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
              <div *ngIf="scd.st && scd.st != '99:99'" class="card-subtitle">{{scd.st}}</div>
              <div *ngIf="scd.st && scd.st == '99:99'" class="card-subtitle">全天</div>
              <div *ngIf="scd.p && scd.p.jc" class="card-subtitle">
                <div class="color-dot" [ngStyle]="{'background-color': scd.p.jc }"></div>
              </div>
            </ion-card>
            </ng-container>
          </ion-row>
          <ion-row justify-content-center>
            <small *ngIf="scdlist && scdlist.length > 0">日程</small>
            <ng-container *ngFor="let scd of scdlist">
            <ion-card *ngIf="scd.gs != '3' && scd.gs != '4'" (click)="gotoDetail(scd)">
              <div class="card-title">{{scd.sn}}</div>
              <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
              <div *ngIf="scd.st && scd.st != '99:99'" class="card-subtitle">{{scd.st}}</div>
              <div *ngIf="scd.st && scd.st == '99:99'" class="card-subtitle">全天</div>
              <div *ngIf="scd.p && scd.p.jc" class="card-subtitle">
                <div class="color-dot" [ngStyle]="{'background-color': scd.p.jc }"></div>
              </div>
            </ion-card>
            </ng-container>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
    <ion-grid *ngIf="isMobile">
      <ion-row justify-content-center>
        <button ion-button *ngIf="isMobile && !speaking" large icon-only clear (click)="play()">
          <ion-icon name="play" color="white"></ion-icon>
        </button>
        <button ion-button *ngIf="isMobile && speaking" large icon-only clear (click)="pause()">
          <ion-icon name="pause" color="white"></ion-icon>
        </button>
      </ion-row>
    </ion-grid>
    </ion-content>`
})
export class DaPage {

  currentday: CalendarDay;
  currentdayofweek: string = moment().format('dddd');
  currentdayshow: string = moment().format('MMMM D');
  todaylist: Array<ScdData> = new Array<ScdData>();
  scdlist: Array<ScdData> = new Array<ScdData>();
  speaking: boolean = false;
  isMobile: boolean = UtilService.isMobile();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private daService: DaService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');

    this.currentday = this.navParams.data;
    this.currentdayofweek = moment(this.currentday.time).format('dddd');
    this.currentdayshow = moment(this.currentday.time).format('MMMM D');
  }

  ionViewDidLoad() {
    this.daService.currentShow(this.currentday).then(d => {
      if (d) {
        for (let line of d) {
          if (line.gs == '3' || line.gs == '4') {
            this.todaylist.push(line);
          } else {
            this.scdlist.push(line);
          }
        }
      }
    });
  }

  gotoDetail(scd: ScdData) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.si;
    p.d = moment(scd.sd);
    p.gs = scd.gs;

    this.feedback.audioClick();
    if (gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }
  }

  play() {
    this.speaking = true;

    //每日简报消息回调
    this.emitService.register('on.speak.finished', (data) => {
      this.pause();
    });

    if (this.scdlist && this.scdlist.length > 0)
      this.daService.speakDailySummary(moment(this.currentday.time), this.scdlist);
    else
      this.daService.speakDailySummary(moment(this.currentday.time), this.todaylist);
  }

  pause() {
    this.daService.stopSpeak();
  }

  goBack() {
    this.navCtrl.pop();
  }
}
