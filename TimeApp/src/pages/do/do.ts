import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { DoService } from "./do.service";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {CardListComponent} from "../../components/card-list/card-list";

/**
 * Generated class for the 待处理/已处理任务一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-do',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-title>待处理</ion-title>
        <ion-buttons right>
          <button ion-button icon-only (click)="goNew()" color="danger">
          <img class="img-header-right" src="./assets/imgs/qtj-white.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <card-list #cardlist (onStartLoad)="getData($event, day)" (onCardClick)="gotoDetail($event)" (onCreateNew)="goNew()" #cardlist></card-list>
    </ion-content>
    `
})
export class DoPage {
  statusBarColor: string = "#3c4d55";

  cardlist: CardListComponent;
  @ViewChildren("cardlist") cardlists: QueryList<CardListComponent>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private doService: DoService,
              private util: UtilService,
              private feedback: FeedbackService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');

  }

  ionViewDidLoad() {
  }

  goBack() {
    this.navCtrl.pop();
  }
}
