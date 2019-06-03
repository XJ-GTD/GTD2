import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {DrService} from "./dr.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";

/**
 * Generated class for the 每日简报设置 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dr',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <!--<ion-icon name="arrow-back"></ion-icon>-->
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>每日简报</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-grid>
            <ion-row align-items-center>
              获得每天的日程安排摘要
            </ion-row>
            <ion-row align-items-center>
              <hr>
            </ion-row>
            <ion-row align-items-center>
              <h1>7:00<small>上午</small></h1>
            </ion-row>
            <ion-row align-items-center>
              每天
            </ion-row>
            <ion-row align-items-center>
              <ion-list>
                <ion-item>
                  <ion-range [(ngModel)]="brightness" min="0" max="1440" step="15" pin="true" dualKnobs="false" snaps="true"></ion-range>
                </ion-item>
              </ion-list>
            </ion-row>
            <ion-row align-items-center>
              <button ion-button full outline>关闭</button>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class DrPage {
  bls:Array<FsData>;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private drService : DrService,
              private util : UtilService,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrPage');
  }

  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
  }

  goBack(){
    this.navCtrl.pop();
  }

}
