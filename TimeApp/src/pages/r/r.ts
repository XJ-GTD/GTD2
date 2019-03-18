import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
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
      <h1 ion-text>您的详细信息</h1>

      <ion-grid class="grid-login-basic no-padding-lr">
        <ion-row justify-content-between align-items-center>
          <div class="w-auto">
            <ion-input type="tel" placeholder="手机号码" [(ngModel)]="rdata.mobile" (ionBlur)="checkPhone()"></ion-input>
          </div>
          <div>
            <button ion-fab color="success"><ion-icon name="arrow-forward" (click)="register()" ></ion-icon></button>
          </div>
        </ion-row>
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input type="number" placeholder="短信验证码" [(ngModel)]="rdata.authCode"></ion-input>
          </div>
          <div>
            <button ion-button (click)="sendMsg()">{{timeOut}}</button>
          </div>
        </ion-row>
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input type="text" placeholder="姓名" [(ngModel)]="rdata.username"></ion-input>
          </div>
        </ion-row>
        <ion-row justify-content-start align-items-center>
          <div class="w-auto">
            <ion-input type="password" placeholder="选择密码" [(ngModel)]="rdata.password"></ion-input>
          </div>
        </ion-row>
      </ion-grid>

      <p class="text-agreement">创建帐户即表示您同意我们的 <a class="text-anchor" (click)="userAgreement()">服务条款</a> 和 <a class="text-anchor" (click)="userAgreement()">隐私政策</a> 。</p>
    </ion-content>
  `,
})
export class RPage {

  rdata: PageRData = new PageRData();

  checkBoxClick: any;
  errorCode: any;
  timeOut: any = "发送验证码";
  timer: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private rService: RService,
              private toastCtrl: ToastController,
  ) {

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

      if (this.rdata.authCode == null || this.rdata.authCode == "" || this.rdata.authCode == undefined){     //判断验证码是否为空
        this.title("验证码不能为空");
      } else if (this.rdata.password == null || this.rdata.password == "" || this.rdata.password == undefined){     //判断密码是否为空
        this.title("密码不能为空");
      } else if (this.rdata.username == null || this.rdata.username == "" || this.rdata.username == undefined){     //用户名是否为空
        this.title("用户名不能为空");
      }else if (this.checkBoxClick != true){  //判断用户协议是否选择
        this.title("请读阅并勾选用户协议");
      } else if(this.rdata.verifykey == "") {
        this.title("请发送短信并填写正确的短信验证码");
      } else{
        //注册成功
        this.rService.signup(this.rdata).then(data => {
          if (data.code != 0)
            throw  data;

          console.debug("注册成功返回信息::" + JSON.stringify(data));
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
      this.rService.sc(this.rdata).then(data => {
        console.log("短信发送成功"+ JSON.stringify(data));
        //短信验证码KEY 赋值给注册信息
        this.rdata.verifykey = data.data.verifykey;
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
    this.errorCode = this.rService.checkPhone(this.rdata.mobile);
  }

}
