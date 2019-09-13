import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import { MemoService, MemoData } from "../../service/business/memo.service";
import {PageBoxComponent} from "../../components/page-box/page-box";

/**
 * Generated class for the 备忘创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-memo',
  template: `<page-box title="活动" [subtitle]="currentAgenda.evd" [data]="currentAgenda.evi" (onSubTitleClick)="changeDatetime()" (onRemove)="goRemove()" (onBack)="goBack()">
      </page-box>`
})
export class MemoPage {
  statusBarColor: string = "#3c4d55";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private memoService: MemoService,
              private util: UtilService,
              private feedback: FeedbackService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private sqlite:SqliteExec) {
    moment.locale('zh-cn');
  }
}
