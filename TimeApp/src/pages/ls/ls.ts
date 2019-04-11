import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {LsService, PageLsData} from "./ls.service";
import {UtilService} from "../../service/util-service/util.service";

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
          <ion-input class="login-tel" type="tel" placeholder="开始输入手机号" [(ngModel)]="lsData.mobile" (input)="format()"></ion-input>
        </div>
        <div>
          <button ion-button class="send-sms" (click)="sendSms()">{{timeText}}</button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-code"  type="number" placeholder="短信验证码" [(ngModel)]="lsData.authCode" (input)="format()"></ion-input>
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

  lsData:PageLsData = new PageLsData();
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
      this.lsService.getSMSCode(this.lsData.mobile).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.lsData.verifykey = data.data.verifykey;
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
      if (this.lsData.authCode == null || this.lsData.authCode == "") {     //判断验证码是否为空
        this.util.toast("验证码不能为空",1500);
      }else if(this.lsData.verifykey == null || this.lsData.verifykey == ""){
        this.util.toast("请发送短信并填写正确的短信验证码",1500);
      }else{
        console.log("手机验证码登录被点击");
        this.util.loadingStart();

        this.lsService.login(this.lsData).then(data=> {
          if (data.code && data.code != 0)
            throw  data;

          return this.lsService.getPersonMessage(data);
        }).then(data=>{
          if (data.code && data.code != 0)
            throw  data;

          return this.lsService.getOther();
        }).then(data=>{
          console.log("手机验证码登录成功"+ JSON.stringify(data));
          this.util.loadingEnd();
          this.navCtrl.setRoot('MPage');
        }).catch(error=>{
          console.log("手机验证码登录失败"+JSON.stringify(error));
          this.util.loadingEnd();
          this.util.toast(error.message,1500);
        });
      }
    }
  }

  checkPhone():boolean {
    if (!this.util.checkPhone(this.lsData.mobile)){
      this.util.toast("请填写正确的手机号",1500);
    }
    return this.util.checkPhone(this.lsData.mobile);
  }

  format(){
    if(this.lsData.mobile.length==11){
      if(this.checkPhone() && this.lsData.authCode !="" && this.lsData.authCode.length == 6){
        this.opa = "1";
      }else {
        this.opa = "0.4";
      }
    }
  }

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }
}
