import {Component, ElementRef, Renderer2, ViewChild, EventEmitter, ViewChildren, QueryList } from '@angular/core';
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
import {PageBoxComponent} from "../../components/page-box/page-box";
import {TaskListComponent} from "../../components/task-list/task-list";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData} from "../../service/business/event.service";
import { PageDirection, IsSuccess, OperateType, EventFinishStatus } from "../../data.enum";

/**
 * Generated class for the 待处理/已处理任务一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-do',
  template:
    `
      <page-box title="重要事项" (onBack)="goBack()">
      <ng-container *ngFor="let day of days">
        <task-list [currentuser]="currentuser" [friends]="friends" (onStartLoad)="getData($event, day)" (onCreateNew)="goCreate()" (onCardClick)="gotoDetail($event)" (onErease)="goErease($event)" (onComplete)="complete($event)" #tasklist></task-list>
      </ng-container>
      </page-box>
    `
})
export class DoPage {
  statusBarColor: string = "#3c4d55";

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  tasklist: TaskListComponent;
  @ViewChildren("tasklist") tasklists: QueryList<TaskListComponent>;
  cachedtasks: Array<AgendaData>;

  days: Array<string> = new Array<string>();
  topday: string = moment().format("YYYY/MM/DD");
  bottomday: string = moment().format("YYYY/MM/DD");

  onrefresh: EventEmitter<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private doService: DoService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {
    //this.doService.createTestDatas()
    // .then(() => {
    //   this.days.push(moment().format("YYYY/MM/DD"));
    // });
    this.days.push(moment().format("YYYY/MM/DD"));
  }

  ngOnDestroy() {
    if (this.onrefresh) {
      this.onrefresh.unsubscribe();
      this.onrefresh = undefined;
    }
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

    this.eventService.todolist()
    .then((d) => {
      if (d && d.length > 0) {

        if (!this.onrefresh) {
          this.onrefresh = this.emitService.register("mwxing.calendar.activities.changed", async (data) => {
            if (!data) {
              return;
            }

            // 多条数据同时更新/单条数据更新
            if (data instanceof Array) {
              for (let single of data) {
                let activityType: string = this.eventService.getEventType(single);

                if (activityType == "AgendaData") {
                  this.cachedtasks = await this.eventService.mergeTodolist(this.cachedtasks, single);
                }
              }
            } else {
              let activityType: string = this.eventService.getEventType(data);

              if (activityType == "AgendaData") {
                this.cachedtasks = await this.eventService.mergeTodolist(this.cachedtasks, data);
              }
            }
          });
        }

        this.cachedtasks = d;

        this.topday = d[0].evd;
        this.bottomday = d[d.length - 1].evd;

        target.tasklist = this.cachedtasks;
      }
    });
  }

  gotoDetail(event: any) {
    if (event && event.value) {
      let target = event.value;

      let p: ScdPageParamter = new ScdPageParamter();

      p.si = target.evi;
      p.d = moment(target.evd);

      this.feedback.audioClick();
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    }
  }

  goErease(target: any) {
    this.eventService.removeAgenda(target, OperateType.OnlySel);
  }

  goBack() {
    this.navCtrl.pop();
  }

  goCreate() {
    let p: ScdPageParamter = new ScdPageParamter();

    p.d = moment();

    this.feedback.audioPress();
    this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
  }

  complete(target: any) {
    console.log(target);
    let complete: AgendaData = {} as AgendaData;
    Object.assign(complete, target);
    complete.wc = EventFinishStatus.Finished;

    this.eventService.saveAgenda(complete, target, OperateType.OnlySel);
  }
}
