import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {LsService, PageLsData} from "../ls/ls.service";
import {PsService} from "../ps/ps.service";
import {UserConfig} from "../../service/config/user.config";

/**
 * Generated class for the PfPage 忘记密码 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pf',
  template:
  `
    <ion-content>
      <h1>忘记密码</h1>
      <ion-grid class="grid-login-basic no-padding-lr">
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="login-tel" type="tel" placeholder="开始输入手机号" [(ngModel)]="pfData.mobile" (input)="format()"></ion-input>
          </div>
          <div>
            <button ion-button class="send-sms" (click)="sendSms()">{{timeText}}</button>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="login-code"  type="number" placeholder="短信验证码" [(ngModel)]="pfData.authCode" (input)="format()"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="login-pwd" type="password" placeholder="密码" [(ngModel)]="pfData.password" (input)="format()"></ion-input>
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
  `,
})
export class PfPage {

  pfData:PageLsData = new PageLsData();
  timeText:any = "获取验证码";
  timer:any;
  opa:any = "0.4";

  constructor(public navCtrl: NavController, public navParams: NavParams, private util:UtilService,private psService:PsService,private lsService:LsService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PfPage');
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
      this.lsService.getSMSCode(this.pfData.mobile).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.pfData.verifykey = data.data.verifykey;
        this.util.toast("短信发送成功",1500);

      }).catch(error => {
        console.log("短信发送失败" + JSON.stringify(error));
        this.util.toast("短信发送失败",1500);
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

  signIn() {
    if(this.checkPhone()) {
      if (this.pfData.authCode == null || this.pfData.authCode == "" || this.pfData.authCode == undefined) {     //判断验证码是否为空
        this.util.toast("验证码不能为空",1500);
      }else if (this.pfData.password == null || this.pfData.password == "" || this.pfData.password == undefined) {     //判断密码是否为空
        this.util.toast("密码不能为空",1500);
      }else if(this.pfData.verifykey == null || this.pfData.verifykey == "" || this.pfData.verifykey == undefined){
        this.util.toast("请发送短信并填写正确的短信验证码",1500);
      }else{
        console.log("忘记密码被点击");
        this.util.loadingStart();

        this.lsService.login(this.pfData).then(data=> {
          if (data.code && data.code != 0)
            throw  data;

          return this.lsService.get(data);
        }).then(data=>{
          console.log("忘记密码登录成功"+ JSON.stringify(data));

          return this.psService.editPass(this.pfData.password,UserConfig.user.id);
        }).then(data=>{
          this.util.toast("修改密码并成功登录",1500);
          clearTimeout(this.timer);
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          console.log("忘记密码登录失败"+JSON.stringify(error));
          this.util.loadingEnd();
          this.util.toast(error.message,1500);
          this.psService.deleteUser();
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.pfData.mobile)){
      this.util.toast("请填写正确的手机号",1500);
    }
    return this.util.checkPhone(this.pfData.mobile);
  }

  format(){
    if(this.pfData.mobile.length==11){
      if(this.checkPhone() && this.pfData.authCode !=""){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

}
