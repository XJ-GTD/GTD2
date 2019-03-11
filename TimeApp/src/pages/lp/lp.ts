import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { UtilService } from "../../service/util-service/util.service";
import {LpData, LpService} from "./lp.service";

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
  '                  <!--  <ion-label no-lines floating>' +
  '                      <span class="input_title">用户名/账号</span>' +
  '                    </ion-label>-->' +
  '                  <ion-input type="text" [(ngModel)]="accountName" pattern="[0-9A-Za-z]*" placeholder="用户名/账号" clearInput></ion-input>' +
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
  '                  <!-- <ion-label no-lines floating>' +
  '                     <span class="input_title">输入密码</span>' +
  '                   </ion-label>-->' +
  '                  <ion-input type="password" [(ngModel)]="accountPassword" placeholder="输入密码" clearInput></ion-input>' +
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

  data: any;
  user: any;
  accountName: string;
  accountPassword: string;

  rePage:string;//成功返回页面
  // puPage:string;//成功跳转页面 移除当前页面 跳转下一页面

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private lpService: LpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LpPage');
    this.rePage = this.navParams.get("rePage");
    console.log(this.rePage)
  }

  signIn() {
    console.log("登录按钮被点击");
    //this.webSocket.close();
    if(this.accountName == null || this.accountPassword == null){
      let toast = this.toastCtrl.create({
        message: '用户名和密码不能为空',
        duration: 1500,
        position: 'middle'
      });
      toast.present();
      return;
    }
    //this.utilService.loading("登录中");
    let lp:LpData = new LpData();
    lp.mobile = this.accountName;
    lp.password = this.accountPassword;
    this.lpService.login(lp).then(data=> {
       console.log(data);
       // if (data.code == 0) {
       //   this.webSocket.close();
       //   // this.userService.getUo();
       //   this.utilService.unloading();
       //   console.log("ub:" + data.message);
       //   this.webSocket.connect(data.data.accountQueue);
       //   this.utilService.alert("登录成功");
       //   if(this.rePage==undefined){
       //     //跳转首页
       //     console.log('LpPage跳转MPage');
       //     this.navCtrl.setRoot('MPage');
       //   }else{
       //     //登录分析
       //     //登录成功跳转，登录成功返回，
       //     this.navCtrl.getViews().forEach(page=>{
       //       if(page.name == this.rePage){
       //         this.navCtrl.popTo(page);
       //         return;
       //       }
       //     });
       //   }
       // }else if(data.code == 1){
       //   this.utilService.unloading();
       //   console.log("ub: " + data.message);
       //   this.utilService.alert(data.message);
       // } else{
       //   this.utilService.unloading();
       //   console.log("ub: " + data.message);
       //   this.utilService.alert(data.message);
       // }

    }).catch(res=>{
      // this.utilService.unloading();
      //  console.log("ub : " +　res.message);
      //  this.utilService.alert(res.message);
     });

  }

  toR() {
    console.log('LpPage跳转RPage');
    this.navCtrl.push('RPage',{"rePage":this.rePage});
  }

  toLs() {
    console.log('LpPage跳转lsPage');
    this.navCtrl.push('LsPage',{"rePage":this.rePage});
  }
}
