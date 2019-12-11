import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {RestFulHeader, RestFulConfig} from "../../service/config/restful.config";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {NetworkService} from "../../service/cordova/network.service";
import * as moment from "moment";
import { AppVersion } from '@ionic-native/app-version';

/**
 * Generated class for the 关于冥王星 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-at',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons right>
          <button ion-button icon-only (click)="goBack()">            
            <ion-icon class="fal fa-times"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
    <ion-grid class="h70">
      <ion-row class="h100" align-items-center>
        <ion-grid>
          <ion-row justify-content-center>
            <ion-avatar>
              <img class="img-logo" src="./assets/imgs/logo.png">
            </ion-avatar>
          </ion-row>
          <ion-row justify-content-center>
            <p></p>
          </ion-row>
          <ion-row justify-content-center>
            <h1 class="app-title">冥王星</h1>
          </ion-row>
          <ion-row justify-content-center>
            <h3 class="app-description">人工智能接触生活、工作与梦想</h3>
          </ion-row>
          <ion-row justify-content-center>
            <h3 class="app-description">迸发出的火花</h3>
          </ion-row>
          <ion-row justify-content-center>
            <p></p>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">版本</span>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">{{client.mainversion}}.{{client.version}}{{build==""? "" : (" build " + build)}}</span>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">{{server.datacenter}}</span>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">v{{server.version}}</span>
          </ion-row>
          <ion-row justify-content-center>
            <p></p>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">网络</span>
          </ion-row>
          <ion-row justify-content-center>
            <span class="app-profiles">{{network.type}} {{network.connected? "已连接" : "已断开"}}</span>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
    </ion-content>

    <!--<ion-footer>-->
      <!--<ion-toolbar>-->
        <!--<ion-buttons left>-->
          <!--<button ion-button icon-only (click)="userAgreement()" color="danger">-->
            <!--服务条款-->
          <!--</button>-->
        <!--</ion-buttons>-->

        <!--<ion-buttons right>-->
          <!--<button ion-button icon-only (click)="userAgreement()" color="danger">-->
            <!--隐私政策-->
          <!--</button>-->
        <!--</ion-buttons>-->
      <!--</ion-toolbar>-->
  <!--</ion-footer>-->
  `
})
export class AtPage {

  client:any = {mainversion: 'v1', version: '1'};
  server:any = {version: '1', datacenter: ''};

  network: any = {type: '未知', connected: false};

  build:any = "";

  constructor(public navCtrl: NavController,
              private appVersion: AppVersion,
              private networkService: NetworkService,
              private util:UtilService,
              private sqlite: SqliteExec) {
  }

  ionViewDidLoad() {
    if (this.util.hasCordova()) {
      this.appVersion.getVersionCode().then((buildnumber) => {
        if (buildnumber) {
          this.build = buildnumber;
        }
      });
    }

    let restfulHeader = new RestFulHeader();
    this.client.mainversion = restfulHeader.pv? restfulHeader.pv.replace(/v/, 'v0.') : 'v0.0';
    this.client.version = UserConfig.getClientVersion();

    this.network.type = this.networkService.getNetworkTypeName();
    this.network.connected = this.networkService.isConnected();

    if (RestFulConfig.INIT_DATA_URL.indexOf('tag=mwxing') > 0) this.server.datacenter += '开发';
    if (RestFulConfig.INIT_DATA_URL.indexOf('debug=true') > 0) this.server.datacenter += '内部';
    if (RestFulConfig.INIT_DATA_URL.indexOf('?') < 0) this.server.datacenter += '公测';
    this.server.datacenter += '数据中心';
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
