import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {FoService} from "./fo.service";
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
          <ion-list no-lines>
            <button ion-item class="plan-list-item" detail-push (click)="gotogithubsetting()">
              <ion-label>github</ion-label>
              <ion-note item-end>{{sdsfn}}</ion-note>
            </button>

            <button ion-item class="plan-list-item" detail-push (click)="gototraviscisetting()">
              <ion-label>travis-ci</ion-label>
              <ion-note item-end>{{sdsfn}}</ion-note>
            </button>

            <button ion-item class="plan-list-item" detail-push (click)="gotofirimsetting()">
              <ion-label>fir.im</ion-label>
              <ion-note item-end>{{sdsfn}}</ion-note>
            </button>
          </ion-list>
    </ion-content>
  `,
})
export class FoPage {
  sdsfn: string = "";

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              private foService: FoService,
              private _renderer: Renderer2) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  gotofirimsetting() {}

  gototraviscisetting() {}

  gotogithubsetting() {
  }

}
