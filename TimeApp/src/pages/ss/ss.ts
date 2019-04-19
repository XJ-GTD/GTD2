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
              <ion-label>系统设置</ion-label>
            </ion-list-header>
            
            <ion-item class="plan-list-item" >
              <ion-label>语音唤醒</ion-label>
              <ion-toggle [(ngModel)]="h.value" (ionChange)="save(h)"></ion-toggle>
            </ion-item>

            <ion-item class="plan-list-item" >
              <ion-label>语音播报</ion-label>
              <ion-toggle [(ngModel)]="b.value" (ionChange)="save(b)"></ion-toggle>
            </ion-item>

            <ion-item class="plan-list-item" >
              <ion-label>振动</ion-label>
              <ion-toggle [(ngModel)]="z.value" (ionChange)="save(z)"></ion-toggle>
            </ion-item>

            <ion-item class="plan-list-item" >
              <ion-label>新消息提醒</ion-label>
              <ion-toggle [(ngModel)]="t.value" (ionChange)="save(t)"></ion-toggle>
            </ion-item>

            <ion-list-header>
              <ion-label>其他</ion-label>
            </ion-list-header>
            <ion-item class="plan-list-item" >
              <ion-label>刷新朋友</ion-label>
              <button ion-button clear item-end  (click)="resfriend()">
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
  @ViewChild("resfri")
  resfri:ElementRef;

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

    this.h.value = this.h.value == "1" || this.h.value=="true" ? "true":"false";
    this.t.value = this.t.value == "1" || this.t.value=="true" ? "true":"false";
    this.b.value = this.b.value == "1" || this.b.value=="true" ? "true":"false";
    this.z.value = this.z.value == "1" || this.z.value=="true" ? "true":"false";
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(setting){

    let set:PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type ;//偏好设置key
    set.yv = setting.value ? "1":"0";//偏好设置value

    this.ssService.save(set);
  }

  resfriend(){
    this._renderer.addClass(this.resfri.nativeElement,"spinanimation");

    this.ssService.resfriend().then(d=>{
      this._renderer.removeClass(this.resfri.nativeElement,"spinanimation");
    })
  }
}

