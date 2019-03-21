import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ToastController} from 'ionic-angular';
import {LpService, PageLpData} from "./lp.service";

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
  template:
  `
  <ion-content>
    <h1>账号登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input type="tel" placeholder="开始输入账号" [(ngModel)]="lpData.mobile" class="login-tel"></ion-input>
        </div>
        <div class="login-enter">
          <button ion-fab color="success" (click)="signIn()"><ion-icon name="arrow-forward"></ion-icon></button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input type="password" placeholder="输入密码" [(ngModel)]="lpData.password" class="login-pwd"></ion-input>
        </div>
      </ion-row>
    </ion-grid>

    <div class="login-div">忘记密码?</div>
    <div class="login-div" (click)="toLs()">改为用短信登录</div>
    <div class="login-div" (click)="toR()">没有账号，立即注册</div>

    <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
  </ion-content>`
})
export class LpPage {
  lpData:PageLpData = new PageLpData();

  errorCode:any;  //判断输入手机号是否符合规范

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lpService: LpService,) {
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

  userAgreement() {
    this.navCtrl.push('PPage');
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
