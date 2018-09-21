import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/params.service";
import { AppConfig } from "../../app/app.config";

/**
 * Generated class for the UserRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
  providers: []
})
export class UserRegisterPage {

  RegisterForm: FormGroup;
  data: any;
  accountName: any;
  accountPassword: any;
  accountMobile: any;
  userName: any;
  reAccountPassword: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {

    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  init() {
    this.RegisterForm = this.formBuilder.group({
      accountMobile:['',Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      accountPassword: ['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(20)])],
      reAccountPassword:['',Validators.compose([Validators.required])]

    });
    this.accountMobile = this.RegisterForm.controls['accountMobile'];
    this.accountPassword = this.RegisterForm.controls['accountPassword'];
    this.reAccountPassword = this.RegisterForm.controls['reAccountPassword'];
  }

  register(form) {

    //用户注册
    this.http.post(AppConfig.USER_REGISTER_URL, {
      accountName: this.accountName,
      accountPassword: form.accountPassword,
      accountMobile: form.accountMobile,
      userName: this.userName,
      loginType: 0
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
            accountName: form.accountMobile,
            accountPassword: form.accountPassword,
            loginType: 0
          },{
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
                this.navCtrl.push('HomePage');
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
