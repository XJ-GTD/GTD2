import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the 项目跟进 Travis CI page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-fotravisci',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>Travis-CI</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            接收 GitHub Travis-CI事件消息推送
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center class="full-width travisci-color">
            <img src="assets/imgs/travisci/travisci-logo.svg" class="travisci-logo">
            <div class="travisci-help">
            <button ion-button color="dark" class="border" clear round small (click)="help()">设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-margin">
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button color="light" class="border" clear round (click)="gotogithubsetting()">接收GitHub消息推送</button>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button full outline small class="no-border" color="danger" (click)="save(defaulttravisci, !travisci)">{{travisci? '关闭' : '打开'}}</button>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoTravisCIPage {

  stravisci: string = "关闭";
  travisci: boolean = false;

  defaulttravisci: Setting;

  github: boolean = false;
  sgithub: string = "关闭";

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private _renderer: Renderer2) {
    let memDef = UserConfig.settins.get(DataConfig.SYS_FOTRACI);

    //初始化参数
    if (!memDef) {
      let def: Setting = new Setting();

      def.typeB = DataConfig.SYS_FOTRACI;
      def.bname = "项目跟进 Travis-CI 关闭";
      def.name = "项目跟进";
      def.type = DataConfig.SYS_FOTRACI;
      def.value = "";

      this.defaulttravisci = def;
    } else {
      this.travisci = memDef.value == "1"? true : false;
      this.defaulttravisci = memDef;
    }
  }

  help() {
    const browser = this.iab.create("https://docs.travis-ci.com/user/tutorial/", "_system");
    browser.show();
  }

  gotogithubsetting() {
    this.github = !this.github;
    this.sgithub = this.github? "打开" : "关闭";

    let modal = this.modalController.create(DataConfig.PAGE._FOGITHUB_PAGE);
    modal.onDidDismiss((data)=>{
      this.ssService.putFollowGitHub(
        UserConfig.account.id,
        "",
        moment().valueOf(),
        this.github
      );
    });
    modal.present();
  }

  async save(setting, value) {
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

    if (set.yk == DataConfig.SYS_FOTRACI) {
      // 改变画面显示
      this.travisci = value;
      // 返回前页
      let data: Object = {setting: setting};

      this.viewCtrl.dismiss(data);
    }
  }

  goBack() {
    let data: Object = {setting: this.defaulttravisci};

    this.viewCtrl.dismiss(data);
  }
}
