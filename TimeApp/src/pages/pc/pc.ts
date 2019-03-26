import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
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
        <img class="img-header-left" src="../../assets/imgs/fh2.png">
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
    <ion-input #input type="text" placeholder="输入计划名称" [(ngModel)]="jhcData.jn" text-center></ion-input>
    </div>
  </ion-row>
  <ion-row>
    <ion-list no-lines radio-group [(ngModel)]="jhcData.jc">
      <ion-list-header class="plan-list-item">
        选择颜色
      </ion-list-header>

      <ion-item class="plan-list-item">
      <div class="color-dot color-palm" item-start></div>
        <ion-label>
        牛皮棕
        </ion-label>
        <ion-radio value="#9B5E4B" checked></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
      <div class="color-dot color-sunflower " item-start></div>
        <ion-label>
        向日葵黄
        </ion-label>
        <ion-radio value="#996A29"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
      <div class="color-dot color-aurantia" item-start></div>
        <ion-label>
        橙黄
        </ion-label>
        <ion-radio value="#CF4425"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-orange" item-start></div>
        <ion-label>
          橙色
        </ion-label>
        <ion-radio value="#AF2B24"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-pink" item-start></div>
        <ion-label>
          粉红色
        </ion-label>
        <ion-radio value="#AD8387"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-lavender" item-start></div>
        <ion-label>
          淡紫
        </ion-label>
        <ion-radio value="#C077DB"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-fuchsia" item-start></div>
        <ion-label>
          亮紫
        </ion-label>
        <ion-radio value="#453B93"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-sky" item-start></div>
        <ion-label>
          天蓝色
        </ion-label>
        <ion-radio value="#51AAF2"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-blue" item-start></div>
        <ion-label>
          深水蓝
        </ion-label>
        <ion-radio value="#3591A5"></ion-radio>
      </ion-item>

      <ion-item class="plan-list-item">
        <div class="color-dot color-daphnite" item-start></div>
        <ion-label>
          氧化铁绿
        </ion-label>
        <ion-radio value="#308158"></ion-radio>
      </ion-item>
      
    </ion-list>
  </ion-row>    
</ion-grid>
</ion-content>`,
})
export class PcPage {

  @ViewChild('input') input ;
  jhcData:PagePcPro = new PagePcPro;

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private pcService:PcService) {
    this.jhcData.jc = "#9B5E4B"; // 默认选中颜色  牛皮棕
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.input.setFocus();//为输入框设置焦点
    },150);
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(){
    if(this.jhcData.jn != "" && this.jhcData.jn != null ){
      if(this.jhcData.jc != "" && this.jhcData.jc != null ){
        this.pcService.savePlan(this.jhcData).then(data=>{
          this.navCtrl.pop();
        }).catch(res=>{
        });
      }else{
        this.alert("计划颜色不能为空");
      }
    }else{
      this.alert("计划名称不能为空");
    }

  }

  alert(message){
    let alert = this.alertCtrl.create({
      title:'',
      subTitle: message,
      buttons:['确定']
    });
    alert.present();
  }
}
