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
          <ion-input class="login-tel" type="tel" placeholder="开始输入账号" [(ngModel)]="lpData.mobile" (ionBlur)="checkPhone()"></ion-input>
        </div>
        <div class="login-enter">
          <button ion-fab color="success" (click)="signIn()" [ngClass]="{'show': inputBoolean == false , 'show-true': inputBoolean == true}">
            <img class="img-content-enter" src="../../assets/imgs/xyb.png">
          </button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-pwd" type="password" placeholder="输入密码" [(ngModel)]="lpData.password" (ionBlur)="checkPwd()"></ion-input>
        </div>
      </ion-row>
    </ion-grid>
    
    <div class="login-div" (click)="toLs()">改为用短信登录</div>
    <div class="login-div" (click)="toR()">没有账号，立即注册</div>

    <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
  </ion-content>`
})
export class LpPage {

  lpData:PageLpData = new PageLpData();
  errorPhone:number = 0; // 0：初始化（输入为空） 1：手机号长度小于11位 2：手机号格式错误 3：手机号正确
  errorPwd:number = 0; // 0：初始化；1：密码输入
  inputBoolean:boolean = false;  // false： show ; true show-true

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lpService: LpService,) {
    console.log('ionViewDidLoad LpPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  toR() {
    this.navCtrl.push('RPage');
  }

  toLs() {
    this.navCtrl.push('LsPage');
  }

  title(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
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
    if(this.errorPhone == 0){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.errorPhone == 1){
      this.title("手机号长度小于11位");
    }else if(this.errorPhone == 2){
      this.title("手机号格式错误");
    }else if(this.errorPwd == 0){ //判断密码是否为空
      this.title("密码不能为空");
    }else {
      console.log("手机密码登录按钮被点击");
      this.lpService.login(this.lpData).then(data=> {
        if (data.code != 0)
          throw  data;

        console.log("手机密码登录成功"+ JSON.stringify(data));
        this.navCtrl.setRoot('MPage');
      }).catch(res=>{
        console.log("手机密码登录失败"+res);
        this.alert(res.message);
      });
    }
  }

  check(){
    if (this.errorPhone == 3 && this.errorPwd == 1){
      this.inputBoolean = true;
    }else {
      this.inputBoolean = false;
    }
  }

  checkPhone() {
    this.errorPhone = this.lpService.checkPhone(this.lpData.mobile);
    this.check();

  }

  checkPwd(){
    if (this.lpData.password != null && this.lpData.password != "" && this.lpData.password != undefined){     //判断密码是否为空
      this.errorPwd = 1;
    }else {
      this.errorPwd = 0;
    }
    this.check();
  }
}
