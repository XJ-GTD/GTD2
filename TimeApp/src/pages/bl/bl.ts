import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the 黑名单列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bl',
  template: `
    <ion-header>

      <ion-navbar>
        <ion-title>黑名单</ion-title>
      </ion-navbar>

    </ion-header>


    <ion-content padding>

    </ion-content>
  `
})
export class BlPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlPage');
  }

}
