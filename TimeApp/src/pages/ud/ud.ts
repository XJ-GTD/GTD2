import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {LsmService} from "../../service/lsm.service";
import {UtilService} from "../../service/util-service/util.service";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the UdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ud',
  templateUrl: 'ud.html',
})
export class UdPage {

  accountMobile:any;
  authCode:any;
  errorCode:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public lsmService: LsmService,
              public alertCtrl: AlertController,
              public utilService: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UdPage');
  }

  signIn() {
    this.lsmService.ml(this.accountMobile, this.authCode).then(data=> {
      console.log(data)
      if (data.code == 0) {
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: data.message,
          buttons: [{
            text: '确定', role: 'cancel', handler: () => {
              //跳转首页
              this.navCtrl.setRoot('HzPage');
            }
          }]
        });
        alert.present();
      }else{
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: data.message,
          buttons:["确定"]
        });
        alert.present();
      }

    }).catch(res=>{
      let alert = this.alertCtrl.create({
        title:'提示信息',
        subTitle: res.message,
        buttons:["确定"]
      });
      alert.present();
      console.log(res);
    });

  }

  checkPhone(){

    this.errorCode = this.utilService.checkPhone(this.accountMobile);
    // if(this.errorCode == 0){
    //   this.checkMoblieNull = true;
    // }
    // if(this.errorCode == 1 || this.errorCode == 2){
    //   this.checkMoblieNull = false;
    //   this.checkMoblie = true;
    // }
    // if(this.errorCode == 3){
    //   this.checkMoblie = false;
    //   this.checkMoblieNull = false;
    // }

  }

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
