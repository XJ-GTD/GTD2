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
    <ion-header>

      <ion-navbar>
        <ion-title>备份恢复</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <ion-buttons>
        <button (click)="backup()">备份</button>
        <button>恢复</button>
        
      </ion-buttons>

    </ion-content>
  `,
})
export class BrPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private brService:BrService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrPage');
  }

  backup(){
    this.brService.backup().then(d=>{
      console.log(("备份完成"));
    })

  }

}
