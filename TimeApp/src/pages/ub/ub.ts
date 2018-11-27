import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/util-service/params.service";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";

/**
 * Generated class for the UbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ub',
  templateUrl: 'ub.html',
  providers: []
})
export class UbPage {

  data: any;
  user: any;
  accountName: string;
  accountPassword: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private sqliteService: BaseSqliteService,
    private paramsService: ParamsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbPage');
  }

  signIn() {
    this.http.post(AppConfig.USER_LOGIN_URL, {
      accountName: this.accountName,
      accountPassword: this.accountPassword,
      // accountName: "admin",
      // accountPassword: "admin",
      loginType: 0

    },AppConfig.HEADER_OPTIONS_JSON)
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
          //this.sqliteService.saveOrUpdateUser(this.data.data.userInfo);
          // window.localStorage.setItem('userName', this.paramsService.user.userName);
          // window.localStorage.setItem('userId', this.paramsService.user.userId.toString());
          // window.localStorage.setItem('accountId', this.paramsService.user.accountId.toString());
          // window.localStorage.setItem('accountName', this.paramsService.user.accountName);
          // window.localStorage.setItem('accountMobile', this.paramsService.user.accountMobile);
          // window.localStorage.setItem('accountUuid', this.paramsService.user.accountUuid);
          // window.localStorage.setItem('accountQueue', this.paramsService.user.accountQueue);
          // window.localStorage.setItem('accountQq', this.paramsService.user.accountQq);
          // window.localStorage.setItem('accountWechat', this.paramsService.user.accountWechat);
          // window.localStorage.setItem('headimgUrl', this.paramsService.user.headimgUrl);

          // loginMessage.present(loginMessage.setMessage(this.data.message));

          loader.present();
          this.navCtrl.setRoot('HaPage');
        } else {
          alert.present();
        }

      })
  }

  signUp() {
    this.navCtrl.push('UaPage');
  }

  forgetPassword() {
    this.navCtrl.push('UserForgetPasswordPage');
  }
}
