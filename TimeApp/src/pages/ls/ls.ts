import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, Navbar, NavController, NavParams, ToastController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {LsService, PageLsData} from "./ls.service";
import {ReturnConfig} from "../../../../TimeApp（v1）/src/app/return.config";

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
  <ion-header no-border>
  <ion-toolbar>
    <ion-buttons left>
      <button ion-button icon-only (click)="goBack()" color="success">
        <ion-icon name="arrow-back"></ion-icon>
      </button>
    </ion-buttons>

    <ion-buttons right>
      <button ion-button color="success">
        帮助
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content padding>
<h1 ion-text>您的手机号码是?</h1>

<ion-grid class="grid-login-basic no-padding-lr">
  <ion-row justify-content-start align-items-center>
    <div class="w-auto">
      <ion-input type="tel" placeholder="手机号码" [(ngModel)]="lsData.mobile"></ion-input>
    </div>
  </ion-row>
  <ion-row justify-content-between align-items-center>
    <div class="w-auto">
      <ion-input type="password" placeholder="短信验证码" [(ngModel)]="lsData.authCode" ></ion-input> <button ion-button (click)="sendMsg()">{{timeOut}}</button>
    </div>
    <div>
      <button ion-fab color="success"><ion-icon name="arrow-forward" (click)="signIn()"></ion-icon></button>
    </div>
  </ion-row>
</ion-grid>

  <button ion-button clear color="dark" (click)="openLoginPasswordPage()" class="no-padding no-margin-lr">改为用冥王星帐户登录</button>
  
  <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" href="">服务条款</a> 和 <a class="text-anchor" href="">隐私政策</a> 。</p>
</ion-content>

  `
})
export class LsPage {

  @ViewChild(Navbar) navBar: Navbar;

  lsData:PageLsData = new PageLsData();
  errorCode:any;
  checkBoxClick:any = true;
  timeOut:any = "发送验证码";
  timer:any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lsService: LsService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LsPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

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

      this.navCtrl.setRoot('MPage');
      if (this.lsData.authCode == null || this.lsData.authCode == "" || this.lsData.authCode == undefined){     //判断验证码是否为空
        this.title("验证码不能为空");
      } else if (this.checkBoxClick != true){  //判断用户协议是否选择
        this.title("请读阅并勾选用户协议");
      }else if(this.lsData.verifykey == "") {
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
    this.lsService.checkPhone(this.lsData.mobile).then(data=>{
      this.errorCode = data;
    })
  }

  format() {
    this.lsService.remo(this.lsData.mobile).then(data=>{
      this.lsData.mobile = data;
    })
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
