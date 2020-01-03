import {Component, Renderer2} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "./ss.service";
import {PlService} from "../pl/pl.service";
import {PageY} from "../../data.mapping";
import * as moment from "moment";
import {SettingsProvider} from "../../providers/settings/settings";

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
    <page-box title="设置" [buttons]="buttons" (onBack)="goBack()" nobackgroud nobottom>

      <ion-list>

        <ion-list-header>
          <ion-label>AI语音</ion-label>
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
          <ion-label>连续语音</ion-label>
          <ion-toggle [(ngModel)]="pautolisten" (ionChange)="save(autolisten, pautolisten)"></ion-toggle>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>向导</ion-label>
          <ion-toggle [(ngModel)]="psimpleprompt" (ionChange)="save(simpleprompt, psimpleprompt)"></ion-toggle>
        </ion-item>
        <!--<ion-item no-lines no-padding no-margin no-border >-->
          <!--<ion-label no-lines>交互方式</ion-label>-->
        <!--</ion-item>-->
        <!--<ion-list radio-group [(ngModel)]="pjf"  (ionChange)="changeJf(jf, pjf)" class="onlyone">-->
          <!--<ion-item *ngFor="let option of jfList" no-lines no-padding no-margin no-border>-->
            <!--<ion-label>-->
              <!--<ion-icon class="fal fa-circle font-large-x" *ngIf="option.val != pjf"-->
              <!--&gt;</ion-icon>-->
              <!--<ion-icon class="fal fa-dot-circle font-large-x" *ngIf="option.val == pjf"-->
              <!--&gt;</ion-icon>-->
              <!--{{option.nm}}</ion-label>-->
            <!--<ion-radio [value]="option.val" class="noshow"></ion-radio>-->
          <!--</ion-item>-->
        <!--</ion-list>-->
      </ion-list>
      
      <ion-list>
        <ion-list-header>
          <ion-label>消息</ion-label>
        </ion-list-header>
        <!--<ion-item no-lines no-padding no-margin no-border>-->
          <!--<ion-label>打开消息提醒(待定)</ion-label>-->
          <!--<ion-toggle [(ngModel)]="bt" (ionChange)="save(t, bt)"></ion-toggle>-->
        <!--</ion-item>-->
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>消息提醒</ion-label>
          <ion-toggle [(ngModel)]="pclosevoice" (ionChange)="save(closevoice, pclosevoice)"></ion-toggle>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>简单播报</ion-label>
          <ion-toggle [(ngModel)]="psimplevoice" (ionChange)="save(simplevoice, psimplevoice)"></ion-toggle>
        </ion-item>
        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>合并播报</ion-label>
          <ion-toggle [(ngModel)]="pcombinevoice" (ionChange)="save(combinevoice, pcombinevoice)"></ion-toggle>
        </ion-item>
      </ion-list>
      
      <ion-list>
        <ion-list-header>
          <ion-label>主题风格</ion-label>
        </ion-list-header>

        <ion-item no-lines no-padding no-margin no-border>
          <div item-content radio-group class="themeselect" (ionChange)="changetheme(theme)" [(ngModel)]="theme.value">
            <div class="waper" ion-item no-border [class.themen-select] = "theme.value == 'black-theme'">
              <ion-radio value="black-theme"  class="noshow" no-margin [disabled]="false"></ion-radio>
              <ion-label><img src="./assets/imgs/black.png"></ion-label>
            </div>
            <div class="waper" ion-item no-border  [class.themen-select] = "theme.value == 'white-theme'">
              <ion-radio  value="white-theme"  class="noshow"  no-margin [disabled]="false"></ion-radio>
              <ion-label><img src="./assets/imgs/white.png"></ion-label>
            </div>
          </div>
        </ion-item>

        <ion-item no-lines no-padding no-margin no-border>
          <ion-label>操作反馈</ion-label>
          <ion-toggle [(ngModel)]="bz" (ionChange)="save(z, bz)"></ion-toggle>
        </ion-item>

        <ion-item no-lines no-padding no-margin no-border [attr.detail-push]="lfsloading? null : ''"
                  [attr.detail-none]="lfsloading? '' : null" (click)="resfriend()">
          <ion-label>联系人刷新</ion-label>
          <ion-note *ngIf="!lfsloading" item-end>{{localfriends}}</ion-note>
          <ion-spinner *ngIf="lfsloading" icon="circles" item-end></ion-spinner>
        </ion-item>
        
        <ion-item no-lines no-padding no-margin no-border detail-push (click)="gotodjhsetting()">
          <ion-label>默认日历</ion-label>
          <ion-note item-end>{{sdjhn}}</ion-note>
        </ion-item>

        <ion-item no-lines no-padding no-margin no-border (click)="gotodjhsetting()">
          <ion-label>自动加到重要</ion-label>
          <ion-toggle [(ngModel)]="bautotodo" (ionChange)="save(autotodo, bautotodo)"></ion-toggle>
        </ion-item>
      </ion-list>




      <!--<ion-list>-->
      <!--<ion-list-header>-->
      <!--<ion-label>智能提醒</ion-label>-->
      <!--</ion-list-header>-->

      <!--<ion-item no-lines no-padding no-margin no-border>-->
      <!--<ion-label>每日简报</ion-label>-->
      <!--<ion-note item-end (click)="gotodrsetting()">{{bdr ? sdrp1 : '关闭'}}</ion-note>-->
      <!--</ion-item>-->
      <!--<ion-item no-lines no-padding no-margin no-border detail-push (click)="gotopjfollowsetting()">-->
      <!--<ion-label>项目跟进</ion-label>-->
      <!--<ion-note item-end *ngIf="!spfon">打开</ion-note>-->
      <!--<ion-note item-end *ngIf="spfon" class="inline-icons">-->
      <!--<ion-icon *ngIf="spfon && github" ios="logo-github" md="logo-github"></ion-icon>-->
      <!--&lt;!&ndash; Travis CI设置选项隐藏 &ndash;&gt;-->
      <!--&lt;!&ndash;-->
      <!--<img *ngIf="spfon && travisci" src="assets/imgs/travisci/travisci-worker-logo.svg">-->
      <!--&ndash;&gt;-->
      <!--<ion-icon *ngIf="spfon && firim" ios="logo-dropbox" md="logo-dropbox"></ion-icon>-->
      <!--</ion-note>-->
      <!--</ion-item>-->
      <!--</ion-list>-->
      
    </page-box>


  `,
})
export class SsPage {


  buttons: any = {
    cancel: true
  };

  jfList : Array<any> = [
    { val : "1",
      nm:"按压"
      },
    { val : "2",
      nm:"动画"
    }];


  h: Setting;        //唤醒
  t: Setting;        //新消息提醒
  b: Setting;        //语音播报
  z: Setting;        //振动

  closevoice:Setting; //关闭消息
  simplevoice:Setting; //简单播报
  combinevoice:Setting;//合并播报

  autolisten:Setting;//自动开启听筒
  simpleprompt:Setting;//简单向导提示
  jf:Setting;//交互方式


  pclosevoice: boolean ;   //关闭消息 页面显示和修改
  psimplevoice: boolean;       //简单播报 页面显示和修改
  pcombinevoice: boolean; //合并播报 页面显示和修改

  pautolisten:boolean;//自动开启听筒 页面显示和修改
  psimpleprompt:boolean;//简单向导提示 页面显示和修改
  pjf:string;//交互方式 页面显示和修改

  autotodo: Setting;        //自动加入todo

  dr: Setting;       //每日简报 智能提醒
  drp1: Setting;     //每日简报 提醒时间
  djh: Setting;      //日历 缺省日历
  sfirim: Setting;
  sgithub: Setting;
  stravisci: Setting;
  theme: Setting = UserConfig.settins.get(DataConfig.SYS_THEME);

  bh: boolean;       //唤醒 页面显示和修改
  bt: boolean;       //新消息提醒 页面显示和修改
  bb: boolean;       //语音播报 页面显示和修改
  bz: boolean;       //振动 页面显示和修改
  bdr: boolean;      //每日简报 页面显示和修改
  bautotodo: boolean;        //自动加入todo

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

  isinit : boolean = false;

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public ssService: SsService,
              private plService: PlService,
              private _renderer: Renderer2,
              private settings: SettingsProvider,) {


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

    this.getData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
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

  changeJf(setting, value) {

    let set: PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type;//偏好设置key
    set.yv = value;//偏好设置value

    this.ssService.save(set);
  }

  // //智能提醒 每日简报设置
  // gotodrsetting() {
  //   let modal = this.modalController.create(DataConfig.PAGE._DR_PAGE);
  //   modal.onDidDismiss((data) => {
  //     this.getData();
  //
  //     this.ssService.putDailySummary(
  //       UserConfig.account.id,
  //       moment('2019/6/3 ' + this.sdrp1 + ':00').unix() * 1000,
  //       this.bdr
  //     );
  //   });
  //   modal.present();
  // }

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

  // gotopjfollowsetting() {
  //   let modal = this.modalController.create(DataConfig.PAGE._FO_PAGE);
  //   modal.onDidDismiss((data) => {
  //     if (data) {
  //       if (data.github) {
  //         this.sgithub = data.github;
  //         this.github = data.github.value == "1" ? true : false;
  //       }
  //       if (data.travisci) {
  //         this.stravisci = data.travisci;
  //         this.travisci = data.travisci.value == "1" ? true : false;
  //       }
  //       if (data.firim) {
  //         this.sfirim = data.firim;
  //         this.firim = data.firim.value == "1" ? true : false;
  //       }
  //
  //       if (this.github || this.firim || this.travisci) {
  //         this.spfon = true;
  //       } else {
  //         this.spfon = false;
  //       }
  //     }
  //   });
  //   modal.present();
  // }

  private async getData() {

    this.closevoice = UserConfig.settins.get(DataConfig.SYS_CLV);
    this.simplevoice = UserConfig.settins.get(DataConfig.SYS_SIV);
    this.combinevoice = UserConfig.settins.get(DataConfig.SYS_CBV);

    this.autolisten = UserConfig.settins.get(DataConfig.SYS_ALIS);
    this.simpleprompt = UserConfig.settins.get(DataConfig.SYS_SIP);
    this.jf = UserConfig.settins.get(DataConfig.SYS_JF);

    this.h = UserConfig.settins.get(DataConfig.SYS_H);
    this.t = UserConfig.settins.get(DataConfig.SYS_T);
    this.b = UserConfig.settins.get(DataConfig.SYS_B);
    this.z = UserConfig.settins.get(DataConfig.SYS_Z);
    this.dr = UserConfig.settins.get(DataConfig.SYS_DR);
    this.drp1 = UserConfig.settins.get(DataConfig.SYS_DRP1);
    this.djh = UserConfig.settins.get(DataConfig.SYS_DJH);
    this.theme = UserConfig.settins.get(DataConfig.SYS_THEME);
    this.autotodo = UserConfig.settins.get(DataConfig.SYS_AUTOTODO);

    this.pclosevoice = (this.closevoice.value == "1") ? true : false;
    this.psimplevoice = (this.simplevoice.value == "1") ? true : false;
    this.pcombinevoice = (this.combinevoice.value == "1") ? true : false;

    this.pautolisten = (this.autolisten.value == "1") ? true : false;
    this.psimpleprompt = (this.simpleprompt.value == "1") ? true : false;
    this.pjf = this.jf.value;

    this.bh = (this.h.value == "1") ? true : false;
    this.bt = (this.t.value == "1") ? true : false;
    this.bb = (this.b.value == "1") ? true : false;
    this.bz = (this.z.value == "1") ? true : false;
    this.bdr = (this.dr.value == "1") ? true : false;
    this.bautotodo = (this.autotodo.value == "1") ? true : false;
    this.sdrp1 = (this.drp1 && this.drp1.value) ? this.drp1.value : "08:30";
    this.sdjh = this.djh.value;
    this.sdjho = await this.plService.getJh(this.sdjh);

    if (this.sdjho)
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

  changetheme(setting) {

    if (setting){
      let set: PageY = new PageY();
      set.yi = setting.yi;//偏好主键ID
      set.ytn = setting.bname; //偏好设置类型名称
      set.yt = setting.typeB; //偏好设置类型
      set.yn = setting.name;//偏好设置名称
      set.yk = setting.type;//偏好设置key
      set.yv = setting.value;//偏好设置value

      this.ssService.save(set);
      this.settings.setActiveTheme( set.yv);
    }

  }
}
