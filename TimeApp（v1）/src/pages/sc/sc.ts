import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ScPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sc',
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>Sc</ion-title>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '</ion-content>',
})
export class ScPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScPage');
  }

}
