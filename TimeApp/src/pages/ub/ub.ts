import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { LsmService} from "../../service/lsm.service";
import { UserService } from "../../service/user.service";
import {DataConfig} from "../../app/data.config";
import {ReturnConfig} from "../../app/return.config";
import {WebsocketService} from "../../service/util-service/websocket.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the UbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ub',
  // templateUrl: 'ub.html',
  providers: [],
  template:'<ion-header>\n' +
  '  <div class="login_header">\n' +
  '    <ion-navbar>\n' +
  '      <ion-title></ion-title>\n' +
  '    </ion-navbar>\n' +
  '  </div>\n' +
  '</ion-header>\n' +
  '\n' +
  '<ion-content padding>\n' +
  '  <div class="user_login">\n' +
  '    <div class="login_body">\n' +
  '      <div class="login_icon">\n' +
  '      <span class="xj_icon">\n' +
  '        <img src="./assets/imgs/logo2.png"/>\n' +
  '      </span>\n' +
  '      </div>\n' +
  '      <div class="login_info">\n' +
  '        <div class="custom_form">\n' +
  '          <div class="custom_group">\n' +
  '            <div class="group_input">\n' +
  '              <div class="input_icon">\n' +
  '              <span >\n' +
  '                 <ion-icon name="ios-person-outline"></ion-icon>\n' +
  '              </span>\n' +
  '              </div>\n' +
  '              <div class="input_text">\n' +
  '                <ion-item>\n' +
  '                  <!--  <ion-label no-lines floating>\n' +
  '                      <span class="input_title">用户名/账号</span>\n' +
  '                    </ion-label>-->\n' +
  '                  <ion-input type="text" [(ngModel)]="accountName" pattern="[0-9A-Za-z]*" placeholder="用户名/账号" clearInput></ion-input>\n' +
  '                </ion-item>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '          <div class="custom_group">\n' +
  '            <div class="group_input">\n' +
  '              <div class="input_icon">\n' +
  '              <span >\n' +
  '                <ion-icon name="ios-lock-outline"></ion-icon>\n' +
  '              </span>\n' +
  '              </div>\n' +
  '              <div class="input_text">\n' +
  '                <ion-item>\n' +
  '                  <!-- <ion-label no-lines floating>\n' +
  '                     <span class="input_title">输入密码</span>\n' +
  '                   </ion-label>-->\n' +
  '                  <ion-input type="password" [(ngModel)]="accountPassword" placeholder="输入密码" clearInput></ion-input>\n' +
  '                </ion-item>\n' +
  '              </div>\n' +
  '              <div class="error_info">\n' +
  '                <span><!--用户名不能为空--></span>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '          <div class="custom_group">\n' +
  '            <button ion-button block color="danger" class="login_button" (click)="signIn()" [disabled]="disabled">\n' +
  '              登录\n' +
  '            </button>\n' +
  '            <div class="copywriting">\n' +
  '              <div>\n' +
  '                <span (click)="signUp()">注册</span>\n' +
  '              </div>\n' +
  '              <div>\n' +
  '                <span (click)="toUd()">短信登录</span>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '</ion-content>',
})
export class UbPage {

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
    private alertCtrl: AlertController,
    private paramsService: ParamsService,
    private lsmService: LsmService,
    private webSocket: WebsocketService,
    private userService: UserService,
    private utilService: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbPage');
    this.rePage = this.navParams.get("rePage");
    console.log(this.rePage)
  }

  signIn() {
    console.log("登录按钮被点击");
    if(this.accountName == null && this.accountPassword == null){
      let alert = this.alertCtrl.create({
        subTitle: "输入为空",
      });
      alert.present();
      return;
    }
    this.utilService.loading("登录中");
    this.lsmService.login(this.accountName, this.accountPassword).then(data=> {
       console.log(data);
       if (data.code == 0) {
         // this.userService.getUo();
         this.utilService.unloading();
         console.log("登录成功");
         this.webSocket.connect(data.data.accountQueue);
         // this.utilService.loading("登录成功");
       }else if(data.code == 1){
         this.utilService.unloading();
         console.log("登录失败");
         // this.utilService.loading("登录失败:" + data.message);
       } else{
         this.utilService.unloading();
         let message = ReturnConfig.RETURN_MSG.get(data.code.toString());
         console.log("登录失败 :: " + message );
         // this.utilService.loading("登录失败:" + message);
       }

    }).catch(res=>{
      this.utilService.unloading();
       console.log("登录失败 :: " +　res.message);
       // this.utilService.loading("登录失败:" + res.message);
       console.log(res);
     });

  }

  signUp() {
    console.log('UbPage跳转UaPage');
    this.navCtrl.push('UaPage',{"rePage":this.rePage});
  }

  toUd() {
    console.log('UbPage跳转UdPage');
    this.navCtrl.push('UdPage',{"rePage":this.rePage});
  }
}
