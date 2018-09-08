import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
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

  data: any;
  user: any;
  accountName: string;
  accountPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLoginPage');
  }

  signIn() {
    this.http.post(AppConfig.USER_LOGIN_URL, {
      // accountName: this.accountName,
      // accountPassword: this.accountPassword,
      accountName: "admin",
      accountPassword: "admin",
      loginType: 0

    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log( this.data);
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1000
        });
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: this.data.message,
          buttons:['确定']
        });

        if (this.data.code == "0") {
          this.paramsService.user = this.data.data.userInfo;
          // loginMessage.present(loginMessage.setMessage(this.data.message));

          loader.present();
          this.navCtrl.push('HomePage');
        } else {
          alert.present();
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
