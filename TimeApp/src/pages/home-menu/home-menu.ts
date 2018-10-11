import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomeMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-menu',
  templateUrl: 'home-menu.html',
  providers: []
})
export class HomeMenuPage {

  menuPage: any = 'HomePage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuPage');
  }


  userSet() {
    console.log("跳转设置页");
    this.navCtrl.push("UserSetPage");
  }
}
