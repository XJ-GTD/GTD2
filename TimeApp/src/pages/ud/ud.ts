import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, Navbar} from 'ionic-angular';
import {LsmService} from "../../service/lsm.service";
import {UtilService} from "../../service/util-service/util.service";
import {PageConfig} from "../../app/page.config";
import {DataConfig} from "../../app/data.config";
import {ReturnConfig} from "../../app/return.config";

/**
 * Generated class for the UdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ud',
  templateUrl: 'ud.html',
})
export class UdPage {

  @ViewChild(Navbar) navBar: Navbar;

  accountMobile:any;
  authCode:any;
  errorCode:any;
  agree:any = false;
  agreeFlag:any = true;
  timeOut:any = "发送验证码";
  timer:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public lsmService: LsmService,
              public alertCtrl: AlertController,
              public utilService: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UdPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };


  signIn() {
    if(this.agree != true || this.errorCode != 3){
      this.checkPhone();
      this.agreeFlag = this.agree;
      return ;
    }
    this.agreeFlag = true;
    this.lsmService.ml(this.accountMobile, this.authCode).then(data=> {
      console.log(data);
      let message = ReturnConfig.RETURN_MSG.get(data.code.toString());
      if (data.code == 0) {
        let alert = this.alertCtrl.create({
          title: '提示信息',
          subTitle: message,
          buttons: [{
            text: '确定', role: 'cancel', handler: () => {
              //跳转首页
              this.navCtrl.push('HzPage');
            }
          }]
        });
        alert.present();
      }else{
        let alert = this.alertCtrl.create({
          title:'提示信息',
          subTitle: message,
          buttons:["确定"]
        });
        alert.present();
      }

    }).catch(res=>{
      let alert = this.alertCtrl.create({
        title:'提示信息',
        subTitle: ReturnConfig.RETURN_MSG.get(res.code),
        buttons:["确定"]
      });
      alert.present();
      console.log(res);
    });

  }

  checkPhone(){

    this.errorCode = this.utilService.checkPhone(this.accountMobile);
    // if(this.errorCode == 0){
    //   this.checkMoblieNull = true;
    //   this.checkMoblie = true;
    // }
    // if(this.errorCode == 3){
    //   this.checkMoblie = false;
    //   this.checkMoblieNull = false;
    //  }
    // if(this.errorCode == 1 || this.errorCode == 2){
    //   this.checkMoblieNull = false;
    // }

  }

  userAgreement() {
    this.navCtrl.push('HcPage');
    this.agree = true;
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

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }


  format(){
    this.accountMobile = this.utilService.remo(this.accountMobile);
  }
}
