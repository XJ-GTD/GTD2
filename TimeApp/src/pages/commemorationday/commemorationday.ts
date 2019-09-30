import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams,} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {ScdPageParamter} from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {CalendarService, PlanItemData} from "../../service/business/calendar.service";
import {EventService, RtJson,} from "../../service/business/event.service";
import {OperateType, RepeatFlag, ConfirmType} from "../../data.enum";
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
      `
    <page-box title="纪念日" [buttons]="buttons" [data]="currentPlanItem.jti" (onRemove)="goRemove()" (onSave)="save()"
              (onBack)="goBack()">

      <ion-grid>
        <ion-row class="snRow">
          <div class="sn font-large-x">
            <!--主题-->
            <ion-textarea rows="8" [(ngModel)]="currentPlanItem.jtn" (ionChange)="changeTitle()" #bzRef></ion-textarea>
          </div>
        </ion-row>
        
        <ion-row class="optionRow">
          <ion-grid>
            <!--附加属性操作-->
            <ion-row *ngIf="currentPlanItem.jti">
              <div (click)="changeComment()" *ngIf="!currentPlanItem.bz">
                <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
                <span class="font-normal">备注</span>
              </div>
              <div (click)="changePlan()" end>
                <ion-icon class="fal fa-line-columns "></ion-icon>
                <span>{{currentPlanItem.ji | formatplan: 'name' : '加入日历': privateplans}}</span>
              </div>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jti">
              <div>
                <button ion-button clear (click)="changeInvites()" class="font-normal">
                  <ion-icon class="fal fa-user-friends font-normal"
                            *ngIf="currentPlanItem.pn <= 0"></ion-icon>
                  参与人
                  <corner-badge fa-user-friends *ngIf="currentPlanItem.pn > 0"><p>{{currentPlanItem.pn}}</p></corner-badge>
                </button>
              </div>
              <div>
                <button ion-button clear (click)="changeRemind()" class="font-normal">
                  <ion-icon class="fal fa-bells " *ngIf="!currentPlanItem.txs"></ion-icon>
                  {{currentPlanItem.txs || "提醒"}}
                  <corner-badge fa-bells *ngIf="currentPlanItem.txs"><p>{{currentPlanItem.txjson.reminds.length}}</p>
                  </corner-badge>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jti">
              <button ion-button clear (click)="changeRepeat()" class="font-normal">
                <ion-icon class="fal fa-copy font-normal" *ngIf="!currentPlanItem.rts"></ion-icon>
                {{currentPlanItem.rts || "重复"}}
                <corner-badge *ngIf="currentPlanItem.rts" fa-copy><p><i class="fa fa-copy "></i></p></corner-badge>
              </button>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.bz" (click)="changeComment()">
                <span class="content font-normal">
                  备注：{{currentPlanItem.bz}}
                </span>
              <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jti && currentPlanItem.sd">
              <div (click)="changeDatetime()">
                <span class="content font-normal">
                  日期：{{currentPlanItem.evd | formatedate: "YYYY年M月D日"}}<br/>
                
                  时间：{{currentPlanItem.evt | formatedate: "HH:mm"}} {{currentPlanItem.ct | formatedate: "duration"}}
                </span>
                <ion-icon class="font-normal fal fa-calendar-check "></ion-icon>
              </div>
              <div (click)="changeDatetime()">
              </div>
              <div end *ngIf="currentPlanItem.ui != currentuser">
                <span class="content  font-normal">
                   ---来自{{currentPlanItem.ui | formatuser: currentPlanItem: friends}}
                  </span>
              </div>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </page-box>


  `
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

  repeattonon = RepeatFlag.RepeatToOnly;

  modifyConfirm;

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

  ionViewDidEnter() {
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

  createConfirm(remove: boolean = false, confirm: ConfirmType = ConfirmType.CurrentOrFutureAll) {
    let buttons: Array<any> = new Array<any>();

    if (remove) {
      buttons.push({
        text: '仅删除此纪念日',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.OnlySel);
        }
      });
      buttons.push({
        text: '删除所有将来纪念日',
        role: 'remove',
        handler: () => {
          this.doOptionRemove(OperateType.FromSel);
        }
      });
    } else {
      if (confirm == ConfirmType.CurrentOrFutureAll) {
        buttons.push({
          text: '仅针对此纪念日存储',
          role: 'modify',
          handler: () => {
            this.doOptionSave(OperateType.OnlySel);
          }
        });
      }
      buttons.push({
        text: '针对将来纪念日存储',
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
      title: "此为重复纪念日。",
      buttons: buttons
    });
  }

  doOptionSave(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.calendarService.savePlanItem(this.currentPlanItem, this.originPlanItem, op).then((planitems) => {
        if (planitems && planitems.length > 0) {
          this.currentPlanItem = planitems[0];
          Object.assign(this.originPlanItem, planitems[0]);

          this.buttons.save = false;
        }
        this.util.loadingEnd();
      });
    });
  }

  save() {
    if (this.validCheck()) {              // 输入校验
      if (this.currentPlanItem.jti) {       // 修改日历项
        if (this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
          return;
        }

        let confirm: ConfirmType = this.calendarService.hasPlanItemModifyConfirm(this.originPlanItem, this.currentPlanItem);

        if (confirm == ConfirmType.CurrentOrFutureAll || confirm == ConfirmType.FutureAll) { // 重复修改
          if (this.modifyConfirm) {
            this.modifyConfirm.dismiss();
          }
          this.modifyConfirm = this.createConfirm(false, confirm);

          this.modifyConfirm.present();
        } else {                          // 非重复/重复已经修改为非重复
          this.util.loadingStart().then(() => {
            this.calendarService.savePlanItem(this.currentPlanItem, this.originPlanItem, OperateType.Non).then((planitems) => {
              if (planitems && planitems.length > 0) {
                this.currentPlanItem = planitems[0];
                Object.assign(this.originPlanItem, planitems[0]);

                this.buttons.save = false;
              }
              this.util.loadingEnd();
            });
          });
        }

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

  doOptionRemove(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.calendarService.removePlanItem(this.originPlanItem, op)
        .then(() => {
          this.util.loadingEnd();
          this.goBack();
        });
    });
  }

  goRemove() {
    if (this.originPlanItem.rfg == RepeatFlag.Repeat) { // 重复
      if (this.modifyConfirm) {
        this.modifyConfirm.dismiss();
      }
      this.modifyConfirm = this.createConfirm(true);

      this.modifyConfirm.present();

    } else {
      this.util.loadingStart().then(() => {
        this.calendarService.removePlanItem(this.originPlanItem, OperateType.Non)
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
}
