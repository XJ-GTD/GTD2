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
  templateUrl: 'ub.html',
  providers: []
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
         let alert = this.alertCtrl.create({
           title: '提示信息',
           subTitle: "登录成功",
           buttons: [{
             text: '确定', role: 'cancel', handler: () => {
               if(this.rePage==undefined){
                 //跳转首页
                 console.log('UbPage跳转HzPage');
                 this.navCtrl.setRoot('HzPage');
               }else{
                 //登录分析
                 //登录成功跳转，登录成功返回，
                 this.navCtrl.getViews().forEach(page=>{
                   if(page.name == this.rePage){
                     this.navCtrl.popTo(page);
                     return;
                   }
                 });
               }
             }
           }]
         });
         alert.present();
       }else if(data.code == 1){
         this.utilService.unloading();
         console.log("登录失败");
         let alert = this.alertCtrl.create({
           title:'提示信息',
           subTitle: data.message,
           buttons:["确定"]
         });
         alert.present();
       } else{
         this.utilService.unloading();
         let message = ReturnConfig.RETURN_MSG.get(data.code.toString());
         console.log("登录失败 :: " + message );
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: message,
            buttons:["确定"]
          });
          alert.present();
       }

    }).catch(res=>{
      this.utilService.unloading();
       console.log("登录失败 :: " +　res.message);

       let alert = this.alertCtrl.create({
         title:'提示信息',
         subTitle: res.message,
         buttons:["确定"]
       });

       alert.present();
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
