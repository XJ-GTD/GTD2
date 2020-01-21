import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams,} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {ScdPageParamter} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {CalendarService, PlanItemData} from "../../service/business/calendar.service";
import {RtJson, TxJson, Member} from "../../service/business/event.service";
import {
  OperateType,
  RepeatFlag,
  ConfirmType,
  IsWholeday,
  InviteState,
  SelfDefineType,
  ModiPower
} from "../../data.enum";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {AssistantService} from "../../service/cordova/assistant.service";
import * as anyenum from "../../data.enum";

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

      <!--<ion-grid>-->
      <!---->
      <!--<ion-row class="limitRow font-small-x">-->
      <!--<span>{{snlength}} / 20 </span>-->
      <!--</ion-row>-->
      <!---->
      <!--<ion-row class="snRow">-->
      <!--<div class="sn font-large-x">-->
      <!--&lt;!&ndash;主题&ndash;&gt;-->
      <!--<ion-textarea rows="8" [(ngModel)]="currentPlanItem.jtn" (ionChange)="changeTitle()" [readonly]="currentPlanItem.jtc == system" [maxlength]="20"></ion-textarea>-->
      <!--</div>-->
      <!--</ion-row>-->

      <!--<ion-row class="optionRow">-->
      <!--<ion-grid>-->
      <!--&lt;!&ndash;附加属性操作&ndash;&gt;-->
      <!--<ion-row *ngIf="currentPlanItem.jti">-->
      <!--<div (click)="changeComment()" *ngIf="!currentPlanItem.bz">-->
      <!--<ion-icon class="fal fa-comment-edit font-normal"></ion-icon>-->
      <!--<span class="font-normal">备注</span>-->
      <!--</div>-->
      <!--<div *ngIf="currentPlanItem.jtc == system" end>-->
      <!--<ion-icon class="fal fa-line-columns "></ion-icon>-->
      <!--<span class="font-normal">{{currentPlanItem.ji | formatplan: 'name' : '加入日历': publicplans}}</span>-->
      <!--</div>-->
      <!--<div *ngIf="currentPlanItem.jtc == selfdefine" (click)="changePlan()" end>-->
      <!--<ion-icon class="fal fa-line-columns "></ion-icon>-->
      <!--<span class="font-normal">{{currentPlanItem.ji | formatplan: 'name' : '加入日历': privateplans}}</span>-->
      <!--</div>-->
      <!--</ion-row>-->

      <!--<ion-row *ngIf="currentPlanItem.jti">-->
      <!--<div *ngIf="currentPlanItem.jtc == selfdefine">-->
      <!--<button ion-button clear (click)="changeInvites()" class="font-normal">-->
      <!--<ion-icon class="fal fa-user-friends font-normal"-->
      <!--*ngIf="currentPlanItem.pn <= 0"></ion-icon>-->
      <!--参与人-->
      <!--<corner-badge fa-user-friends *ngIf="currentPlanItem.pn > 0"><p>{{currentPlanItem.pn}}</p></corner-badge>-->
      <!--</button>-->
      <!--</div>-->
      <!--<div>-->
      <!--<button ion-button clear (click)="changeRemind()" class="font-normal">-->
      <!--<ion-icon class="fal fa-bells " *ngIf="!currentPlanItem.txs"></ion-icon>-->
      <!--{{currentPlanItem.txs || "提醒"}}-->
      <!--<corner-badge fa-bells *ngIf="currentPlanItem.txs"><p>{{currentPlanItem.txjson.reminds.length}}</p>-->
      <!--</corner-badge>-->
      <!--</button>-->
      <!--</div>-->
      <!--</ion-row>-->

      <!--<ion-row *ngIf="currentPlanItem.jti">-->
      <!--<button ion-button clear (click)="changeRepeat()" class="font-normal">-->
      <!--<ion-icon class="fal fa-copy font-normal" *ngIf="!currentPlanItem.rts"></ion-icon>-->
      <!--{{currentPlanItem.rts || "重复"}}-->
      <!--<corner-badge *ngIf="currentPlanItem.rts" fa-copy><p><i class="fa fa-copy "></i></p></corner-badge>-->
      <!--</button>-->
      <!--</ion-row>-->

      <!--<ion-row *ngIf="currentPlanItem.bz" (click)="changeComment()">-->
      <!--<span class="content font-normal">-->
      <!--备注：{{currentPlanItem.bz}}-->
      <!--</span>-->
      <!--<ion-icon class="fal fa-comment-edit font-normal"></ion-icon>-->
      <!--</ion-row>-->

      <!--<ion-row *ngIf="currentPlanItem.jti && currentPlanItem.sd">-->
      <!--<div (click)="changeDatetime()">-->
      <!--<span class="content font-normal">-->
      <!--日期：{{currentPlanItem.evd | formatedate: "YYYY年M月D日"}}<br/>-->

      <!--时间：{{currentPlanItem.sd  + " " + currentPlanItem.st | formatedate: "HH:mm"}}-->
      <!--</span>-->
      <!--<ion-icon class="font-normal fal fa-calendar-check "></ion-icon>-->
      <!--</div>-->
      <!--<div (click)="changeDatetime()">-->
      <!--</div>-->
      <!--<div end *ngIf="currentPlanItem.jtc == selfdefine && currentPlanItem.ui != currentuser">-->
      <!--<span class="content  font-normal">-->
      <!-- -{{currentPlanItem.ui | formatuser: currentPlanItem: friends}}-->
      <!--</span>-->
      <!--</div>-->
      <!--</ion-row>-->
      <!--</ion-grid>-->
      <!--</ion-row>-->
      <!--</ion-grid>-->
      <ion-grid>

        <ion-row class="snRow">
          <div class="sn font-large-x">
            <!--主题-->
            <ion-textarea rows="8" [(ngModel)]="currentPlanItem.jtn" (ionChange)="changeTitle()"
                          [readonly]="currentPlanItem.jtc == system" [maxlength]="20"
            placeholder="在20字符内描述你的日历项主题"></ion-textarea>

          </div>

          <!-- <span>{{snlength}} / 20 </span>-->
        </ion-row>


        <ion-row class="dateRow">
          <!--<div class="agendaai">-->
            <!--<ion-icon class="fal fa-waveform" *ngIf="currentPlanItem.jti" (click)="speakPlanItem()"></ion-icon>-->
            <!--<ion-icon class="fal fa-microphone" *ngIf="!currentPlanItem.jti" (click)="recordPlanItem()"></ion-icon>-->
          <!--</div>-->

          <div (click)="changeDatetime()" class="pickDate" *ngIf="currentPlanItem.jti">
            <ion-icon class="fal fa-alarm-clock "></ion-icon>
            <span class="content  agendaDate">
                  {{currentPlanItem.sd | formatedate: "YYYY-M-D"}}
                </span>
            <span class="content  agendaDate">
                      {{currentPlanItem.sd + " " + currentPlanItem.st | formatedate: "A hh:mm"}}
              </span>
          </div>

          <div class="pickDate" *ngIf="!currentPlanItem.jti">
            <ion-icon class="fal fa-alarm-clock "></ion-icon>
            <span class="content  agendaDate">
                  {{currentPlanItem.sd | formatedate: "YYYY-M-D"}}
            </span>
          </div>

        </ion-row>


        <ion-row class="optionRow">
          <ion-grid>

            <ion-row *ngIf="currentPlanItem.jti">

              <div *ngIf="currentPlanItem.jtc == system">
                <ion-icon class="fad fa-circle font-normal"
                          [ngStyle]="{'color': currentPlanItem.ji == ''? 'transparent' : (currentPlanItem.ji | formatplan: 'color': privateplans )}"></ion-icon>
                <span class="font-normal">{{currentPlanItem.ji | formatplan: 'name' : '加入日历': publicplans}}</span>
              </div>
              <div *ngIf="currentPlanItem.jtc == selfdefine" (click)="changePlan()">
                <ion-icon class="fad fa-circle font-normal"
                          [ngStyle]="{'color': currentPlanItem.ji == ''? 'transparent' : (currentPlanItem.ji | formatplan: 'color': privateplans )}"></ion-icon>
                <span class="font-normal">{{currentPlanItem.ji | formatplan: 'name' : '加入日历': privateplans}}</span>
              </div>

              <div end *ngIf="currentPlanItem.jtc == selfdefine && currentPlanItem.ui != currentuser"
                   (click)="openfriend(currentAgenda.ui)">
                <span class="content  font-normal person">
                   发起人：{{currentPlanItem.ui | formatuser: currentPlanItem: friends}}
                  </span>
              </div>
            </ion-row>

            <ion-row (click)="changeComment()" *ngIf="currentPlanItem.jti">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-comment-alt-edit"  *ngIf="currentPlanItem.bz" ></ion-icon>
                  <ion-icon class="fad fa-comment-alt-edit"  *ngIf="!currentPlanItem.bz" noval></ion-icon>
                  <span class="content font-normal" margin-left [class.noval] = "!currentPlanItem.bz">
                  {{currentPlanItem.bz || "没有备注"}}
                  </span>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jtc == selfdefine && currentPlanItem.jti" (click)="changeRemind()">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-bell" *ngIf="currentPlanItem.txs" ></ion-icon>
                  <ion-icon class="fad fa-bell"  *ngIf="!currentPlanItem.txs " noval></ion-icon>
                  <span class="content font-normal"  margin-left [class.noval] = "!currentPlanItem.txs">
                   {{currentPlanItem.txs || "未设置"}}
                </span>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jtc == selfdefine && currentPlanItem.jti" (click)="changeRepeat()">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-copy " *ngIf="currentPlanItem.rts"></ion-icon>
                  <ion-icon class="fad fa-copy " *ngIf="!currentPlanItem.rts" noval></ion-icon>
                  <span class="content font-normal"  margin-left [class.noval] = "!currentPlanItem.rts">
                  {{currentPlanItem.rts || "不重复"}}
                </span>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentPlanItem.jtc == selfdefine && currentPlanItem.jti">
              <div class="button-b">
                <button ion-button clear (click)="changeInvites()">
                  <ion-icon class="fad fa-user-friends "></ion-icon>
                  <corner-badge fa-user-friends *ngIf="currentPlanItem.pn > 0">{{currentPlanItem.pn}}
                  </corner-badge>
                </button>
              </div>
              <div class="button-m" end>
                <button ion-button clear>
                  <ion-icon class="fad fa-share-alt"></ion-icon>
                </button>
              </div>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </page-box>


  `
})
export class CommemorationDayPage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };


  speaking: boolean = false;

  currentPlanItem: PlanItemData = {} as PlanItemData;
  originPlanItem: PlanItemData = {} as PlanItemData;


  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  privateplans: Array<any> = UserConfig.privateplans;
  publicplans: Array<any> = UserConfig.publicplans;

  repeattonon = RepeatFlag.RepeatToOnly;

  system: SelfDefineType = SelfDefineType.System;
  selfdefine: SelfDefineType = SelfDefineType.Define;

  modifyConfirm;
  @ViewChild(PageBoxComponent)
  pageBoxComponent: PageBoxComponent

  snlength:number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private util: UtilService,
              private calendarService: CalendarService,
              private assistantService: AssistantService,
              private changeDetectorRef: ChangeDetectorRef,) {
    moment.locale('zh-cn');
    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      if (paramter.si) {
        this.calendarService.getPlanItem(paramter.si).then((commemorationday) => {
          this.currentPlanItem = commemorationday;
          Object.assign(this.originPlanItem, commemorationday);

          this.snlength =  this.currentPlanItem.jtn.length;
          if (this.currentPlanItem.jtc != SelfDefineType.System) {
            this.buttons.remove = true;
          }
        });
      } else {
        this.currentPlanItem.sd = paramter.d.format("YYYY/MM/DD");

        if (paramter.sn) this.currentPlanItem.jtn = paramter.sn;
      }
    }
  }

  ionViewDidEnter() {
    this.pageBoxComponent.setBoxContent();
  }

  changeTitle() {
    this.snlength =  this.currentPlanItem.jtn.length;
    if (this.currentPlanItem.jtc == SelfDefineType.System) return;    // 下载日历项不能修改

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

  changeDatetime() {

    if (this.currentPlanItem.jtc == SelfDefineType.System) return;    // 下载日历项不能修改

    // 受邀人没有接受或者没有修改权限不能修改
    if (this.originPlanItem.ui != this.currentuser && (this.originPlanItem.md != ModiPower.enable || this.originPlanItem.invitestatus != InviteState.Accepted)) { // 受邀人修改权限检查
      return;
    }
    let enableEdit: boolean = false;
    if (this.originPlanItem.ui != this.currentuser) { // 受邀人修改权限检查
      enableEdit = false;
    } else {
      enableEdit = true;
    }
    let modal = this.modalCtrl.create(DataConfig.PAGE._DTSELECT_PAGE, {

      evd: this.currentPlanItem.sd,
      evt: this.currentPlanItem.st,
      ct: this.currentPlanItem.sd,
      et: this.currentPlanItem.st,
      al: IsWholeday.StartSet,
      rfg: this.originPlanItem.rfg,
      enableEdit: enableEdit,
      noshowEnd: true,
    });
    modal.onDidDismiss(async (data) => {
      if (data) {
        this.currentPlanItem.sd = data.sd;
        this.currentPlanItem.st = data.st;
        this.currentPlanItem.txs = this.currentPlanItem.txjson.text(this.currentPlanItem.sd,this.currentPlanItem.st);
      }

      if (!this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();


  }

  changeInvites() {
    if (this.currentPlanItem.jtc == SelfDefineType.System) return;    // 下载日历项不能修改

    let clonemembers;
    if (this.currentPlanItem.members && this.currentPlanItem.members.length > 0) {
      clonemembers = new Array<Member>(...this.currentPlanItem.members);
    } else {
      clonemembers = new Array<Member>();
    }
    let modal = this.modalCtrl.create(DataConfig.PAGE._INVITES_PAGE, {
      ui: this.currentPlanItem.ui,
      mine: this.currentPlanItem.ui == this.currentuser,
      members: clonemembers,
      md: this.currentPlanItem.md,
      iv: this.currentPlanItem.iv
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentPlanItem.members = data.members;
      this.currentPlanItem.pn = data.members.length;
      this.currentPlanItem.md = data.md;
      this.currentPlanItem.iv = data.iv;

      if (!this.calendarService.isSamePlanItem(this.currentPlanItem, this.originPlanItem)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
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
    let modal = this.modalCtrl.create(DataConfig.PAGE._REPEAT_PAGE, {
      value: data,
      enableEdit: true,
      sd: this.currentPlanItem.sd
    });
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

  changeRemind() {
    if (this.currentPlanItem.ui != this.currentuser && this.originPlanItem.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    if (!this.currentPlanItem.txjson && this.currentPlanItem.tx) {
      this.currentPlanItem.txjson = new TxJson();
      let txdata = JSON.parse(this.currentPlanItem.tx);
      Object.assign(this.currentPlanItem.txjson, txdata);
    } else if (!this.currentPlanItem.txjson && !this.currentPlanItem.tx) {
      this.currentPlanItem.txjson = new TxJson();
    }

    let data = new TxJson();
    Object.assign(data, this.currentPlanItem.txjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REMIND_PAGE, {
      value: {
        txjson: data,
        evd: this.currentPlanItem.sd,
        evt: this.currentPlanItem.st,
        al: IsWholeday.StartSet
      }
    });
    modal.onDidDismiss(async (data) => {
      if (data && data.txjson) {
        this.currentPlanItem.txjson = new TxJson();
        Object.assign(this.currentPlanItem.txjson, data.txjson);
        this.currentPlanItem.tx = JSON.stringify(this.currentPlanItem.txjson);
        this.currentPlanItem.txs = this.currentPlanItem.txjson.text(this.currentPlanItem.sd,this.currentPlanItem.st);

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
    if (this.currentPlanItem.jtc == SelfDefineType.System) return;    // 下载日历项不能修改

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
    if (this.currentPlanItem.jtc == SelfDefineType.System) return;    // 下载日历项不能修改

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

  createConfirmSingle() {
    let buttons: Array<any> = new Array<any>();

    buttons.push({
      text: '确定',
      role: 'ok',
      handler: () => {
        this.doOptionRemove(OperateType.Non);
      }
    });

    buttons.push({
      text: '取消',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });

    return this.actionSheetCtrl.create({
      title: "是否删除",
      buttons: buttons
    });
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

      this.modifyConfirm = this.createConfirmSingle();
      this.modifyConfirm.present();

      // this.util.loadingStart().then(() => {
      //   this.calendarService.removePlanItem(this.originPlanItem, OperateType.Non)
      //     .then(() => {
      //       this.util.loadingEnd();
      //       this.goBack();
      //     });
      // });
    }
  }

  goBack() {
    this.navCtrl.pop();
  }


  recordPlanItem() {
    this.currentPlanItem.jtn = "";
    this.assistantService.audio2Text((text) => {
      this.currentPlanItem.jtn = text;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();

    }, () => {
      // this.buttons.record = true;
    }, () => {
      this.currentPlanItem.jtn = "语音不可用，请手动输入。";
      // this.buttons.record = true;
    });
  }

  speakPlanItem() {
    if (!this.speaking) {
      this.speaking = true;
      let speakData = moment(this.currentPlanItem.sd + " " + this.currentPlanItem.st).format("YYYY年M月D日 HH点m分");
      let speakData1 = this.currentPlanItem.jtn;
      let speakData2 = "";
      if (this.currentPlanItem.ui != this.currentuser) {
        let friend = this.friends.find((val) => {
          return this.currentPlanItem.ui == val.ui;
        });

        if (friend) {
          speakData2 = "发起人" + friend.ran;
        }
      }

      speakData = speakData + speakData1 + speakData2;

      this.assistantService.speakText(speakData).then(() => {
        this.speaking = false;
      })
    } else {
      this.assistantService.stopSpeak(false);
      this.speaking = false;
    }
  }

}
