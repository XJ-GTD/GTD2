import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Navbar} from 'ionic-angular';
import {RelmemService} from "../../service/relmem.service";
import {UEntity} from "../../entity/u.entity";
import {PageConfig} from "../../app/page.config";
import {RuModel} from "../../model/ru.model";
import {DataConfig} from "../../app/data.config";
import {UtilService} from "../../service/util-service/util.service";


/**
 * Generated class for the PcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  template:`<ion-header> 
    <ion-navbar> 
      <ion-title></ion-title> 
    </ion-navbar> 
  </ion-header> 
  <ion-content padding> 
    <ion-item style="height: 40%" class="flag" *ngIf="ru"> 
      <ion-avatar > 
        <img [src]="ru.hiu" style="width: 60px;height: 60px ;margin: 0 auto"> 
      </ion-avatar> 
      <ion-title style="margin: 0 auto">{{ru.rN}}</ion-title> 
    </ion-item> 
    <ion-item class="flag" *ngIf="ru"> 
      <ion-label>备注</ion-label> 
      <ion-input type="text" text-end placeholder="{{ru.rN}}" [(ngModel)]="ru.ran"></ion-input> 
    </ion-item> 
    <ion-item *ngIf="code == 1 || code == 2" class="flag"> 
      <ion-label>接收该用户的推送</ion-label> 
      <ion-checkbox item-end [(ngModel)]="ru.rF"></ion-checkbox> 
    </ion-item> 
    <ion-label></ion-label> 
    <ion-label></ion-label> 
    <ion-label></ion-label> 
    <ion-buttons *ngIf="code == 3 || code == 2" col-10  style="margin: 0 auto"> 
      <button ion-button round full (click)="submit()" >确定</button> 
    </ion-buttons> 
  </ion-content>`,
})
export class PcPage {

  @ViewChild(Navbar) navBar: Navbar;

  uo:UEntity;

  name:any;
  // tel:any;
  code:any;

  ru:RuModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private relme:RelmemService,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.name = this.navParams.get("name");
    // this.tel=this.navParams.get("tel");
    this.code = this.navParams.get("code");
    this.ru = this.navParams.get("u");
    console.log("dddddddddddd"+ JSON.stringify(this.ru));
  }

  ionViewWillEnter(){
    console.log("PcPage :: 获取登录用户");
    this.uo = DataConfig.uInfo;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };


  submit() {
    let loader = this.loadingCtrl.create({
      content: "",
      duration: 1000
    });
    //true 为1 false 为0
    if(this.ru.rF){
      this.ru.rF = "1"
    }else{
      this.ru.rF = "0"
    }
    if(this.ru.hiu == null){
      this.ru.hiu = DataConfig.defaultHeadImg;
    }
    this.relme.aru(this.uo.uI,this.ru.rI,this.ru.ran,this.ru.rN,  this.ru.rC, '0',this.ru.hiu,this.ru.rF,null).then(data => {
      if(data.code == 0){
        //添加成功
        // console.log("添加成功::" + this.tel);
        let pageList = this.navCtrl.getViews().forEach(page => {
          if(page.name == PageConfig.PA_PAGE){
            this.navCtrl.popTo(page);
          } else {
          }
        });
      }else{
        //添加失败
        // console.log("添加失败::" + this.tel);
        loader.setContent("服务器繁忙，添加失败");
        loader.present();
      }

    }).catch(reason => {
      //添加失败
      // console.log("添加失败::" + this.tel);
      loader.setContent("出错了，添加失败");
      loader.present();
    })
  }

}
