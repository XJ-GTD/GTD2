import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {LpService, PageLpData} from "./lp.service";
import {DataConfig} from "../../service/config/data.config";
import {LsService, PageLsData} from "../ls/ls.service";

/**
 * Generated class for the 登陆（密码） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lp',
  providers: [],
  template:'<ion-header>' +
  '  <div class="login_header">' +
  '    <ion-navbar>' +
  '      <ion-title></ion-title>' +
  '    </ion-navbar>' +
  '  </div>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <div class="user_login">' +
  '    <div class="login_body">' +
  '      <div class="login_icon">' +
  '      <span class="xj_icon">' +
  '        <img src="./assets/imgs/logo2.png"/>' +
  '      </span>' +
  '      </div>' +
  '      <div class="login_info">' +
  '        <div class="custom_form">' +
  '          <div class="custom_group">' +
  '            <div class="group_input">' +
  '              <div class="input_icon">' +
  '              <span >' +
  '                 <ion-icon name="ios-person-outline"></ion-icon>' +
  '              </span>' +
  '              </div>' +
  '              <div class="input_text">' +
  '                <ion-item>' +
  '                  <ion-input type="text" [(ngModel)]="lpData.mobile" pattern="[0-9A-Za-z]*" placeholder="用户名/账号" (ionBlur)="checkPhone()"  (input)="format()"  clearInput></ion-input>' +
  '                </ion-item>' +
  '              </div>' +
  '            </div>' +
  '          </div>' +
  '          <div class="custom_group">' +
  '            <div class="group_input">' +
  '              <div class="input_icon">' +
  '              <span >' +
  '                <ion-icon name="ios-lock-outline"></ion-icon>' +
  '              </span>' +
  '              </div>' +
  '              <div class="input_text">' +
  '                <ion-item>' +
  '                  <ion-input type="password" [(ngModel)]="lpData.password" placeholder="输入密码" clearInput></ion-input>' +
  '                </ion-item>' +
  '              </div>' +
  '              <div class="error_info">' +
  '                <span><!--用户名不能为空--></span>' +
  '              </div>' +
  '            </div>' +
  '          </div>' +
  '          <div class="custom_group">' +
  '            <button ion-button block color="danger" class="login_button" (click)="signIn()" [disabled]="disabled">' +
  '              登录' +
  '            </button>' +
  '            <div class="copywriting">' +
  '              <div>' +
  '                <span (click)="toR()">注册</span>' +
  '              </div>' +
  '              <div>' +
  '                <span (click)="toLs()">短信登录</span>' +
  '              </div>' +
  '            </div>' +
  '          </div>' +
  '        </div>' +
  '      </div>' +
  '    </div>' +
  '  </div>' +
  '</ion-content>',
})
export class LpPage {
  lpData:PageLpData = new PageLpData();

  errorCode:any;  //判断输入手机号是否符合规范

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private lpService: LpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LpPage');
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

      if (this.lpData.password == null || this.lpData.password == "" || this.lpData.password == undefined){     //判断密码是否为空
        this.title("密码不能为空");
      } else{
        console.log("登录按钮被点击");
        this.lpService.login(this.lpData).then(data=> {
          if (data.code != 0)
            throw  data;

          console.log("手机密码登录成功"+ JSON.stringify(data));
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

  checkPhone() {
    this.lpService.checkPhone(this.lpData.mobile).then(data=>{
      this.errorCode = data;
    })
  }

  format() {
    this.lpService.remo(this.lpData.mobile).then(data=>{
      this.lpData.mobile = data;
    })
  }

  toR() {
    console.log('LpPage跳转RPage');
    this.navCtrl.push('RPage');
  }

  toLs() {
    console.log('LpPage跳转lsPage');
    this.navCtrl.push('LsPage');
  }
}
