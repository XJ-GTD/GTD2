import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { CommemorationDayService } from "./commemorationday.service";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {CornerBadgeComponent} from "../../components/corner-badge/corner-badge";
import {CalendarService, PlanItemData} from "../../service/business/calendar.service";
import {EventService, AgendaData, RtJson, TxJson} from "../../service/business/event.service";
import { PageDirection, IsSuccess, OperateType, RepeatFlag, ToDoListStatus, IsWholeday } from "../../data.enum";
import {Keyboard} from "@ionic-native/keyboard";

/**
 * Generated class for the 纪念日创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-commemorationday',
  template:
      `<page-box title="纪念日" [buttons]="buttons" [data]="currentPlanItem.jti" (onRemove)="goRemove()" (onSave)="save()" (onBack)="goBack()">
        <ion-grid>
          <ion-row class="agendaEvn">
            <!--主题-->
            <ion-textarea rows="8" [(ngModel)]="currentPlanItem.jtn" (ionChange)="changeTitle()" #bzRef></ion-textarea>
          </ion-row>

          <ion-row class="optionRow">
            <ion-grid>
            <!--附加属性操作-->
            <ion-row class="agendaOptionOne" *ngIf="currentPlanItem.jti">
              <button class="agendaRemarkbutton" ion-button icon-start clear  (click)="changeComment()" *ngIf="!currentPlanItem.bz">
                <ion-icon class="fal fa-fa-comment-edit iconRemark"></ion-icon>
                <div>备注</div>
              </button>
              <button class="agendaPlanbutton"  ion-button icon-start clear  (click)="changePlan()">
                <ion-icon class="fal fa-line-columns iconPlus"></ion-icon>
                <div>{{currentPlanItem.ji | formatplan: 'name' : '加入日历': privateplans}}</div>
              </button>
            </ion-row>

            <ion-row class="agendaOptionThree" *ngIf="currentPlanItem.jti">
              <button ion-button  clear (click)="changeRepeat()">
                <div class="agendarepeat">
                  <ion-icon class="fal fa-copy  iconCopy" *ngIf="!currentPlanItem.rts"></ion-icon>
                  {{currentPlanItem.rts || "重复"}}
                  <corner-badge *ngIf="currentPlanItem.rts"><p><i class="fa fa-copy "></i></p></corner-badge>
                </div>
              </button>
            </ion-row>

            <ion-row class="agendaRemark" *ngIf="currentPlanItem.bz">
              <button  ion-button icon-end clear   (click)="changeComment()">
            <span class="content">
                备注：{{currentPlanItem.bz}}
              </span>
                <ion-icon class="fal fa-fa-comment-edit iconRemark"></ion-icon>
              </button>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jti && currentPlanItem.sd">
              <ion-col  class="agendaDate" (click)="changeDatetime()">
                <button ion-button icon-end clear  >
                  <span class="content">
                    日期：{{currentPlanItem.sd | formatedate: "YYYY年M月D日"}}
                  </span>
                </button>
                <button ion-button icon-end clear  *ngIf="currentPlanItem.st">
                  <span class="content">
                    时间：{{currentPlanItem.st | formatedate: "HH:mm"}}
                  </span>
                </button>
              </ion-col>
              <ion-col  (click)="changeDatetime()">
                <button ion-button icon-end clear  >
                  <ion-icon class="fal fa-calendar-check  iconCalendar"></ion-icon>
                </button>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
      </page-box>`
})
export class CommemorationDayPage {
  statusBarColor: string = "#3c4d55";

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };

  currentPlanItem: PlanItemData = {} as PlanItemData;
  originPlanItem: PlanItemData = {} as PlanItemData;

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  privateplans: Array<any> = UserConfig.privateplans;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite: SqliteExec,
              private keyboard: Keyboard) {
    moment.locale('zh-cn');
    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      if (paramter.si) {
        this.calendarService.getPlanItem(paramter.si).then((commemorationday) => {
          this.currentPlanItem = commemorationday;
          Object.assign(this.originPlanItem, commemorationday);

          this.buttons.remove = true;
        });
      } else {
        this.currentPlanItem.sd = paramter.d.format("YYYY/MM/DD");

        if (paramter.sn) this.currentPlanItem.jtn = paramter.sn;
      }
    }
  }

  ionViewDidEnter(){
    setTimeout(() => {
      if (!this.currentPlanItem.jti) {
        let el = this._bzRef.nativeElement.querySelector('textarea');
        el.focus();
        this.keyboard.show();   //for android
      }
    }, 500);
  }

  changeTitle() {
    if (this.currentPlanItem.jti) {
      if (this.currentPlanItem.jtn != "" && !this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    } else {
      if (this.currentPlanItem.jtn != "") {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    }
  }

  changeRepeat() {
    if (!this.currentPlanItem.rtjson && this.currentPlanItem.rt) {
      this.currentPlanItem.rtjson = new RtJson();
      let rtdata = JSON.parse(this.currentPlanItem.rt);
      Object.assign(this.currentPlanItem.rtjson, rtdata);
    } else if (!this.currentPlanItem.rtjson && !this.currentPlanItem.rt) {
      this.currentPlanItem.rtjson = new RtJson();
    }

    let data = new RtJson();
    Object.assign(data, this.currentPlanItem.rtjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REPEAT_PAGE, {value: data});
    modal.onDidDismiss(async (data) => {
      if (data && data.rtjson) {
        this.currentPlanItem.rtjson = new RtJson();
        Object.assign(this.currentPlanItem.rtjson, data.rtjson);
        this.currentPlanItem.rt = JSON.stringify(this.currentPlanItem.rtjson);
        this.currentPlanItem.rts = this.currentPlanItem.rtjson.text();

        if (!this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  changeComment() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._COMMENT_PAGE, {value: this.currentPlanItem.bz});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentPlanItem.bz = data.bz;

      if (!this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changePlan() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._PLAN_PAGE, {ji: this.currentPlanItem.ji});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentPlanItem.ji = data;

      if (!this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  validCheck(): boolean {
    if (this.currentPlanItem.jtn && this.currentPlanItem.jtn != "") {
      return true;
    }
  }

  save() {
    if (this.validCheck()) {              // 输入校验
      if (this.currentPlanItem.jti) {       // 修改日程
        if (this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
          return;
        }

        this.util.loadingStart().then(() => {
          this.calendarService.savePlanItem(this.currentPlanItem).then((commemorationday) => {
            if (commemorationday && commemorationday.length > 0) {
              this.currentPlanItem = commemorationday[0];
              Object.assign(this.originPlanItem, commemorationday[0]);

              this.buttons.remove = true;
              this.buttons.save = false;
            }
            this.util.loadingEnd();
          });
        });

        // if (this.calendarService.hasAgendaModifyConfirm(this.originAgenda, this.currentPlanItem)) { // 重复修改
        //   if (this.modifyConfirm) {
        //     this.modifyConfirm.dismiss();
        //   }
        //   this.modifyConfirm = this.createConfirm();
        //
        //   this.modifyConfirm.present();
        // } else {                          // 非重复/重复已经修改为非重复
        //   this.util.loadingStart().then(() => {
        //     this.eventService.saveAgenda(this.currentPlanItem, this.originAgenda, OperateType.OnlySel).then((agenda) => {
        //       if (agenda && agenda.length > 0) {
        //         this.currentPlanItem = agenda[0];
        //         Object.assign(this.originAgenda, agenda[0]);
        //
        //         this.buttons.save = false;
        //       }
        //       this.util.loadingEnd();
        //     });
        //   });
        // }
      } else {                            // 新建日程
        this.util.loadingStart().then(() => {
          this.calendarService.savePlanItem(this.currentPlanItem).then((commemorationday) => {
            if (commemorationday && commemorationday.length > 0) {
              this.currentPlanItem = commemorationday[0];
              Object.assign(this.originPlanItem, commemorationday[0]);

              this.buttons.remove = true;
              this.buttons.save = false;
            }
            this.util.loadingEnd();
          });
        });
      }
    }
  }

  goRemove() {
    this.util.loadingStart().then(() => {
      this.calendarService.removePlanItem(this.originPlanItem.jti)
      .then(() => {
        this.util.loadingEnd();
        this.goBack();
      });
    });
  }

  goBack() {
    this.navCtrl.pop();
  }
}
