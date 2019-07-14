import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the 项目跟进 通知共享 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-foshare',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>通知</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            给团队推送通知
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row>
        <ion-list no-lines>
          <ion-list-header>GitHub</ion-list-header>
          <ion-item-sliding>
            <ion-item>
              <h3><ion-icon name="git-network"></ion-icon> XJ-GTD/GTD2</h3>
              <p>过去, 现在和未来管理局 ( 记录过去，提醒现在和预约未来 )</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear>
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item-sliding>
            <ion-item>
              <ion-avatar item-start>
                <img [src]="defaultavatar">
              </ion-avatar>
              <h3><ion-icon name="git-network"></ion-icon> XJ-GTD/GTD2</h3>
              <p>过去, 现在和未来管理局 ( 记录过去，提醒现在和预约未来 )</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear>
                关闭
              </button>
            </ion-item-options>
          </ion-item-sliding>

          <ion-list-header>集成 | fir.im</ion-list-header>
          <ion-item-sliding>
            <ion-item>
              <h3>
                <ion-thumbnail>
                  <img src="http://firicon.fir.im/690cc493f7aa664d50c8a6493b964bc151181128?attname=blob&tmp=1563027675.485636">
                </ion-thumbnail>
                 　　冥王星
              </h3>
              <p>Platform: Android</p>
              <div class="avatars">
                <div>
                  <ion-avatar>
                    <img [src]="defaultavatar">
                  </ion-avatar>
                </div>
                <div>
                  <ion-avatar>
                    <img [src]="defaultavatar">
                  </ion-avatar>
                </div>
                <div>
                  <ion-avatar>
                    <img [src]="defaultavatar">
                  </ion-avatar>
                </div>
              </div>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear>
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
              </button>
              <button ion-button (click)="unread(item)">
                <ion-icon name="barcode"></ion-icon>
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item-sliding>
            <ion-item>
              <ion-avatar item-start>
                <img [src]="defaultavatar">
              </ion-avatar>
              <h3>
                <ion-thumbnail>
                  <img src="http://firicon.fir.im/690cc493f7aa664d50c8a6493b964bc151181128?attname=blob&tmp=1563027675.485636">
                </ion-thumbnail>
                 　　冥王星
              </h3>
              <p>Platform: Android</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear>
                关闭
              </button>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoSharePage {
  defaultavatar: string;

  travisci: boolean = false;
  defaulttravisci: Setting;

  github: boolean = false;
  sgithub: Setting;
  sgithubsecret: Setting;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private _renderer: Renderer2) {
    this.defaultavatar = DataConfig.HUIBASE64;
    let memDef = UserConfig.settins.get(DataConfig.SYS_FOTRACI);
    let memGithubDef = UserConfig.settins.get(DataConfig.SYS_FOGH);

    //初始化参数
    if (!memGithubDef) {
      this.github = false;
    } else {
      this.sgithub = memGithubDef;
      this.github = memGithubDef.value == "1"? true : false;
    }

    if (!memDef) {
      let def: Setting = new Setting();

      def.typeB = DataConfig.SYS_FOTRACI;
      def.bname = "项目跟进 Travis-CI 关闭";
      def.name = "项目跟进";
      def.type = DataConfig.SYS_FOTRACI;
      def.value = "0";

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

  shareto() {
    let modal = this.modalController.create(DataConfig.PAGE._FS4FO_PAGE,{});
    modal.onDidDismiss((data)=>{
    });
    modal.present();
  }

  gotogithubsetting() {
    this.github = !this.github;

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

      this.ssService.putFollowGitHub(
        UserConfig.account.id,
        secret,
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
