import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginSmsPage } from '../login-sms/login-sms';

/**
 * Generated class for the LoginPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-password',
  templateUrl: 'login-password.html',
})
export class LoginPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPasswordPage');
  }
  
  goBack() {
    this.navCtrl.pop();
  }

  openLoginSmsPage(item) {
    this.navCtrl.push(LoginSmsPage, { item: item });
  }
}
