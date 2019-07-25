import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, ViewController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "../ss/ss.service";
import {FsData, PageY} from "../../data.mapping";
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
          <!-- 自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sgithub of sgithubs">
            <ion-item>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithub.ins.value.full_name}}</h3>
              <p>{{sgithub.ins.value.description}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="shareto(sgithub)">
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
                添加
              </button>
              <button ion-button clear (click)="configure(sgithub)">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <!-- 共享给自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sgithubin of sgithubsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="sgithubin.ins.value.from.avatar">
              </ion-avatar>
              <h3><ion-icon name="git-network"></ion-icon> {{sgithubin.ins.value.full_name}}</h3>
              <p>{{sgithubin.ins.value.description}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="configure(sgithubin)">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>

          <ion-list-header>集成 | fir.im</ion-list-header>
          <!-- 自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sfir of sfirs">
            <ion-item>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfir.ins.value.icon">
                </ion-thumbnail>
                 　　{{sfir.ins.value.name}}
              </h3>
              <p>Platform: {{sfir.ins.value.platform}}</p>
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
              <button ion-button clear (click)="shareto(sfir)">
                <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
                添加
              </button>
              <button ion-button clear (click)="configure(sfir)">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
              </button>
            </ion-item-options>
          </ion-item-sliding>
          <!-- 共享给自己的项目跟进通知 -->
          <ion-item-sliding *ngFor="let sfirin of sfirsin">
            <ion-item>
              <ion-avatar item-start>
                <img [src]="sfirin.ins.value.from.avatar">
              </ion-avatar>
              <h3>
                <ion-thumbnail>
                  <img [src]="sfirin.ins.value.icon">
                </ion-thumbnail>
                 　　{{sfirin.ins.value.name}}
              </h3>
              <p>Platform: {{sfirin.ins.value.platform}}</p>
            </ion-item>
            <ion-item-options side="right">
              <button ion-button clear (click)="configure(sfirin)">
                <ion-icon ios="ios-construct" md="ios-construct"></ion-icon>
                选项
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

  smembers: Map<string, Array<FsData>>;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private _renderer: Renderer2) {
    this.defaultavatar = DataConfig.HUIBASE64;

    //FIR.IM实例
    let firInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS);
    //FIR.IM实例共享
    let firShareInstances = UserConfig.getSettings(DataConfig.SYS_FOFIR_INS_SHARE);
    //GITHUB实例
    let githubInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS);
    //GITHUB实例共享
    let githubShareInstances = UserConfig.getSettings(DataConfig.SYS_FOGH_INS_SHARE);
    //被共享FIR.IM实例
    let firinInstances = UserConfig.getSettings(DataConfig.SYS_FOFIRIN_INS);
    //被共享GITHUB实例
    let githubinInstances = UserConfig.getSettings(DataConfig.SYS_FOGHIN_INS);

    let firs: Array<any> = new Array<any>();
    let githubs: Array<any> = new Array<any>();

    for (let f in firInstances) {
      let obj = firInstances[f];

      firs.push({
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        share: {}
      });
    }

    for (let g in githubInstances) {
      let obj = githubInstances[g];

      githubs.push({
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        share: {}
      });
    }

    let firsin: Array<any> = new Array<any>();
    let githubsin: Array<any> = new Array<any>();

    for (let f in firinInstances) {
      let obj = firInstances[f];

      firsin.push({
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        from: {}
      });
    }

    for (let g in githubinInstances) {
      let obj = githubInstances[g];

      githubsin.push({
        ins: {
          id: obj.yi,
          type: obj.typeB,
          typename: obj.bname,
          key: obj.type,
          keyname: obj.name,
          value: JSON.parse(obj.value)
        },
        share: {}
      });
    }

    this.sgithubs = githubs;
    this.sfirs = firs;
    this.sgithubsin = githubsin;
    this.sfirsin = firsin;

    //初始化参数格式设计
  }

  shareto(instance) {
    let modal = this.modalController.create(DataConfig.PAGE._FS4FO_PAGE, {selected: ['13585820972']});
    modal.onDidDismiss((data)=>{
      if (data && data.selected) {
        console.log("dddd");
      }
    });
    modal.present();
  }

  configure(instance) {
    let modal = this.modalController.create(DataConfig.PAGE._FOCONFIGURE_PAGE, {selected: ['13585820972']});
    modal.onDidDismiss((data)=>{
      if (data && data.selected) {
        console.log("dddd");
      }
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
