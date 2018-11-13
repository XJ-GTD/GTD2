import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {UtilService} from "../../service/util.service";
import {SqliteService} from "../../service/sqlite.service";
import { ParamsService } from "../../service/params.service";
import {UserModel} from "../../model/user.model";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  slides = [
    {
      title: "Welcome to the GTD2!",
      description: "这 <b>是一个引导页</b> ！",
      image: "../../assets/imgs/welcome.jpg",
    }
  ];

  constructor(public navCtrl: NavController,
              public util: UtilService,
              private loadingCtrl: LoadingController,
              private sqliteService: SqliteService,
              private paramsService: ParamsService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  goToLogin() {
    this.navCtrl.setRoot('UserLoginPage');
  }

  /**
   * 游客身份登录 dch
   */
  visitor(){
    let loader = this.loadingCtrl.create({
      content: "正在加载...",
      duration: 1000
    });
    this.sqliteService.userIsExist('').then(data=>{
      if(data && data.rows&& data.rows.length>0){
        this.paramsService.user = data.rows.item(0);
        loader.present();
        this.navCtrl.setRoot('HomePage');
      }else{
        let uuid = this.util.getUuid();
        this.sqliteService.executeSql('INSERT INTO GTD_USER(userId,UserType) VALUES (?,?)',[uuid,0])
          .then(data=>{
            let userInfo:UserModel = new UserModel();
            userInfo.userId=uuid;
            this.paramsService.user = userInfo;
            loader.present();
            this.navCtrl.setRoot('HomePage');
          }).catch(e=>{
          console.log(e)
        })

      }
    }).catch(e=>{
      console.log(e);
    })


  }

}
