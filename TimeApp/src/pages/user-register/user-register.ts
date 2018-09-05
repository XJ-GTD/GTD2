import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";
import {ParamsService} from "../../service/params.service";

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
  user: any;
  accountName: any;
  accountPassword: any;
  accountMobile: any;
  userName: any;
  reAccountPassword: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              public toastCtrl: ToastController,
              private paramsService: ParamsService) {
    this.RegisterForm = this.formBuilder.group({
      accountName: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(12)])],
      accountMobile:['',Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(11)])],
      accountPassword: ['', Validators.compose([Validators.required, Validators.minLength(6),Validators.maxLength(20)])],
      reAccountPassword:['',Validators.compose([Validators.required])]
    })
    this.accountName = "100" + this.RegisterForm.controls['accountMobile'];
    this.accountMobile=this.RegisterForm.controls['accountMobile'];
    this.accountPassword = this.RegisterForm.controls['accountPassword'];
    this.reAccountPassword=this.RegisterForm.controls['reAccountPassword'];
    this.userName = this.RegisterForm.controls['userName'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

  register(form) {
    let registerMessage = this.toastCtrl.create({
      message: "",
      duration: 3000,
      position: "middle"
    });

    //用户注册
    this.http.post(AppConfig.USER_REGISTER_URL, {
      accountName: this.accountName,
      accountPassword: form.accountPassword,
      accountMobile: form.accountMobile,
      userName: this.userName
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        if (this.data.code == "0") {
          registerMessage.present(registerMessage.setMessage(this.data.message));
          //注册成功后登陆
          this.http.post(AppConfig.USER_LOGIN_URL, {
            accountName: form.accountName,
            accountPassword: form.accountPassword
          },{
            headers: {
              "Content-Type": "application/json"
            },
            responseType: 'json'
          })
            .subscribe(data => {
              console.log(data);
              this.user = data;

              if (this.user.code == "0") {
                this.paramsService.data = this.user.data.userInfo;
                registerMessage.present(registerMessage.setMessage(this.user.message));
                this.navCtrl.push('HomeMenuPage');
              } else {
                registerMessage.present(registerMessage.setMessage(this.user.message));
              }

            })
        } else {
          registerMessage.present(registerMessage.setMessage(this.data.message));
        }

      })

  }
}
