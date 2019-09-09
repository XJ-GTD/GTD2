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
import { PageDirection, IsSuccess, OperateType, RepeatFlag, ToDoListStatus } from "../../data.enum";

/**
 * Generated class for the 日程创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-agenda',
  template: `<page-box title="活动" [subtitle]="currentAgenda.evd" [data]="currentAgenda.evi" (onSubTitleClick)="changeDatetime()" (onRemove)="goRemove()" (onBack)="goBack()">
        <ion-card>
          <ion-card-content>
            <!--主题-->
            <ion-textarea [(ngModel)]="currentAgenda.evn" placeholder="参加小明的生日Party" (ionBlur)="save()"></ion-textarea>

            <div class="card-subtitle" *ngIf="currentAgenda.fj && currentAgenda.fj > 0">
              <button ion-button icon-end clear small>
                <div>附件: 点此查看附件</div>
                <ion-icon ios="md-attach" md="md-attach"></ion-icon>
              </button>
            </div>
            <div class="card-subtitle" *ngIf="false">
              <button ion-button icon-end clear small>
                <div>地址: 浦东新区红枫路108弄11号1201室</div>
                <ion-icon ios="ios-pin" md="ios-pin"></ion-icon>
              </button>
            </div>
            <div class="card-subtitle" *ngIf="currentAgenda.bz && currentAgenda.bz != ''">
              <button ion-button icon-end clear small>
                <div>备注: 数据都是假的, 请勿模仿</div>
                <ion-icon ios="ios-create" md="ios-create"></ion-icon>
              </button>
            </div>
            <div class="card-subtitle" *ngIf="currentAgenda.ui && currentAgenda.ui != currentuser">
              {{currentAgenda.ui | formatuser: currentuser: friends}}
            </div>
          </ion-card-content>

          <!--附加属性操作-->
          <ion-row *ngIf="currentAgenda.evi">
            <ion-col *ngIf="!currentAgenda.fj || currentAgenda.fj == 0">
              <button ion-button icon-start clear small>
                <ion-icon ios="md-attach" md="md-attach"></ion-icon>
                <div>附件</div>
              </button>
            </ion-col>
            <ion-col *ngIf="true">
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-pin" md="ios-pin"></ion-icon>
                <div>地址</div>
              </button>
            </ion-col>
            <ion-col *ngIf="!currentAgenda.bz || currentAgenda.bz == ''">
              <button ion-button icon-start clear small (click)="changeComment()">
                <ion-icon ios="ios-create" md="ios-create"></ion-icon>
                <div>备注</div>
              </button>
            </ion-col>
            <ion-col *ngIf="currentAgenda.todolist == todoliston">
              <button ion-button icon-only clear small>
                <ion-icon ios="md-star" md="md-star"></ion-icon>
              </button>
            </ion-col>
            <ion-col *ngIf="currentAgenda.todolist == todolistoff">
              <button ion-button icon-only clear small>
                <ion-icon ios="md-star-outline" md="md-star-outline"></ion-icon>
              </button>
            </ion-col>
          </ion-row>

          <ion-row *ngIf="currentAgenda.evi && (currentAgenda.pn > 0 || (currentAgenda.txs && currentAgenda.txs != '') || (currentAgenda.rts && currentAgenda.rts != ''))">
            <ion-col *ngIf="currentAgenda.pn > 0">
              <button ion-button small>
                <div>
                  参与人
                  <corner-badge>{{currentAgenda.pn}}</corner-badge>
                </div>
              </button>
            </ion-col>
            <ion-col *ngIf="currentAgenda.txs && currentAgenda.txs != ''">
              <button ion-button small>
                <div>
                半小时后提醒
                <corner-badge>3</corner-badge>
                </div>
              </button>
            </ion-col>
            <ion-col *ngIf="currentAgenda.rfg == repeatflag">
              <button ion-button small (click)="changeRepeat()">
                <div>
                {{currentAgenda.rts}}
                <corner-badge>3</corner-badge>
                </div>
              </button>
            </ion-col>
          </ion-row>

          <!--控制操作-->
          <ion-row *ngIf="currentAgenda.evi">
            <ion-col>
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-add" md="ios-add"></ion-icon>
                <div>计划</div>
              </button>
            </ion-col>
            <ion-col *ngIf="!currentAgenda.txs || currentAgenda.txs == ''">
              <button ion-button icon-start clear small>
                <ion-icon ios="md-notifications" md="md-notifications"></ion-icon>
                <div>提醒</div>
              </button>
            </ion-col>
            <ion-col *ngIf="!currentAgenda.rfg || currentAgenda.rfg == nonrepeatflag">
              <button ion-button icon-start clear small (click)="changeRepeat()">
                <ion-icon ios="ios-repeat" md="ios-repeat"></ion-icon>
                <div>重复</div>
              </button>
            </ion-col>
            <ion-col *ngIf="!currentAgenda.pn || currentAgenda.pn == 0">
              <button ion-button icon-start clear small>
                <ion-icon ios="ios-person-add" md="ios-person-add"></ion-icon>
                <div>邀请</div>
              </button>
            </ion-col>
          </ion-row>
        </ion-card>
      </page-box>`
})
export class AgendaPage {
  statusBarColor: string = "#3c4d55";

  currentuser: string = UserConfig.account.id;
  friends: Array<any> = UserConfig.friends;
  currentAgenda: AgendaData = {} as AgendaData;
  originAgenda: AgendaData = {} as AgendaData;

  modifyConfirm;

  todoliston = ToDoListStatus.On;
  todolistoff = ToDoListStatus.Off;

  repeatflag = RepeatFlag.Repeat;
  nonrepeatflag = RepeatFlag.NonRepeat;

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
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
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
        });
      }
    }
  }

  ionViewWillLeave() {
    if (this.modifyConfirm !== undefined) {
      this.modifyConfirm.dismiss();
    }
  }

  changeDatetime() {}

  changeComment() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._BZ_PAGE, {value: this.currentAgenda.bz});
    modal.onDidDismiss(async (data)=>{
      this.currentAgenda.bz = data.bz;

      if (this.eventService.isAgendaChanged(this.currentAgenda, this.originAgenda)) {
        this.doOptionSave(OperateType.OnlySel);
      }
    });
    modal.present();
  }

  changeRepeat() {
    if (!this.currentAgenda.rtjson && this.currentAgenda.rt) {
      this.currentAgenda.rtjson = new RtJson();
      let rtdata = JSON.parse(this.currentAgenda.rt);
      Object.assign(this.currentAgenda.rtjson, rtdata);
    } else {
      this.currentAgenda.rtjson = new RtJson();
    }

    let modal = this.modalCtrl.create(DataConfig.PAGE._CF_PAGE, {value: this.currentAgenda.rtjson});
    modal.onDidDismiss(async (data) => {
      if (data) {
        this.currentAgenda.rtjson = data;
        this.currentAgenda.rt = JSON.stringify(this.currentAgenda.rtjson);
        this.currentAgenda.rts = this.currentAgenda.rtjson.text();
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
      }
    });
  }

  save() {
    if (this.validCheck()) {              // 输入校验
      if (this.currentAgenda.evi) {       // 修改日程
        if (!this.eventService.isAgendaChanged(this.currentAgenda, this.originAgenda)) {
          return;
        }

        if (this.originAgenda.rfg == RepeatFlag.Repeat) { // 重复
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
            }
          });
        }
      } else {                            // 新建日程
        this.eventService.saveAgenda(this.currentAgenda).then((agenda) => {
          if (agenda && agenda.length > 0) {
            this.currentAgenda = agenda[0];
            Object.assign(this.originAgenda, agenda[0]);
          }
        });
      }
    }
  }
}
