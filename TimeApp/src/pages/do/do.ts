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
import {TaskListComponent} from "../../components/task-list/task-list";
import {EventService} from "../../service/business/event.service";
import { PageDirection } from "../../data.enum";

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
      <!-- 下拉PageDown -->
      <ion-refresher (ionRefresh)="pagedown($event)">
        <ion-refresher-content pullingIcon="arrow-dropdown"
                               pullingText="下拉刷新"
                               refreshingSpinner="circles"
                               refreshingText="刷新中..."></ion-refresher-content>
      </ion-refresher>
      <ng-container *ngFor="let day of days">
        <task-list (onStartLoad)="getData($event, day)" (onCardClick)="gotoDetail($event)" (onCreateNew)="goNew()" #tasklist></task-list>
      </ng-container>
      <!-- 上拉PageUp -->
      <ion-infinite-scroll (ionInfinite)="pageup($event)"
                           enabled="true"
                           threshold="100px">
        <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="加载更多"></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
    `
})
export class DoPage {
  statusBarColor: string = "#3c4d55";

  tasklist: TaskListComponent;
  @ViewChildren("tasklist") tasklists: QueryList<TaskListComponent>;

  days: Array<string> = new Array<string>();
  topday: string = moment().format("YYYY/MM/DD");
  bottomday: string = moment().format("YYYY/MM/DD");

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private doService: DoService,
              private util: UtilService,
              private feedback: FeedbackService,
              private eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {
    this.doService.createTestDatas()
    .then(() => {
      this.days.push(moment().format("YYYY/MM/DD"));
    });
  }

  pagedown(target: any) {
    if (this.days.indexOf(this.topday) >= 0) {
      target.cancel();
    } else {
      this.days.unshift(this.topday);
      target.complete();
    }
  }

  pageup(target: any) {
    if (this.days.indexOf(this.bottomday) >= 0) {
      target.cancel();
    } else {
      this.days.push(this.bottomday);
      target.complete();
    }
  }

  getData(target: any, day: string) {
    let direction: PageDirection = PageDirection.PageInit;

    if (this.days.length > 1 && this.days.indexOf(day) == (this.days.length - 1)) {
      direction = PageDirection.PageUp;
    }

    if (this.days.length > 1 && this.days.indexOf(day) == 0) {
      direction = PageDirection.PageDown;
    }

    this.eventService.fetchPagedTasks(day, direction)
    .then((d) => {
      if (d && d.length > 0) {
        this.topday = d[0].evd;
        this.bottomday = d[d.length - 1].evd;

        target.tasklist = d;
      }
    });
  }

  gotoDetail(target: any) {

  }

  goNew() {}

  goBack() {
    this.navCtrl.pop();
  }
}
