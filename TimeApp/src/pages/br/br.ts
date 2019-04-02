import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {BrService} from "./br.service";

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

            <ion-item class="plan-list-item" (click)="recover()">
              <ion-label>恢复</ion-label>
            </ion-item>

          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class BrPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private brService:BrService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  backup(){
    this.brService.backup().then(data=>{
      console.log(("备份完成"));
    })

  }

  recover(){
    this.brService.getLastDt().then(data=>{

      this.brService.recover(Number(data.data.bts)).then(data=>{
        console.log(("recover 恢复成功"));
      })

    })
  }

}
