import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "../../service/util-service/params.service";
import { UtilService} from "../../service/util-service/util.service";
import {LsmService} from "../../service/lsm.service";
import {HaPage} from "../ha/ha";
import {timeout} from "rxjs/operator/timeout";


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
  errorCode: any;
  timeOut:any = "发送验证码";
  timer:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private paramsService: ParamsService,
              private utilService: UtilService,
              private lsmService: LsmService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UaPage');
  }

  register() {
    var a=this.checkBoxClick;
    if (!this.checkBoxClick== true)
    {
      this.checkBoxClickFlag=true;
    }else
    {
      this.checkBoxClickFlag=false;
      if(this.errorCode == 3 && this.checkPassword == false ){
        this.lsmService.sn(this.accountMobile,this.accountPassword,this.authCode).then(data =>{
          if(data.code == 0) {
            //注册成功执行登陆
            this.lsmService.login(this.accountMobile, this.accountPassword).then(data => {
              // 登陆成功
              let alert = this.alertCtrl.create({
                title: '提示信息',
                subTitle: data.message,
                buttons: [{
                  text: '确定', role: 'cancel', handler: () => {
                    //跳转首页
                    this.navCtrl.setRoot('HzPage');
                  }
                }]
              });
              alert.present();

            }).catch(reason => {
              //登陆失败
              let alert = this.alertCtrl.create({
                title:'提示信息',
                subTitle: reason.message,
                buttons:['确定']
              });
              alert.present();
            })
          }else{
            let alert = this.alertCtrl.create({
              title:'提示信息',
              subTitle: data.message,
              buttons:['确定']
            });
            alert.present();
          }
        }).catch(reason => {
          //注册失败
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: reason.message,
            buttons:['确定']
          });
          alert.present();
        })
      }
      //用户注册

    }

  }
  checkPhone(){

    this.errorCode = this.utilService.checkPhone(this.accountMobile);
    if(this.errorCode == 0){
      this.checkMoblieNull = true;
    }
    if(this.errorCode == 1 || this.errorCode == 2){
      this.checkMoblieNull = false;
      this.checkMoblie = true;
    }
    if(this.errorCode == 3){
      this.checkMoblie = false;
      this.checkMoblieNull = false;
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
    console.log(11);
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

    }else{
      let alert = this.alertCtrl.create({
        title:'提示信息',
        subTitle: '请填写正确的手机号',
        buttons:['确定']
      });
      alert.present();
    }
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
  }
}

