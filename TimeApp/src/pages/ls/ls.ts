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
          <button ion-fab color="success" (click)="signIn()">
            <img class="img-content-enter" src="../../assets/imgs/xyb.png">
            <!--<ion-icon name="arrow-forward"></ion-icon>-->
          </button>
        </div>
      </ion-row>
      <ion-row justify-content-between align-items-center>
        <div class="w-auto">
          <ion-input class="login-code" type="password" placeholder="验证码" [(ngModel)]="lsData.authCode"></ion-input>
        </div>
        <div>
          <button ion-button class="login-send" (click)="sendMsg()">{{timeOut}}</button>
        </div>
      </ion-row>
    </ion-grid>

    <div class="login-div">忘记密码?</div>
    <div class="login-div" (click)="toLp()">改为用密码登录</div>
    <div class="login-div" (click)="toR()">没有账号，立即注册</div>

    <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
  </ion-content>
  `
})
export class LsPage {

  lsData:PageLsData = new PageLsData();
  errorCode:any;
  timeOut:any = "获取验证码";
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

  signIn() {
    if(this.errorCode == undefined || this.errorCode == 0 ){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.errorCode == 3){ //验证手机号是否符合规范

      if (this.lsData.authCode == null || this.lsData.authCode == "" || this.lsData.authCode == undefined){     //判断验证码是否为空
        this.title("验证码不能为空");
      } else if(this.lsData.verifykey == "") {
        this.title("请发送短信并填写正确的短信验证码");
      } else{
        this.lsService.login(this.lsData).then(data=> {
          if (data.code != 0)
            throw  data;

          console.log("手机验证码登录成功"+ JSON.stringify(data));
          this.navCtrl.setRoot('MPage');
        }).catch(res=>{
          console.log(res);
          this.alert(res.message);
        });
      }
    }else {
      this.title("请输入正确11位手机号");
    }
  }

  toR() {
    console.log('LpPage跳转RPage');
    this.navCtrl.push('RPage');
  }

  userAgreement() {
    this.navCtrl.push('PPage');
  }

  sendMsg(){
    if(this.errorCode == 3) {
      this.lsService.getSMSCode(this.lsData.mobile).then(data => {
        console.log("短信发送成功"+ JSON.stringify(data));
        //短信验证码KEY 赋值给验证码登录信息
        this.lsData.verifykey = data.data.verifykey;
        this.alert("短信发送成功");
      }).catch(ref => {
        console.log("ref::" + ref);
        this.alert("短信发送失败");
      });

      this.timeOut = 10;
      this.timer = setInterval(()=>{
        this.timeOut --;
        if(this.timeOut <= 0){
          clearTimeout(this.timer);
          console.log("清除定时器");
          this.timeOut="发送验证码"
        }
        console.log(this.timeOut)
      },1000)
    }else{
      this.title("请填写正确的手机号");
    }
  }

  checkPhone() {
    this.errorCode = this.lsService.checkPhone(this.lsData.mobile);
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
