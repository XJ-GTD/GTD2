import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {UtilService} from "../../service/util-service/util.service";
import { getSecret } from "../../util/crypto-util";
import {PageY} from "../../data.mapping";
import * as moment from "moment";
import {Clipboard} from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { getSha1SafeforBrowser } from '../../util/crypto-util';

/**
 * Generated class for the 项目跟进 GitHub page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-fogithub',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>GitHub</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            接收 GitHub 事件消息推送
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center class="full-width github-color">
            <ion-icon ios="logo-github" md="logo-github" class="github-logo"></ion-icon>
            <div class="github-help">
            <button ion-button color="dark" class="border" clear round small (click)="help()">设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-height">
          <ion-card *ngIf="github">
            <ion-card-header text-center>安全令牌</ion-card-header>
            <ion-card-content>
              <p text-center>{{secret| formatstring: 'mask': hideOrshow}}</p>
            </ion-card-content>
            <ion-row>
              <ion-col text-center>
                <button ion-button icon-start clear small (click)="resetSecret()">
                  <ion-icon name="refresh-circle"></ion-icon>
                  <div>重置</div>
                </button>
              </ion-col>
              <ion-col text-center>
                <button ion-button icon-start clear small (click)="copySecret()">
                  <ion-icon name="copy"></ion-icon>
                  <div>复制</div>
                </button>
              </ion-col>
              <ion-col text-center>
                <button ion-button icon-start clear small (click)="showOrhideSecret()">
                  <ion-icon [name]="hideOrshow? 'eye' : 'eye-off'"></ion-icon>
                  <div>{{hideOrshow? '显示' : '隐藏'}}</div>
                </button>
              </ion-col>
            </ion-row>
          </ion-card>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="github">
            <button ion-button color="light" class="border" clear round (click)="copyWebhook()">复制 webhook 地址</button>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="!github">
            <button ion-button color="light" class="border" clear round (click)="openWebhook()">打开</button>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="github">
            <button ion-button full outline small class="no-border" color="danger" (click)="save(defaultgithub, !github)">{{github? '关闭' : '打开'}}</button>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoGitHubPage {

  secret: string = "";
  hideOrshow: boolean = true;
  webhook: string = "http://pluto.guobaa.com/aag/webhooks/github/v3/";
  observer = "";

  github: boolean = false;
  sgithub: string = "关闭";

  defaultgithub: Setting;
  defaultgithubsecret: Setting;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private clipboard: Clipboard,
              private iab: InAppBrowser,
              private util: UtilService,
              private ssService: SsService,
              private _renderer: Renderer2) {
    this.observer = getSha1SafeforBrowser(UserConfig.account.id);
    let memDef = UserConfig.settins.get(DataConfig.SYS_FOGH);
    let memSecretDef = UserConfig.settins.get(DataConfig.SYS_FOGHSECRET);

    //初始化参数
    if (!memSecretDef) {
      this.secret = getSecret(UserConfig.account.id);

      let def: Setting = new Setting();

      def.typeB = DataConfig.SYS_FOGHSECRET;
      def.bname = "项目跟进 github 安全令牌";
      def.name = "项目跟进";
      def.type = DataConfig.SYS_FOGHSECRET;
      def.value = this.secret;

      this.defaultgithubsecret = def;
    } else {
      if (this.defaultgithubsecret.value) {
        this.secret = this.defaultgithubsecret.value;
      } else {
        this.secret = getSecret(UserConfig.account.id);
        this.defaultgithubsecret.value = this.secret;
      }
    }

    if (!memDef) {
      let def: Setting = new Setting();

      def.typeB = DataConfig.SYS_FOGH;
      def.bname = "项目跟进 github 关闭";
      def.name = "项目跟进";
      def.type = DataConfig.SYS_FOGH;
      def.value = "";

      this.defaultgithub = def;
    } else {
      this.github = memDef.value == "1"? true : false;
      this.defaultgithub = memDef;
    }
  }

  help() {
    const browser = this.iab.create("https://developer.github.com/webhooks/creating/", "_system");
    browser.show();
  }

  resetSecret() {
    this.secret = getSecret(UserConfig.account.id);
    this.hideOrshow = false;

    this.save(this.defaultgithubsecret, this.secret, false);
    this.save(this.defaultgithub, this.github, false);
  }

  openWebhook() {
    this.save(this.defaultgithubsecret, this.secret, false);
    this.save(this.defaultgithub, true, false);
  }

  copySecret() {
    this.clipboard.copy(this.secret);
    this.util.popoverStart("安全令牌已复制到剪贴板");
  }

  copyWebhook() {
    this.clipboard.copy(this.webhook + this.observer);
    this.util.popoverStart("webhook地址已复制到剪贴板");
  }

  showOrhideSecret() {
    this.hideOrshow = !this.hideOrshow;
  }

  async save(setting, value, close: boolean = true) {
    let set:PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type ;//偏好设置key
    if (typeof value === "boolean")
      set.yv = (value) ? "1":"0";//偏好设置value
    else
      set.yv = value;//偏好设置value

    setting.value = set.yv;

    await this.ssService.save(set);

    if (set.yk == DataConfig.SYS_FOGH) {
      // 改变画面显示
      this.github = value;

      if (close) {
        // 返回前页
        let data: Object = {setting: setting};
        this.viewCtrl.dismiss(data);
      } else {
        this.ssService.putFollowGitHub(
          UserConfig.account.id,
          moment().valueOf(),
          this.github
        );
      }
    }
  }

  goBack() {
    let data: Object = {setting: this.defaultgithub};

    this.viewCtrl.dismiss(data);
  }
}
