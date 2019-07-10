import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";

/**
 * Generated class for the 项目跟进 集成 | Fir.IM page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
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
      <ion-title>Fir.IM Webhook</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            设置 集成 | Fir.IM Webhook
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
    </ion-grid>
  </ion-content>
  `
})
export class FoFirIMPage {
  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private ssService: SsService,
              private _renderer: Renderer2) {
  }
}
