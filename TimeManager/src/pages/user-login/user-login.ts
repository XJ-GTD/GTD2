import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { User } from "../../model/user.model";
import { ParamsService } from "../../service/params.service";

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

  user: any = new User();
  accountMobile: string;
  accountPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    /*public loadingCtrl: LoadingController,*/
    private http: HttpClient,
    public toastCtrl: ToastController,
    private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
  }

  signIn() {

    /*let loader = this.loadingCtrl.create({
      content: "登陆中...",
      duration: 1500
    });
    loader.present();*/
    let loginMessage = this.toastCtrl.create({
      message: "",
      duration: 3000,
      position: "middle"
    });

    this.http.post(AppConfig.USER_LOGIN_URL, {
      accountMobile: this.accountMobile,
      accountPassword: this.accountPassword
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        this.user = data;

        if (this.user.code == "0") {
          this.paramsService.data = this.user.data.userInfo;
          loginMessage.present(loginMessage.setMessage(this.user.message));
          this.navCtrl.push('HomeMenuPage');
        } else {
          loginMessage.present(loginMessage.setMessage(this.user.message));
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
