import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/util-service/params.service";
import {BaseSqliteService} from "../../service/sqlite-service/base-sqlite.service";
import { LsmService} from "../../service/lsm.service";
import {BsModel} from "../../model/out/bs.model";
import {HaPage} from "../ha/ha";

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
    private paramsService: ParamsService,
    private lsmService: LsmService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbPage');
  }

  signIn() {

    console.debug("登录按钮被点击");
     this.lsmService.login(this.accountName, this.accountPassword).then(data=> {
       console.log(data);
       if (data.code == 0) {
         console.debug("登录成功");
         let alert = this.alertCtrl.create({
           title: '提示信息',
           subTitle: "登录成功",
           buttons: [{
             text: '确定', role: 'cancel', handler: () => {
               //跳转首页
               console.log('UbPage跳转HzPage');
               this.navCtrl.setRoot('HzPage');
             }
           }]
         });
         alert.present();
       }else{
         console.debug("登录失败");
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: "登录失败",
            buttons:["确定"]
          });
          alert.present();
       }

     }).catch(res=>{
       console.debug("登录失败");
       let alert = this.alertCtrl.create({
         title:'提示信息',
         subTitle: "登录失败",
         buttons:["确定"]
       });
       alert.present();
       console.log(res);
     });

  }

  signUp() {
    console.log('UbPage跳转UaPage');
    this.navCtrl.push('UaPage');
  }

  toUd() {
    console.log('UbPage跳转UdPage');
    this.navCtrl.push('UdPage');
  }
}
