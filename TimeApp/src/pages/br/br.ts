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
              <ion-label>恢复</ion-label>
            </ion-item>

          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class BrPage {

  bts:any;
  isRecover:any = "none";

  constructor(public navCtrl: NavController,
              private brService:BrService,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrPage');
  }

  ionViewDidEnter(){
    this.brService.getLastDt().then(data=>{
      this.bts = data.data.bts;
      if(this.bts && this.bts!=""){
        this.isRecover = "block";
      }
      console.log("获取页面获取最后更新时间     ："+this.bts);
    }).catch(res=>{
      console.log("获取页面获取最后更新时间失败" + JSON.stringify(res));
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  backup(){
    this.brService.backup().then(data=>{
      this.util.toast("备份完成",1500)
    })
  }

  recover(){
    if(this.isRecover){
      this.brService.recover(Number(this.bts)).then(data=>{
        this.util.toast("恢复成功",1500)
      })
    }
  }

}
