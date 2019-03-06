import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {DwEmitService} from "../../service/util-service/dw-emit.service";

/**
 * Generated class for the AdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ad',
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>意见反馈</ion-title>' +
  '    <ion-buttons right>' +
  '      <button icon-only ion-button style="padding-right: 10px;">' +
  '        完成' +
  '      </button>' +
  '    </ion-buttons>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <ion-label>问题描述</ion-label>' +
  '  <ion-textarea placeholder="请描述你遇到的问题" (input)="updateEditor()"></ion-textarea>' +
  '  <div ion-item no-padding>' +
  '    <div>' +
  '      <ion-thumbnail ion-button color="light" float-left class="padding-0">' +
  '        <img src="http://pics.sc.chinaz.com/files/pic/pic9/201811/bpic9202.jpg" style="border-radius: 5px">' +
  '      </ion-thumbnail>' +
  '    </div>' +
  '    <div>' +
  '      <ion-thumbnail ion-button color="light" class="div-add-border" >' +
  '        <ion-icon name="add"></ion-icon>' +
  '      </ion-thumbnail>' +
  '    </div>' +
  '  </div>' +
  '</ion-content>'
})
export class AdPage {

  @ViewChild(Navbar) navBar: Navbar;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dwEmit: DwEmitService,
              private element: ElementRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  updateEditor(){
    let el = this.element.nativeElement.querySelector("textarea");
    el.style.overflow = "hidden";
    el.style.height = "auto";
    if (el['scrollHeight'] >= 120) { //给输入框设定一个最小的高度
      el['style'].height = el['scrollHeight'] + "px";
    }else {
      el['style'].height = "120px";
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

}
