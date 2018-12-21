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
    this.rePage = this.navParams.get("rePage");
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
                      if(!this.rePage){
                        //跳转首页
                        this.navCtrl.setRoot('HzPage');
                      }else{
                        this.navCtrl.getViews().forEach(page=>{
                          if(page.name == this.rePage){
                            this.navCtrl.popTo(page);
                          }
                        })
                      }

                    }
                  }]
                });
                alert.present();
              }else{
                console.debug("登录失败");
                //登陆失败
                let alert = this.alertCtrl.create({
                  title:'提示信息',
                  subTitle: "登录失败",
                  buttons:['确定']
                });
                alert.present();
              }


            }).catch(reason => {
              console.debug("登录失败");
              //登陆失败
              let alert = this.alertCtrl.create({
                title:'提示信息',
                subTitle: "登录失败",
                buttons:['确定']
              });
              alert.present();
            })
          }else{
            console.debug("注册失败");
            let alert = this.alertCtrl.create({
              title:'提示信息',
              subTitle: "注册失败",
              buttons:['确定']
            });
            alert.present();
          }
        }).catch(reason => {
          console.debug("注册失败");
          //注册失败
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: "注册失败",
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

