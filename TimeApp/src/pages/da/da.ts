import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { DaService } from "./da.service";
import { ScdData } from "../../data.mapping";

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
            日程
            <ion-card *ngFor="let scd of scdlist">
              <div class="card-title">{{scd.sn}}</div>
              <div *ngIf="scd.bz" class="card-subtitle">{{scd.bz}}</div>
              <div *ngIf="scd.st && scd.st != '99:99'" class="card-subtitle">{{scd.st}}</div>
              <div *ngIf="scd.st && scd.st == '99:99'" class="card-subtitle">全天</div>
              <div *ngIf="scd.p && scd.p.jc" class="card-subtitle">
                <div class="color-dot" [ngStyle]="{'background-color': scd.p.jc }"></div>
              </div>
            </ion-card>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
    </ion-content>`
})
export class DaPage {

  client:any = {mainversion: 'v1', version: '1'};
  server:any = {version: '1', datacenter: ''};
  currentday: CalendarDay;
  currentdayofweek: string = moment().format('dddd');
  currentdayshow: string = moment().format('MMMM D');
  scdlist: Array<ScdData> = new Array<ScdData>();

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private daService: DaService, private sqlite:SqliteExec) {
    moment.locale('zh-cn');

    this.currentday = this.navParams.data;
    this.currentdayofweek = moment(this.currentday.time).format('dddd');
    this.currentdayshow = moment(this.currentday.time).format('MMMM D');
  }

  ionViewDidLoad() {
    let restfulHeader = new RestFulHeader();
    this.client.mainversion = restfulHeader.pv? restfulHeader.pv.replace(/v/, 'v0.') : 'v0.0';
    this.client.version = UserConfig.getClientVersion();

    if (RestFulConfig.INIT_DATA_URL.indexOf('tag=mwxing') > 0) this.server.datacenter += '开发';
    if (RestFulConfig.INIT_DATA_URL.indexOf('debug=true') > 0) this.server.datacenter += '内部';
    if (RestFulConfig.INIT_DATA_URL.indexOf('?') < 0) this.server.datacenter += '公测';
    this.server.datacenter += '数据中心';

    this.daService.currentShow(this.currentday).then(d => {
      if (d) this.scdlist = d;
    });
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
