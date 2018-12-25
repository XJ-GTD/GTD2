import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import { LsmService} from "../../service/lsm.service";

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private paramsService: ParamsService,
    private lsmService: LsmService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbPage');
    this.rePage = this.navParams.get("rePage");
    console.log(this.rePage)
  }

  signIn() {

    console.debug("登录按钮被点击");
    if(this.accountName == null && this.accountPassword == null){
      let alert = this.alertCtrl.create({
        subTitle: "输入为空",
      });
      alert.present();
      return;
    }
     this.lsmService.login(this.accountName, this.accountPassword).then(data=> {
       console.log(data);
       if (data.code == 0) {
         console.debug("登录成功");
         let alert = this.alertCtrl.create({
           title: '提示信息',
           subTitle: "登录成功",
           buttons: [{
             text: '确定', role: 'cancel', handler: () => {
               if(!this.rePage){
                 //跳转首页
                 console.log('UbPage跳转HzPage');
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
          let alert = this.alertCtrl.create({
            title:'提示信息',
            subTitle: "登录失败",
            buttons:["确定"]
          });
          alert.present();
       }

     }).catch(res=>{
       console.debug("登录失败");
       let alert = this.alertCtrl.create({
         title:'提示信息',
         subTitle: "登录失败",
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
