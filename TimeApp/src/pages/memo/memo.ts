import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController, ActionSheetController, NavParams, Slides} from 'ionic-angular';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {EmitService} from "../../service/util-service/emit.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {Keyboard} from "@ionic-native/keyboard";
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
  template: `  <modal-box title="备忘" (onSave)="save()" (onCancel)="cancel()">
        <ion-textarea type="text" placeholder="备注" [(ngModel)]="memo" class="memo-set" autosize maxHeight="400" #bzRef></ion-textarea>
      </modal-box>`
})
export class MemoPage {
  statusBarColor: string = "#3c4d55";

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;

  day: string = moment().format("YYYY/MM/DD");
  memo: string = "";
  origin: MemoData;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              private actionSheetCtrl: ActionSheetController,
              private emitService: EmitService,
              private util: UtilService,
              private feedback: FeedbackService,
              private keyboard: Keyboard) {
    moment.locale('zh-cn');
    if (this.navParams) {
      let data = this.navParams.data;

      this.day = data.day;

      if (data.memo && typeof data.memo === "string") {
        this.origin = undefined;
        this.memo = data.memo;
      }

      if (data.memo && typeof data.memo !== "string") {
        this.origin = data.memo;
        this.memo = this.origin.mon;
      }
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      let el = this._bzRef.nativeElement.querySelector('textarea');
      el.focus();
      this.keyboard.show();   //for android
    }, 500);
  }

  save() {
    if (this.origin) {
      this.origin.mon = this.memo;
    }

    let data: Object = {
      day: this.day,
      memo: this.origin? this.origin : this.memo
    };
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }
}
