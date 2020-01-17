import {ChangeDetectorRef, Component, ViewChild,} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, } from 'ionic-angular';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import * as moment from "moment";
import {AssistantService} from "../../service/cordova/assistant.service";

@IonicPage()
@Component({
  selector: 'page-comment',
  template: `
  <modal-box title="备注" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">

    <ion-grid>

      <!--<ion-row class="limitRow font-small-x">-->
        <!--<span>{{snlength}} / 80 </span>-->
      <!--</ion-row>-->

      <ion-row class="snRow">
        <div class="sn font-large-x">
          <ion-textarea   placeholder="日历项的备注。。。"  class="memo-set" rows="8" [(ngModel)]="bz" class="font-large-x" [maxlength]="80"  (ionChange)="changeTitle()" ></ion-textarea>
        </div>
      </ion-row>
      <!--<ion-row class="dateRow">-->
        <!--<div class="agendaai">-->
          <!--<ion-icon class="fal fa-waveform" *ngIf="bz != ''" (click)="speakPlanItem()"></ion-icon>-->
          <!--<ion-icon class="fal fa-microphone" *ngIf="bz == ''" (click)="recordPlanItem()"></ion-icon>-->
        <!--</div>-->
      <!--</ion-row>      -->
    </ion-grid>
  </modal-box>
  `
})
export class CommentPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent;


  buttons: any = {
    save: true,
    cancel: true
  };
  speaking: boolean = false;

  snlength:number = 0;


  bz: string = "";  //备注

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private assistantService: AssistantService,
              private changeDetectorRef: ChangeDetectorRef,) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.bz = value;
        this.snlength = this.bz.length;
      }
    }
  }



  ionViewDidEnter() {
  }

  ngAfterViewInit(){

    this.modalBoxComponent.setBoxContent();


  }

  save() {
    let data: Object = {bz: this.bz};
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }

  record(text){
    this.bz = text;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  changeTitle() {
    this.snlength =  this.bz.length;

  }


  recordPlanItem() {
    this.bz= "";
    this.assistantService.audio2Text((text) => {
      this.bz = text;
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();

    }, () => {
      // this.buttons.record = true;
    }, () => {
      this.bz = "语音不可用，请手动输入。";
      // this.buttons.record = true;
    });
  }

  speakPlanItem() {
    if (!this.speaking) {
      this.speaking = true;
      let speakData = this.bz;

      this.assistantService.speakText(speakData).then(() => {
        this.speaking = false;
      })
    } else {
      this.assistantService.stopSpeak(false);
      this.speaking = false;
    }
  }

}
