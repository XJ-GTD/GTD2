import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {CalendarDay} from "../../components/ion2-calendar";
import {TaskService} from "./task.service";
import {ScdData, ScdPageParamter} from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {CornerBadgeComponent} from "../../components/corner-badge/corner-badge";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, TaskData, RtJson, TxJson} from "../../service/business/event.service";
import {
  PageDirection,
  IsSuccess,
  OperateType,
  RepeatFlag,
  ConfirmType,
  IsWholeday,
  ObjectType
} from "../../data.enum";
import {Keyboard} from "@ionic-native/keyboard";

/**
 * Generated class for the 任务创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-task',
  template:
      `
    <page-box title="任务" [buttons]="buttons" [data]="currentTask.evi" (onRemove)="goRemove()" (onSave)="save()"
              (onBack)="goBack()">

      <ion-grid>
        <ion-row class="snRow">
          <div class="sn font-large-x">
            <!--主题-->
            <ion-textarea rows="8" no-margin [(ngModel)]="currentTask.evn" (ionChange)="changeTitle()"
                          #bzRef></ion-textarea>
          </div>
        </ion-row>
        <ion-row class="optionRow">
          <ion-grid>
            <!--附加属性操作-->
            <ion-row *ngIf="currentTask.evi">
              <div (click)="changeLocation()" *ngIf="!currentTask.adr">
                <ion-icon class="fal fa-map-marker-alt font-normal"></ion-icon>
                <span class="font-normal">地址</span>
              </div>
              <div (click)="changeComment()" *ngIf="!currentTask.bz">
                <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
                <span class="font-normal">备注</span>
              </div>
              <div (click)="changePlan()" end>
                <ion-icon class="fal fa-line-columns  font-normal"></ion-icon>
                <span class="font-normal">{{currentTask.ji | formatplan: 'name' :'加入日历': privateplans}}</span>
              </div>
            </ion-row>

            <ion-row *ngIf="currentTask.evi">
              <div>
                <button ion-button clear (click)="changeInvites()" class="font-normal">
                  <ion-icon class="fal fa-user-friends font-normal"
                            *ngIf="currentTask.pn <= 0"></ion-icon>
                  参与人
                  <corner-badge fa-user-friends *ngIf="currentTask.pn > 0"><p>{{currentTask.pn}}</p></corner-badge>
                </button>
              </div>
              <div>
                <button ion-button clear (click)="changeRemind()" class="font-normal">
                  <ion-icon class="fal fa-bells " *ngIf="!currentTask.txs"></ion-icon>
                  {{currentTask.txs || "提醒"}}
                  <corner-badge fa-bells *ngIf="currentTask.txs"><p>{{currentTask.txjson.reminds.length}}</p>
                  </corner-badge>
                </button>
              </div>
              <div>
                <button ion-button clear icon-end (click)="changeAttach()" class="font-normal">
                  <ion-icon class="fal fa-sparkles  font-normal"
                            *ngIf="!currentTask.fj || currentTask.fj == '0'"></ion-icon>
                  补充
                  <corner-badge fa-sparkles *ngIf="currentTask.fj && currentTask.fj != '0'">
                    <p>{{currentTask.fj}}</p>
                  </corner-badge>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentTask.evi">
              <button ion-button clear (click)="changeRepeat()" class="font-normal">
                <ion-icon class="fal fa-copy font-normal" *ngIf="!currentTask.rts"></ion-icon>
                {{currentTask.rts || "重复"}}
                <corner-badge *ngIf="currentTask.rts" fa-copy><p><i class="fa fa-copy "></i></p></corner-badge>
              </button>
            </ion-row>

            <ion-row *ngIf="currentTask.bz" (click)="changeComment()">
              <span class="content font-normal">
                  备注：{{currentTask.bz}}
                </span>
              <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
            </ion-row>

            <ion-row *ngIf="currentTask.adr " (click)="changeLocation()">
              <span class="content font-normal">
                地址：{{currentTask.adr}}
                </span>
              <ion-icon class="fal fa-map-marker-alt font-normal"></ion-icon>
            </ion-row>
            <ion-row *ngIf="currentTask.evd">
              <div (click)="changeDatetime()">
                <span class="content font-normal">
                  日期：{{currentTask.evd | formatedate: "YYYY年M月D日"}}<br/>

                  时间：{{currentTask.evt | formatedate: "HH:mm"}}
                </span>
                <ion-icon class="font-normal fal fa-calendar-check "></ion-icon>
              </div>
              <div (click)="changeDatetime()">
              </div>
              <div end *ngIf="currentTask.evi && currentTask.ui != currentuser">
                <span class="content  font-normal">
                   ---来自{{currentTask.ui | formatuser: currentuser: friends}}
                  </span>
              </div>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </page-box>
  `
})
export class TaskPage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  currentTask: TaskData = {} as TaskData;
  originTask: TaskData = {} as TaskData;

  privateplans: Array<any> = UserConfig.privateplans;

  modifyConfirm;

  wholeday = IsWholeday.Whole;

  repeatflag = RepeatFlag.Repeat;
  nonrepeatflag = RepeatFlag.NonRepeat;
  repeattonon = RepeatFlag.RepeatToOnly;

  @ViewChild(PageBoxComponent)
  pageBoxComponent: PageBoxComponent

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private taskService: TaskService,
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
        this.eventService.getTask(paramter.si).then((task) => {
          this.currentTask = task;
          Object.assign(this.originTask, task);

          this.buttons.remove = true;
        });
      } else {
        this.currentTask.evd = paramter.d.format("YYYY/MM/DD");

        if (paramter.t) {
          this.currentTask.evt = paramter.t;
        } else {
          this.currentTask.evt = moment().add(1, "h").format("HH:00");
        }

        if (paramter.sn) this.currentTask.evn = paramter.sn;
      }
    }
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    this.pageBoxComponent.setBoxContent();
    setTimeout(() => {
      if (!this.currentTask.evi) {
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
    let modal = this.modalCtrl.create(DataConfig.PAGE._DTSELECT_PAGE, {
      sd: this.currentTask.evd,
      st: this.currentTask.evt
    });
    modal.onDidDismiss(async (data) => {

    });
    modal.present();
  }

  changeTitle() {
    if (this.currentTask.evi) {
      if (this.currentTask.evn != "" && !this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    } else {
      if (this.currentTask.evn != "") {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    }
  }

  changeAttach() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._ATTACH_PAGE, {
      obt: ObjectType.Event,
      obi: this.currentTask.evi
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentTask.fjs = data.attach;

      if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeInvites() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._INVITES_PAGE, {
      members: this.currentTask.members,
      md: this.currentTask.md,
      iv: this.currentTask.iv
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentTask.members = data.members;
      this.currentTask.pn = data.members.length;
      this.currentTask.md = data.md;
      this.currentTask.iv = data.iv;

      if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changePlan() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._PLAN_PAGE, {ji: this.currentTask.ji});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentTask.ji = data;

      if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeLocation() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._LOCATION_PAGE, {
      adr: this.currentTask.adr,
      adrx: this.currentTask.adrx,
      adry: this.currentTask.adry
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentTask.adr = data.adr || "";
      this.currentTask.adrx = data.adrx || 0;
      this.currentTask.adry = data.adry || 0;

      if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }

    });
    modal.present();
  }

  changeComment() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._COMMENT_PAGE, {value: this.currentTask.bz});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentTask.bz = data.bz;

      if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeRepeat() {
    if (!this.currentTask.rtjson && this.currentTask.rt) {
      this.currentTask.rtjson = new RtJson();
      let rtdata = JSON.parse(this.currentTask.rt);
      Object.assign(this.currentTask.rtjson, rtdata);
    } else if (!this.currentTask.rtjson && !this.currentTask.rt) {
      this.currentTask.rtjson = new RtJson();
    }

    let data = new RtJson();
    Object.assign(data, this.currentTask.rtjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REPEAT_PAGE, {value: data});
    modal.onDidDismiss(async (data) => {
      if (data && data.rtjson) {
        this.currentTask.rtjson = new RtJson();
        Object.assign(this.currentTask.rtjson, data.rtjson);
        this.currentTask.rt = JSON.stringify(this.currentTask.rtjson);
        this.currentTask.rts = this.currentTask.rtjson.text();

        if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  changeRemind() {
    if (!this.currentTask.txjson && this.currentTask.tx) {
      this.currentTask.txjson = new TxJson();
      let txdata = JSON.parse(this.currentTask.tx);
      Object.assign(this.currentTask.txjson, txdata);
    } else if (!this.currentTask.txjson && !this.currentTask.tx) {
      this.currentTask.txjson = new TxJson();
    }

    let data = new TxJson();
    Object.assign(data, this.currentTask.txjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REMIND_PAGE, {
      value: {
        txjson: data,
        evd: this.currentTask.evd,
        evt: this.currentTask.evt,
        al: IsWholeday.NonWhole
      }
    });
    modal.onDidDismiss(async (data) => {
      if (data && data.txjson) {
        this.currentTask.txjson = new TxJson();
        Object.assign(this.currentTask.txjson, data.txjson);
        this.currentTask.tx = JSON.stringify(this.currentTask.txjson);
        this.currentTask.txs = this.currentTask.txjson.text();

        if (!this.eventService.isSameTask(this.currentTask, this.originTask)) {
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
      this.eventService.removeTask(this.originTask)
        .then(() => {
          this.util.loadingEnd();
          this.goBack();
        });
    });
  }

  goRemove() {
    if (this.originTask.rfg == RepeatFlag.Repeat) { // 重复
      if (this.modifyConfirm) {
        this.modifyConfirm.dismiss();
      }
      this.modifyConfirm = this.createConfirm(true);

      this.modifyConfirm.present();

    } else {
      this.util.loadingStart().then(() => {
        this.eventService.removeTask(this.originTask)
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
    if (this.currentTask.evn && this.currentTask.evn != "") {
      return true;
    }
  }

  createConfirm(remove: boolean = false, confirm: ConfirmType = ConfirmType.CurrentOrFutureAll) {
    let buttons: Array<any> = new Array<any>();

    if (remove) {
      buttons.push({
        text: '仅删除此任务',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.OnlySel);
        }
      });
      buttons.push({
        text: '删除所有将来任务',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.FromSel);
        }
      });
    } else {
      if (confirm == ConfirmType.CurrentOrFutureAll) {
        buttons.push({
          text: '仅针对此任务存储',
          role: 'modify',
          handler: () => {
            this.doOptionSave(OperateType.OnlySel);
          }
        });
      }
      buttons.push({
        text: '针对将来任务存储',
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
      title: "此为重复任务。",
      buttons: buttons
    });
  }

  doOptionSave(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.eventService.saveTask(this.currentTask).then((task) => {
        if (task) {
          this.currentTask = task;
          Object.assign(this.originTask, task);

          this.buttons.save = false;
        }
        this.util.loadingEnd();
      });
    });
  }

  save() {
    if (this.validCheck()) {              // 输入校验
      if (this.currentTask.evi) {       // 修改任务
        if (this.eventService.isSameTask(this.currentTask, this.originTask)) {
          return;
        }

        let confirm: ConfirmType = this.eventService.hasTaskModifyConfirm(this.originTask, this.currentTask);
        if (confirm == ConfirmType.CurrentOrFutureAll || confirm == ConfirmType.FutureAll) { // 重复修改
          if (this.modifyConfirm) {
            this.modifyConfirm.dismiss();
          }
          this.modifyConfirm = this.createConfirm(false, confirm);

          this.modifyConfirm.present();
        } else {                          // 非重复/重复已经修改为非重复
          this.util.loadingStart().then(() => {
            this.eventService.saveTask(this.currentTask).then((task) => {
              if (task) {
                this.currentTask = task;
                Object.assign(this.originTask, task);

                this.buttons.save = false;
              }
              this.util.loadingEnd();
            });
          });
        }
      } else {                            // 新建任务
        this.util.loadingStart().then(() => {
          this.eventService.saveTask(this.currentTask).then((task) => {
            if (task) {
              this.currentTask = task;
              Object.assign(this.originTask, task);

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
