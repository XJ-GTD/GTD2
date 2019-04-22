import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LpService} from "./lp.service";
import {UtilService} from "../../service/util-service/util.service";
import {PageLoginData} from "../../data.mapping";

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
  <ion-content>
    <h1>账号登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input class="login-tel" type="tel" placeholder="开始输入账号" [(ngModel)]="lpData.mobile" (input)="format()"></ion-input>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-pwd" type="password" placeholder="密码" [(ngModel)]="lpData.password" (input)="format()"></ion-input>
        </div>
       <div>
         <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="signIn()">
           <img class="img-content-enter" src="./assets/imgs/xyb.png">
         </button>
       </div>
      </ion-row>
    </ion-grid>

    <div class="login-div" (click)="toPf()">忘记密码?</div>
    <div class="login-div" (click)="toLs()">改为用短信登录</div>
    <div class="login-div" (click)="toR()">没有账号，立即注册</div>

    <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
  </ion-content>`
})
export class LpPage {

  lpData:PageLoginData = new PageLoginData();
  opa:any = "0.4";

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

  toPf(){
    this.navCtrl.push('PfPage');
  }

  toR() {
    this.navCtrl.push('RPage');
  }

  toLs() {
    this.navCtrl.push('LsPage');
  }

  signIn() {
    if (this.checkPhone()){
      if (this.lpData.password == null || this.lpData.password == "") {     //判断密码是否为空
        this.util.popoverStart("密码不能为空");
      }else{
        this.util.loadingStart();

        this.lpService.login(this.lpData).then(data=> {
          return this.lpService.getPersonMessage(data);
        }).then(data=>{
          return this.lpService.getOther();
        }).then(data=>{
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          this.util.popoverStart(error.message +"手机密码登录失败");
          this.util.loadingEnd();
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.lpData.mobile)){
      this.util.popoverStart("请填写正确的手机号");
    }
    return this.util.checkPhone(this.lpData.mobile);
  }

  format(){
    if(this.lpData.mobile.length==11){
      if(this.checkPhone() && this.lpData.password !="" && this.lpData.password.length >= 4){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

}
