import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import {UtilService} from "../../service/util-service/util.service";
import {PageConfig} from "../../app/page.config";
import {XiaojiAlarmclockService} from "../../service/util-service/xiaoji-alarmclock.service";

/**
 * Generated class for the AaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aa',
  template:
  '<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>设置</ion-title>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding class="page-backgroud-color">' +
  '  <div>' +
  '    <button ion-item (click)="accountSecurity()" class="rowCss">' +
  '      <ion-label>账号与安全</ion-label>' +
  '    </button>' +
  '    <button ion-item (click)="newsMessage()" class="rowCss">' +
  '      <ion-label>消息通知</ion-label>' +
  '    </button>' +
  '    <button ion-item (click)="cleanCache()" class="rowCss no-border">' +
  '      <ion-label item-start>缓存清理</ion-label>' +
  '      <ion-label item-end text-end>5.5M</ion-label>' +
  '    </button>' +
  '    <button ion-item (click)="shareApp()" margin-top class="rowCss no-border">' +
  '      <ion-label>分享APP</ion-label>' +
  '    </button>' +
  '    <button ion-item (click)="aboutApp()" margin-top class="rowCss">' +
  '      <ion-label>关于</ion-label>' +
  '    </button>' +
  '    <button ion-item (click)="helpAndFeedback()" class="rowCss no-border">\n' +
  '      <ion-label>帮助及反馈</ion-label>\n' +
  '    </button>\n' +
  '  </div>\n' +
  '</ion-content>\n',
  // '\n' +
  // '<ion-footer>\n' +
  // '  <ion-item class="rowCss">\n' +
  // '    <ion-label text-center color="danger" (click)="logOut()">退出登录</ion-label>\n' +
  // '  </ion-item>\n' +
  // '\n' +
  // '</ion-footer>\n'
})
export class AaPage {

  @ViewChild(Navbar) navBar: Navbar;

  testDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alarm: XiaojiAlarmclockService,
              private paramsService: ParamsService,

              public util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AaPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  };


  logOut() {
    this.paramsService.user = null;
    window.localStorage.clear();
    console.log('AaPage跳转UbPage');
    this.navCtrl.push(PageConfig.UB_PAGE);
  }

  accountSecurity() {

  }

  newsMessage() {

  }

  cleanCache() {

  }

  shareApp() {

  }

  aboutApp() {

  }

  helpAndFeedback() {
    console.log('AaPage跳转AdPage')
    this.navCtrl.push(PageConfig.AD_PAGE);
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

  testAlarm() {
    this.testDate = this.testDate.replace("T", " ");
    this.testDate = this.testDate.replace(":00Z","");
    console.log('设置完成 时间' + this.testDate);
    this.alarm.setAlarmClock(this.testDate, "测试闹钟");
  }
}

