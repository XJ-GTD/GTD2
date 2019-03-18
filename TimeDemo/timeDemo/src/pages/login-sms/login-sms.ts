import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPasswordPage } from '../login-password/login-password';

/**
 * Generated class for the LoginSmsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-sms',
  templateUrl: 'login-sms.html',
})
export class LoginSmsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginSmsPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  openLoginPasswordPage(item) {
    this.navCtrl.push(LoginPasswordPage, { item: item });
  }

}
