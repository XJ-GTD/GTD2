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
    <!--<page-box title="活动" [subtitle]="currentAgenda.evd" [data]="currentAgenda.evi" (onSubTitleClick)="changeDatetime()"-->
    <!--(onRemove)="goRemove()" (onBack)="goBack()">-->
    <!--<ion-grid>-->
    <!--<ion-row class="agendaEvn">-->
    <!--&lt;!&ndash;主题&ndash;&gt;-->
    <!--<ion-textarea [(ngModel)]="currentAgenda.evn" placeholder="参加小明的生日Party" (ionBlur)="save()"-->
    <!--rows="8"></ion-textarea>-->
    <!--</ion-row>-->
    <!--<ion-row class="agendaAttach" *ngIf="currentAgenda.fj && currentAgenda.fj > 0">-->
    <!--<button ion-button icon-end clear >-->
    <!--<div>附件: 点此查看附件</div>-->
    <!--<ion-icon ios="md-attach" md="md-attach"></ion-icon>-->
    <!--</button>-->
    <!--</ion-row>-->
    <!--<ion-row class="agendaPin" *ngIf="false">-->
    <!--<button ion-button icon-end clear  (click)="changeLocation()">-->
    <!--<div>地址: 浦东新区红枫路108弄11号1201室</div>-->
    <!--<ion-icon ios="ios-pin" md="ios-pin"></ion-icon>-->
    <!--</button>-->
    <!--</ion-row>-->
    <!--<ion-row class="agendaRemark" *ngIf="currentAgenda.bz && currentAgenda.bz != ''">-->
    <!--<button ion-button icon-end clear  (click)="changeComment()">-->
    <!--<div>备注: {{currentAgenda.bz}}</div>-->
    <!--<ion-icon ios="ios-create" md="ios-create"></ion-icon>-->
    <!--</button>-->
    <!--</ion-row>-->
    <!--<ion-row class="agendaDate">-->
    <!--<ion-badge *ngIf="currentAgenda.evi" (click)="clickSubtitle()">{{currentAgenda.evd}}</ion-badge>-->
    <!--</ion-row>-->
    <!--<ion-row class="agendaSender" *ngIf="currentAgenda.ui && currentAgenda.ui != currentuser">-->
    <!--{{currentAgenda.ui | formatuser: currentuser: friends}}-->
    <!--</ion-row>-->
    <!--&lt;!&ndash;附加属性操作&ndash;&gt;-->
    <!--<ion-row class="agendaOptionRight" *ngIf="currentAgenda.evi">-->
    <!--<ion-col *ngIf="!currentAgenda.fj || currentAgenda.fj == 0">-->
    <!--<button ion-button icon-start clear >-->
    <!--<ion-icon ios="md-attach" md="md-attach"></ion-icon>-->
    <!--<div>附件</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="true">-->
    <!--<button ion-button icon-start clear  (click)="changeLocation()">-->
    <!--<ion-icon ios="ios-pin" md="ios-pin"></ion-icon>-->
    <!--<div>地址</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="!currentAgenda.bz || currentAgenda.bz == ''">-->
    <!--<button ion-button icon-start clear  (click)="changeComment()">-->
    <!--<ion-icon ios="ios-create" md="ios-create"></ion-icon>-->
    <!--<div>备注</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="currentAgenda.todolist == todoliston">-->
    <!--<button ion-button icon-only clear  (click)="removeTodolist()">-->
    <!--<ion-icon ios="md-star" md="md-star"></ion-icon>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="currentAgenda.todolist == todolistoff">-->
    <!--<button ion-button icon-only clear  (click)="addTodolist()">-->
    <!--<ion-icon ios="md-star-outline" md="md-star-outline"></ion-icon>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--</ion-row>-->
    <!--&lt;!&ndash;控制操作&ndash;&gt;-->
    <!--<ion-row *ngIf="currentAgenda.evi" class="agendaOptionLeft" >-->
    <!--<ion-col>-->
    <!--<button ion-button icon-start clear  (click)="changePlan()">-->
    <!--<ion-icon ios="ios-add" md="ios-add"></ion-icon>-->
    <!--<div>{{currentAgenda.ji | formatplan: '计划': privateplans}}</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="!currentAgenda.txs || currentAgenda.txs == ''">-->
    <!--<button ion-button icon-start clear  (click)="changeRemind()">-->
    <!--<ion-icon ios="md-notifications" md="md-notifications"></ion-icon>-->
    <!--<div>提醒</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="!currentAgenda.rfg || currentAgenda.rfg == nonrepeatflag">-->
    <!--<button ion-button icon-start clear  (click)="changeRepeat()">-->
    <!--<ion-icon ios="ios-repeat" md="ios-repeat"></ion-icon>-->
    <!--<div>重复</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="!currentAgenda.pn || currentAgenda.pn == 0">-->
    <!--<button ion-button icon-start clear  (click)="changeInvites()">-->
    <!--<ion-icon ios="ios-person-add" md="ios-person-add"></ion-icon>-->
    <!--<div>邀请</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--</ion-row>-->

    <!--<ion-row *ngIf="currentAgenda.evi && (currentAgenda.pn > 0 || (currentAgenda.txs && currentAgenda.txs != '') || (currentAgenda.rts && currentAgenda.rts != ''))">-->
    <!--<ion-col *ngIf="currentAgenda.pn > 0">-->
    <!--<button ion-button  (click)="changeInvites()">-->
    <!--<div class="agendaPlayer">-->
    <!--参与人-->
    <!--<corner-badge>{{currentAgenda.pn}}</corner-badge>-->
    <!--</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="currentAgenda.txs && currentAgenda.txs != ''">-->
    <!--<button ion-button  (click)="changeRemind()">-->
    <!--<div class="agendaRemind">-->
    <!--{{currentAgenda.txs}}-->
    <!--<corner-badge>3</corner-badge>-->
    <!--</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--<ion-col *ngIf="currentAgenda.rfg == repeatflag">-->
    <!--<button ion-button  (click)="changeRepeat()">-->
    <!--<div class="agendarepeat">-->
    <!--{{currentAgenda.rts}}-->
    <!--<corner-badge>3</corner-badge>-->
    <!--</div>-->
    <!--</button>-->
    <!--</ion-col>-->
    <!--</ion-row>-->


    <!--</ion-grid>-->
    <!--</page-box>-->

    <page-box title="活动" [buttons]="buttons" [data]="currentAgenda.evi" (onRemove)="goRemove()" (onSave)="save()" (onBack)="goBack()">
      <ion-grid>
        <ion-row class="agendaEvn">
          <!--主题-->
          <ion-textarea rows="8" [(ngModel)]="currentAgenda.evn" (ionChange)="changeTitle()"></ion-textarea>

          <div class="agendatodo" *ngIf="currentAgenda.todolist">
            <button ion-button icon-only clear  (click)="changeTodolist()">
              <ion-icon class="fa" [class.fa-star] = "currentAgenda.todolist == todoliston" [class.fa-star-o] = "currentAgenda.todolist != todoliston"></ion-icon>
            </button>
          </div>
        </ion-row>

        <ion-row class="optionRow">
          <ion-grid>


            <!--附加属性操作-->
            <ion-row class="agendaOptionOne" *ngIf="currentAgenda.evi">
              <button class="agendaPinbutton" ion-button icon-start clear  (click)="changeLocation()" *ngIf="!currentAgenda.adr">
                <ion-icon class="fa fa-map-marker iconPin"></ion-icon>
                <div>地址</div>
              </button>
              <button class="agendaRemarkbutton" ion-button icon-start clear  (click)="changeComment()" *ngIf="!currentAgenda.bz">
                <ion-icon class="fa fa-edit iconRemark"></ion-icon>
                <div>备注</div>
              </button>
              <button class="agendaPlanbutton"  ion-button icon-start clear  (click)="changePlan()">
                <ion-icon class="fa fa-plus-square iconPlus"></ion-icon>
                <div>{{currentAgenda.ji | formatplan: '计划': privateplans}}</div>
              </button>
            </ion-row>

            <ion-row class="agendaOptionTwo" *ngIf="currentAgenda.evi">
              <ion-col class="agendaPlayer">
                <button ion-button  clear (click)="changeInvites()">
                    <ion-icon class="fa fa-address-book-o iconUserPlus" *ngIf="currentAgenda.pn <= 0"></ion-icon>
                    参与人
                    <corner-badge *ngIf="currentAgenda.pn > 0">{{currentAgenda.pn}}</corner-badge>
                </button>
              </ion-col>
              <ion-col  class="agendaRemind">
                <button ion-button clear (click)="changeRemind()">
                    <ion-icon class="fa fa-bell iconBell" *ngIf="!currentAgenda.txs"></ion-icon>
                    {{currentAgenda.txs || "提醒"}}
                  <corner-badge *ngIf="currentAgenda.txs"><p>{{currentAgenda.txjson.reminds.length}}</p></corner-badge>
                </button>
              </ion-col>
              <ion-col class="agendaAttach">
                <button ion-button clear icon-end >
                    <ion-icon class="fa fa-paperclip iconAttach" *ngIf="!currentAgenda.fj"></ion-icon>
                     补充
                    <corner-badge *ngIf="currentAgenda.fj"><p>{{currentAgenda.fj}}</p></corner-badge>
                </button>
              </ion-col>
            </ion-row>

            <ion-row class="agendaOptionThree" *ngIf="currentAgenda.evi">
              <button ion-button  clear (click)="changeRepeat()">
                <div class="agendarepeat">
                  <ion-icon class="fa fa-copy  iconCopy" *ngIf="!currentAgenda.rts"></ion-icon>
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
                <ion-icon class="fa fa-edit iconRemark"></ion-icon>
              </button>
            </ion-row>

            <ion-row class="agendaPin" *ngIf="currentAgenda.adr">
              <button  ion-button icon-end clear  (click)="changeLocation()">
            <span class="content">
              地址：{{currentAgenda.adr}}
              </span>
                <ion-icon class="fa fa-map-marker iconPin"></ion-icon>
              </button>
            </ion-row>
            <ion-row *ngIf="currentAgenda.evd">
              <ion-col  class="agendaDate" (click)="clickSubtitle()">
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
              <ion-col  (click)="clickSubtitle()">
                <button ion-button icon-end clear  >
                  <ion-icon class="fa fa-calendar iconCalendar"></ion-icon>
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

    <!--<div class="create">-->
      <!--&lt;!&ndash;主题&ndash;&gt;-->
      <!--<ion-textarea rows="8" [(ngModel)]="currentAgenda.evn" placeholder="参加小明的生日Party"-->
                    <!--(ionBlur)="save()"></ion-textarea>-->
    <!--</div>-->
  `
})
export class AgendaPage {
  statusBarColor: string = "#3c4d55";

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
              private sqlite: SqliteExec) {
    moment.locale('zh-cn');
    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      this.currentAgenda.sd = paramter.d.format("YYYY/MM/DD");

      if (paramter.t) {
        this.currentAgenda.st = paramter.t;
      } else {
        this.currentAgenda.st = moment().add(1, "h").format("HH:00");
      }

      if (paramter.sn) this.currentAgenda.evn = paramter.sn;

      if (paramter.si) {
        this.eventService.getAgenda(paramter.si).then((agenda) => {
          this.currentAgenda = agenda;
          Object.assign(this.originAgenda, agenda);

          this.buttons.remove = true;
        });
      }
    }
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter(){
    this.pageBoxComponent.setBoxContent();
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
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
      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
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

      this.currentAgenda.ji = data.jh.ji;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeLocation() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._LOCATION_PAGE);
    modal.onDidDismiss(async (data) => {

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
    let modal = this.modalCtrl.create(DataConfig.PAGE._REMIND_PAGE, {value: data});
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
    this.eventService.removeAgenda(this.originAgenda, op)
    .then(() => {
      this.goBack();
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
      this.eventService.removeAgenda(this.originAgenda, OperateType.OnlySel)
      .then(() => {
        this.goBack();
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
    this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, op).then((agenda) => {
      if (agenda && agenda.length > 0) {
        this.currentAgenda = agenda[0];
        Object.assign(this.originAgenda, agenda[0]);

        this.buttons.save = false;
      }
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
          this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, OperateType.OnlySel).then((agenda) => {
            if (agenda && agenda.length > 0) {
              this.currentAgenda = agenda[0];
              Object.assign(this.originAgenda, agenda[0]);

              this.buttons.save = false;
            }
          });
        }
      } else {                            // 新建日程
        this.eventService.saveAgenda(this.currentAgenda).then((agenda) => {
          if (agenda && agenda.length > 0) {
            this.currentAgenda = agenda[0];
            Object.assign(this.originAgenda, agenda[0]);

            this.buttons.remove = true;
            this.buttons.save = false;
          }
        });
      }
    }
  }
}
