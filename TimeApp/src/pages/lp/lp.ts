import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LpService} from "./lp.service";
import {UtilService} from "../../service/util-service/util.service";
import {EffectService} from "../../service/business/effect.service";
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
          <ion-input class="login-tel" type="tel" placeholder="开始输入账号" [(ngModel)]="login.phoneno" (input)="format()"></ion-input>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-pwd" type="password" placeholder="密码" [(ngModel)]="login.userpassword" (input)="format()"></ion-input>
        </div>
       <div>
         <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="signIn()">
           <ion-icon class="fal fa-sign-in-alt"></ion-icon>
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

  login:PageLoginData = new PageLoginData();
  opa:any = "0.4";

  constructor(public navCtrl: NavController,
              private util:UtilService,
              private effectService: EffectService,
              private lpService: LpService,) {
  }

  ionViewDidLoad() {
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
      if (this.login.userpassword == null || this.login.userpassword == "") {     //判断密码是否为空
        this.util.popoverStart("密码不能为空");
      }else{
        this.util.loadingStart();

        this.lpService.login(this.login).then(data=> {
          if(!data || data.code != 0)
            throw  data;

          return this.lpService.getPersonMessage(data);
        }).then(data=>{
          if (data == "-1")
            throw data;

          return this.lpService.getOther();
        }).then(data=>{
          // 拉取完整同步数据
          this.effectService.syncInitial();
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          this.util.loadingEnd();
          if(error && error.code && error.message != undefined && error.message != null && error.message != ""){

            this.util.toastStart(error.message,1500);
          }else{

            this.util.toastStart("网络异常",1500);
          }
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.login.phoneno)){
      this.util.popoverStart("请填写正确的手机号");
    }
    return this.util.checkPhone(this.login.phoneno);
  }

  format(){
    if(this.login.phoneno.length==11){
      if(this.checkPhone() && this.login.userpassword !="" && this.login.userpassword.length >= 4){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

}
