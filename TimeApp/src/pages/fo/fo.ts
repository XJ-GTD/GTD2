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
              获得项目代码发布、集成状态和安装版本通知
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row>
              <ion-list no-lines>
                <button ion-item class="plan-list-item" detail-push (click)="gotogithubsetting()">
                  <ion-icon ios="logo-github" md="logo-github" item-start></ion-icon>
                  <ion-label>GitHub</ion-label>
                  <ion-note item-end>{{sgithub}}</ion-note>
                </button>

                <button ion-item class="plan-list-item" detail-push (click)="gototraviscisetting()">
                  <ion-icon ios="logo-freebsd-devil" md="logo-freebsd-devil" item-start></ion-icon>
                  <ion-label>Travis CI</ion-label>
                  <ion-note item-end>{{stravisci}}</ion-note>
                </button>

                <button ion-item class="plan-list-item" detail-push (click)="gotofirimsetting()">
                  <ion-icon ios="ios-bonfire" md="md-bonfire" item-start></ion-icon>
                  <ion-label>集成 | fir.im</ion-label>
                  <ion-note item-end>{{sfirim}}</ion-note>
                </button>
              </ion-list>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class FoPage {
  sfirim: string = "关闭";
  sgithub: string = "关闭";
  stravisci: string = "关闭";

  firim: boolean = false;
  github: boolean = false;
  travisci: boolean = false;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private ssService: SsService,
              private _renderer: Renderer2) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  gotofirimsetting() {
    this.firim = !this.firim;
    this.sfirim = this.firim? "打开" : "关闭";

    this.ssService.putFollowFirIM(
      UserConfig.account.id,
      moment().valueOf(),
      this.firim
    );
  }

  gototraviscisetting() {
    this.travisci = !this.travisci;
    this.stravisci = this.travisci? "打开" : "关闭";

    this.ssService.putFollowTravisCI(
      UserConfig.account.id,
      moment().valueOf(),
      this.travisci
    );
  }

  gotogithubsetting() {
    this.github = !this.github;
    this.sgithub = this.github? "打开" : "关闭";

    this.ssService.putFollowGitHub(
      UserConfig.account.id,
      moment().valueOf(),
      this.github
    );
  }

}
