import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LsService} from "./ls.service";
import {UtilService} from "../../service/util-service/util.service";
import {PageLoginData} from "../../data.mapping";

/**
 * Generated class for the 登陆（短信） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ls',
  template:
  `
  <ion-content>
    <h1>短信登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input class="login-tel" type="tel" placeholder="开始输入手机号" [(ngModel)]="login.phoneno" (input)="format()"></ion-input>
        </div>
        <div>
          <button ion-button class="send-sms" (click)="sendSms()">{{timeText}}</button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-code"  type="number" placeholder="短信验证码" [(ngModel)]="login.verifycode" (input)="format()"></ion-input>
        </div>
        <div>
          <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="signIn()">
            <img class="img-content-enter" src="./assets/imgs/xyb.png">
          </button>
        </div>
      </ion-row>
    </ion-grid>
    
    <div class="login-div" (click)="toLp()">改为用密码登录</div>
    <div class="login-div" (click)="toR()">没有账号，立即注册</div>

    <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
  </ion-content>
  `
})
export class LsPage {

  login:PageLoginData = new PageLoginData();
  timeText:any = "获取验证码";
  timer:any;
  opa:any = "0.4";

  constructor(public navCtrl: NavController,
              private util:UtilService,
              private lsService: LsService,) {
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

  toLp() {
    this.navCtrl.push('LpPage');
  }

  sendSms(){
    if(this.checkPhone()){

      this.lsService.getSMSCode(this.login.phoneno).then(data => {
        console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.login.verifykey = data.verifykey;
        this.util.toastStart("短信发送成功",2000);

        this.timeText = 60;
        console.log("开始" + this.timeText + "定时器");
        this.timer = setInterval(() => {
          this.timeText--;
          if (this.timeText <= 0) {
            clearTimeout(this.timer);
            console.log("清除定时器");
            this.timeText = "发送验证码"
          }
        }, 1000)

      }).catch(error => {
        clearTimeout(this.timer);
        this.timeText = "发送验证码";
        //this.util.toastStart("短信发送失败",2000);
      });

    }
  }

  signIn() {
    if(this.checkPhone()) {
      if (this.login.verifycode == null || this.login.verifycode == "") {     //判断验证码是否为空
        this.util.toastStart("验证码不能为空",1500);
      }else if(this.login.verifykey == null || this.login.verifykey == ""){
        this.util.toastStart("请发送短信并填写正确的短信验证码",1500);
      }else{
        this.util.loadingStart();

        this.lsService.login(this.login).then(data=> {
          if (data.code != 0)
            throw  data;

          return this.lsService.getPersonMessage(data);
        }).then(data=>{
          return this.lsService.getOther();
        }).then(data=>{
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          this.util.loadingEnd();
          if(error && error.message != undefined && error.message != null && error.message != ""){
            this.util.toastStart(error.message,1500);
          }else{
            this.util.toastStart("手机验证码登录失败",1500);
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
      if(this.checkPhone() && this.login.verifycode !="" && this.login.verifycode.length == 6){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }
}
