import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FdService} from "./fd.service";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 参与人详情 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fd',
  template:  `<ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="dismiss()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
        </button>
      </ion-buttons>
      <ion-title>参与人详情</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid  style="text-align:center; height: 100%;">
      <ion-row>
        <ion-avatar item-start style="width: 100%;">
          <img  style="border-radius: 50%;width: 80px;height: 80px;display: unset;"
           [src]="fd.hiu">
        </ion-avatar>
      </ion-row>
      <ion-row>
        <ion-label>
          {{fd.rn}}
        </ion-label>
      </ion-row>
      <ion-row>
        <ion-label>
          {{fd.rc}}
        </ion-label>
      </ion-row>
      <ion-buttons  style="border-top: 1px solid #871428;">
        <button ion-button  *ngIf="fd.isbla" icon-only (click)="rbl()">
          移出黑名单
        </button>
        <button ion-button  *ngIf="!fd.isbla" icon-only (click)="abl()">
          移入黑名单
        </button>
      </ion-buttons>
    </ion-grid>
    
  </ion-content>`,
})
export class FdPage {
  fd:FsData = new FsData();
  pwi:string;
  constructor(public navCtrl: NavController,
              public fdService: FdService,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FdPage');
    this.pwi = this.navParams.get('pwi');
    this.fd.hiu = DataConfig.HUIBASE64;
    this.getd();
  }

  getd(){
    this.fdService.get(this.pwi).then(data=>{
      if(data){
        this.fd = data;
      }
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * 移除黑名单
   */
  rbl(){
    this.fdService.removeBlack(this.fd.rc).then(data=>{
      if(data && data.code == 0){
        this.getd();
        alert("移出成功")
      }
    })
  }

  /**
   * 移入黑名单
   */
  abl(){
    this.fdService.putBlack(this.fd).then(data=>{
      if(data && data.code == 0){
        this.getd();
        alert("移入成功")
      }
    })
  }
}
