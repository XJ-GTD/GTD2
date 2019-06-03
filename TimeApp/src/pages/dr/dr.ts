import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {DrService} from "./dr.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";
import * as moment from "moment";

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
            <ion-row align-items-center justify-content-center>
              获得每天的日程安排摘要
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <hr>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <h1>{{notifytime| formatedate:"HH:mm"}} <small>{{notifytime| formatedate:"A"}}</small></h1>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              每天
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <ion-list>
                <ion-item>
                  <ion-range [(ngModel)]="notifytime" [min]="min" [max]="max" [step]="step" pin="false" dualKnobs="false" snaps="true"></ion-range>
                </ion-item>
              </ion-list>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <button ion-button full outline>关闭</button>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class DrPage {
  min: number = moment('2019/6/3 00:00:00').unix() * 1000;
  max: number = moment('2019/6/3 23:59:59').unix() * 1000;
  step: number = 15 * 60 * 1000; //15分钟
  notifytime: number = moment('2019/6/3 08:30:00').unix();

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
