import {Component, Renderer2} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "./ss.service";
import {PlService} from "../pl/pl.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";

/**
 * Generated class for the 设置画面 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ss',
  template:
      `
    <page-box title="设置" [buttons]="buttons" (onBack)="goBack()">

      <ion-list>
        <ion-list-header>
          <ion-label>新消息</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>新消息提醒</ion-label>
          <ion-toggle [(ngModel)]="bt" (ionChange)="save(t, bt)"></ion-toggle>
        </ion-item>
      </ion-list>
      <ion-list>

        <ion-list-header>
          <ion-label>语音</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>语音唤醒</ion-label>
          <ion-toggle [(ngModel)]="bh" (ionChange)="save(h, bh)"></ion-toggle>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>语音播报</ion-label>
          <ion-toggle [(ngModel)]="bb" (ionChange)="save(b, bb)"></ion-toggle>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>震动音效</ion-label>
          <ion-toggle [(ngModel)]="bz" (ionChange)="save(z, bz)"></ion-toggle>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>联系人</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border [attr.detail-push]="lfsloading? null : ''"
                  [attr.detail-none]="lfsloading? '' : null" (click)="resfriend()">
          <ion-label>本地联系人</ion-label>
          <ion-note *ngIf="!lfsloading" item-end>{{localfriends}}</ion-note>
          <ion-spinner *ngIf="lfsloading" icon="circles" item-end></ion-spinner>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>智能提醒</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>每日简报</ion-label>
          <ion-note item-end (click)="gotodrsetting()">{{bdr ? sdrp1 : '关闭'}}</ion-note>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border detail-push (click)="gotopjfollowsetting()">
          <ion-label>项目跟进</ion-label>
          <ion-note item-end *ngIf="!spfon">打开</ion-note>
          <ion-note item-end *ngIf="spfon" class="inline-icons">
            <ion-icon *ngIf="spfon && github" ios="logo-github" md="logo-github"></ion-icon>
            <!-- Travis CI设置选项隐藏 -->
            <!--
                            <img *ngIf="spfon && travisci" src="assets/imgs/travisci/travisci-worker-logo.svg">
            -->
            <ion-icon *ngIf="spfon && firim" ios="logo-dropbox" md="logo-dropbox"></ion-icon>
          </ion-note>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-list-header>
          <ion-label>主题</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border>
          <div item-content radio-group class="themeselect">
            <div class="waper" ion-item>
              <ion-radio value="black"></ion-radio>
              <ion-label><img src="./assets/imgs/black.png"></ion-label>
            </div>
            <div class="waper" ion-item>
              <ion-radio  value="white"></ion-radio>
              <ion-label><img src="./assets/imgs/white.png"></ion-label>
            </div>
          </div>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>
          <ion-label>日历</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border detail-push (click)="gotodjhsetting()">
          <ion-label>默认日历</ion-label>
          <ion-note item-end>{{sdjhn}}</ion-note>
        </ion-item>

      </ion-list>

    </page-box>


  `,
})
export class SsPage {


  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };

  h: Setting;        //唤醒
  t: Setting;        //新消息提醒
  b: Setting;        //语音播报
  z: Setting;        //振动
  dr: Setting;       //每日简报 智能提醒
  drp1: Setting;     //每日简报 提醒时间
  djh: Setting;      //日历 缺省日历
  sfirim: Setting;
  sgithub: Setting;
  stravisci: Setting;

  bh: boolean;       //唤醒 页面显示和修改
  bt: boolean;       //新消息提醒 页面显示和修改
  bb: boolean;       //语音播报 页面显示和修改
  bz: boolean;       //振动 页面显示和修改
  bdr: boolean;      //每日简报 页面显示和修改
  github: boolean = false;   //项目跟进 GitHub
  travisci: boolean = false;   //项目跟进 Travis CI
  firim: boolean = false;   //项目跟进 Fir.IM
  sdrp1: string;     //每日简报 提醒时间
  spfon: boolean = false;     //项目跟进 智能提醒
  sdjhn: string;     //日历 缺省日历名称
  sdjh: string;      //日历 缺省日历
  sdjho: any;        //日历 缺省日历对象

  lfsloading: boolean = false;  //导入本地联系人处理状态
  localfriends: number = 0;     //本地联系人导入数

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public ssService: SsService,
              private plService: PlService,
              private _renderer: Renderer2) {
    let memFirIMDef = UserConfig.settins.get(DataConfig.SYS_FOFIR);
    let memGithubDef = UserConfig.settins.get(DataConfig.SYS_FOGH);
    let memTravisCIDef = UserConfig.settins.get(DataConfig.SYS_FOTRACI);

    if (memFirIMDef) {
      this.sfirim = memFirIMDef;
      this.firim = memFirIMDef.value == "1" ? true : false;
    }
    if (memGithubDef) {
      this.sgithub = memGithubDef;
      this.github = memGithubDef.value == "1" ? true : false;
    }
    if (memTravisCIDef) {
      this.stravisci = memTravisCIDef;
      this.travisci = memTravisCIDef.value == "1" ? true : false;
    }

    if (this.github || this.firim || this.travisci) {
      this.spfon = true;
    } else {
      this.spfon = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');

    this.getData();
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(setting, value) {

    let set: PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type;//偏好设置key
    set.yv = (value) ? "1" : "0";//偏好设置value

    this.ssService.save(set);
  }

  //智能提醒 每日简报设置
  gotodrsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._DR_PAGE);
    modal.onDidDismiss((data) => {
      this.getData();

      this.ssService.putDailySummary(
        UserConfig.account.id,
        moment('2019/6/3 ' + this.sdrp1 + ':00').unix() * 1000,
        this.bdr
      );
    });
    modal.present();
  }

  gotodjhsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._JH_PAGE, this.sdjho);
    modal.onDidDismiss((data) => {
      this.sdjho = data.jh;
      this.sdjhn = data.jh.jn;
      this.sdjh = data.jh.ji;

      this.djh.value = data.jh.ji;

      let set: PageY = new PageY();
      set.yi = this.djh.yi;//偏好主键ID
      set.ytn = this.djh.bname; //偏好设置类型名称
      set.yt = this.djh.typeB; //偏好设置类型
      set.yn = this.djh.name;//偏好设置名称
      set.yk = this.djh.type;//偏好设置key
      set.yv = data.jh.ji;//偏好设置value

      this.ssService.save(set);
    });
    modal.present();
  }

  gotopjfollowsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._FO_PAGE);
    modal.onDidDismiss((data) => {
      if (data) {
        if (data.github) {
          this.sgithub = data.github;
          this.github = data.github.value == "1" ? true : false;
        }
        if (data.travisci) {
          this.stravisci = data.travisci;
          this.travisci = data.travisci.value == "1" ? true : false;
        }
        if (data.firim) {
          this.sfirim = data.firim;
          this.firim = data.firim.value == "1" ? true : false;
        }

        if (this.github || this.firim || this.travisci) {
          this.spfon = true;
        } else {
          this.spfon = false;
        }
      }
    });
    modal.present();
  }

  private async getData() {
    this.h = UserConfig.settins.get(DataConfig.SYS_H);
    this.t = UserConfig.settins.get(DataConfig.SYS_T);
    this.b = UserConfig.settins.get(DataConfig.SYS_B);
    this.z = UserConfig.settins.get(DataConfig.SYS_Z);
    this.dr = UserConfig.settins.get(DataConfig.SYS_DR);
    this.drp1 = UserConfig.settins.get(DataConfig.SYS_DRP1);
    this.djh = UserConfig.settins.get(DataConfig.SYS_DJH);

    this.bh = (this.h.value == "1") ? true : false;
    this.bt = (this.t.value == "1") ? true : false;
    this.bb = (this.b.value == "1") ? true : false;
    this.bz = (this.z.value == "1") ? true : false;
    this.bdr = (this.dr.value == "1") ? true : false;
    this.sdrp1 = (this.drp1 && this.drp1.value) ? this.drp1.value : "08:30";
    this.sdjh = this.djh.value;
    this.sdjho = await this.plService.getJh(this.sdjh);
    this.sdjhn = this.sdjho.jn;

    this.localfriends = UserConfig.friends ? UserConfig.friends.length : 0;
  }

  //刷新本地联系人
  resfriend() {
    this.lfsloading = true;

    this.ssService.resfriend().then(d => {
      this.lfsloading = false;
    })
  }
}
