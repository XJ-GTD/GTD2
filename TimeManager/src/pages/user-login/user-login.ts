import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/params.service";
import {WebsocketService} from "../../service/websocket.service";

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
  providers: []
})
export class UserLoginPage {

  data: any;
  user: any;
  accountMobile: string;
  accountPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private http: HttpClient,
    public toastCtrl: ToastController,
    private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
  }

  signIn() {

    this.http.post(AppConfig.USER_LOGIN_URL, {
      // accountMobile: this.accountMobile,
      // accountPassword: this.accountPassword
      accountMobile: "admin",
      accountPassword: "admin"
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        this.data = data;
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1500
        });

        if (this.data.code == "0") {
          this.paramsService.user = this.data.data.userInfo;
          // loginMessage.present(loginMessage.setMessage(this.data.message));

          loader.present();
          this.navCtrl.push('HomeMenuPage');
        } else {
          loader.present();
        }

      })
  }

  signUp() {
    this.navCtrl.push('UserRegisterPage');
  }

  forgetPassword() {
    this.navCtrl.push('UserForgetPasswordPage');
  }
}
