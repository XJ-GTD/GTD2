import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {Setting, UserConfig} from "../../service/config/user.config";
import {PageY, SsService} from "./ss.service";

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
            <img class="img-header-left" src="../../assets/imgs/fh2.png">
          </button>
        </ion-buttons>
        <ion-title>设置</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
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
          </ion-list>
        </ion-row>
      </ion-grid>

    </ion-content>
  `,
})
export class SsPage {

  h:Setting; //唤醒
  t:Setting;//新消息提醒
  b:Setting;//语音播报
  z:Setting;//振动

  constructor(private navCtrl: NavController,
              public ssService:SsService,) {
    this.h = UserConfig.settins.get("H");
    this.t = UserConfig.settins.get("T");
    this.b = UserConfig.settins.get("B");
    this.z = UserConfig.settins.get("Z");

    /*console.log(this.h.value+"1");
    console.log(this.t.value+"2");
    console.log(this.b.value+"3");
    console.log(this.z.value+"4");*/

    this.h.value = this.h.value == "1" ? "true":"false";
    this.t.value = this.t.value == "1" ? "true":"false";
    this.b.value = this.b.value == "1" ? "true":"false";
    this.z.value = this.z.value == "1" ? "true":"false";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsPage');
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
    set.yv = setting.value == true ? "1":"0";//偏好设置value

    this.ssService.save(set);
  }
}

