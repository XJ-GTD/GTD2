import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import { MemoService, MemoData } from "../../service/business/memo.service";
import { DayActivityData } from "../../service/business/calendar.service";
import {PageBoxComponent} from "../../components/page-box/page-box";
import {EmitService} from "../../service/util-service/emit.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import { ScdData, ScdPageParamter } from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";

/**
 * Generated class for the 备忘创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dailymemos',
  template: `<page-box title="备忘" [subtitle]="day" (onSubTitleClick)="changeDatetime()" (onRemove)="goRemove()" (onBack)="goBack()">
        <ion-list>
          <ion-item *ngFor="let memo of memos">
            <button ion-button small clear item-start>
            {{memo.utt | formatedate: 'HH:mm'}}
            </button>
            <h2>{{memo.mon}}</h2>
            <button ion-button icon-only clear item-end>
              <ion-icon class="fa fa-trash-o"></ion-icon>
            </button>
          </ion-item>
        </ion-list>
        <ion-fab bottom center>
          <button ion-fab mini (click)="addMemo()">
            <ion-icon name="add"></ion-icon>
          </button>
        </ion-fab>
      </page-box>`
})
export class DailyMemosPage {
  statusBarColor: string = "#3c4d55";

  memos: Array<MemoData> = new Array<MemoData>();
  day: string = moment().format("YYYY/MM/DD");
  dayActivities: DayActivityData;

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
    }

    if (this.memos.length == 0) {
      this.addMemo();
    }
  }

  addMemo() {
    let modal = this.modalCtrl.create(DataConfig.PAGE._MEMO_PAGE, {day: this.day});
    modal.onDidDismiss(async (data) => {
      if (data.memo && typeof data.memo === 'string') { // 创建新备忘
        let memo: MemoData = {} as MemoData;

        memo.sd = data.day;
        memo.mon = data.memo;

        await this.memoService.saveMemo(memo);
      }
    });
    modal.present();
  }

  goBack() {
    this.navCtrl.pop();
  }
}
