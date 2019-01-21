import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ParamsService } from "../../service/util-service/params.service";
import { UtilService} from "../../service/util-service/util.service";
import {LsmService} from "../../service/lsm.service";
import {ReturnConfig} from "../../app/return.config";
import {PageConfig} from "../../app/page.config";


/**
 * Generated class for the UaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ua',
  // templateUrl: 'ua.html',
  providers: [],
  template:'<ion-header>\n' +
  '  <div class="register_header">\n' +
  '    <ion-navbar>\n' +
  '      <div class="header_header">账号注册</div>\n' +
  '    </ion-navbar>\n' +
  '  </div>\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '  <div class="register_body">\n' +
  '    <div class="custom_form">\n' +
  '      <div class="custom_group">\n' +
  '        <div class="group_input">\n' +
  '          <div class="input_icon">\n' +
  '              <span>\n' +
  '                 <ion-icon name="ios-person-outline"></ion-icon>\n' +
  '              </span>\n' +
  '          </div>\n' +
  '          <div class="input_text">\n' +
  '            <ion-item>\n' +
  '              <ion-input type="tel" [(ngModel)]="accountMobile" (input)="format()"  (ionBlur)="checkPhone()"  clearInput=true placeholder="输入您的手机号">\n' +
  '              </ion-input>\n' +
  '            </ion-item>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '        <div>\n' +
  '          <div>\n' +
  '            <!--*ngIf="true" -->\n' +
  '            <div class="error_info">\n' +
  '              <span *ngIf="this.errorCode == 0">手机号不能为空</span>\n' +
  '              <span *ngIf="this.errorCode == 1 || this.errorCode == 2">请输入正确11位手机号</span>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div class="custom_group verification">\n' +
  '        <div class="group_input ">\n' +
  '          <div class="verification_icon">\n' +
  '            <span class="img_span">\n' +
  '              <img src="./assets/imgs/verification.png"/>\n' +
  '            </span>\n' +
  '          </div>\n' +
  '          <div class="input_text_verification">\n' +
  '            <div class="verification_item">\n' +
  '              <ion-item>\n' +
  '                <ion-input type="text" [(ngModel)]="authCode" placeholder="验证码" clearInput></ion-input>\n' +
  '              </ion-item>\n' +
  '            </div>\n' +
  '            <div class="button_verification">\n' +
  '              <button ion-button (click)="sendMsg()">{{timeOut}}</button>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div >\n' +
  '        <div >\n' +
  '          <!--*ngIf="true" -->\n' +
  '          <div class="error_info">\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div class="custom_group">\n' +
  '        <div class="group_input">\n' +
  '          <div class="input_icon">\n' +
  '            <span>\n' +
  '              <ion-icon name="ios-lock-outline"></ion-icon>\n' +
  '            </span>\n' +
  '          </div>\n' +
  '          <div class="input_text">\n' +
  '            <ion-item>\n' +
  '              <ion-input type="password" [(ngModel)]="accountPassword" (ionBlur)="checkPwd()" placeholder="密码" clearInput></ion-input>\n' +
  '            </ion-item>\n' +
  '          </div>\n' +
  '          <div >\n' +
  '            <div >\n' +
  '              <!--*ngIf="true" -->\n' +
  '              <div class="error_info">\n' +
  '                <span *ngIf="this.checkBoxClickFlag">不同意协议不能注册</span>\n' +
  '                <span *ngIf="this.checkPassword">请输入密码</span>\n' +
  '              </div>\n' +
  '            </div>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div class="custom_group padding_0">\n' +
  '        <button ion-button block color="danger" (click)="register()" class="region_button" [disabled]="disable">\n' +
  '          注册\n' +
  '        </button>\n' +
  '        <div class="copywriting" margin-top>\n' +
  '          <span class="checkbox_span">\n' +
  '            <!--<ion-item>-->\n' +
  '            <!--<ion-label >已阅读《用户协议》</ion-label>-->\n' +
  '              <ion-checkbox [(ngModel)]="checkBoxClick"></ion-checkbox>\n' +
  '            <!--</ion-item>-->\n' +
  '          <span class="userAgreement_span">我已阅读并同意<span class="userAgreement_span_1"\n' +
  '                                                        (click)="userAgreegment()">《用户协议》</span></span>\n' +
  '          </span>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '</ion-content>',
})
export class UaPage {

  RegisterForm: FormGroup;
  data: any;
  accountName: any;
  accountPassword: any;
  accountMobile: any;
  userName: any;
  deviceId: any;
  checkMobile: any;
  checkMobileNull: any;
  checkPassword: any;
  reAccountPassword: any;
  checkBoxClick: any;
  checkBoxClickFlag:any;
  authCode: any;
  errorCode: any;
  timeOut:any = "发送验证码";
  timer:any;


  rePage:string;
  disable:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService,
              private utilService: UtilService,
              private lsmService: LsmService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UaPage');
    this.rePage = this.navParams.get("rePage");
  }

  register() {
    let a=this.checkBoxClick;
    if (!this.checkBoxClick== true)
    {
      this.checkBoxClickFlag=true;
    }else
    {
      this.checkBoxClickFlag=false;
      if(this.errorCode == 3 && this.checkPassword == false ){
        this.disable = true;
        this.lsmService.sn(this.accountMobile,this.accountPassword,this.authCode).then(data =>{
          console.debug("注册返回信息::" + JSON.stringify(data));
          if(data.code == 0) {
            console.log("注册成功");
            //注册成功执行登陆
            this.lsmService.login(this.accountMobile, this.accountPassword).then(data1 => {
              console.debug("登录返回信息::" + JSON.stringify(data));
              // 登陆成功
              if(data1.code == 0) {
                console.debug("登录成功");
                let alert = this.alertCtrl.create({
                  title: '提示信息',
                  subTitle: "注册成功",
                  buttons: [{
                    text: '确定', role: 'cancel', handler: () => {
                      if(this.rePage != undefined){
                        this.navCtrl.getViews().forEach(page=>{
                          if(page.name == this.rePage){
                            this.navCtrl.popTo(page);
                          }
                        })
                      }else{
                        this.navCtrl.setRoot(PageConfig.HZ_PAGE);
                      }
                    }
                  }]
                });
                alert.present();
                this.disable = false;
              }else{
                let message = ReturnConfig.RETURN_MSG.get(data.code.toString());
                console.log("登录失败");
                //登陆失败
                let alert = this.alertCtrl.create({
                  title:'提示信息',
                  subTitle: message,
                  buttons:[
                    {
                      text:"确定",
                      role:"cancel",
                      handler:()=>{
                        this.navCtrl.pop();
                      }
                    }
                  ]
                });
                alert.present();
                this.disable = false;
              }


            }).catch(reason => {
              console.debug("登录失败");
              //登陆失败
              let alert = this.alertCtrl.create({
                title:'提示信息',
                subTitle: "登录失败",
                buttons:[
                  {
                    text:"确定",
                    role:"cancel",
                    handler:()=>{
                      this.navCtrl.pop();
                    }
                  }
                ]
              });
              alert.present();
              this.disable = false;
            })
          }else{
            console.debug("注册失败");
            let alert = this.alertCtrl.create({
              title:'提示信息',
              subTitle: data.message,
              buttons:['确定']
            });
            alert.present();
            this.disable = false;
          }
        }).catch(reason => {
          console.log("注册失败 ::" + reason.message);
          //注册失败
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: reason.message,
            buttons:['确定']
          });
          alert.present();
          this.disable = false;
        })
      }
      //用户注册

    }

  }
  checkPhone(){

    this.errorCode = this.utilService.checkPhone(this.accountMobile);
    if(this.errorCode == 0){
      this.checkMobileNull = true;
    }
    if(this.errorCode == 1 || this.errorCode == 2){
      this.checkMobileNull = false;
      this.checkMobile = true;
    }
    if(this.errorCode == 3){
      this.checkMobile = false;
      this.checkMobileNull = false;
    }

  }

  checkPwd(){
    if (this.accountPassword==null || this.accountPassword=="" || this.accountPassword===undefined) {      //判断字符是否为空
      this.checkPassword=true;
    }else{
      this.checkPassword=false;
    }
  }
  userAgreegment() {
    this.navCtrl.push('HcPage');
  }

  sendMsg(){
    if(this.errorCode == 3){
      this.lsmService.sc(this.accountMobile).then(data=>{
        console.log("sc::" + data)
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: data.message,
          buttons:['确定']
        });
        alert.present();
      }).catch(ref =>{
        console.log("ref::" + ref);
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: ref.message,
          buttons:['确定']
        });
        alert.present();
      })

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
      let alert = this.alertCtrl.create({
        title:'提示信息',
        subTitle: '请填写正确的手机号',
        buttons:['确定']
      });
      alert.present();
    }

  }

  format(){
    this.accountMobile = this.utilService.remo(this.accountMobile);
  }
}

