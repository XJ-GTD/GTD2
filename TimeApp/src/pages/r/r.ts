import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ToastController} from 'ionic-angular';
import {PageRData, RService} from "./r.service";

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
    <ion-content padding>
      <h1>注册账号</h1>
      <ion-grid class="grid-login-basic no-padding-lr">
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-name"  type="text" placeholder="您的尊称" [(ngModel)]="rData.username"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input class="register-tel" type="tel" placeholder="开始输入电话号码" [(ngModel)]="rData.mobile" (ionBlur)="checkPhone()"></ion-input>
          </div>
          <div>
            <button ion-fab color="success" (click)="register()">
            <img class="img-content-enter" src="../../assets/imgs/xyb.png">
            <!--<ion-icon name="arrow-forward" ></ion-icon>-->
          </button>
          </div>
        </ion-row>
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-code"  type="number" placeholder="短信验证码" [(ngModel)]="rData.authCode"></ion-input>
          </div>
          <div>
            <button ion-button class="register-send" (click)="sendMsg()">{{timeOut}}</button>
          </div>
        </ion-row>
        
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input class="register-pwd" type="password" placeholder="密码" [(ngModel)]="rData.password"></ion-input>
          </div>
        </ion-row>
      </ion-grid>

     <div class="register-div" (click)="toLp()">改为用密码登录</div>

      <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
    </ion-content>
  `,
})
export class RPage {

  rData: PageRData = new PageRData();

  errorCode: any;
  timeOut: any = "获取验证码";
  timer: any;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private rService: RService,) {
    console.log('ionViewDidLoad RPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  toLp() {
    this.navCtrl.push('LpPage');
  }

  userAgreement() {
    this.navCtrl.push('PPage');
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

  register() {
    if(this.errorCode == undefined || this.errorCode == 0 ){  //判断手机号是否为空
      this.title("手机号不能为空");
    }else if(this.errorCode == 3){ //验证手机号是否符合规范
      if (this.rData.username == null || this.rData.username == "" || this.rData.username == undefined){     //用户名是否为空
        this.title("用户名不能为空");
      }else  if (this.rData.authCode == null || this.rData.authCode == "" || this.rData.authCode == undefined){     //判断验证码是否为空
        this.title("验证码不能为空");
      } else if (this.rData.password == null || this.rData.password == "" || this.rData.password == undefined){     //判断密码是否为空
        this.title("密码不能为空");
      } else if(this.rData.verifykey == "") {
        this.title("请发送短信并填写正确的短信验证码");
      } else{
        console.log("注册按钮被点击");
        this.rService.signup(this.rData).then(data => {
          if (data.code != 0)
            throw  data;

          console.debug("注册并密码登录成功::" + JSON.stringify(data));
          this.navCtrl.setRoot('MPage');
        }).catch(res=>{
          //注册异常
          console.log(res);
          this.alert(res.message);
        });
      }
    }else {
      this.title("请输入正确11位手机号");
    }
  }

  sendMsg() {
    if(this.errorCode == 3){
      this.rService.sc(this.rData).then(data => {
        console.log("短信发送成功"+ JSON.stringify(data));
        //短信验证码KEY 赋值给注册信息
        this.rData.verifykey = data.data.verifykey;
        this.alert("短信发送成功");
      }).catch(ref =>{
        console.log("ref::" + ref);
        this.alert("短信发送失败");
      });

      this.timeOut = 10;
      this.timer = setInterval(()=>{
        this.timeOut --;
        if(this.timeOut <= 0){
          clearTimeout(this.timer)
          console.log("清除定时器")
          this.timeOut="发送验证码"
        }
        console.log(this.timeOut)
      },1000)

    }else{
      this.title("请输入正确11位手机号");
    }
  }

  checkPhone() {
    this.errorCode = this.rService.checkPhone(this.rData.mobile);
  }

}
