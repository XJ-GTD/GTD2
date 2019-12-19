import {Component, ElementRef, Renderer2, ViewChild, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import {
  IonicPage,
  NavController,
  ViewController,
  ModalController,
  ActionSheetController,
  NavParams,
  Slides
} from 'ionic-angular';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {MemoData, MemoService} from "../../service/business/memo.service";
import {EmitService} from "../../service/util-service/emit.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {Keyboard} from "@ionic-native/keyboard";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {AssistantService} from "../../service/cordova/assistant.service";

/**
 * Generated class for the 备忘创建/修改 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-memo',
  template: `
    <page-box title="添加备忘" [buttons]="buttons" (onSave)="save()" (onBack)="cancel()">

      <ion-grid>


        <ion-row class="snRow">
          <div class="sn font-large-x">
            <ion-textarea placeholder="你想记录什么。。。。" rows="8" [(ngModel)]="memo" class="memo-set" #bzRef></ion-textarea>
          </div>

        </ion-row>

        <ion-row class="dateRow">
          <div class="agendaai">
            <ion-icon class="fal fa-microphone" (click)="recordAgenda()"></ion-icon>
          </div>

          <div class="pickDate">
            <ion-icon class="fal fa-alarm-clock "></ion-icon>
            <span class="content  agendaDate">
                  {{day | formatedate: "YYYY-M-D"}}
            </span>
          </div>
        </ion-row>

      </ion-grid>

    </page-box>`
})
export class MemoPage {
  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;

  day: string = moment().format("YYYY/MM/DD");
  memo: string = "";
  origin: MemoData;
  showDay: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private emitService: EmitService,
              private util: UtilService,
              private feedback: FeedbackService,
              private  memoService: MemoService,
              private changeDetectorRef: ChangeDetectorRef,
              private assistantService: AssistantService,) {
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
    // setTimeout(() => {
    //   let el = this._bzRef.nativeElement.querySelector('textarea');
    //   el.focus();
    //   this.keyboard.show();   //for android
    // }, 500);
  }

  save() {
    let memo: MemoData = {} as MemoData;

    if (this.origin) {
      Object.assign(memo, this.origin);
      memo.mon = this.memo;
    } else {
      memo.sd = this.day;
      memo.mon = this.memo;
    }

    this.memoService.saveMemo(memo).then(() => {
      this.navCtrl.pop();
    })
  }

  cancel() {
    this.navCtrl.pop();
  }

  recordAgenda() {
    this.memo = "";
    this.assistantService.audio2Text((text) => {
      this.memo = text;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();

    }, () => {
      // this.buttons.record = true;
    }, () => {
      this.memo = "语音不可用，请手动输入。";
      // this.buttons.record = true;
    });
  }
}
