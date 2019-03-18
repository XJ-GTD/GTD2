import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {LpService, PageLpData} from "./lp.service";
import {DataConfig} from "../../service/config/data.config";
import {LsService, PageLsData} from "../ls/ls.service";
import * as Util from "util";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 登陆（密码） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lp',
  providers: [],
  template:` 

    
  <ion-content>
    <h1>账号登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input type="tel" placeholder="输入手机号码" [(ngModel)]="lpData.mobile"></ion-input>
        </div>
        <div style="margin-right: 30px;">
          <button ion-fab color="success" (click)="signIn()"><ion-icon name="arrow-forward"></ion-icon></button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input type="password" placeholder="输入密码" [(ngModel)]="lpData.password"></ion-input>
        </div>
      </ion-row>
    </ion-grid>

    <button ion-button clear color="dark" (click)="toLs()" class="no-padding no-margin-lr">改为用手机短信登录</button>

    <p class="text-agreement"> <a class="text-anchor" href="#" (click)="toR()">创建帐户</a>即表示您同意我们的 <a class="text-anchor" href="">服务条款</a> 和 <a class="text-anchor" href="">隐私政策</a> 。</p>
  </ion-content>`
})
export class LpPage {
  lpData:PageLpData = new PageLpData();

  errorCode:any;  //判断输入手机号是否符合规范

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lpService: LpService,
  private utilService:UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LpPage');
  }

  title(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
    return;
  }

  alert(message){
    let alert = this.alertCtrl.create({
      title:'提示信息',
      subTitle: message,
      buttons:['确定']
    });
    alert.present();
  }

  signIn() {

    this.lpData.mobile = this.lpService.remo(this.lpData.mobile);

    if(this.lpData.mobile == undefined || this.lpData.mobile == "" ){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.lpService.checkPhone(this.lpData.mobile ) == 3){ //验证手机号是否符合规范

      if (this.lpData.password == null || this.lpData.password == "" || this.lpData.password == undefined){     //判断密码是否为空
        this.title("密码不能为空");
      } else{
        console.log("登录按钮被点击");
        this.lpService.login(this.lpData).then(data=> {
          if (data.code != 0)
            throw  data;

          console.log("手机密码登录成功"+ JSON.stringify(data));
          this.navCtrl.setRoot('MPage');
        }).catch(res=>{
          console.log(res);
          this.alert(res.message);
        });
      }
    }else {
      this.title("请输入正确11位手机号");
    }
  }


  toR() {
    console.log('LpPage跳转RPage');
    this.navCtrl.push('RPage');
  }

  toLs() {
    console.log('LpPage跳转lsPage');
    this.navCtrl.push('LsPage');
  }
}
