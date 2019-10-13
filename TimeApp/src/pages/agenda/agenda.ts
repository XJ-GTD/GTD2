import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {CalendarDay} from "../../components/ion2-calendar";
import {AgendaService} from "./agenda.service";
import {ScdData, ScdPageParamter} from "../../data.mapping";
import {EmitService} from "../../service/util-service/emit.service";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {CornerBadgeComponent} from "../../components/corner-badge/corner-badge";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData, Member, RtJson, TxJson} from "../../service/business/event.service";
import {
  PageDirection,
  IsSuccess,
  OperateType,
  RepeatFlag,
  ToDoListStatus,
  ConfirmType,
  IsWholeday,
  ObjectType,
  InviteState
} from "../../data.enum";
import {Keyboard} from "@ionic-native/keyboard";
import {ModiPower} from "../../data.enum";

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
    <page-box title="活动" [buttons]="buttons" [data]="currentAgenda.evi" (onRemove)="goRemove()" (onSave)="save()"
              (onBack)="goBack()" (onRecord)="record($event)" (onSpeaker)="speaker($event)" [speakData] = "currentAgenda.evn">

      <ion-grid [ngStyle]="{'border-left': (!currentAgenda.evi || currentAgenda.ji == '')? '0' : ('0.6rem solid ' + (currentAgenda.ji | formatplan: 'color': privateplans)), 'padding-left': (!currentAgenda.evi || currentAgenda.ji == '')? '1.2rem' : '0.6rem'}">
        <ion-row class="snRow">
          <div class="sn font-large-x">
            <!--主题-->
            <ion-textarea rows="8" no-margin [(ngModel)]="currentAgenda.evn" (ionChange)="changeTitle()" [readonly]="originAgenda.evi && originAgenda.ui != currentuser && (originAgenda.md != enablechange || originAgenda.invitestatus != acceptedinvite)"
                          #bzRef></ion-textarea>
          </div>

          <div class="agendatodo" *ngIf="currentAgenda.evi && currentAgenda.todolist">
            <ion-icon (click)="changeTodolist()" class="font-large-x  fa-star"
                      [class.fad]="currentAgenda.todolist == todoliston"
                      [class.fal]="currentAgenda.todolist != todoliston"></ion-icon>

          </div>
        </ion-row>
        <ion-row class="optionRow">
          <ion-grid>
            <!--附加属性操作-->
            <ion-row *ngIf="currentAgenda.evi">
              <div (click)="changeLocation()" *ngIf="!currentAgenda.adr">
                <ion-icon class="fal fa-map-marker-alt font-normal"></ion-icon>
                <span class="font-normal">地址</span>
              </div>
              <div (click)="changeComment()" *ngIf="!currentAgenda.bz">
                <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
                <span class="font-normal">备注</span>
              </div>
              <div (click)="changePlan()" end>
                <ion-icon class="fal fa-line-columns  font-normal"></ion-icon>
                <span class="font-normal">{{currentAgenda.ji | formatplan: 'name' :'加入日历': privateplans}}</span>
              </div>
            </ion-row>

            <ion-row *ngIf="currentAgenda.evi">
              <div>
                <button ion-button clear (click)="changeInvites()" class="font-normal">
                  <ion-icon class="fal fa-user-friends font-normal"
                            *ngIf="currentAgenda.pn <= 0"></ion-icon>
                  参与人
                  <corner-badge fa-user-friends *ngIf="currentAgenda.pn > 0"><p>{{currentAgenda.pn}}</p></corner-badge>
                </button>
              </div>
              <div>
                <button ion-button clear (click)="changeRemind()" class="font-normal">
                  <ion-icon class="fal fa-bells " *ngIf="!currentAgenda.txs"></ion-icon>
                  {{currentAgenda.txs || "提醒"}}
                  <corner-badge fa-bells *ngIf="currentAgenda.txs"><p>{{currentAgenda.txjson.reminds.length}}</p>
                  </corner-badge>
                </button>
              </div>
              <div>
                <button ion-button clear icon-end (click)="changeAttach()" class="font-normal">
                  <ion-icon class="fal fa-sparkles  font-normal"
                            *ngIf="!currentAgenda.fj || currentAgenda.fj == '0'"></ion-icon>
                  补充
                  <corner-badge fa-sparkles *ngIf="currentAgenda.fj && currentAgenda.fj != '0'">
                    <p>{{currentAgenda.fj}}</p>
                  </corner-badge>
                </button>
              </div>
            </ion-row>

            <ion-row *ngIf="currentAgenda.evi">
              <button ion-button clear (click)="changeRepeat()" class="font-normal" [disabled]="originAgenda.evi && originAgenda.ui != currentuser && originAgenda.md != enablechange">
                <ion-icon class="fal fa-copy font-normal" *ngIf="!currentAgenda.rts"></ion-icon>
                {{currentAgenda.rts || "重复"}}
                <!--<corner-badge *ngIf="currentAgenda.rts" fa-copy><p><i class="fa fa-copy "></i></p></corner-badge>-->
              </button>
            </ion-row>

            <ion-row *ngIf="currentAgenda.bz" (click)="changeComment()">
              <span class="content font-normal">
                  备注：{{currentAgenda.bz}}
                </span>
              <ion-icon class="fal fa-comment-edit font-normal"></ion-icon>
            </ion-row>

            <ion-row *ngIf="currentAgenda.adr " (click)="changeLocation()">
              <span class="content font-normal">
                地址：{{currentAgenda.adr}}
                </span>
              <ion-icon class="fal fa-map-marker-alt font-normal"></ion-icon>
            </ion-row>
            <ion-row *ngIf="currentAgenda.evd">
              <div (click)="changeDatetime()">
                <span class="content font-normal">
                  日期：{{currentAgenda.evd | formatedate: "YYYY年M月D日"}}<br/>

                  时间：{{currentAgenda.evd + " " + currentAgenda.evt | formatedate: "A HH:mm"}}({{currentAgenda.ct | transfromdate: "duration"}})
                </span>
                <ion-icon class="font-normal fal fa-calendar-check "></ion-icon>
              </div>
              <div (click)="changeDatetime()">
              </div>
              <div end *ngIf="currentAgenda.evi && currentAgenda.ui != currentuser">
                <span class="content  font-normal">
                   ---来自{{currentAgenda.ui | formatuser: currentuser: friends}}
                  </span>
              </div>
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
    record:true,
    speaker:true,
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

  enablechange = ModiPower.enable;

  repeatflag = RepeatFlag.Repeat;
  nonrepeatflag = RepeatFlag.NonRepeat;
  repeattonon = RepeatFlag.RepeatToOnly;

  acceptedinvite: InviteState = InviteState.Accepted;

  @ViewChild(PageBoxComponent)
  pageBoxComponent: PageBoxComponent

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
              private keyboard: Keyboard,
              private changeDetectorRef:ChangeDetectorRef) {
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

  ionViewDidEnter() {
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
    if (this.originAgenda.ui != this.currentuser && (this.originAgenda.md != ModiPower.enable || this.originAgenda.invitestatus != InviteState.Accepted)) { // 受邀人修改权限检查
      return;
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._DTSELECT_PAGE, {
      sd: this.currentAgenda.evd,
      st: this.currentAgenda.st,
      ed: this.currentAgenda.ed,
      et: this.currentAgenda.et,
      al: this.currentAgenda.al,
      ct: this.currentAgenda.ct
    });
    modal.onDidDismiss(async (data) => {

    });
    modal.present();
  }

  changeTitle() {
    if (this.originAgenda.evi && this.originAgenda.ui != this.currentuser && (this.originAgenda.md != ModiPower.enable || this.originAgenda.invitestatus != InviteState.Accepted)) { // 受邀人修改权限检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._ATTACH_PAGE, {
      obt: ObjectType.Event,
      obi: this.currentAgenda.evi,
      attach:this.currentAgenda.attachments
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;
      //console.info("附件已经传递过来，data:"+JSON.stringify(data));
      //alert("附件已经传递过来，data:"+JSON.stringify(data));
      this.currentAgenda.attachments = data.attach;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeInvites() {
    // if (this.originAgenda.ui != this.currentuser && this.originAgenda.md != ModiPower.enable) { // 受邀人修改权限检查
    //   return;
    // }

    let clonemembers;
    if (this.currentAgenda.members && this.currentAgenda.members.length > 0) {
      clonemembers = new Array<Member>(...this.currentAgenda.members);
    } else {
      clonemembers = new Array<Member>();
    }
    let modal = this.modalCtrl.create(DataConfig.PAGE._INVITES_PAGE, {
      ui: this.currentAgenda.ui,
      mine: this.currentAgenda.ui == this.currentuser,
      members: clonemembers,
      md: this.currentAgenda.md,
      iv: this.currentAgenda.iv
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.members = data.members;
      this.currentAgenda.pn = data.members.length;
      this.currentAgenda.md = data.md;
      this.currentAgenda.iv = data.iv;

      if (!this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changePlan() {
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && (this.originAgenda.md != ModiPower.enable || this.originAgenda.invitestatus != InviteState.Accepted)) { // 受邀人修改权限检查
      return;
    }

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
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    if (!this.currentAgenda.txjson && this.currentAgenda.tx) {
      this.currentAgenda.txjson = new TxJson();
      let txdata = JSON.parse(this.currentAgenda.tx);
      Object.assign(this.currentAgenda.txjson, txdata);
    } else if (!this.currentAgenda.txjson && !this.currentAgenda.tx) {
      this.currentAgenda.txjson = new TxJson();
    }

    let data = new TxJson();
    Object.assign(data, this.currentAgenda.txjson);
    let modal = this.modalCtrl.create(DataConfig.PAGE._REMIND_PAGE, {
      value: {
        txjson: data,
        evd: this.currentAgenda.evd,
        evt: this.currentAgenda.evt,
        al: this.currentAgenda.al
      }
    });
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

  createConfirm(remove: boolean = false, confirm: ConfirmType = ConfirmType.CurrentOrFutureAll) {
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
      if (confirm == ConfirmType.CurrentOrFutureAll) {
        buttons.push({
          text: '仅针对此日程存储',
          role: 'modify',
          handler: () => {
            this.doOptionSave(OperateType.OnlySel);
          }
        });
      }
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

        let confirm: ConfirmType = this.eventService.hasAgendaModifyConfirm(this.originAgenda, this.currentAgenda);
        if (confirm == ConfirmType.CurrentOrFutureAll || confirm == ConfirmType.FutureAll) { // 重复修改
          if (this.modifyConfirm) {
            this.modifyConfirm.dismiss();
          }
          this.modifyConfirm = this.createConfirm(false, confirm);

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


  record(text){
    this.currentAgenda.evn = text;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  speaker(){
  }
}
