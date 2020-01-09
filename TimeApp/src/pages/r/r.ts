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
        <ion-row justify-content-between align-items-center>
          <div >
            <ion-input class="login-tel" type="tel" placeholder="开始输入电话号码" [(ngModel)]="login.phoneno" (input)="format()"></ion-input>
          </div>
          <div>
            <button ion-button class="send-sms" (click)="sendSms()">{{timeText}}</button>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div >
            <ion-input class="login-r-code"  type="number" placeholder="短信验证码" [(ngModel)]="login.verifycode" (input)="format()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div >
            <ion-input class="login-tel"  type="text" placeholder="您的尊称" [(ngModel)]="login.username" (input)="format()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div >
            <ion-input class="login-r-pwd" type="password" placeholder="密码" [(ngModel)]="login.userpassword" (input)="format()"></ion-input>
          </div>
          <div>
            <button ion-fab class="login-enter" [ngStyle]="{'opacity': opa }" (click)="register()">
              <ion-icon class="fal fa-sign-in-alt"></ion-icon>
            </button>
          </div>
        </ion-row>
      </ion-grid>

     <div class="login-div" (click)="toLp()">改为用账号登录</div>
      <div class="login-div" (click)="toLs()">改为用短信验证码登录</div>

      <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
    </ion-content>
  `,
})
export class RPage {

  login: PageLoginData = new PageLoginData();
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
      this.rService.getSMSCode(this.login.phoneno).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.login.verifykey = data.verifykey;
        this.util.toastStart("短信发送成功",1500);

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
        console.log("短信发送失败" + JSON.stringify(error));
        clearTimeout(this.timer);
        this.timeText = "发送验证码";
        //this.util.toastStart("短信发送失败",1500);
      });

    }
  }

  register() {
    if(this.checkPhone()) {
      if (this.login.verifycode == null || this.login.verifycode == "") {     //判断验证码是否为空
        this.util.toastStart("短信验证码不能为空",1500);
      }else if (this.login.username == null || this.login.username == "") {           //判断用户名是否为空
        this.util.toastStart("用户名不能为空",1500);
      }else if (this.login.userpassword == null || this.login.userpassword == "") {     //判断密码是否为空
        this.util.toastStart("密码不能为空",1500);
      }else if(this.login.verifykey == null || this.login.verifykey == ""){
        this.util.toastStart("请发送短信并填写正确的短信验证码",1500);
      }else {
        this.util.loadingStart();
        this.rService.register(this.login).then(data => {
          clearTimeout(this.timer);
          this.util.loadingEnd();
          this.navCtrl.setRoot(DataConfig.PAGE._M_PAGE);
        }).catch(error=>{
          this.util.loadingEnd();
          if(error && error.code && error.message != undefined && error.message != null && error.message != ""){
            console.log(error.message);
            this.util.toastStart(error.message,1500);
          }else{
            console.log("注册以及密码登录失败");
            this.util.toastStart("网络异常",1500);
          }
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.login.phoneno)){
      this.util.toastStart("请填写正确的手机号",1500);
    }
    return this.util.checkPhone(this.login.phoneno);
  }

  format(){
    if(this.login.phoneno.length==11){
      if(this.checkPhone()
        && this.login.verifycode !="" && this.login.verifycode.length == 6
        && this.login.username !="" && this.login.username.length >= 2
        && this.login.userpassword !="" && this.login.userpassword.length >= 4){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

}
