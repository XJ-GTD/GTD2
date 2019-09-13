import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import { MemoService, MemoData } from "../../service/business/memo.service";
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
  selector: 'page-memo',
  template: `<page-box title="备忘" [subtitle]="day" (onSubTitleClick)="changeDatetime()" (onRemove)="goRemove()" (onBack)="goBack()">
      </page-box>`
})
export class MemoPage {
  statusBarColor: string = "#3c4d55";

  memos: Array<MemoData> = new Array<MemoData>();
  day: string = moment().format("YYYY/MM/DD");

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private memoService: MemoService,
              private util: UtilService,
              private feedback: FeedbackService) {
    moment.locale('zh-cn');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
