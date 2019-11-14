import {Component, EventEmitter, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as async from "async/dist/async.js"
import * as moment from "moment";
import { ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {TaskListComponent} from "../../components/task-list/task-list";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData} from "../../service/business/event.service";
import { PageDirection, OperateType, EventFinishStatus } from "../../data.enum";
import {AtmeService} from "./atme.service";

/**
 * Generated class for the 待处理/已处理任务一览 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-atme',
  template:
    `
      <page-box title="我要关注" [buttons]="buttons" [data]="summarytasks" [plans]="privateplans" (onCreate)="goCreate()" (onBack)="goBack()">
      <ng-container *ngFor="let day of days">
        <task-list [currentuser]="currentuser" [friends]="friends" [plans]="privateplans" (onStartLoad)="getData($event, day)" (onCreateNew)="goCreate()" (onCardClick)="gotoDetail($event)" (onErease)="goErease($event)" (onComplete)="complete($event)" #tasklist></task-list>
      </ng-container>
      </page-box>
    `
})
export class AtmePage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    create: true,
    cancel: true
  };

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  privateplans: Array<any> = UserConfig.privateplans;

  tasklist: TaskListComponent;
  @ViewChildren("tasklist") tasklists: QueryList<TaskListComponent>;
  cachedtasks: Array<AgendaData>;
  summarytasks: Array<AgendaData>;

  days: Array<string> = new Array<string>();
  topday: string = moment().format("YYYY/MM/DD");
  bottomday: string = moment().format("YYYY/MM/DD");

  onrefresh: EventEmitter<any>;

  private todosqueue: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private atService: AtmeService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');

    this.todosqueue = async.queue(async ({data}, callback) => {
      // 多条数据同时更新/单条数据更新
      if (data instanceof Array) {
        for (let single of data) {
          if (single.evi) {
            let activityType: string = this.eventService.getEventType(single);

            if (activityType == "AgendaData") {
              this.cachedtasks = await this.eventService.mergeTodolist(this.cachedtasks, single);
            }
          }
        }
      } else {
        if (data.evi) {
          let activityType: string = this.eventService.getEventType(data);

          if (activityType == "AgendaData") {
            this.cachedtasks = await this.eventService.mergeTodolist(this.cachedtasks, data);
          }
        }
      }

      callback();
    });
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
      if (d) {
        if (!this.onrefresh) {
          this.onrefresh = this.emitService.register("mwxing.calendar.activities.changed", async (data) => {
            if (!data) {
              return;
            }

            this.todosqueue.push({data: data}, () => {
              // 用于更新日历下待处理任务的汇总显示
              this.summarytasks = this.cachedtasks.reduce((target, element) => {
                target.push(element);
                return target;
              }, new Array<AgendaData>());
            });
          });
        }

        this.cachedtasks = d;
        this.summarytasks = this.cachedtasks;

        if (d.length > 0) {
          this.topday = d[0].evd;
          this.bottomday = d[d.length - 1].evd;
        }

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

  async goErease(target: any) {
    let origin: AgendaData = await this.eventService.getAgenda(target.evi);

    this.eventService.removeAgenda(origin, OperateType.OnlySel);
  }

  goBack() {
    this.navCtrl.pop();
  }

  goCreate() {
    let p: ScdPageParamter = new ScdPageParamter();

    p.d = moment();
    p.todolist = true;

    this.feedback.audioPress();
    this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
  }

  async complete(target: any) {
    let origin: AgendaData = await this.eventService.getAgenda(target.evi);

    let complete: AgendaData = {} as AgendaData;
    Object.assign(complete, origin);

    complete.wc = EventFinishStatus.Finished;

    await this.eventService.saveAgenda(complete, origin, OperateType.OnlySel);
  }
}