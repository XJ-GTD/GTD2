import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";

/**
 * Generated class for the 项目跟进 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fo',
  template:
  `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>项目跟进</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-grid>
            <ion-row align-items-center justify-content-center>
              获得项目代码提交、持续集成和版本发布通知
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <h1 class="h1-danger">5 / 32</h1>
            </ion-row>
            <ion-row align-items-center justify-content-center class="golden-margin">
              <small>通知</small>
            </ion-row>
          </ion-grid>
        </ion-row>
        <ion-row>
          <ion-list no-lines>
            <button ion-item class="plan-list-item" detail-push (click)="gotogithubsetting()">
              <ion-icon ios="logo-github" md="logo-github" item-start></ion-icon>
              <ion-label>GitHub</ion-label>
              <ion-note item-end>{{github? "关闭" : "打开"}}</ion-note>
            </button>

            <button ion-item class="plan-list-item" detail-push (click)="gototraviscisetting()">
              <img src="assets/imgs/travisci/travisci-worker-logo.svg" item-start>
              <ion-label>Travis CI</ion-label>
              <ion-note item-end>{{travisci? "关闭" : "打开"}}</ion-note>
            </button>

            <button ion-item class="plan-list-item" detail-push (click)="gotofirimsetting()">
              <ion-icon ios="logo-dropbox" md="logo-dropbox" item-start></ion-icon>
              <ion-label>集成 | fir.im</ion-label>
              <ion-note item-end>{{firim? "关闭" : "打开"}}</ion-note>
            </button>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class FoPage {
  sfirim: Setting;
  sgithub: Setting;
  stravisci: Setting;

  firim: boolean = false;
  github: boolean = false;
  travisci: boolean = false;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private ssService: SsService,
              private _renderer: Renderer2) {
    let memFirIMDef = UserConfig.settins.get(DataConfig.SYS_FOFIR);
    let memGithubDef = UserConfig.settins.get(DataConfig.SYS_FOGH);
    let memTravisCIDef = UserConfig.settins.get(DataConfig.SYS_FOTRACI);

    if (memFirIMDef) {
      this.sfirim = memFirIMDef;
      this.firim = memFirIMDef.value == "1"? true : false;
    }
    if (memGithubDef) {
      this.sgithub = memGithubDef;
      this.github = memGithubDef.value == "1"? true : false;
    }
    if (memTravisCIDef) {
      this.stravisci = memTravisCIDef;
      this.travisci = memTravisCIDef.value == "1"? true : false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  gotofirimsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FOFIRIM_PAGE);
    modal.onDidDismiss((data)=>{
      if (data && data.setting) {
        this.firim = data.setting.value == "1"? true : false;
        this.sfirim = data.setting;
      }

      this.ssService.putFollowFirIM(
        UserConfig.account.id,
        moment().valueOf(),
        this.firim
      );
    });
    modal.present();
  }

  gototraviscisetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FOTRAVISCI_PAGE);
    modal.onDidDismiss((data)=>{
      if (data && data.setting) {
        this.travisci = data.setting.value == "1"? true : false;
        this.stravisci = data.setting;
      }

      this.ssService.putFollowTravisCI(
        UserConfig.account.id,
        moment().valueOf(),
        this.travisci
      );
    });
    modal.present();
  }

  gotogithubsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FOGITHUB_PAGE);
    modal.onDidDismiss((data)=>{
      if (data && data.setting) {
        this.github = data.setting.value == "1"? true : false;
        this.sgithub = data.setting;
      }

      this.ssService.putFollowGitHub(
        UserConfig.account.id,
        moment().valueOf(),
        this.github
      );
    });
    modal.present();
  }

}
