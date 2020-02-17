import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LsService} from "./ls.service";
import {UtilService} from "../../service/util-service/util.service";
import {EffectService} from "../../service/business/effect.service";
import {PageLoginData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";

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
      <ion-row justify-content-between align-items-center>
        <div >
          <ion-input class="login-tel" type="tel" placeholder="开始输入手机号" [(ngModel)]="login.phoneno" (input)="format()"></ion-input>
        </div>
        <div>
          <button ion-button  class="send-sms" (click)="sendSms()" [disabled]="!enableSendSMS">{{timeText}}</button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div >
          <ion-input class="login-code"  type="number" placeholder="短信验证码" [(ngModel)]="login.verifycode" (input)="format()"></ion-input>
        </div>
        <div>
          <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="signIn()">
            <ion-icon class="fal fa-sign-in-alt"></ion-icon>
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

  enableSendSMS: boolean = true;

  constructor(public navCtrl: NavController,
              private util:UtilService,
              private effectService: EffectService,
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
      this.enableSendSMS = false;

      this.lsService.getSMSCode(this.login.phoneno).then(data => {

        //短信验证码KEY 赋值给验证码登录信息
        this.login.verifykey = data.verifykey;
        this.util.toastStart("短信发送成功",1500);

        this.timeText = 60;
        this.timer = setInterval(() => {
          this.timeText--;
          if (this.timeText <= 0) {
            clearTimeout(this.timer);
            this.timeText = "发送验证码"
            this.enableSendSMS = true;
          }
        }, 1000)

      }).catch(error => {
        clearTimeout(this.timer);
        this.timeText = "发送验证码";
        this.enableSendSMS = true;
        this.util.toastStart("短信发送失败",1500);
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
          if(!data || data.code != 0)
            throw  data;

          return this.lsService.getPersonMessage(data);
        }).then(data=>{
          if (data == "-1")
            throw data;


          // 拉取完整同步数据
          this.effectService.syncInitial();
          this.util.loadingEnd();
          this.navCtrl.setRoot(DataConfig.PAGE._AL_PAGE);
          //不需要getOther
          //return this.lsService.getOther();
        }).catch(error=>{
          this.util.loadingEnd();
          if(error && error.code && error.message != undefined && error.message != null && error.message != ""){

            this.util.toastStart(error.message,1500);
          }else{
            console.log("手机验证码登录失败");
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
      if(this.checkPhone() && this.login.verifycode !="" && this.login.verifycode.length == 6){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }
}
