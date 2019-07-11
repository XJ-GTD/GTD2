import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";

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
      <ion-title>github</ion-title>
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
            <div class="firim-help">
            <button ion-button color="dark" class="border" clear round small>设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-margin-s">
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button color="light" class="border" clear round>生成安全令牌</button>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <button ion-button color="light" class="border" clear round>复制 webhook 地址</button>
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
export class FoGitHubPage {
  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private ssService: SsService,
              private _renderer: Renderer2) {
  }

  goBack() {
    this.navCtrl.pop();
  }
}
