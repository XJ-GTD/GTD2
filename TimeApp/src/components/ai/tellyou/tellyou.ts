import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {UtilService} from "../../../service/util-service/util.service";
import {AssistantService} from "../../../service/cordova/assistant.service";
import {EmitService} from "../../../service/util-service/emit.service";
import {Subscriber} from "rxjs";
import {TimeOutService} from "../../../util/timeOutService";
import {TellYou, TellyouService} from "./tellyou.service";
import {DataConfig} from "../../../service/config/data.config";
import {EventType, InviteState, ModalTranType, TellyouIdType, TellyouType} from "../../../data.enum";
import {ScdPageParamter} from "../../../data.mapping";
import * as moment from "moment";

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
            <button ion-button item-end clear class="show" (click)="open(tellYouData)">
              查看
            </button>
            <p class="tellType">
              {{tellYouData.tellType}}
            </p>
            <p class="formperson">
              {{tellYouData.formperson}}
            </p>
            <p class="fromdate">
              {{tellYouData.fromdate}}
            </p>
          </ion-item>
        </ion-card-title>
      </ion-card-header>
      <ion-card-content no-padding>
        <ion-item>
              <span class="sn">{{tellYouData.sn}} [tellType;//1活动邀请 2日历项邀请 3活动提醒 4小任务提醒 5日历项提醒 6重要事项系统 7和并提醒 10系统消息]
                [id; //活动，日历项，小任务]
                [contenttype;]
                [formperson; //发起人]
                [fromdate; //日期 时间 时长]
                [datetype //1 开始时间 2 截至到]
                [sn;  //内容主题]
                [repeat; //重复文字]
                [invites //邀请人数]
                [bells; //剩余提醒个数]
                [handshake;//剩余邀请个数]
                [systems;//剩余系统消息个数]
                [spearktext;//播报格式]
              </span>

        </ion-item>
        <ion-item>
          <button ion-button icon-start clear item-start class="aispeech" (click)="play()">
            <ion-icon class="fal fa-play"></ion-icon>
          </button>
          <button ion-button item-end class="reject" (click)="reject()">
            拒绝
          </button>
          <button ion-button item-end class="accept" (click)="accept()">
            接受
          </button>
        </ion-item>
        <ion-item>
          <button ion-button icon-start clear item-start class="aispeech" (click)="stop()">
            <ion-icon class="fal fa-stop"></ion-icon>
          </button>
          <button ion-button item-end class="again" (click)="again()">
            10分钟后再提醒
          </button>
        </ion-item>
      </ion-card-content>
    </ion-card>
    <ion-item class="warning">
      <p>
        <ion-icon class="fal fa-bells"> {{tellYouData.bells}}</ion-icon>
        <ion-icon class="fal fa-handshake"> {{tellYouData.handshake}}</ion-icon>
        <ion-icon class="fal fa-exclamation"> {{tellYouData.systems}}</ion-icon>
      </p>
      <button ion-button item-end clear class="ignore" (click)="ignoreAll()">
        忽略所有
      </button>
    </ion-item>
  `,
})
export class TellYouComponent{
  // aiTellYou: Subscriber<any>;

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
              private tellyouService: TellyouService) {

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
    this.tellyouService.resumeTellYou();
  }

  showPopper(data: TellYou) {
    this.tellYouData = data;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
      this.onShow.emit(true);
    }

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


  open() {

  }

  again() {

  }

  reject() {

  }

  accept() {

  }

  play() {

  }

  stop() {
  }


  //
  // toMemo(day) {
  //
  //   this.util.createModal(DataConfig.PAGE._DAILYMEMOS_PAGE, day, ModalTranType.scale).present();
  // }
  //
  // toPlanItem(item) {
  //   let p: ScdPageParamter = new ScdPageParamter();
  //   p.si = item.jti;
  //
  //
  //   this.util.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p, ModalTranType.scale).present();
  // }
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



