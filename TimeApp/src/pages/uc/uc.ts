import {Component, ViewChild} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Navbar} from 'ionic-angular';
import {ParamsService} from "../../service/util-service/params.service";
import {UEntity} from "../../entity/u.entity";
import {UserService} from "../../service/user.service";
import {DataConfig} from "../../app/data.config";

/**
 * Generated class for the UcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-uc',
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
    <ion-item no-border> 
      <ion-label>昵称</ion-label> 
      <ion-input type="text" *ngIf="this.state == true" [(ngModel)]="uo.uN"></ion-input> 
      <ion-input type="text" *ngIf="this.state == false" disabled="true" [(ngModel)]="uo.uN"></ion-input> 
      <ion-avatar item-end> 
        <img src="./assets/imgs/headImg.jpg" style="width: 60px;height: 60px"> 
      </ion-avatar> 
    </ion-item> 
    <button ion-item margin-top *ngIf="this.state == false" class="rowCss"> 
      <ion-label item-start>性别</ion-label> 
      <ion-label item-end text-end *ngIf="uo.uS == 0">无</ion-label> 
      <ion-label item-end text-end *ngIf="uo.uS == 1">男</ion-label> 
      <ion-label item-end text-end *ngIf="uo.uS == 2">女</ion-label> 
    </button> 
    <ion-item margin-top *ngIf="this.state == true" class="rowCss"> 
      <ion-label>性别</ion-label> 
      <ion-select  item-end [(ngModel)]="uo.uS"> 
        <ion-option value="0">无</ion-option> 
        <ion-option value="1">男</ion-option> 
        <ion-option value="2">女</ion-option> 
      </ion-select> 
    </ion-item> 
    <button ion-item class="rowCss" no-border> 
      <ion-label>生日</ion-label> 
      <ion-label item-end text-end *ngIf="this.state == false">{{uo.biy}}</ion-label> 
      <ion-datetime displayFormat="YYYY-MM-DD" *ngIf="this.state == true" item-end text-end float-end [(ngModel)]="uo.biy"></ion-datetime> 
    </button> 
    <button ion-item margin-top no-border *ngIf="this.state == false" class="rowCss"> 
      <ion-label>手机号</ion-label> 
      <ion-label item-end text-end >{{uo.uCt}}</ion-label> 
    </button> 
    <button ion-item margin-top  *ngIf="this.state == true" class="rowCss"> 
      <ion-label>手机号</ion-label> 
      <ion-input type="tel" item-end text-end [(ngModel)]="uo.uCt"></ion-input> 
    </button> 
    <button ion-item (click)="relation()" no-border margin-top class="rowCss">关系人</button> 
  </ion-content>`,
})
export class UcPage {

  @ViewChild(Navbar) navBar: Navbar;

  //编辑控制
  state:any = false;
  uo:UEntity;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  init() {
    this.uo = DataConfig.uInfo;
    console.log("uc 获取用户信息："+JSON.stringify(this.uo))
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

  confirm(uo:UEntity){
    this.userService.upu(uo.uI,uo.uN,uo.hIU,uo.biy,uo.rn,uo.iC,uo.uS).then(data=>{
      if(data.code == 0){
        this.state = false;
        console.log("修改信息成功");
        this.userService.getUo().then(data=>{
          if(data.code == 0){

          }
        })
      }else{
        this.state = true;
        console.log("修改信息失败")
      }
    }).catch(reason => {
      this.state = true;
      console.log("修改信息失败")
    })

  }

}
