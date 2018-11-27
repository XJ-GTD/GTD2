import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/util-service/params.service";
import { AppConfig } from "../../app/app.config";


/**
 * Generated class for the UaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ua',
  templateUrl: 'ua.html',
  providers: []
})
export class UaPage {

  RegisterForm: FormGroup;
  data: any;
  accountName: any;
  accountPassword: any;
  accountMobile: any;
  userName: any;
  deviceId: any;
  checkMoblie: any;
  checkMoblieNull: any;
  checkPassword: any;
  reAccountPassword: any;
  checkBoxClick: any;
  checkBoxClickFlag:any;
  authCode: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService) {

    // this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UaPage');
  }

  /*init() {
    this.RegisterForm = this.formBuilder.group({
      accountMobile:['',Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      accountPassword:['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(20)])],
      reAccountPassword:['',Validators.compose([Validators.required])]

    });
    this.accountMobile = this.RegisterForm.controls['accountMobile'];
    this.accountPassword = this.RegisterForm.controls['accountPassword'];
    this.reAccountPassword = this.RegisterForm.controls['reAccountPassword'];
  }**/

  register() {
    var a=this.checkBoxClick;
    if (!this.checkBoxClick== true)
    {
      this.checkBoxClickFlag=true;
    }else
    {
      this.checkBoxClickFlag=false;
      //用户注册
      this.http.post(AppConfig.USER_REGISTER_URL, {
        accountName: this.accountName,
        accountPassword: this.accountPassword,
        accountMobile: this.accountMobile,
        deviceId: this.deviceId,
        loginType: 0,
        authCode: this.authCode
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        responseType: 'json'
      })
        .subscribe(data => {
          this.data = data;
          let loader = this.loadingCtrl.create({
            content: this.data.message,
            duration: 1000
          });
          if (this.data.code == "0") {
            loader.present();
            //注册成功后登陆
            this.http.post(AppConfig.USER_LOGIN_URL, {
              accountName: this.accountMobile,

              accountPassword: this.accountPassword,
              loginType: 0
            }, {
              headers: {
                "Content-Type": "application/json"
              },
              responseType: 'json'
            })
              .subscribe(data => {
                console.log(data);
                this.data = data;
                let loader = this.loadingCtrl.create({
                  content: this.data.message,
                  duration: 1000
                });
                if (this.data.code == "0") {
                  this.paramsService.user = this.data.data.userInfo;
                  loader.present();
                  this.navCtrl.push('HaPage');
                } else {
                  loader.present();
                }

              })
          } else {
            loader.present();
          }

        })
    }

  }
  checkPhone(){
    var  re = /^1\d{10}$/;   //正则表达式
    var  ren=re.test(this.accountMobile);
    //判断手机号是否为空
    this.checkMoblieNull=false;
    this.checkMoblie=false;
    if(this.accountMobile==null || this.accountMobile==""){
      this.checkMoblieNull=true;
    }else {
      //判断手机号是否为11
      if (!re.test(this.accountMobile)) {      //判断字符是否是11位数字
        this.checkMoblie=true;
      }
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
    if(this.checkMoblie == false && this.checkMoblieNull == false){
      this.http.post(AppConfig.SMS_MESSAGEXSEND_URL, {
        tel : this.accountMobile,
        type : 0
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        responseType: 'json'
      })
        .subscribe(data =>{
          this.data = data;
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: this.data.message,
            buttons:['确定']
          });
          alert.present();
          console.log(this.data.data)
        })
    }
  }
}

