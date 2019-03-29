import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LpService, PageLpData} from "./lp.service";
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
  template:
  `
  <ion-content padding>
    <h1>账号登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input class="login-tel" type="tel" placeholder="开始输入账号" [(ngModel)]="lpData.mobile" (ionBlur)="checkPhone()"></ion-input>
        </div>
        <div>
          <button ion-fab class="login-enter" (click)="signIn()" [ngClass]="{'show': inputBoolean == false , 'show-true': inputBoolean == true}">
            <img class="img-content-enter" src="./assets/imgs/xyb.png">
          </button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-pwd" type="password" placeholder="密码" [(ngModel)]="lpData.password" (ionBlur)="checkPwd()"></ion-input>
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
              private util:UtilService,
              private lpService: LpService,) {
  }

  ionViewDidLoad() {
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

  signIn() {
    if(this.inputBoolean){
      console.log("手机密码登录按钮被点击");
      this.util.loadingStart();
      this.lpService.login(this.lpData).then(data=> {
        if (data.code != 0)
          throw  data;

        console.log("手机密码登录成功"+ JSON.stringify(data));
        this.util.loadingEnd();
        this.navCtrl.setRoot('MPage');
      }).catch(error=>{
        console.log("手机密码登录失败"+JSON.stringify(error));
        this.util.loadingEnd();
        //this.alert(error.message);
        this.util.toast("手机密码登录失败",1500);
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
    this.errorPhone = this.util.checkPhone(this.lpData.mobile);
    this.check();

    /*if(this.errorPhone == 0){  //判断手机号是否为空
      this.util.toast("手机号不能为空",1500);
    }else if(this.errorPhone == 1){
      this.util.toast("手机号长度小于11位",1500);
    }else if(this.errorPhone == 2){
      this.util.toast("手机号格式错误",1500);
    }*/
  }

  checkPwd(){
    if (this.lpData.password != null && this.lpData.password != "" && this.lpData.password != undefined){     //判断密码是否为空
      this.errorPwd = 1;
    }else {
      this.errorPwd = 0;
    }
    this.check();

    /*if(this.errorPwd == 0){ //判断密码是否为空
      this.util.toast("密码不能为空",1500);
    }*/
  }

}
