import {ChangeDetectorRef, Component, EventEmitter, Output,} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {EmitService} from "../../../service/util-service/emit.service";
import {TellYou, TellyouService} from "./tellyou.service";
import {DataConfig} from "../../../service/config/data.config";
import {ModalTranType, TellyouIdType, TellyouType} from "../../../data.enum";
import {ScdPageParamter} from "../../../data.mapping";
import {UserConfig} from "../../../service/config/user.config";
import * as moment from "moment";
import {RemindfeedbackService} from "../../../service/cordova/remindfeedback.service";

/**
 * Generated class for the Hb01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'TellyouComponent',
  template: `
    <button ion-button icon-start clear item-end (click)="closePopper()" class="closebutton">
      <ion-icon class="fal fa-times"></ion-icon>
    </button>
    <ion-card>
      <ion-card-header no-padding>
        <ion-card-title no-padding no-margin>
          <ion-item>
            <p class="tellType">              
              <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.system">系统</ng-template>
              <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.invite_agenda 
              || tellYouData.tellType ==  tellyouType.invite_planitem">邀请</ng-template>
              <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.remind_agenda
              ||tellYouData.tellType ==  tellyouType.remind_planitem 
              ||tellYouData.tellType ==  tellyouType.remind_minitask 
              || tellYouData.tellType ==  tellyouType.remind_todo
              || tellYouData.tellType ==  tellyouType.remind_merge">提醒</ng-template>
              <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.at_agenda">@信息</ng-template>
              <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.cancel_agenda
                || tellYouData.tellType ==  tellyouType.cancel_planitem">取消</ng-template>
              <button ion-button icon-start clear item-start class="aispeech" (click)="play(tellYouData)" *ngIf="!tellYouData.speakering">
                <ion-icon class="fal fa-play"></ion-icon>
              </button>
              <button ion-button icon-start clear item-start class="aispeech" (click)="stop(tellYouData)"  *ngIf="tellYouData.speakering">
                <ion-icon class="fal fa-stop"></ion-icon>
              </button>
              
            </p>
            <p class="fromdate" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda 
              || tellYouData.tellType ==  tellyouType.invite_planitem">
              <ng-template [ngIf]="tellYouData.datetype != 2">开始于:</ng-template>
              <ng-template [ngIf]="tellYouData.datetype == 2">截至到:</ng-template>
              {{tellYouData.fromdate | formatedate: 'YYYY-MM-DD hh:ss'}}
            </p>
            <p class="formperson" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda 
                  || tellYouData.tellType ==  tellyouType.invite_planitem">
              --{{tellYouData.formperson}}
            </p>
            <!--<p class="fromdate" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda -->
              <!--|| tellYouData.tellType ==  tellyouType.invite_planitem">-->
              <!--参与{{tellYouData.invites + 1}}人-->
            <!--</p>-->
            <!--<p item-end class="repeat" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda -->
              <!--|| tellYouData.tellType ==  tellyouType.invite_planitem">-->
              <!--{{tellYouData.repeat}}-->
            <!--</p>-->
            <button ion-button item-end clear class="repeat ignore" (click)="ignoreAll()" item-end>
              忽略所有
            </button>
          </ion-item>
        </ion-card-title>
      </ion-card-header>
      <ion-card-content no-padding>
        <ion-item>
              <span class="sn" *ngIf="tellYouData.tellType !=  tellyouType.remind_merge ">
                {{tellYouData.sn}}
              </span>
          <ng-template [ngIf]="tellYouData.tellType ==  tellyouType.remind_merge">
            <ng-template  ngFor let-rem  [ngForOf]="tellYouData.reminds">
              <p>{{rem.sn}}</p>
            </ng-template>
          </ng-template>
        </ion-item>
        <ion-item>
          <!--<button ion-button item-end class="reject" (click)="reject(tellYouData)" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda -->
              <!--|| tellYouData.tellType ==  tellyouType.invite_planitem">-->
            <!--拒绝-->
          <!--</button>-->
          <!--<button ion-button item-end class="accept" (click)="accept(tellYouData)" *ngIf="tellYouData.tellType ==  tellyouType.invite_agenda -->
              <!--|| tellYouData.tellType ==  tellyouType.invite_planitem">-->
            <!--接受-->
          <!--</button>-->
        </ion-item>
      </ion-card-content>
    </ion-card>
    <ion-item class="warning">
      <p>
        <ion-icon class="fal fa-bells"> {{tellYouData.bells}}</ion-icon>
        <ion-icon class="fal fa-handshake"> {{tellYouData.handshake}}</ion-icon>
        <ion-icon class="fal fa-exclamation"> {{tellYouData.systems}}</ion-icon>
      </p>

      <button ion-button item-end clear class="show" (click)="open(tellYouData)" *ngIf="tellYouData.idtype !=  tellyouIdType.MiniTask && tellYouData.tellType !=  tellyouType.remind_merge ">
        查看
      </button>
    </ion-item>
  `,
})
export class TellYouComponent{
  // aiTellYou: Subscriber<any>;
  tellyouType: any = TellyouType;
  tellyouIdType: any = TellyouIdType;


  tellYouData: TellYou = new TellYou();

  @Output()
  private onClose: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onSpeakStop: EventEmitter<any> = new EventEmitter<any>();


  @Output()
  private onSpeakStart: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onGotoView: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onIgnore: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onShow: EventEmitter<any> = new EventEmitter<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private tellyouService: TellyouService,
              private assistantService: AssistantService,
              private emitService: EmitService,
              private utilService: UtilService,
              private  remindfeedback:RemindfeedbackService) {

      this.tellyouService.regeditTellYou((tellYou:TellYou)=>{
        this.showPopper(tellYou);
      }, () => {
        this.closePopper();
      });
  }
  closePopper() {
    this.tellYouData = new TellYou();
    this.changeDetectorRef.detectChanges();
    this.onClose.emit(true);
    this.remindfeedback.remindAudioStop();
    this.assistantService.stopSpeak(false);
    this.tellyouService.resumeTellYou();
  }

  currentuser: string = UserConfig.account.id;

  friends: Array<any> = UserConfig.friends;

  showPopper(data: TellYou) {

    this.tellYouData = data;


    // pageData.remindtime = "111111";//提醒时间，提醒的情况下有
    this.tellYouData.bells= this.tellyouService.getRemindlen(); //剩余提醒个数
    this.tellYouData.handshake=this.tellyouService.getInvitelen();//剩余邀请个数
    this.tellYouData.systems= this.tellyouService.getSystemslen();//剩余系统消息个数


    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
      this.onShow.emit(true);
    }

    //语音播报
    this.assistantService.stopSpeak(false);

    this.remindfeedback.remindAudio(this.tellYouData.mp3,()=>{
      //语音播
      this.tellYouData.speakering = true;
      this.assistantService.speakText(`${UserConfig.user.nickname} 你好。${this.tellYouData.spearktext} `).then(()=>{
        this.tellYouData.speakering = false;
        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      });
    },()=>{
      //语音播报
      this.tellYouData.speakering = true;
      this.assistantService.speakText(`${UserConfig.user.nickname} 你好。${this.tellYouData.spearktext} `).then(()=>{
        this.tellYouData.speakering = false;
        if (!this.changeDetectorRef['destroyed']) {
          this.changeDetectorRef.detectChanges();
        }
      });
    });

  }




  ignoreAll() {
    this.tellyouService.ignoreAll();
    this.closePopper();
  }

  ngOnDestroy() {
    this.tellyouService.unRegeditTellYou();
    // if (this.aiTellYou)
    //   this.aiTellYou.unsubscribe();
  }


  //查看
  open(data:TellYou) {

    if (data.tellType == TellyouType.at_agenda) {
      this.aTday();
      return;
    }else if (data.tellType == TellyouType.remind_todo){
      this.todoList();
      return;
    }else if (data.tellType == TellyouType.cancel_planitem || data.tellType == TellyouType.cancel_agenda){
      return;
    }else{
      if (data.idtype == TellyouIdType.Agenda){
        this.toAgenda(data.id);
        return;
      }else if (data.idtype == TellyouIdType.PlanItem){
        this.toPlanItem(data.id);
        return;
      }
    }
  }


  toAgenda(id) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = id;
    this.utilService.createModal(DataConfig.PAGE._AGENDA_PAGE, p, ModalTranType.scale).present();
  }

  toPlanItem(id) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = id;
    this.utilService.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p, ModalTranType.scale).present();
  }

  todoList() {
    this.utilService.createModal(DataConfig.PAGE._DO_PAGE,null,ModalTranType.left).present();
  }

  aTday() {
    this.utilService.createModal(DataConfig.PAGE._ATME_PAGE,null,ModalTranType.left).present();
  }


  again(data:TellYou) {

  }

  reject(data:TellYou) {

  }

  accept(data:TellYou) {

  }

  play(data:TellYou) {

    //语音播报
    this.assistantService.speakText(`${this.tellYouData.spearktext} `).then(()=>{
      this.tellYouData.speakering = false;
      if (!this.changeDetectorRef['destroyed']) {
        this.changeDetectorRef.detectChanges();
      }
    });
    this.tellYouData.speakering = true;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }

  }

  stop(data:TellYou) {
    //语音播报
    this.assistantService.stopSpeak(false);
    this.tellYouData.speakering = false;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }


  //
  // async acceptInvite($event, event) {
  //   $event.stopPropagation();  // 阻止冒泡
  //   $event.preventDefault(); // 忽略事件传递
  //   event.invitestatus = InviteState.Accepted;
  //
  //   if (event && !event.type && event.jti) {
  //     await this.calendarService.acceptReceivedPlanItem(event.jti);
  //   }
  //   if (event && event.type == EventType.Agenda) {
  //     await this.eventService.acceptReceivedAgenda(event.evi);
  //   }
  // }
  //
  // async rejectInvite($event, event) {
  //   $event.stopPropagation();  // 阻止冒泡
  //   $event.preventDefault(); // 忽略事件传递
  //   event.invitestatus = InviteState.Rejected;
  //
  //   if (event && !event.type && event.jti) {
  //     await this.calendarService.rejectReceivedPlanItem(event.jti);
  //   }
  //   if (event && event.type == EventType.Agenda) {
  //     await this.eventService.rejectReceivedAgenda(event.evi);
  //   }
  // }
  //
  // toDetail(si, d, type, gs) {
  //
  //   let p: ScdPageParamter = new ScdPageParamter();
  //   p.si = si;
  //   p.d = moment(d, "YYYY/MM/DD");
  //   p.gs = gs;
  //
  //   this.feekback.audioClick();
  //   if (gs == "0") {
  //     //本人画面
  //     if (type == EventType.Agenda) {
  //
  //       this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p, ModalTranType.scale).present();
  //     }
  //     if (type == EventType.Task) {
  //       // this.modalCtr.create(DataConfig.PAGE._TASK_PAGE, p).present();
  //     }
  //   } else if (gs == "1") {
  //     //受邀人画面
  //     this.util.createModal(DataConfig.PAGE._AGENDA_PAGE, p, ModalTranType.scale).present();
  //   } else {
  //     //系统画面
  //     // this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
  //   }
  //
  // }
}



