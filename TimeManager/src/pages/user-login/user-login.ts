import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";

/**
 * Generated class for the UserLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLoginPage {
  accountMobile: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private http: HttpClient) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
  }

  signIn() {

    let loader = this.loadingCtrl.create({
      content: "登陆中...",
      duration: 1500
    });
    loader.present();

    this.http.post(AppConfig.USER_LOGIN_URL, {
      accountMobile: this.accountMobile,
      accountPassword: this.password
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        if (data.code == "0") {
          loader.present(loader.setContent(data.message));
          this.navCtrl.push('HomeMenuPage');
        } else {
          loader.present(loader.setContent(data.message));
        }

      })
  }

}
