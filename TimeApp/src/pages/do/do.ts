import {
  Component,
  EventEmitter,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {IonicPage, NavController, ModalController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { DoService } from "./do.service";
import {ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {TaskListComponent} from "../../components/task-list/task-list";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData, Attachment} from "../../service/business/event.service";
import {PageDirection, OperateType, EventFinishStatus, ObjectType} from "../../data.enum";
import {AsyncQueue} from "../../util/asyncQueue";
import {TimeOutService} from "../../util/timeOutService";

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
      <page-box title="重要事项" [buttons]="buttons" [data]="summarytasks" [plans]="privateplans" (onCreate)="goCreate()" (onBack)="goBack()">
      <ng-container *ngFor="let day of days">
        <task-list [tasklist]="" [currentuser]="currentuser" [friends]="friends" [plans]="privateplans" (onStartLoad)="getData($event, day)" (onCreateNew)="goCreate()" (onCardClick)="gotoDetail($event)" (onErease)="goErease($event)" (onComplete)="complete($event)"></task-list>
      </ng-container>
      </page-box>
  `,
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class DoPage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    create: false,
    cancel: true
  };

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;

  privateplans: Array<any> = UserConfig.privateplans;

  cachedtasks: Array<AgendaData>;
  summarytasks: Array<AgendaData>;

  days: Array<string> = new Array<string>();
  topday: string = moment().format("YYYY/MM/DD");
  bottomday: string = moment().format("YYYY/MM/DD");

  onrefresh: EventEmitter<any>;

  private todosqueue: AsyncQueue;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtr: ModalController,
              private emitService: EmitService,
              private doService: DoService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite:SqliteExec,
              // public changeDetectorRef: ChangeDetectorRef,
              // private detectorService:DetectorService,
              private timeOutService:TimeOutService) {
    moment.locale('zh-cn');
     // this.detectorService.registerDetector(changeDetectorRef);

    this.todosqueue = new AsyncQueue(async ({data}, callback) => {
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
    },1,1,"todo.changed",this.util,this.timeOutService);

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

    this.eventService.todolist().then((d) => {
      if (d) {
        if (!this.onrefresh) {
          this.onrefresh = this.emitService.register("mwxing.calendar.activities.changed", async (data) => {
            if (!data) {
              return;
            }

            this.todosqueue.push({data: data}, () => {
              // 用于更新日历下待处理任务的汇总显示
              // this.detectorService.detector();
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

        let startsort = moment().subtract(3,"day");
        let endsort = moment().add(3,"day");
        this.cachedtasks.sort((a,b)=>{
          let amo = moment((a.evd + a.evt),"YYYY/MM/DD HH:ss");
          let bmo = moment((b.evd + b.evt),"YYYY/MM/DD HH:ss");
          if (amo.isBefore(endsort) &&  amo.isAfter(startsort) && bmo.isBefore(endsort) &&  bmo.isAfter(startsort)){
            return amo.diff(bmo);
          }else if (amo.isBefore(endsort) &&  amo.isAfter(startsort)){
            return -1;
          }else if (bmo.isBefore(endsort) &&  bmo.isAfter(startsort)) {
            return 1;
          }else{
            return amo.diff(bmo);
          }
        });

        target.tasklist = this.cachedtasks;
      }
    });
  }

  gotoDetail(event: any) {
    if (event && event.value) {
      let target = event.value;

      let p: ScdPageParamter = new ScdPageParamter();

      p.si = target.evi;
      p.d = moment(target.evd, "YYYY/MM/DD");

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

    let attachment:Attachment = {} as Attachment;

    attachment.fjn ="已完成(在【重要事项】中点击了完成)！";
    attachment.ui = this.currentuser;
    attachment.members = origin.members;
    attachment.obi = origin.evi;
    attachment.obt = ObjectType.Event;

    this.eventService.saveAttachment(attachment);

  }
}
