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
import {CalendarService} from "../../service/business/calendar.service";
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private agendaService: AgendaService,
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

        // if (this.calendarService.hasAgendaModifyConfirm(this.originAgenda, this.currentAgenda)) { // 重复修改
        //   if (this.modifyConfirm) {
        //     this.modifyConfirm.dismiss();
        //   }
        //   this.modifyConfirm = this.createConfirm();
        //
        //   this.modifyConfirm.present();
        // } else {                          // 非重复/重复已经修改为非重复
        //   this.util.loadingStart().then(() => {
        //     this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, OperateType.OnlySel).then((agenda) => {
        //       if (agenda && agenda.length > 0) {
        //         this.currentAgenda = agenda[0];
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
            if (commemorationday) {
              this.currentPlanItem = commemorationday;
              Object.assign(this.originPlanItem, commemorationday);

              this.buttons.remove = true;
              this.buttons.save = false;
            }
            this.util.loadingEnd();
          });
        });
      }
    }
  }
}
