import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../../service/config/data.config";
import {Setting, UserConfig} from "../../../service/config/user.config";
import {EmitService} from "../../../service/util-service/emit.service";
import {SsService} from "../../ss/ss.service";
import {PageY} from "../../../data.mapping";
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
        <ion-buttons right>
          <button ion-button color="danger" (click)="more()">
            <img class="img-header-right" src="./assets/imgs/more.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-grid>
            <ion-row align-items-center justify-content-center>
              获得GitHub, fir.im服务的webhooks事件通知
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <h1 class="h1-danger">{{besharedinscounts? besharedinscounts : "-"}} / {{selfinscounts? selfinscounts : "-"}}</h1>
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
<!-- 删除Travis CI配置项，因为持续集成消息是通过GitHub接收的 -->
<!--
            <button ion-item class="plan-list-item" detail-push (click)="gototraviscisetting()">
              <img src="assets/imgs/travisci/travisci-worker-logo.svg" item-start>
              <ion-label>Travis CI</ion-label>
              <ion-note item-end>{{(github && travisci)? "关闭" : "打开"}}</ion-note>
            </button>
-->
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
  sgithubsecret: Setting;
  stravisci: Setting;

  firim: boolean = false;
  github: boolean = false;
  travisci: boolean = false;

  selfinscounts: number = 0;
  besharedinscounts: number = 0;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private emitService: EmitService,
              private ssService: SsService,
              private _renderer: Renderer2) {
    let memFirIMDef = UserConfig.settins.get(DataConfig.SYS_FOFIR);
    let memGithubDef = UserConfig.settins.get(DataConfig.SYS_FOGH);
    let memGithubSecretDef = UserConfig.settins.get(DataConfig.SYS_FOGHSECRET);
    let memTravisCIDef = UserConfig.settins.get(DataConfig.SYS_FOTRACI);

    if (memFirIMDef) {
      this.sfirim = memFirIMDef;
      this.firim = memFirIMDef.value == "1"? true : false;
    }
    if (memGithubDef) {
      this.sgithub = memGithubDef;
      this.github = memGithubDef.value == "1"? true : false;
    }
    if (memGithubSecretDef) {
      this.sgithubsecret = memGithubSecretDef;
    }
    if (memTravisCIDef) {
      this.stravisci = memTravisCIDef;
      this.travisci = memTravisCIDef.value == "1"? true : false;
    }

    //初始化实例数量
    this.emitService.register("mwxing.config.user.ytbl.refreshed", () => {
      this.refreshInstances();
    });

    this.refreshInstances();
  }

  refreshInstances() {
    //FIR.IM实例
    let firInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS);
    //GITHUB实例
    let githubInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS);
    //被共享FIR.IM实例
    let firinInstances = UserConfig.getSettings(DataConfig.SYS_FOFIRIN_INS);
    //被共享GITHUB实例
    let githubinInstances = UserConfig.getSettings(DataConfig.SYS_FOGHIN_INS);

    let selfinstances = 0;
    if (firInstances && firInstances.length > 0) {
      selfinstances += firInstances.length;
    }
    if (githubInstances && githubInstances.length > 0) {
      selfinstances += githubInstances.length;
    }

    let besharedinstances = 0;
    if (firinInstances && firinInstances.length > 0) {
      besharedinstances += firinInstances.length;
    }
    if (githubinInstances && githubinInstances.length > 0) {
      besharedinstances += githubinInstances.length;
    }

    //设置画面显示
    this.selfinscounts = selfinstances;
    this.besharedinscounts = besharedinstances;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
  }

  goBack() {
    let data: Object = {
      github: this.sgithub,
      travisci: this.stravisci,
      firim: this.sfirim
    };

    this.viewCtrl.dismiss(data);
  }

  more() {
    let modal = this.modalController.create(DataConfig.PAGE._FOSHARE_PAGE);
    modal.onDidDismiss((data)=>{
    });
    modal.present();
  }

  gotofirimsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FOFIRIM_PAGE);
    modal.onDidDismiss((data)=>{
      if (data && data.setting) {
        this.firim = data.setting.value == "1"? true : false;
        this.sfirim = data.setting;

        this.ssService.putFollowFirIM(
          UserConfig.account.id,
          moment().valueOf(),
          this.firim
        );
      }
    });
    modal.present();
  }

  gototraviscisetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FOTRAVISCI_PAGE);
    modal.onDidDismiss((data)=>{
      if (data && data.setting) {
        this.travisci = data.setting.value == "1"? true : false;
        this.stravisci = data.setting;

        this.ssService.putFollowTravisCI(
          UserConfig.account.id,
          moment().valueOf(),
          this.travisci
        );
      }
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

      let secret = "";
      if (data && data.secret) {
        this.sgithubsecret = data.secret;
        secret = this.sgithubsecret.value;
      }

      if (data && data.setting && data.secret) {
        this.ssService.putFollowGitHub(
          UserConfig.account.id,
          secret,
          moment().valueOf(),
          this.github
        );
      }
    });
    modal.present();
  }

}
