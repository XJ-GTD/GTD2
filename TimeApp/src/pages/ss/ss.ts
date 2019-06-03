import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {SsService} from "./ss.service";
import {PageY} from "../../data.mapping";

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
              <ion-label>新消息</ion-label>
            </ion-list-header>

            <ion-item class="plan-list-item" >
              <ion-label>新消息提醒</ion-label>
              <ion-toggle [(ngModel)]="bt" (ionChange)="save(t, bt)"></ion-toggle>
            </ion-item>

            <ion-list-header>
              <ion-label>联系人</ion-label>
            </ion-list-header>

            <button ion-item class="plan-list-item" [attr.detail-none]="!lfsloading" [attr.detail-push]="lfsloading" (click)="resfriend()">
              <ion-label>本地联系人</ion-label>
              <ion-note *ngIf="!lfsloading" item-end>{{localfriends}}</ion-note>
              <ion-spinner *ngIf="lfsloading" icon="circles" item-end></ion-spinner>
            </button>

            <ion-item class="plan-list-item" >
              <ion-label>本地联系人</ion-label>
              <button ion-button clear item-end >
                <div #resfri>
                  <img class="img-content-refresh" src="./assets/imgs/sx.png" />
                </div>
              </button>
            </ion-item>
          </ion-list>
    </ion-content>
  `,
})
export class SsPage {

  h:Setting; //唤醒
  t:Setting;//新消息提醒
  b:Setting;//语音播报
  z:Setting;//振动
  bh:boolean;//唤醒 页面显示和修改
  bt:boolean;//新消息提醒 页面显示和修改
  bb:boolean;//语音播报 页面显示和修改
  bz:boolean;//振动 页面显示和修改
  lfsloading: boolean = false;
  localfriends: number = 0;

  constructor(private navCtrl: NavController,
              public ssService:SsService,
              private _renderer: Renderer2 ) {
    this.h = UserConfig.settins.get(DataConfig.SYS_H);
    this.t = UserConfig.settins.get(DataConfig.SYS_T);
    this.b = UserConfig.settins.get(DataConfig.SYS_B);
    this.z = UserConfig.settins.get(DataConfig.SYS_Z);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');

    this.bh = (this.h.value == "1") ? true : false;
    this.bt = (this.t.value == "1") ? true : false;
    this.bb = (this.b.value == "1") ? true : false;
    this.bz = (this.z.value == "1") ? true : false;

    this.localfriends = UserConfig.friends? UserConfig.friends.length : 0;
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

  resfriend(){
    this.lfsloading = true;

    this.ssService.resfriend().then(d=>{
      this.lfsloading = true;
    })
  }
}
