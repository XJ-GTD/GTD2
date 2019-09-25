import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import { CalendarDay } from "../../components/ion2-calendar";
import { AgendaService } from "./agenda.service";
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
 * Generated class for the 日程创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-agenda',
  template:
      `
    <page-box title="活动" [buttons]="buttons" [data]="currentAgenda.evi" (onRemove)="goRemove()" (onSave)="save()" (onBack)="goBack()">
      <ion-grid>
        <ion-row class="agendaEvn">
          <!--主题-->
          <ion-textarea rows="8" [(ngModel)]="currentAgenda.evn" (ionChange)="changeTitle()" #bzRef></ion-textarea>

          <div class="agendatodo" *ngIf="currentAgenda.evi && currentAgenda.todolist">
            <button ion-button icon-only clear  (click)="changeTodolist()">
              <ion-icon class="fa" [class.fa-star-exclamation] = "currentAgenda.todolist == todoliston" [class.fa-star] = "currentAgenda.todolist != todoliston"></ion-icon>
            </button>
          </div>
        </ion-row>

        <ion-row class="optionRow">
          <ion-grid>
            <!--附加属性操作-->
            <ion-row class="agendaOptionOne" *ngIf="currentAgenda.evi">
              <button class="agendaPinbutton" ion-button icon-start clear  (click)="changeLocation()" *ngIf="!currentAgenda.adr">
                <ion-icon class="fal fa-map-marker-alt iconPin"></ion-icon>
                <div>地址</div>
              </button>
              <button class="agendaRemarkbutton" ion-button icon-start clear  (click)="changeComment()" *ngIf="!currentAgenda.bz">
                <ion-icon class="fal fa-comment-edit iconRemark"></ion-icon>
                <div>备注</div>
              </button>
              <button class="agendaPlanbutton"  ion-button icon-start clear  (click)="changePlan()">
                <ion-icon class="fal fa-line-columns iconPlus"></ion-icon>
                <div>{{currentAgenda.ji | formatplan: 'name' :'加入日历': privateplans}}</div>
              </button>
            </ion-row>

            <ion-row class="agendaOptionTwo" *ngIf="currentAgenda.evi">
              <ion-col class="agendaPlayer">
                <button ion-button  clear (click)="changeInvites()">
                    <ion-icon class="fal fa-user-friends iconUserPlus" *ngIf="currentAgenda.pn <= 0"></ion-icon>
                    参与人
                    <corner-badge *ngIf="currentAgenda.pn > 0">{{currentAgenda.pn}}</corner-badge>
                </button>
              </ion-col>
              <ion-col  class="agendaRemind">
                <button ion-button clear (click)="changeRemind()">
                    <ion-icon class="fal fa-bells iconBell" *ngIf="!currentAgenda.txs"></ion-icon>
                    {{currentAgenda.txs || "提醒"}}
                  <corner-badge *ngIf="currentAgenda.txs"><p>{{currentAgenda.txjson.reminds.length}}</p></corner-badge>
                </button>
              </ion-col>
              <ion-col class="agendaAttach">
                <button ion-button clear icon-end  (click)="changeAttach()">
                    <ion-icon class="fal fa-sparkles iconAttach" *ngIf="!currentAgenda.fj || currentAgenda.fj == '0'"></ion-icon>
                     补充
                    <corner-badge *ngIf="currentAgenda.fj && currentAgenda.fj != '0'"><p>{{currentAgenda.fj}}</p></corner-badge>
                </button>
              </ion-col>
            </ion-row>

            <ion-row class="agendaOptionThree" *ngIf="currentAgenda.evi">
              <button ion-button  clear (click)="changeRepeat()">
                <div class="agendarepeat">
                  <ion-icon class="fal fa-copy  iconCopy" *ngIf="!currentAgenda.rts"></ion-icon>
                  {{currentAgenda.rts || "重复"}}
                  <corner-badge *ngIf="currentAgenda.rts"><p><i class="fa fa-copy "></i></p></corner-badge>
                </div>
              </button>
            </ion-row>

            <ion-row class="agendaRemark" *ngIf="currentAgenda.bz">
              <button  ion-button icon-end clear   (click)="changeComment()">
            <span class="content">
                备注：{{currentAgenda.bz}}
              </span>
                <ion-icon class="fal fa-comment-edit iconRemark"></ion-icon>
              </button>
            </ion-row>

            <ion-row class="agendaPin" *ngIf="currentAgenda.adr">
              <button  ion-button icon-end clear  (click)="changeLocation()">
            <span class="content">
              地址：{{currentAgenda.adr}}
              </span>
                <ion-icon class="fal fa-map-marker-alt iconPin"></ion-icon>
              </button>
            </ion-row>
            <ion-row *ngIf="currentAgenda.evd">
              <ion-col  class="agendaDate" (click)="changeDatetime()">
                <button ion-button icon-end clear  >
                  <span class="content">
                    日期：{{currentAgenda.evd | formatedate: "YYYY年M月D日"}}
                    </span>
                      </button>
                <button ion-button icon-end clear  >
                  <span class="content" *ngIf="currentAgenda.al == wholeday">
                    时间：全天
                  </span>
                  <span class="content" *ngIf="currentAgenda.al != wholeday">
                    时间：{{currentAgenda.evt | formatedate: "HH:mm"}} {{currentAgenda.ct | formatedate: "duration"}}
                    </span>
                </button>
              </ion-col>
              <ion-col  (click)="changeDatetime()">
                <button ion-button icon-end clear  >
                  <ion-icon class="fal fa-calendar-check iconCalendar"></ion-icon>
                </button>
              </ion-col>
              <ion-col class="agendaSender" *ngIf="currentAgenda.ui != currentuser">
            <span class="content">
               ---来自{{currentAgenda.ui | formatuser: currentuser: friends}}
              </span>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </page-box>
  `
})
export class AgendaPage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  currentAgenda: AgendaData = {} as AgendaData;
  originAgenda: AgendaData = {} as AgendaData;

  privateplans: Array<any> = UserConfig.privateplans;

  modifyConfirm;

  todoliston = ToDoListStatus.On;
  todolistoff = ToDoListStatus.Off;

  wholeday = IsWholeday.Whole;

  repeatflag = RepeatFlag.Repeat;
  nonrepeatflag = RepeatFlag.NonRepeat;
  @ViewChild(PageBoxComponent)
  pageBoxComponent:PageBoxComponent

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;



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
        this.eventService.getAgenda(paramter.si).then((agenda) => {
          this.currentAgenda = agenda;
          Object.assign(this.originAgenda, agenda);

          this.buttons.remove = true;
        });
      } else {
        this.currentAgenda.sd = paramter.d.format("YYYY/MM/DD");

        if (paramter.t) {
          this.currentAgenda.st = paramter.t;
        } else {
          this.currentAgenda.st = moment().add(1, "h").format("HH:00");
        }

        if (paramter.sn) this.currentAgenda.evn = paramter.sn;

        if (paramter.todolist) {
          this.currentAgenda.todolist = ToDoListStatus.On;
        }
      }
    }
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter(){
    this.pageBoxComponent.setBoxContent();
    setTimeout(() => {
      if (!this.currentAgenda.evi) {
        let el = this._bzRef.nativeElement.querySelector('textarea');
        el.focus();
        this.keyboard.show();   //for android
      }
    }, 500);
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    if (this.modifyConfirm !== undefined) {
      this.modifyConfirm.dismiss();
    }
  }

  changeDatetime() {
  }

  changeTitle() {
    if (this.currentAgenda.evi) {
      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    } else {
      if (this.currentAgenda.evn != "") {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    }
  }

  changeTodolist() {
    if (this.currentAgenda.todolist == ToDoListStatus.On) {
      this.currentAgenda.todolist = ToDoListStatus.Off;
    } else {
      this.currentAgenda.todolist = ToDoListStatus.On;
    }

    if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
      this.buttons.save = true;
    } else {
      this.buttons.save = false;
    }
  }

  changeAttach() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._ATTACH_PAGE);
    modal.onDidDismiss(async (data)=>{

    });
    modal.present();
  }

  changeInvites() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._INVITES_PAGE);
    modal.onDidDismiss(async (data) => {

    });
    modal.present();
  }

  changePlan() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._PLAN_PAGE, {ji: this.currentAgenda.ji});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.ji = data;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeLocation() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._LOCATION_PAGE, {
      adr: this.currentAgenda.adr,
      adrx: this.currentAgenda.adrx,
      adry: this.currentAgenda.adry
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.adr = data.adr || "";
      this.currentAgenda.adrx = data.adrx || 0;
      this.currentAgenda.adry = data.adry || 0;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }

    });
    modal.present();
  }

  changeComment() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._COMMENT_PAGE, {value: this.currentAgenda.bz});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.bz = data.bz;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeRepeat() {
    if (!this.currentAgenda.rtjson && this.currentAgenda.rt) {
      this.currentAgenda.rtjson = new RtJson();
      let rtdata = JSON.parse(this.currentAgenda.rt);
      Object.assign(this.currentAgenda.rtjson, rtdata);
    } else if (!this.currentAgenda.rtjson && !this.currentAgenda.rt) {
      this.currentAgenda.rtjson = new RtJson();
    }

    let data = new RtJson();
    Object.assign(data, this.currentAgenda.rtjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REPEAT_PAGE, {value: data});
    modal.onDidDismiss(async (data) => {
      if (data && data.rtjson) {
        this.currentAgenda.rtjson = new RtJson();
        Object.assign(this.currentAgenda.rtjson, data.rtjson);
        this.currentAgenda.rt = JSON.stringify(this.currentAgenda.rtjson);
        this.currentAgenda.rts = this.currentAgenda.rtjson.text();

        if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  changeRemind() {
    if (!this.currentAgenda.txjson && this.currentAgenda.tx) {
      this.currentAgenda.txjson = new TxJson();
      let txdata = JSON.parse(this.currentAgenda.tx);
      Object.assign(this.currentAgenda.txjson, txdata);
    } else if (!this.currentAgenda.txjson && !this.currentAgenda.tx) {
      this.currentAgenda.txjson = new TxJson();
    }

    let data = new TxJson();
    Object.assign(data, this.currentAgenda.txjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REMIND_PAGE, {value: {
      txjson: data,
      evd: this.currentAgenda.evd,
      evt: this.currentAgenda.evt,
      al: this.currentAgenda.al
    }});
    modal.onDidDismiss(async (data) => {
      if (data && data.txjson) {
        this.currentAgenda.txjson = new TxJson();
        Object.assign(this.currentAgenda.txjson, data.txjson);
        this.currentAgenda.tx = JSON.stringify(this.currentAgenda.txjson);
        this.currentAgenda.txs = this.currentAgenda.txjson.text();

        if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  doOptionRemove(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.eventService.removeAgenda(this.originAgenda, op)
      .then(() => {
        this.util.loadingEnd();
        this.goBack();
      });
    });
  }

  goRemove() {
    if (this.originAgenda.rfg == RepeatFlag.Repeat) { // 重复
      if (this.modifyConfirm) {
        this.modifyConfirm.dismiss();
      }
      this.modifyConfirm = this.createConfirm(true);

      this.modifyConfirm.present();

    } else {
      this.util.loadingStart().then(() => {
        this.eventService.removeAgenda(this.originAgenda, OperateType.OnlySel)
        .then(() => {
          this.util.loadingEnd();
          this.goBack();
        });
      });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  validCheck(): boolean {
    if (this.currentAgenda.evn && this.currentAgenda.evn != "") {
      return true;
    }
  }

  createConfirm(remove: boolean = false) {
    let buttons: Array<any> = new Array<any>();

    if (remove) {
      buttons.push({
        text: '仅删除此日程',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.OnlySel);
        }
      });
      buttons.push({
        text: '删除所有将来日程',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.FromSel);
        }
      });
    } else {
      buttons.push({
        text: '仅针对此日程存储',
        role: 'modify',
        handler: () => {
          this.doOptionSave(OperateType.OnlySel);
        }
      });
      buttons.push({
        text: '针对将来日程存储',
        role: 'modify',
        handler: () => {
          this.doOptionSave(OperateType.FromSel);
        }
      });
    }

    buttons.push({
      text: '取消',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });

    return this.actionSheetCtrl.create({
      title: "此为重复日程。",
      buttons: buttons
    });
  }

  doOptionSave(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, op).then((agenda) => {
        if (agenda && agenda.length > 0) {
          this.currentAgenda = agenda[0];
          Object.assign(this.originAgenda, agenda[0]);

          this.buttons.save = false;
        }
        this.util.loadingEnd();
      });
    });
  }

  save() {
    if (this.validCheck()) {              // 输入校验
      if (this.currentAgenda.evi) {       // 修改日程
        if (this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
          return;
        }

        if (this.eventService.hasAgendaModifyConfirm(this.originAgenda, this.currentAgenda)) { // 重复修改
          if (this.modifyConfirm) {
            this.modifyConfirm.dismiss();
          }
          this.modifyConfirm = this.createConfirm();

          this.modifyConfirm.present();
        } else {                          // 非重复/重复已经修改为非重复
          this.util.loadingStart().then(() => {
            this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, OperateType.OnlySel).then((agenda) => {
              if (agenda && agenda.length > 0) {
                this.currentAgenda = agenda[0];
                Object.assign(this.originAgenda, agenda[0]);

                this.buttons.save = false;
              }
              this.util.loadingEnd();
            });
          });
        }
      } else {                            // 新建日程
        this.util.loadingStart().then(() => {
          this.eventService.saveAgenda(this.currentAgenda).then((agenda) => {
            if (agenda && agenda.length > 0) {
              this.currentAgenda = agenda[0];
              Object.assign(this.originAgenda, agenda[0]);

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
