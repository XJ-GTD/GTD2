import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";
import {Clipboard} from '@ionic-native/clipboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the 项目跟进 集成 | Fir.IM page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-fofirim',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>集成 | fir.im</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            接收 集成 | fir.im 消息推送
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center class="full-width fir-color">
            <img src="assets/imgs/fir.im/firim-logo.png" class="fir-logo">
            <img src="assets/imgs/fir.im/plane.svg" class="fir-plane">
            <div class="rorate-proreller">
              <img src="assets/imgs/fir.im/propeller.svg" class="fir-propeller">
            </div>
            <div class="firim-help">
            <button ion-button color="dark" class="border" clear round small (click)="help()">设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-margin">
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button color="light" class="border" clear round (click)="copyWebhook()">复制 webhook 地址</button>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button full outline small class="no-border" color="danger" (click)="save(dr, !bdr)">{{bdr? '关闭' : '打开'}}</button>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoFirIMPage {
  webhook: string = "http://pluto.guobaa.com/aag/webhooks/fir.im/v3";

  sfirim: string = "关闭";
  firim: boolean = false;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private clipboard: Clipboard,
              private iab: InAppBrowser,
              private util: UtilService,
              private ssService: SsService,
              private _renderer: Renderer2) {
  }

  help() {
    let browser = this.iab.create("https://fir.im/support/articles/webhook/custom", "_system");
    browser.show();
  }

  copyWebhook() {
    this.clipboard.copy(this.webhook);
    this.util.popoverStart("webhook地址已复制到剪贴板");
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

    await this.ssService.save(set);

    if (set.yk == DataConfig.SYS_FOFIR) {
      // 改变画面显示
      this.bdr = value;
      // 返回前页
      this.navCtrl.pop();
    }

  }

  goBack() {
    this.navCtrl.pop();
  }
}
