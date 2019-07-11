import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import { getSecret } from "../../util/crypto-util";
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
            <button ion-button color="dark" class="border" clear round small>设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-height">
          <ion-card>
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
                <button ion-button icon-start clear small>
                  <ion-icon name="copy"></ion-icon>
                  <div>复制</div>
                </button>
              </ion-col>
              <ion-col text-center>
                <button ion-button icon-start clear small (click)="showOrhideSecret()">
                  <ion-icon name="eye"></ion-icon>
                  <div>显示</div>
                </button>
              </ion-col>
            </ion-row>
          </ion-card>
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

  secret: string = "****************";
  hideOrshow: boolean = true;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private ssService: SsService,
              private _renderer: Renderer2) {
  }

  resetSecret() {
    this.secret = getSecret(UserConfig.user.id);
  }

  showOrhideSecret() {

  }

  goBack() {
    this.navCtrl.pop();
  }
}
