import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RService} from "./r.service";
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";
import {PageLoginData} from "../../data.mapping";

/**
 * Generated class for the 注册 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-r',
  template:
    `
    <ion-content>
      <h1>注册账号</h1>
      <ion-grid class="grid-login-basic no-padding-lr">
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-tel" type="tel" placeholder="开始输入电话号码" [(ngModel)]="rData.mobile" (input)="format()"></ion-input>
          </div>
          <div>
            <button ion-button class="send-sms" (click)="sendSms()">{{timeText}}</button>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="register-code"  type="number" placeholder="短信验证码" [(ngModel)]="rData.authCode" (input)="format()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="register-name"  type="text" placeholder="您的尊称" [(ngModel)]="rData.username" (input)="format()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="register-pwd" type="password" placeholder="密码" [(ngModel)]="rData.password" (input)="format()"></ion-input>
          </div>
          <div>
            <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="register()">
              <img class="img-content-enter" src="./assets/imgs/xyb.png">
            </button>
          </div>
        </ion-row>
      </ion-grid>

     <div class="register-div" (click)="toLp()">改为用账号登录</div>
      <div class="register-div" (click)="toLs()">改为用短信验证码登录</div>

      <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
    </ion-content>
  `,
})
export class RPage {

  rData: PageLoginData = new PageLoginData();
  timeText:any = "获取验证码";
  timer:any;
  opa:any = "0.4";

  constructor(public navCtrl: NavController,
              private util:UtilService,
              private rService: RService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  toLp() {
    this.navCtrl.push('LpPage');
  }

  toLs() {
    this.navCtrl.push('LsPage');
  }

  sendSms(){
    if(this.checkPhone()){
      this.rService.sc(this.rData).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.rData.verifykey = data.verifykey;
        this.util.toastStart("短信发送成功",1500);

      }).catch(error => {
        console.log("短信发送失败" + JSON.stringify(error));
        this.util.toastStart("短信发送失败",1500);
      });

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
    }
  }

  register() {
    if(this.checkPhone()) {
      if (this.rData.username == null || this.rData.username == "") {           //判断用户名是否为空
        this.util.popoverStart("用户名不能为空");
      }else if (this.rData.authCode == null || this.rData.authCode == "") {     //判断验证码是否为空
        this.util.popoverStart("验证码不能为空");
      }else if (this.rData.password == null || this.rData.password == "") {     //判断密码是否为空
        this.util.popoverStart("密码不能为空");
      }else if(this.rData.verifykey == null || this.rData.verifykey == ""){
        this.util.popoverStart("请发送短信并填写正确的短信验证码");
      }else {
        this.util.loadingStart();
        this.rService.register(this.rData).then(data => {
          clearTimeout(this.timer);
          this.util.loadingEnd();
          this.navCtrl.setRoot(DataConfig.PAGE._M_PAGE);
        }).catch(error=>{
          this.util.loadingEnd();
          this.util.popoverStart(error.message);
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.rData.mobile)){
      this.util.popoverStart("请填写正确的手机号");
    }
    return this.util.checkPhone(this.rData.mobile);
  }

  format(){
    if(this.rData.mobile.length==11){
      if(this.checkPhone()
        && this.rData.authCode !="" && this.rData.authCode.length == 6
        && this.rData.username !="" && this.rData.username.length >= 2
        && this.rData.password !="" && this.rData.password.length >= 4){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

}
