import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the 帮助 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hl',
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
export class HlPage {

  @ViewChild(Navbar) navBar: Navbar;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private element: ElementRef) {
  }

  ionViewDidLoad() {
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
}
