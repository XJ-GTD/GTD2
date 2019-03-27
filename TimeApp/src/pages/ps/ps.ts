import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Navbar} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {PageUData, PsService} from "./ps.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 个人设置 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ps',
  providers: [],
  template:`<ion-header> 
    <ion-navbar> 
      <ion-title></ion-title> 
      <ion-buttons right> 
        <button ion-button ion-only *ngIf="state == false" (click)="edit()" style="padding-right: 10px;"> 
          编辑 
        </button> 
        <button ion-button ion-only *ngIf="state == true" (click)="confirm(uo)" style="padding-right: 10px;"> 
          确定 
        </button> 
      </ion-buttons> 
    </ion-navbar> 
  </ion-header> 
  <ion-content padding class="page-backgroud-color"> 
    <ion-item class="no-border"> 
      <ion-label>昵称</ion-label> 
      <ion-input type="text" *ngIf="this.state == true" [(ngModel)]="uo.user.name"></ion-input> 
      <ion-input type="text" *ngIf="this.state == false" disabled="true" [(ngModel)]="uo.user.name"></ion-input> 
      <ion-avatar item-end> 
        <img src="./assets/imgs/headImg.jpg" style="width: 60px;height: 60px"> 
      </ion-avatar> 
    </ion-item> 
    <button ion-item margin-top *ngIf="this.state == false" class="rowCss"> 
      <ion-label item-start>性别</ion-label> 
      <ion-label item-end text-end *ngIf="uo.user.sex == 0">无</ion-label> 
      <ion-label item-end text-end *ngIf="uo.user.sex == 1">男</ion-label> 
      <ion-label item-end text-end *ngIf="uo.user.sex == 2">女</ion-label> 
    </button> 
    <ion-item margin-top *ngIf="this.state == true" class="rowCss"> 
      <ion-label>性别</ion-label> 
      <ion-select  item-end [(ngModel)]="uo.user.sex"> 
        <ion-option value="0">无</ion-option> 
        <ion-option value="1">男</ion-option> 
        <ion-option value="2">女</ion-option> 
      </ion-select> 
    </ion-item> 
    <button ion-item class="rowCss no-border"> 
      <ion-label>生日</ion-label> 
      <ion-label item-end text-end *ngIf="this.state == false">{{uo.user.bothday}}</ion-label> 
      <ion-datetime displayFormat="YYYY-MM-DD" *ngIf="this.state == true" item-end text-end float-end [(ngModel)]="uo.user.bothday"></ion-datetime> 
    </button> 
    <button ion-item margin-top *ngIf="this.state == false" class="rowCss no-border"> 
      <ion-label>手机号</ion-label> 
      <ion-label item-end text-end >{{uo.user.No}}</ion-label> 
    </button> 
    <button ion-item margin-top  *ngIf="this.state == true" class="rowCss no-border noborder"> 
      <ion-label>手机号</ion-label> 
      <ion-input type="tel" item-end text-end [(ngModel)]="uo.user.No"></ion-input> 
    </button>
  </ion-content>`,
})
export class PsPage {

  @ViewChild(Navbar) navBar: Navbar;

  //编辑控制
  state:any = false;
  uo:PageUData = new PageUData();

  constructor(public navCtrl: NavController,
              private psService:PsService,
              public navParams: NavParams,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
    this.init();
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  init() {
    this.psService.getUser().then(data=>{
      if(data && data.user){
        this.uo = data;
      }
    })
    // this.uo = DataConfig.uInfo;
    // console.log("uc 获取用户信息："+JSON.stringify(this.uo))
  }

  updateUserInfo() {

  }

  relation() {
    console.log("UcPage跳转PaPage");
    this.navCtrl.push("PaPage");
  }

  edit(){
    this.state = true;
  }

  save(){
    this.psService.saveUser(this.uo).then(data=>{
      if(data.code ==0){
        this.util.toast('保存成功！',2000);
      }
    })
  }

  confirm(){
    // this.userService.upu(uo.uI,uo.uN,uo.hIU,uo.biy,uo.rn,uo.iC,uo.uS, uo.uCt).then(data=>{
    //   if(data.code == 0){
    //     this.state = false;
    //     console.log("修改信息成功");
    //     this.userService.getUo().then(data=>{
    //       if(data.code == 0){
    //
    //       }
    //     })
    //   }else{
    //     this.state = true;
    //     console.log("修改信息失败")
    //   }
    // }).catch(reason => {
    //   this.state = true;
    //   console.log("修改信息失败")
    // })

  }

}
