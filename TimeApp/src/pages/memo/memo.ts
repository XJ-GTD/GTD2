import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
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
  template: `  <modal-box title="备注" (onClose)="close()">
        <ion-textarea type="text" placeholder="备注" [(ngModel)]="bz" class="memo-set" autosize maxHeight="400" #bzRef></ion-textarea>
      </modal-box>`
})
export class MemoPage {
  statusBarColor: string = "#3c4d55";

  day: string = moment().format("YYYY/MM/DD");

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private util: UtilService,
              private feedback: FeedbackService) {
    moment.locale('zh-cn');
    if (this.navParams) {
    }
  }

  close() {
    this.navCtrl.pop();
  }
}
