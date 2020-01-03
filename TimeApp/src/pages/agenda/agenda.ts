import {Component, ViewChild, ChangeDetectorRef} from '@angular/core';
import {
  NavController,
  ModalController,
  ActionSheetController,
  NavParams,
} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {ScdPageParamter} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {
  EventService, AgendaData, Member, Attachment, RtJson, TxJson,
  generateRtJson, generateTxJson
} from "../../service/business/event.service";
import {
  OperateType,
  RepeatFlag,
  ToDoListStatus,
  ConfirmType,
  IsWholeday,
  CycleType,
  DelType,
  ObjectType,
  InviteState
} from "../../data.enum";
import {ModiPower} from "../../data.enum";
import {AssistantService} from "../../service/cordova/assistant.service";
import {EmitService} from "../../service/util-service/emit.service";
import * as anyenum from "../../data.enum";

declare var Wechat;

/**
 * Generated class for the 日程创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-agenda',
  template:
      `
    <page-box title="活动" [buttons]="buttons" [data]="currentAgenda.evi" (onRemove)="goRemove()" (onSave)="save()"
              (onBack)="goBack()">

      <ion-grid>
        <!-- [ngStyle]="{'border-left': (!currentAgenda.evi || !currentAgenda.ji || currentAgenda.ji == '')? '0' : ('0.6rem solid ' + (currentAgenda.ji | formatplan: 'color': privateplans)), 'padding-left': (!currentAgenda.evi || !currentAgenda.ji || currentAgenda.ji == '')? '1.2rem' : '0.6rem', 'border-radius': (!currentAgenda.evi || !currentAgenda.ji || currentAgenda.ji == '')? '0' : '4px'}" -->
        <!--<ion-grid>-->

        <!--<div class="plan plan-right"-->
        <!--[ngStyle]="{'background-color': currentAgenda.ji == ''? 'transparent' : (currentAgenda.ji | formatplan: 'color': privateplans )}">-->
        <!--<span>{{currentAgenda.ji | formatplan: 'name': '': privateplans}}</span></div>-->


        <ion-row class="snRow">
          <div class="sn font-large-x">
            <!--主题-->
            <ion-textarea rows="8" no-margin [(ngModel)]="currentAgenda.evn" (ionChange)="changeTitle()"
                          placeholder="在80字符内描述你的活动主题"
                          [readonly]="originAgenda.evi && originAgenda.ui != currentuser && (originAgenda.md != enablechange || originAgenda.invitestatus != acceptedinvite)"
                          [maxlength]="80">
            </ion-textarea>
          </div>

          <!--<span>{{snlength}} / 80 </span>-->
        </ion-row>

        <ion-row class="dateRow">
          <div class="agendaai">
            <ion-icon class="fal fa-waveform" *ngIf="currentAgenda.evi" (click)="speakAgenda()"></ion-icon>
            <ion-icon class="fal fa-microphone" *ngIf="!currentAgenda.evi" (click)="recordAgenda()"></ion-icon>
          </div>

          <div (click)="changeDatetime()" class="pickDate" *ngIf="currentAgenda.evi">
            <ion-icon class="fal fa-alarm-clock "></ion-icon>
            <span class="content  agendaDate font-large-x">
                  {{currentAgenda.evd | formatedate: "YYYY-M-D"}}
                </span>
            <span class="content  agendaDate font-small">
                      {{currentAgenda.evd + " " + currentAgenda.evt | formatedate: "A hh:mm"}}
                 </span>
            <span class="content  agendaDate font-small">
            {{currentAgenda.ct | transfromdate: "duration"}}
                 </span>
            <!--<p class="content  agendaDate">-->
            <!--<b>时长：</b>{{currentAgenda.ct | transfromdate: "duration"}}-->
            <!--</p>-->
          </div>

          <div class="pickDate" *ngIf="!currentAgenda.evi">
            <ion-icon class="fal fa-alarm-clock "></ion-icon>
            <span class="content  agendaDate">
                  {{currentAgenda.sd | formatedate: "YYYY-M-D"}}
            </span>
          </div>

        </ion-row>


        <ion-row class="optionRow">
          <ion-grid>

            <ion-row *ngIf="currentAgenda.evi">
              <!--<div (click)="changeComment()" *ngIf="!currentAgenda.bz">-->
              <!--<ion-icon class="fal fa-comment-edit font-normal"></ion-icon>-->
              <!--<span class="font-normal">备注</span>-->
              <!--</div>-->
              <div (click)="changePlan()">
                <ion-icon class="fad fa-circle  font-normal"
                          [ngStyle]="{'color': currentAgenda.ji == ''? 'transparent' : (currentAgenda.ji | formatplan: 'color': privateplans )}"></ion-icon>
                <span class="font-normal">{{currentAgenda.ji | formatplan: 'name' :'加入日历': privateplans}}</span>
              </div>
              <div end *ngIf="currentAgenda.evi && currentAgenda.ui != currentuser"
                   (click)="openfriend(currentAgenda.ui)">
                <span class="content  font-normal person">
                   发起人：{{currentAgenda.ui | formatuser: currentuser: friends}}
                  </span>
              </div>
            </ion-row>


            <ion-row *ngIf="currentAgenda.evi" (click)="changeRemind()">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-bell" *ngIf="currentAgenda.txs"></ion-icon>
                  <ion-icon class="fad fa-bell" *ngIf="!currentAgenda.txs" noval></ion-icon>
                  <span class="content font-normal"    [class.noval] = "!currentAgenda.txs">
                   {{currentAgenda.txs || "未设置"}}
                </span>
                </button>
              </div>
            </ion-row>


            <ion-row *ngIf="currentAgenda.evi" (click)="changeRepeat()">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-copy " *ngIf="currentAgenda.rts"></ion-icon>
                  <ion-icon class="fad fa-copy " noval *ngIf="!currentAgenda.rts "></ion-icon>
                  <span class="content font-normal"   [class.noval] = "!currentAgenda.rts">
                  {{currentAgenda.rts || "不重复"}}
                </span>
                </button>
              </div>

              <!--<button ion-button clear class="font-normal repeatButton"-->
              <!--[disabled]="originAgenda.evi && originAgenda.ui != currentuser && originAgenda.md != enablechange">-->
              <!--<ion-icon class="fal fa-copy font-normal" *ngIf="!currentAgenda.rts"></ion-icon>-->
              <!--<span class="content font-normal" *ngIf="currentAgenda.adr ">-->
              <!--{{currentAgenda.adr}}-->
              <!--</span>-->
              <!--<span class="content font-normal" *ngIf="!currentAgenda.adr ">-->
              <!--未设置-->
              <!--</span>-->
              <!---->
              <!--&lt;!&ndash;<corner-badge *ngIf="currentAgenda.rts" fa-copy><p><i class="fa fa-copy "></i></p></corner-badge>&ndash;&gt;-->
              <!--</button>-->
            </ion-row>

            <ion-row (click)="changeLocation()" *ngIf="currentAgenda.evi">
              <div class="button-b">
                <button ion-button clear>
                  <ion-icon class="fad fa-map-marker-alt" *ngIf="currentAgenda.adr "></ion-icon>
                  <ion-icon class="fad fa-map-marker-alt" *ngIf="!currentAgenda.adr " noval></ion-icon>
                  <span class="content font-normal"  [class.noval] = "!currentAgenda.adr">
                  {{currentAgenda.adr || "未设置"}}
                </span>

                </button>
              </div>
            </ion-row>


            <ion-row *ngIf="currentAgenda.evi">
              <div class="button-b">
                <button ion-button clear (click)="changeInvites()">
                  <ion-icon class="fad fa-user-friends "></ion-icon>
                  <corner-badge fa-user-friends *ngIf="currentAgenda.pn > 0">{{currentAgenda.pn}}</corner-badge>
                </button>
                <button ion-button clear (click)="changeAttach()">
                  <ion-icon class="fad fa-info-circle "></ion-icon>
                  <corner-badge fa-info-circle *ngIf="currentAgenda.fj && currentAgenda.fj != '0'">
                    {{currentAgenda.fj}}
                  </corner-badge>
                </button>
              </div>
              <div class="button-m" end>
                <button ion-button clear (click)="changeTodolist()">
                  <ion-icon class="fa-star"
                            [class.fad]="currentAgenda.todolist == todoliston"
                            [class.fal]="currentAgenda.todolist != todoliston"></ion-icon>

                </button>
                <button ion-button clear (click)="atmembers()">
                  <ion-icon class="fad fa-at"></ion-icon>
                </button>
                <button ion-button clear (click)="shareWeiXin()">
                  <ion-icon class="fad fa-share-alt"></ion-icon>
                </button>

              </div>
            </ion-row>


            <!--<div>-->
            <!--<button ion-button clear class="font-normal">-->
            <!--{{currentAgenda.txs || "提醒"}}-->
            <!--<corner-badge fa-bells *ngIf="currentAgenda.txs"><p>{{currentAgenda.txjson.reminds.length}}</p>-->
            <!--</corner-badge>-->
            <!--</button>-->
            <!--</div>-->


            <!--<ion-row *ngIf="currentAgenda.bz" (click)="changeComment()" class="contentdata">-->
            <!--<span class="content font-normal">-->
            <!--备注：{{currentAgenda.bz}}-->
            <!--</span>-->
            <!--<span class="content font-normal">-->
            <!--<ion-icon class="fal fa-comment-edit font-normal"></ion-icon>  -->
            <!--</span>-->

            <!--</ion-row>-->
            <!--<ion-row *ngIf="currentAgenda.evd" class="contentdata">-->
            <!---->


            <!--</ion-row>-->

          </ion-grid>
          <div class="inviteChoose animated bounceInUp"
               *ngIf="showinvite">
            <div ion-item>
              <ion-buttons>
                <button ion-button (click)="rejectInvite(currentAgenda)" justify-content-center>拒绝</button>
                <button ion-button (click)="acceptInvite(currentAgenda)" justify-content-center>接受</button>
              </ion-buttons>

            </div>
          </div>

        </ion-row>
      </ion-grid>
    </page-box>
  `
})
export class AgendaPage {

  ConfirmText: any = {
    Update: "Update",
    Remove: "Remove",
    RemoveSimple: "RemoveSimple"
  }

  showinvite:boolean = false;
  buttons: any = {
    remove: false,
    save: false,
    cancel: true
  };
  speaking: boolean = false;
  currentuser: string = UserConfig.account.id;
  currentusername: string = UserConfig.user.nickname;
  friends: Array<any> = UserConfig.friends;
  currentAgenda: AgendaData = {} as AgendaData;
  originAgenda: AgendaData = {} as AgendaData;

  privateplans: Array<any> = UserConfig.privateplans;

  modifyConfirm;
  snlength: number = 0;

  todoliston = ToDoListStatus.On;
  // todolistoff = ToDoListStatus.Off;

  enablechange = ModiPower.enable;

  repeatflag = RepeatFlag.Repeat;
  // nonrepeatflag = RepeatFlag.NonRepeat;
  // repeattonon = RepeatFlag.RepeatToOnly;

  acceptedinvite: InviteState = InviteState.Accepted;
  rejectedinvite: InviteState = InviteState.Rejected;

  @ViewChild(PageBoxComponent)
  pageBoxComponent: PageBoxComponent


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private emitService: EmitService,
              private actionSheetCtrl: ActionSheetController,
              private util: UtilService,
              private eventService: EventService,
              private changeDetectorRef: ChangeDetectorRef,
              private assistantService: AssistantService,) {
    moment.locale('zh-cn');
    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      if (paramter.si) {
        this.currentAgenda.evi = paramter.si;   // 预先赋值用于控制在加载日程的时候键盘不显示

        this.util.loadingStart().then(async () => {
          let count: number = 0;
          let hasremoved: boolean = true;

          // 通过通知打开需要等待日程接收下来之后显示
          while (true) {
            let agenda = await this.eventService.getAgenda(paramter.si, true);

            if (agenda && agenda.del != DelType.del) {
              this.emitService.emit("mwxing.calendar.datas.readwrite", {rw: "read", payload: agenda});

              this.util.cloneObj(this.currentAgenda , agenda);
              this.currentAgenda.rtjson = generateRtJson(this.currentAgenda.rtjson,this.currentAgenda.rt);
              this.currentAgenda.txjson = generateTxJson(this.currentAgenda.txjson,this.currentAgenda.tx);

              this.util.cloneObj(this.originAgenda, agenda);

              this.snlength = this.currentAgenda.evn.length;
              if (this.currentAgenda.ui != this.currentuser && this.currentAgenda.invitestatus != InviteState.Accepted && this.currentAgenda.invitestatus != InviteState.Rejected) {
                this.showinvite = true;
                // this.buttons.accept = true;
                // this.buttons.reject = true;
              } else {
                this.buttons.remove = true;
              }

              this.util.loadingEnd();
              hasremoved = false;
              break;
            } else if (agenda && agenda.del == DelType.del) {
              hasremoved = true;
              this.util.toastStart("该日程已删除", 3000);
              break;
            }

            if (count >= 10) {
              this.util.toastStart("该日程还在路上, 请稍候再试", 3000);
              break;
            }

            count++;
          }

          // 没有查询到数据/数据已经删除，画面退出
          if (hasremoved) {
            this.util.loadingEnd();
            this.goBack();
          }
        });
      } else {
        this.currentAgenda.sd = paramter.d.format("YYYY/MM/DD");

        // 指定今天以前的日期，全部使用今天创建
        // 需求：今天以前的日期不能创建日程
        if (moment(this.currentAgenda.sd, "YYYY/MM/DD").diff(moment(moment().format("YYYY/MM/DD"), "YYYY/MM/DD")) < 0) {
          this.currentAgenda.sd = moment().format("YYYY/MM/DD");
        }


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
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
    if (this.modifyConfirm !== undefined) {
      this.modifyConfirm.dismiss();
    }
  }

  changeDatetime() {
    // 受邀人没有接受或者没有修改权限不能修改
    if (this.originAgenda.ui != this.currentuser && (this.originAgenda.md != ModiPower.enable || this.originAgenda.invitestatus != InviteState.Accepted)) { // 受邀人修改权限检查
      return;
    }
    let enableEdit: boolean = false;
    if (this.originAgenda.ui != this.currentuser) { // 受邀人修改权限检查
      enableEdit = false;
    } else {
      enableEdit = true;
    }
    let modal = this.modalCtrl.create(DataConfig.PAGE._DTSELECT_PAGE, {
      evd: this.currentAgenda.evd,
      evt: this.currentAgenda.evt,
      ct: this.currentAgenda.ct,
      al: this.currentAgenda.al,
      rfg: this.currentAgenda.rfg,
      enableEdit: enableEdit
    });
    modal.onDidDismiss(async (data) => {
      if (data) {

        if (data.al == anyenum.IsWholeday.EndSet){
          if (this.currentAgenda.al != data.al
            || this.currentAgenda.evd != data.evd
            || this.currentAgenda.evt != data.evt
            || this.currentAgenda.sd != data.sd
            || this.currentAgenda.st != data.st
            || this.currentAgenda.ed != data.ed
            || this.currentAgenda.et != data.et
            || this.currentAgenda.ct != data.ct){
            this.currentAgenda.todolist = anyenum.ToDoListStatus.On;
          }
        }

        this.currentAgenda.al = data.al;
        this.currentAgenda.evd = data.evd;
        this.currentAgenda.evt = data.evt;
        this.currentAgenda.sd = data.sd;
        this.currentAgenda.st = data.st;
        this.currentAgenda.ed = data.ed;
        this.currentAgenda.et = data.et;
        this.currentAgenda.ct = data.ct;

        this.currentAgenda.txs = this.currentAgenda.txjson.text(this.currentAgenda.evd,this.currentAgenda.evt);
      }

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeTitle() {
    this.snlength = this.currentAgenda.evn.length;
    // 受邀人没有接受或者没有修改权限不能修改
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
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    if (this.currentAgenda.todolist == ToDoListStatus.On) {
      this.currentAgenda.todolist = ToDoListStatus.Off;
    } else {
      this.currentAgenda.todolist = ToDoListStatus.On;
    }

    if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
      this.buttons.save = true;
    } else {
      this.buttons.save = false;
    }
  }

  changeAttach() {
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    let cloneattachments;
    if (this.currentAgenda.attachments && this.currentAgenda.attachments.length > 0) {
      cloneattachments = new Array<Attachment>(...this.currentAgenda.attachments);
    } else {
      cloneattachments = new Array<Attachment>();
    }

    //参与人
    let clonemembers;
    if (this.currentAgenda.members && this.currentAgenda.members.length > 0) {
      clonemembers = new Array<Member>(...this.currentAgenda.members);
    } else {
      clonemembers = new Array<Member>();
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._ATTACH_PAGE, {
      obt: ObjectType.Event,
      obi: this.currentAgenda.evi,
      attach: cloneattachments,
      userId: this.currentuser,
      members: clonemembers
    });
    modal.onDidDismiss(async (data) => {
      if (!data) return;
      //console.info("附件已经传递过来，data:"+JSON.stringify(data));
      //alert("附件已经传递过来，data:"+JSON.stringify(data));
      this.currentAgenda.attachments = data.attach;
      this.currentAgenda.fj = data.attach.length;

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
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

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changePlan() {
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._PLAN_PAGE, {ji: this.currentAgenda.ji});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.ji = data;

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeLocation() {
    // 受邀人没有接受不能修改
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

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }

    });
    modal.present();
  }

  changeComment() {
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._COMMENT_PAGE, {value: this.currentAgenda.bz});
    modal.onDidDismiss(async (data) => {
      if (!data) return;

      this.currentAgenda.bz = data.bz;

      if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
        this.buttons.save = true;
      } else {
        this.buttons.save = false;
      }
    });
    modal.present();
  }

  changeRepeat() {
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }
    // 时间设置为结束时间，不能修改重复
    if (this.currentAgenda.al == IsWholeday.EndSet) {
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

    // 受邀人没有接受或者没有修改权限不能修改
    let enableEdit: boolean = false;
    if (this.originAgenda.ui != this.currentuser) { // 受邀人修改权限检查
      enableEdit = false;
    } else {
      enableEdit = true;
    }
    let modal = this.modalCtrl.create(DataConfig.PAGE._REPEAT_PAGE, {
      value: data,
      enableEdit: enableEdit,
      sd: this.currentAgenda.sd
    });

    modal.onDidDismiss(async (data) => {
      if (data && data.rtjson) {
        this.currentAgenda.rtjson = new RtJson();
        Object.assign(this.currentAgenda.rtjson, data.rtjson);
        this.currentAgenda.rt = JSON.stringify(this.currentAgenda.rtjson);
        this.currentAgenda.rts = this.currentAgenda.rtjson.text();

        // 根据重复返回重新设置重复标志
        if (this.currentAgenda.rtjson.cycletype == CycleType.close) {
          this.currentAgenda.rfg = RepeatFlag.NonRepeat;
        } else {
          if (this.originAgenda.rfg != RepeatFlag.NonRepeat) {
            this.currentAgenda.rfg = this.originAgenda.rfg;
          } else {
            this.currentAgenda.rfg = RepeatFlag.Repeat;
          }
        }

        if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  changeRemind() {
    // 受邀人没有接受不能修改
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
        al: this.currentAgenda.al,
      },
    });
    modal.onDidDismiss(async (data) => {
      if (data && data.txjson) {
        this.currentAgenda.txjson = new TxJson();
        Object.assign(this.currentAgenda.txjson, data.txjson);
        this.currentAgenda.tx = JSON.stringify(this.currentAgenda.txjson);
        this.currentAgenda.txs = this.currentAgenda.txjson.text(this.currentAgenda.evd,this.currentAgenda.evt);

        if (this.currentAgenda.evn != "" && !this.eventService.isSameAgenda(this.currentAgenda, this.originAgenda)) {
          this.buttons.save = true;
        } else {
          this.buttons.save = false;
        }
      }
    });
    modal.present();
  }

  atmembers(){
    // 受邀人没有接受不能修改
    if (this.originAgenda.ui != this.currentuser && this.originAgenda.invitestatus != InviteState.Accepted) { // 受邀人接受状态检查
      return;
    }


    let modal = this.modalCtrl.create(DataConfig.PAGE._ATMEMBER_PAGE,
      {
        members: this.originAgenda.members,
        evi:this.originAgenda.evi,
        evn:this.originAgenda.evn,
        ui : UserConfig.account.id,
      });
    modal.onDidDismiss(async (data) => {
      if (!data) return;

    });
    modal.present();
  }

  acceptInvite(event) {
    this.util.loadingStart().then(() => {
      event.invitestatus = InviteState.Accepted;

      this.eventService.acceptReceivedAgenda(event.evi)
        .then((agenda) => {

          if (agenda) {
            this.util.cloneObj(this.currentAgenda , agenda);
            this.currentAgenda.rtjson = generateRtJson(this.currentAgenda.rtjson,this.currentAgenda.rt);
            this.currentAgenda.txjson = generateTxJson(this.currentAgenda.txjson,this.currentAgenda.tx);
            this.util.cloneObj(this.originAgenda, agenda);

            this.buttons.save = false;
          }

          this.buttons.remove = true;
          this.showinvite = false;
          // this.buttons.accept = false;
          // this.buttons.reject = false;

          this.util.loadingEnd();
        });
    });
  }

  rejectInvite(event) {
    this.util.loadingStart().then(() => {
      event.invitestatus = InviteState.Rejected;

      this.eventService.rejectReceivedAgenda(event.evi)
        .then(() => {
          this.util.loadingEnd();
          this.goBack();
        });
    });
  }

  doOptionRemove(op: OperateType) {
    this.navCtrl.pop().then(()=>{
      this.eventService.removeAgenda(this.originAgenda, op);
    })
      //
      // .then(() => {
      //   // this.util.loadingEnd();
      //   setTimeout(()=>{
      //
      //     this.goBack();
      //   },200);
      // });
    // this.util.loadingStart().then(() => {
    // });
  }

  goRemove() {
 /*   if (this.modifyConfirm) {
      this.modifyConfirm.dismiss();
    }*/
    if (this.originAgenda.rfg == RepeatFlag.Repeat) { // 重复
      this.modifyConfirm = this.createConfirm(this.ConfirmText.Remove);
    } else {
      this.modifyConfirm = this.createConfirm(this.ConfirmText.RemoveSimple);
    }
    this.modifyConfirm.present();

  }

  goBack() {
    this.navCtrl.pop();
  }

  validCheck(): boolean {
    if (this.currentAgenda.evn && this.currentAgenda.evn != "") {
      return true;
    }
  }

  createConfirm(confirmText: string, confirm: ConfirmType = ConfirmType.CurrentOrFutureAll) {
    let actionSheet : any;
    let buttons: Array<any> = new Array<any>();
    let title: string = "";
    if (confirmText == this.ConfirmText.Remove) {

      title = "此为重复日程";

      buttons.push({
        text: '仅删除此日程',
        role: 'remove',
        handler: () => {
          let navTransition = actionSheet.dismiss();
          navTransition.then(() => {
            this.doOptionRemove(OperateType.OnlySel);
          });
          return false;
        }
      });
      buttons.push({
        text: '删除所有将来日程',
        role: 'remove',
        handler: () => {
          let navTransition = actionSheet.dismiss();
          navTransition.then(() => {
            this.doOptionRemove(OperateType.FromSel);
          });
          return false;
        }
      });
    } else if (confirmText == this.ConfirmText.RemoveSimple) {
      title = "是否删除";
      buttons.push({
        text: '确定',
        role: 'ok',
        handler: () => {
          let navTransition = actionSheet.dismiss();
          navTransition.then(() => {
            this.doOptionRemove(OperateType.OnlySel);
          });
          return false;
        }
      });

    } else {
      if (confirm == ConfirmType.CurrentOrFutureAll) {

        title = "此为重复日程";

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

    actionSheet =  this.actionSheetCtrl.create({
      title: title,
      buttons: buttons
    });
    return actionSheet;
  }

  doOptionSave(op: OperateType) {
    this.util.loadingStart().then(() => {
      this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, op).then((agenda) => {
        if (agenda && agenda.length > 0) {
          this.util.cloneObj(this.currentAgenda , agenda[0]);
          this.currentAgenda.rtjson = generateRtJson(this.currentAgenda.rtjson,this.currentAgenda.rt);
          this.currentAgenda.txjson = generateTxJson(this.currentAgenda.txjson,this.currentAgenda.tx);
          this.util.cloneObj(this.originAgenda, agenda[0]);

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
          this.modifyConfirm = this.createConfirm(this.ConfirmText.Update, confirm);

          this.modifyConfirm.present();
        } else {                          // 非重复/重复已经修改为非重复
          this.util.loadingStart().then(() => {
            this.eventService.saveAgenda(this.currentAgenda, this.originAgenda, OperateType.OnlySel).then((agenda) => {
              if (agenda && agenda.length > 0) {
                this.emitService.emit("mwxing.calendar.datas.readwrite", {rw: "writeandread", payload: agenda});

                this.util.cloneObj(this.currentAgenda , agenda[0]);
                this.currentAgenda.rtjson = generateRtJson(this.currentAgenda.rtjson,this.currentAgenda.rt);
                this.currentAgenda.txjson = generateTxJson(this.currentAgenda.txjson,this.currentAgenda.tx);
                this.util.cloneObj(this.originAgenda, agenda[0]);

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
              this.util.cloneObj(this.currentAgenda ,agenda[0]);
              this.currentAgenda.rtjson = generateRtJson(this.currentAgenda.rtjson,this.currentAgenda.rt);
              this.currentAgenda.txjson = generateTxJson(this.currentAgenda.txjson,this.currentAgenda.tx);
              this.util.cloneObj(this.originAgenda, agenda[0]);

              this.buttons.remove = true;
              this.buttons.save = false;
            }
            this.util.loadingEnd();
          });
        });
      }
    }
  }


  recordAgenda() {
    this.currentAgenda.evn = "";
    this.assistantService.audio2Text((text) => {
      this.currentAgenda.evn = text;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();

    }, () => {
      // this.buttons.record = true;
    }, () => {
      this.currentAgenda.evn = "语音不可用，请手动输入。";
      // this.buttons.record = true;
    });
  }

  speakAgenda() {
    if (!this.speaking) {
      this.speaking = true;
      let speakData = moment(this.currentAgenda.evd + " " + this.currentAgenda.evt).format("YYYY年M月D日 HH点m分");
      let speakData1 = this.currentAgenda.evn;
      let speakData2 = "";
      if (this.currentAgenda.ui != this.currentuser){
        let friend = this.friends.find((val) => {
          return this.currentAgenda.ui == val.ui;
        });

        if (friend){
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

  openfriend(ui) {
    let friend = this.friends.find((val) => {
      return ui == val.ui;
    });

    if (friend) {
      this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: friend}).present();
    }

  }
  //分享微信
  shareWeiXin() {
    this.eventService.shareAgenda(this.currentAgenda).then((url) => {
      //获取分享内容
      let text: string = this.currentAgenda.evn;
      let type: string = "";
      if(this.currentAgenda.type == ObjectType.Calendar) {
            type ="日历";
      }
      else if(this.currentAgenda.type == ObjectType.Memo) {
            type ="备忘";
      }
      else {
            type ="活动";
      }
      let title: string = `${this.currentusername} 分享了 一个${type}`;
      //验证是否按照微信组件
      Wechat.isInstalled(installed => {
        if (installed) {
          Wechat.share({
            message:{
                title: title,
                description: text,
                thumb: "https://pluto.guobaa.com/cal/sharesite/icon/hd.png",
                media: {
                  type: Wechat.Type.WEBPAGE,
                  webpageUrl: url || "https://fir.im/d2z3"
                }
            },
            scene:0  // 分享目标 0:分享到对话，1:分享到朋友圈，2:收藏
          }, () => {
              console.log('分享成功');
          }, reason => {
              console.log('分享失败' + reason);
          });
        } else {
            alert('请安装微信');
        }
      });
    });
  }

}
