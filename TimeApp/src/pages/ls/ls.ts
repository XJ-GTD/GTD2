import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ToastController} from 'ionic-angular';
import {LsService, PageLsData} from "./ls.service";

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
    <h1>验证码登录</h1>
    <ion-grid class="grid-login-basic no-padding-lr">
      <ion-row justify-content-start align-items-center>
        <div class="w-auto">
          <ion-input class="login-tel" type="tel" placeholder="开始输入手机号" [(ngModel)]="lsData.mobile" (ionBlur)="checkPhone()"></ion-input>
        </div>
        <div class="login-enter">
          <button ion-fab color="success" (click)="signIn()" [ngClass]="{'show': inputBoolean == false , 'show-true': inputBoolean == true}">
            <img class="img-content-enter" src="../../assets/imgs/xyb.png">
          </button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-code" type="password" placeholder="验证码" [(ngModel)]="lsData.authCode" (ionBlur)="checkCode()"></ion-input>
        </div>
        <div>
          <button ion-button class="login-send" (click)="sendMsg()">{{timeText}}</button>
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
  errorPhone:number = 0; // 0：初始化（输入为空） 1：手机号长度小于11位 2：手机号格式错误 3：手机号正确
  errorCode:number = 0; // 0：初始化；1：验证码输入
  inputBoolean:boolean = false;  // false： show ; true show-true
  timeText:any = "获取验证码";
  timer:any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lsService: LsService,) {
    console.log('ionViewDidLoad LsPage');
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

  title(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'middle'
    });
    toast.present();
    return;
  }

  alert(message){
    let alert = this.alertCtrl.create({
      title:'提示信息',
      subTitle: message,
      buttons:['确定']
    });
    alert.present();
  }

  sendMsg(){
    if(this.errorPhone == 0){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.errorPhone == 1){
      this.title("手机号长度小于11位");
    }else if(this.errorPhone == 2){
      this.title("手机号格式错误");
    }else {
      this.lsService.getSMSCode(this.lsData.mobile).then(data => {
        //console.log("短信发送成功" + JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.lsData.verifykey = data.data.verifykey;
        this.alert("短信发送成功");

      }).catch(ref => {
        console.log("ref::" + ref);
        this.alert("短信发送失败");
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
    if(this.errorPhone == 0){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.errorPhone == 1){
      this.title("手机号长度小于11位");
    }else if(this.errorPhone == 2){
      this.title("手机号格式错误");
    }else if(this.errorCode == 0){ //判断密码是否为空
      this.title("验证码不能为空");
    }else {
      console.log("手机验证码登录被点击");
      this.lsService.login(this.lsData).then(data=> {
        if (data.code != 0)
          throw  data;

        console.log("手机验证码登录成功"+ JSON.stringify(data));
        clearTimeout(this.timer);
        this.navCtrl.setRoot('MPage');
      }).catch(res=>{
        console.log("手机验证码登录失败"+res);
        this.alert(res.message);
      });
    }
  }

  check(){
    if (this.errorPhone == 3 && this.errorCode == 1){
      this.inputBoolean = true;
    }else {
      this.inputBoolean = false;
    }
  }

  checkPhone() {
    this.errorPhone = this.lsService.checkPhone(this.lsData.mobile);
    this.check();
  }

  checkCode(){
    if (this.lsData.authCode != null && this.lsData.authCode != "" && this.lsData.authCode != undefined){     //判断验证码是否为空
      this.errorCode = 1;
    }else {
      this.errorCode = 0;
    }
    this.check();
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
