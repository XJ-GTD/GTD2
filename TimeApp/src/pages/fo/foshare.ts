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
            团队共享通知推送
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
        </ion-grid>
      </ion-row>
      <ion-row>
        <ion-list no-lines>
          <ion-list-header>GitHub</ion-list-header>
          <ion-item-sliding *ngFor="let sgithub of sgithubs">
            <ion-item>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithub.full_name}}</h3>
              <p>{{sgithub.description}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="shareto()">
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
                添加
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item-sliding *ngFor="let sgithubin of sgithubsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="sgithubin.from.avatar">
              </ion-avatar>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithubin.full_name}}</h3>
              <p>{{sgithubin.description}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear>
                关闭
              </button>
            </ion-item-options>
          </ion-item-sliding>

          <ion-list-header>集成 | fir.im</ion-list-header>
          <ion-item-sliding *ngFor="let sfir of sfirs">
            <ion-item>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfir.icon">
                </ion-thumbnail>
                 　　{{sfir.name}}
              </h3>
              <p>Platform: {{sfir.platform}}</p>
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
          <ion-item-sliding *ngFor="let sfirin of sfirsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="sfirin.from.avatar">
              </ion-avatar>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfirin.icon">
                </ion-thumbnail>
                 　　{{sfirin.name}}
              </h3>
              <p>Platform: {{sfirin.platform}}</p>
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

  sfirs: Array<any>;
  sgithubs: Array<any>;
  sfirsin: Array<any>;
  sgithubsin: Array<any>;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private _renderer: Renderer2) {
    this.defaultavatar = DataConfig.HUIBASE64;
    let firInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS);
    let githubInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS);
    let firinInstances = UserConfig.getSettings(DataConfig.SYS_FOFIRIN_INS);
    let githubinInstances = UserConfig.getSettings(DataConfig.SYS_FOGHIN_INS);

    let firs: Array<any> = new Array<any>();
    let githubs: Array<any> = new Array<any>();

    for (let f in firInstances) {
      let value = JSON.parse(firInstances[f].value);

      firs.push(value);
    }

    for (let g in githubInstances) {
      let value = JSON.parse(githubInstances[g].value);

      githubs.push(value);
    }

    let firsin: Array<any> = new Array<any>();
    let githubsin: Array<any> = new Array<any>();

    for (let f in firinInstances) {
      let value = JSON.parse(firInstances[f].value);

      firsin.push(value);
    }

    for (let g in githubinInstances) {
      let value = JSON.parse(githubInstances[g].value);

      githubsin.push(value);
    }

    this.sgithubs = githubs;
    this.sfirs = firs;
    this.sgithubsin = githubsin;
    this.sfirsin = firsin;

    //初始化参数格式设计
  }

  shareto() {
    let modal = this.modalController.create(DataConfig.PAGE._FS4FO_PAGE, {selected: ['13585820972']});
    modal.onDidDismiss((data)=>{
      if (data && data.selected) {
        console.log("dddd");
      }
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
