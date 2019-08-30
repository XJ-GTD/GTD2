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
      <ng-container *ngFor="let day of days">
        <task-list (onStartLoad)="getData($event, day)" (onCardClick)="gotoDetail($event)" (onCreateNew)="goNew()" #tasklist></task-list>
      </ng-container>
    </ion-content>
    `
})
export class DoPage {
  statusBarColor: string = "#3c4d55";

  tasklist: TaskListComponent;
  @ViewChildren("tasklist") tasklists: QueryList<TaskListComponent>;

  days: Array<string> = new Array<string>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private doService: DoService,
              private util: UtilService,
              private feedback: FeedbackService,
              privaate eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
    this.days.push(moment().format("YYYY/MM/DD"));
  }

  ionViewDidLoad() {
  }

  getData(target: any, day: string) {
    let direction: PageDirection = PageDirection.PageInit;

    if (moment().diff(day) > 0) {
      direction = PageDirection.PageDown;
    }

    if (moment().diff(day) < 0) {
      direction = PageDirection.PageUp;
    }

    this.eventService.fetchPagedTasks(day, direction)
    .then((d) => {
      target.tasklist = d;
    });
  }

  gotoDetail(target: any) {

  }

  goNew() {}

  goBack() {
    this.navCtrl.pop();
  }
}
