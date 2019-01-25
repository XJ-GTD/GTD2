import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import {RuModel} from "../../model/ru.model";
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the PbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pb',
  template:`<ion-header> 
    <ion-navbar> 
      <ion-title></ion-title> 
      <ion-buttons right> 
        <button ion-button ion-only *ngIf="state == false" (click)="edit()"  style="padding-right: 10px;"> 
          编辑 
        </button> 
        <button ion-button ion-only *ngIf="state == true" (click)="confirm()"  style="padding-right: 10px;"> 
          确定 
        </button> 
      </ion-buttons> 
    </ion-navbar> 
   
  </ion-header> 
  <ion-content padding> 
    <div *ngIf="u"> 
      <ion-item style="height: 40%"> 
        <ion-avatar > 
          <img [src]="u.hiu" style="width: 60px;height: 60px ;margin: 0 auto"> 
        </ion-avatar> 
        <ion-title style="margin: 0 auto">{{u.rN}}</ion-title> 
      </ion-item> 
      <!--<div >--> 
      <ion-item> 
        <ion-label>备注</ion-label> 
        <ion-input type="text" text-end placeholder="{{name}}" [disabled]="state ? false : true" [(ngModel)]="u.ran"></ion-input> 
      </ion-item> 
      <ion-item> 
        <ion-label>接收该用户的推送</ion-label> 
        <ion-checkbox item-end [disabled]="state ? false : true" [checked]="true" [(ngModel)]="isPush"></ion-checkbox> 
      </ion-item> 
      <ion-item *ngIf="isPop"> 
        <ion-label color="danger">他拒收了你的推送</ion-label> 
        <button item-end ion-button>再次发送</button> 
      </ion-item> 
      <!--</div>--> 
    </div> 
  </ion-content>`,
})
export class PbPage {

  @ViewChild(Navbar) navBar: Navbar;

  name:any;
  state:any;//true 编辑 false 不可编辑
  isPush:any;//接受用户推送 接受 true
  isPop:any;//是否被拒绝 拒绝 true
  u:RuModel = new RuModel();
  uo:UEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PbPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
    this.state = false;
    this.u = this.navParams.data.u;
    this.name = this.u.rN;
    if(this.u.rF == '0'){
      this.isPush = false;
    }
    if(this.u.rF == '1'){
      this.isPush = true;
    }
    this.isPop = false;
    console.log(this.name + this.state)
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };


  edit(){
    this.state = true;
  }

  confirm(){
    console.log(this.u.rF);
    if(this.isPush){
      this.u.rF = '1';
    }else{
      this.u.rF = '0';
    }
    console.log(this.u.id);
    this.relmemService.upr(this.u.id,this.u.ran,this.u.rN,this.u.rC,this.u.rel,this.u.rF,null,'').then(data=>{
      if(data.code == 0){
        this.state = false;
      }
    }).catch(reason => {

    });
    console.log(this.isPush);
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



}
