import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {MemoService, MemoData} from "../../service/business/memo.service";
import {DayActivityData} from "../../service/business/calendar.service";
import {EmitService} from "../../service/util-service/emit.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {unitOfTime} from "moment";

/**
 * Generated class for the 备忘创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dailymemos',
  template:
      `
    <page-box title="备忘" [buttons]="buttons"  (onBack)="goBack()" (onCreate)="addMemo()" >
      <ng-template [ngIf]="memos.length > 0"
                   [ngIfElse]="notask">
        <ion-grid class="list-grid-content">
          <ion-row class="item-content dayagenda-week">
            <div class="line">
              <p>
                {{day | formatedate:'CYYYY/MM/DD W'}}
              </p>
            </div>
          </ion-row>
          
          <ion-row class="item-content item-content-backgroud" leftmargin toppadding bottompadding rightmargin *ngFor="let memo of memos" (click)="goDetail(memo)">
            <div class="line font-normal">
              <div class="st">{{memo.utt | formatedate: 'HH:mm'}}</div>
              <div class="sn threeline">{{memo.mon}}</div>
              <div class="icon"  end (click)="remove($event, memo)">
                <ion-icon class="fal fa-minus-circle"></ion-icon>
              </div>
            </div>
          </ion-row>
        </ion-grid>
      </ng-template>
      <ng-template #notask>
        <div class="notask">
          <ion-icon class="fal fa-icons"></ion-icon>
          <span>{{day}}没有记录哟～</span>
          <button *ngIf="istoday" (click)="addMemo()">
            创建备忘
          </button>
        </div>
      </ng-template>
    </page-box>
  `
})
export class DailyMemosPage {

  buttons: any = {
    remove: false,
    share: false,
    save: false,
    create:false,
    cancel: true
  };

  memos: Array<MemoData> = new Array<MemoData>();
  day: string = moment().format("YYYY/MM/DD");
  dayActivities: DayActivityData;

  istoday:boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private memoService: MemoService,
              private util: UtilService,
              private feedback: FeedbackService) {
    moment.locale('zh-cn');
    if (this.navParams) {
      this.dayActivities = this.navParams.data;
      this.day = this.dayActivities.day;
      this.memos = this.dayActivities.memos;
      this.istoday = moment(this.day, "YYYY/MM/DD").isSame(moment(),"days");
      this.buttons.create = this.istoday;
    }
  }

  addMemo() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._MEMO_PAGE, {day: this.day});
    modal.onDidDismiss(async (data) => {
      if (data && data.memo && typeof data.memo === 'string') { // 创建新备忘
        let memo: MemoData = {} as MemoData;

        memo.sd = data.day;
        memo.mon = data.memo;

        await this.memoService.saveMemo(memo);
      }
    });
    modal.present();
  }

  goDetail(memo) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._MEMO_PAGE, {day: this.day, memo: memo});
    modal.onDidDismiss(async (data) => {
      if (data && data.memo && typeof data.memo !== 'string') { // 创建新备忘
        let changed: MemoData = {} as MemoData;

        Object.assign(changed, data.memo)

        await this.memoService.saveMemo(changed);
      }
    });
    modal.present();
  }

  remove(event, memo) {
    event.stopPropagation();  // 阻止冒泡
    event.preventDefault();   // 忽略事件传递
    this.memoService.removeMemo(memo.moi);
  }

  goBack() {
    this.navCtrl.pop();
  }
}
