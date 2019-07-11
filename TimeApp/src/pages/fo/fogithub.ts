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
          <ion-row align-items-center justify-content-center class="full-width fir-color">
            <ion-icon name="github-logo"></ion-icon>
            <div class="firim-help">
            <button ion-button color="dark" class="border" clear round small>设置帮助</button>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <h1 class="h1-danger">5 / 32</h1>
          </ion-row>
          <ion-row align-items-center justify-content-center class="golden-margin">
            <small>通知</small>
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
