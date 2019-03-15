import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
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
  template: '<ion-header>' +
    '  <div class="register_header">' +
    '    <ion-navbar>' +
    '      <div class="header_header">账号注册</div>' +
    '    </ion-navbar>' +
    '  </div>' +
    '</ion-header>' +
    '<ion-content padding>' +
    '  <div class="register_body">' +
    '    <div class="custom_form">' +
    '      <div class="custom_group">' +
    '        <div class="group_input">' +
    '          <div class="input_icon">' +
    '              <span>' +
    '                 <ion-icon name="ios-person-outline"></ion-icon>' +
    '              </span>' +
    '          </div>' +
    '          <div class="input_text">' +
    '            <ion-item>' +
    '              <ion-input type="tel" [(ngModel)]="rdata.mobile" (input)="format()"  (ionBlur)="checkPhone()"  clearInput=true placeholder="输入您的手机号">' +
    '              </ion-input>' +
    '            </ion-item>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group verification">' +
    '        <div class="group_input ">' +
    '          <div class="verification_icon">' +
    '            <span class="img_span">' +
    '              <img src="./assets/imgs/verification.png"/>' +
    '            </span>' +
    '          </div>' +
    '          <div class="input_text_verification">' +
    '            <div class="verification_item">' +
    '              <ion-item>' +
    '                <ion-input type="text" [(ngModel)]="rdata.authCode" placeholder="验证码" clearInput></ion-input>' +
    '              </ion-item>' +
    '            </div>' +
    '            <div class="button_verification">' +
    '              <button ion-button (click)="sendMsg()">{{timeOut}}</button>' +
    '            </div>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group">' +
    '        <div class="group_input">' +
    '          <div class="input_icon">' +
    '            <span>' +
    '              <ion-icon name="ios-lock-outline"></ion-icon>' +
    '            </span>' +
    '          </div>' +
    '          <div class="input_text">' +
    '            <ion-item>' +
    '              <ion-input type="password" [(ngModel)]="rdata.password" placeholder="密码" clearInput></ion-input>' +
    '            </ion-item>' +
    '          </div>' +
    '        </div>' +
    '      </div>' +
    '      <div class="custom_group padding_0">' +
    '        <button ion-button block color="danger" (click)="register()" class="region_button" [disabled]="disable">' +
    '          注册' +
    '        </button>' +
    '        <div class="copywriting" margin-top>' +
    '          <span class="checkbox_span">' +
    '              <ion-checkbox [(ngModel)]="checkBoxClick"></ion-checkbox>' +
    '          <span class="userAgreement_span">我已阅读并同意<span class="userAgreement_span_1" (click)="userAgreegment()">《用户协议》</span></span>' +
    '          </span>' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</ion-content>',
})
export class RPage {

  rdata: PageRData = new PageRData();

  checkBoxClick: any;
  errorCode: any;
  timeOut: any = "发送验证码";
  timer: any;

  data: any;
  accountName: any;
  accountMobile: any;
  userName: any;
  deviceId: any;
  authCode: any;


  rePage: string;
  disable: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private rService: RService,
              private toastCtrl: ToastController,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RPage');
    this.rePage = this.navParams.get("RPage");
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
      } else if (this.checkBoxClick != true){  //判断用户协议是否选择
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

  userAgreegment() {
    this.navCtrl.push('PPage');
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
    this.rService.checkPhone(this.rdata.mobile).then(data=>{
      this.errorCode = data;
    })
  }

  format() {
    this.rService.remo(this.rdata.mobile).then(data=>{
      this.rdata.mobile = data;
    })
  }

}
