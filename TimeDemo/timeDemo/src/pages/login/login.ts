import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPasswordPage } from '../login-password/login-password';
import { LoginSmsPage } from '../login-sms/login-sms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  openLoginPasswordPage(item) {
    this.navCtrl.push(LoginPasswordPage, { item: item });
  }

  openLoginSmsPage(item) {
    this.navCtrl.push(LoginSmsPage, { item: item });
  }
}
