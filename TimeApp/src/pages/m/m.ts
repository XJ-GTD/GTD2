import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import {PageConfig} from "../../app/page.config";
import {UserService} from "../../service/user.service";
import {UEntity} from "../../entity/u.entity";
import {DataConfig} from "../../app/data.config";

/**
 * Generated class for the MPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m',
  providers: [],
  template:'<!--首页侧边栏-->' +
  '<ion-menu [content]="ha" side="left" swipeEnabled = "false" type="scalePush">' +
  '  <ion-content>' +
  '    <ion-item margin-top margin-bottom (click)="toUc()" [hidden]="uo.uty == 0" id="tag1" style="height:185px" no-lines>' +
  '      <ion-avatar item-start>' +
  '        <img [src]="imgurl" class="img_size">' +
  '      </ion-avatar>' +
  '      <h1 [innerHtml]="uo.uN"></h1>' +
  '      <span [innerHtml]="uo.uCt" class="fontcol"></span>' +
  '    </ion-item>' +
  '' +
  '    <ion-item [hidden]="uo.uty != 0" (click)="toUb()" no-lines  style="height:185px" >' +
  '      <button ion-button class="sign_button">' +
  '        登录/注册' +
  '      </button>' +
  '    </ion-item>' +
  '    <ion-list>' +
  '      <ion-item style="height:76px">' +
  '        <img src="./assets/imgs/13.png" item-start class="icon_size"/>' +
  '        <ion-toggle (ionChange)="inPrivate()"></ion-toggle>' +
  '        <ion-label>隐私模式</ion-label>' +
  '      </ion-item>' +
  '      <ion-item (click)="playerListShow()" style="height:76px">' +
  '        <img src="./assets/imgs/12.png" item-start class="icon_size"/>' +
  '        <ion-label>参与人</ion-label>' +
  '      </ion-item>' +
  '      <ion-item (click)="toPl()" style="height:76px" >' +
  '        <img src="./assets/imgs/11.png" item-start class="icon_size "/>' +
  '        <ion-label>计划</ion-label>' +
  '      </ion-item>' +
  '    </ion-list>' +
  '  </ion-content>' +
  '  <ion-footer>' +
  '    <ion-item  (click)="userSet()">设置</ion-item>' +
  '  </ion-footer>' +
  '</ion-menu>' +
  '<ion-nav #ha [root]="haPage"></ion-nav>',

})
export class MPage {
  @ViewChild('myTabs') tabRef: Tabs;

  haPage: any = PageConfig.HA_PAGE;
  // uo: UModel;
  uo:UEntity;
  imgurl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public userService: UserService) {
    this.uo = DataConfig.uInfo;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MPage');
    this.imgurl = "./assets/imgs/headImg.jpg";
  }


  userSet() {
    console.log("跳转设置页MPage跳转SsPage");
    this.navCtrl.push("SsPage");

  }

  inPrivate() {

  }

  playerListShow() {
    console.log("跳转参与人页MPage跳转GlPage");
    this.navCtrl.push('GlPage',{popPage:'MPage'});
  }

  sbAdd(){
    console.log("跳转日程添加MPage跳转SbPage");
    this.navCtrl.push('SbPage',{popPage:'MPage'});
  }

  toPl(){
    console.log("跳转计划一览PlPage");
    this.navCtrl.push(PageConfig.PL_PAGE);
  }

  toUc(){
    console.log("跳转用户详情MPage跳转UcPage");
    this.navCtrl.push('UcPage',{popPage:'MPage',uo:this.uo});
  }

  toUb(){
    console.log("跳转用户详情MPage跳转LpPage");
    this.navCtrl.push(PageConfig.LP_PAGE);
  }

  showHistory() {

  }

  ionViewWillEnter(){
    // console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
    //this.getuo();
    console.log("ionViewWillEnter 刷新MPage :: ");
    this.uo = DataConfig.uInfo;
    console.log("m 获取用户信息："+JSON.stringify(this.uo));
  }
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
