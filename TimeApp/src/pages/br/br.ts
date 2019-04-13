import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {BrService} from "./br.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 备份恢复 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-br',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>
        <ion-title>备份恢复</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            
            <ion-item class="plan-list-item" (click)="backup()">
              <ion-label>备份</ion-label>
            </ion-item>

            <ion-item class="plan-list-item" (click)="recover()" [ngStyle]="{'display': isRecover }">
              <ion-label>恢复  <small>{{bts  * 1000 | date:"yyyy年MM月dd日 HH:mm:ss"}}</small></ion-label> 
            </ion-item>

          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class BrPage {

  bts:any = new Date().getTime()/1000 ;// 最后一次备份日期
  isRecover:any = "none";

  constructor(public navCtrl: NavController,
              private brService:BrService,
              private util: UtilService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrPage');
  }

  ionViewDidEnter(){
    this.getLastDate();
  }

  getLastDate(){
    this.brService.getLastDt().then(data=>{
      this.bts = data.data.bts;
      if(this.bts && this.bts!=''){
        this.isRecover = 'block';
      }
      console.log('获取最后更新时间：'+this.bts);
    }).catch(error=>{
      console.log('获取最后更新时间失败' + JSON.stringify(error));
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  backup(){
    this.util.loadingStart();
    this.brService.backup().then(data=>{
      this.util.popoverStart('备份完成')
      this.getLastDate();
      this.util.loadingEnd();
    }).catch(error=>{
      this.util.popoverStart('备份失败')
      this.util.loadingEnd();
    })

  }

  recover(){
    if(this.isRecover){
      this.util.loadingStart();
      this.brService.recover(Number(this.bts)).then(data=>{
        this.util.popoverStart('恢复成功');
        this.util.loadingEnd();
      }).catch(error=>{
        this.util.popoverStart('恢复失败');
        this.util.loadingEnd();
      })
    }
  }

}
