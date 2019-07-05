import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
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
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>设置</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
          <ion-list no-lines>
            <ion-list-header>
              <ion-label>新消息</ion-label>
            </ion-list-header>

            <ion-item class="plan-list-item" >
              <ion-label>新消息提醒</ion-label>
              <ion-toggle [(ngModel)]="bt" (ionChange)="save(t, bt)"></ion-toggle>
            </ion-item>

            <ion-list-header>
              <ion-label>语音</ion-label>
            </ion-list-header>

            <ion-item class="plan-list-item" >
              <ion-label>语音唤醒</ion-label>
              <ion-toggle [(ngModel)]="bh" (ionChange)="save(h, bh)"></ion-toggle>
            </ion-item>

            <ion-item class="plan-list-item" >
              <ion-label>语音播报</ion-label>
              <ion-toggle [(ngModel)]="bb" (ionChange)="save(b, bb)"></ion-toggle>
            </ion-item>

            <ion-item class="plan-list-item" >
              <ion-label>震动音效</ion-label>
              <ion-toggle [(ngModel)]="bz" (ionChange)="save(z, bz)"></ion-toggle>
            </ion-item>

            <ion-list-header>
              <ion-label>联系人</ion-label>
            </ion-list-header>

            <button ion-item class="plan-list-item" [attr.detail-push]="lfsloading? null : ''" [attr.detail-none]="lfsloading? '' : null" (click)="resfriend()">
              <ion-label>本地联系人</ion-label>
              <ion-note *ngIf="!lfsloading" item-end>{{localfriends}}</ion-note>
              <ion-spinner *ngIf="lfsloading" icon="circles" item-end></ion-spinner>
            </button>

            <ion-list-header>
              <ion-label>智能提醒</ion-label>
            </ion-list-header>

            <button ion-item class="plan-list-item" detail-push (click)="gotodrsetting()">
              <ion-label>每日简报</ion-label>
              <ion-note item-end>{{bdr? sdrp1 : '关闭'}}</ion-note>
            </button>

            <ion-list-header>
              <ion-label>日历</ion-label>
            </ion-list-header>

            <button ion-item class="plan-list-item" detail-push (click)="gotodjhsetting()">
              <ion-label>缺省日历</ion-label>
              <ion-note item-end>{{sdjhn}}</ion-note>
            </button>
          </ion-list>
    </ion-content>
  `,
})
export class SsPage {

  h:Setting;        //唤醒
  t:Setting;        //新消息提醒
  b:Setting;        //语音播报
  z:Setting;        //振动
  dr:Setting;       //每日简报 智能提醒
  drp1:Setting;     //每日简报 提醒时间
  djh:Setting;      //日历 缺省日历

  bh:boolean;       //唤醒 页面显示和修改
  bt:boolean;       //新消息提醒 页面显示和修改
  bb:boolean;       //语音播报 页面显示和修改
  bz:boolean;       //振动 页面显示和修改
  bdr:boolean;      //每日简报 页面显示和修改
  sdrp1:string;     //每日简报 提醒时间
  sdjhn:string;     //日历 缺省日历名称
  sdjh:string;      //日历 缺省日历

  lfsloading: boolean = false;  //导入本地联系人处理状态
  localfriends: number = 0;     //本地联系人导入数

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public ssService: SsService,
              private plService: PlService,
              private _renderer: Renderer2) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');

    this.getData();
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(setting, value){

    let set:PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type ;//偏好设置key
    set.yv = (value) ? "1":"0";//偏好设置value

    this.ssService.save(set);
  }

  //智能提醒 每日简报设置
  gotodrsetting() {
    let modal = this.modalController.create(DataConfig.PAGE._DR_PAGE);
    modal.onDidDismiss((data)=>{
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
    let modal = this.modalController.create(DataConfig.PAGE._JH_PAGE);
    modal.onDidDismiss((data)=>{
      this.bdjhn = data.jn;
      this.bdjh = data.ji;

      this.djh.value = data.ji;

      let set:PageY = new PageY();
      set.yi = this.djh.yi;//偏好主键ID
      set.ytn = this.djh.bname; //偏好设置类型名称
      set.yt = this.djh.typeB; //偏好设置类型
      set.yn = this.djh.name;//偏好设置名称
      set.yk = this.djh.type ;//偏好设置key
      set.yv = data.ji;//偏好设置value

      this.ssService.save(set);
    });
    modal.present();
  }

  private getData() {
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
    this.sdjhn = this.plService.getJh(this.sdjh, 'jn');

    this.localfriends = UserConfig.friends? UserConfig.friends.length : 0;
  }

  //刷新本地联系人
  resfriend(){
    this.lfsloading = true;

    this.ssService.resfriend().then(d=>{
      this.lfsloading = false;
    })
  }
}
