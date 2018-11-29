import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserModel} from "../../model/user.model";
import {ParamsService} from "../../service/util-service/params.service";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";

/**
 * Generated class for the UcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-uc',
  templateUrl: 'uc.html',
  providers: []
})
export class UcPage {

  data: any;
  user: UserModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
  }

  init() {

    this.user = new UserModel();
    this.user = this.paramsService.user;
    this.user.birthday = this.user.birthday.replace(" 00:00", "");
  }

  updateUserInfo() {

    // this.http.post(AppConfig.USER_UPDATE_INFO_URL, this.user, AppConfig.HEADER_OPTIONS_JSON)
    //   .subscribe(data => {
    //     this.data = data;
    //     console.log("userInfo data：" + this.data.data);
    //
    //     let loader = this.loadingCtrl.create({
    //       content: this.data.message,
    //       duration: 1000
    //     });
    //
    //     if (this.data.code == 0) {
    //       this.paramsService.user = this.data.data.userInfo;
    //       this.user = this.data.userInfo;
    //       this.user.birthday = this.user.birthday.replace("T00:00Z", "");
    //       loader.present();
    //     } else if (this.data.code == 1) {
    //       console.log("更新请求失败");
    //       loader.present();
    //     }
    //   });
  }

  relation() {
    console.log("跳转relationPage");
    this.navCtrl.push("UserRelationPage");
  }
}
