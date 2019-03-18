import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController} from 'ionic-angular';
import {PagePcPro, PcService} from "./pc.service";

/**
 * Generated class for the 计划新建 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  template:
    `<ion-header no-border>
  <ion-toolbar>
    <ion-buttons left>
      <button ion-button icon-only (click)="goBack()" color="danger">
        <ion-icon name="arrow-back"></ion-icon>
      </button>
    </ion-buttons>

    <ion-buttons right>
      <button ion-button color="danger" (click)="save()">
        保存
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content padding>
<ion-grid>
  <ion-row justify-content-center>
    <div class="name-input w-auto">
    <ion-input type="text" placeholder="输入计划名称" [(ngModel)]="jhData.jn" text-center></ion-input>
    </div>
  </ion-row>
  <ion-row>
    <ion-list no-lines radio-group>
      <ion-list-header class="plan-list-item">
        选择颜色
      </ion-list-header>

      <ion-item class="plan-list-item">
      <div class="color-dot color-blue" item-start></div>
        <ion-label>
        牛皮棕
        </ion-label>
        <ion-radio checked="true" value="go"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
      <div class="color-dot color-pink" item-start></div>
        <ion-label>
        向日葵黄
        </ion-label>
        <ion-radio value="rust"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
      <div class="color-dot color-blue" item-start></div>
        <ion-label>
        橙黄
        </ion-label>
        <ion-radio value="python"></ion-radio>
      </ion-item>
    </ion-list>
  </ion-row>
</ion-grid>
</ion-content>`,
})
export class PcPage {
  jhData:PagePcPro = new PagePcPro;

  constructor(private navCtrl: NavController,
              private pcService:PcService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
  }

  goBack() {
    this.navCtrl.pop();
  }


  save(){
    console.log("计划添加 :: " + this.jhData.jn +"--"+ this.jhData.jg +"--color:"+this.jhData.jc);

    // this.jhService.ajh(this.jhmc,this.jhms).then(data=>{
    //   console.log("计划添加成功 :: " + JSON.stringify(data));
    //   this.navCtrl.pop();
    // }).catch(reason => {
    //   console.log("计划添加失败 :: " + JSON.stringify(reason));
    // })
  }
}
