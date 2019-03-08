import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, IonicApp} from 'ionic-angular';
import {MenuScalePushType} from "../components/menuType/customType";
import {BackgroundMode} from '@ionic-native/background-mode';
import {XiaojiAssistantService} from "../service/util-service/xiaoji-assistant.service";
import {PageConfig} from "./page.config";

@Component({
  template: '<ion-nav></ion-nav>'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform,
              private appCtrl: IonicApp,
              private backgroundMode: BackgroundMode,
              private speechService: XiaojiAssistantService) {

    console.log(' time app start ');
    MenuController.registerType('scalePush', MenuScalePushType);

    this.platform.ready().then(() => {
      //允许进入后台模式
      this.backgroundMode.enable();
      //设置返回键盘（android）
      this.registerBackButtonAction();
      //跳转页面
      this.nav.setRoot(PageConfig._AL_PAGE);
    });
  }

  registerBackButtonAction(): void {
    this.platform.registerBackButtonAction(() => {
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.appCtrl._toastPortal.getActive() || this.appCtrl._loadingPortal.getActive() || this.appCtrl._overlayPortal.getActive();
      let activePortal = this.appCtrl._modalPortal.getActive();
      if (activePortal) {
        this.speechService.stopSpeak();
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }

      if (this.nav.canGoBack()) {
        this.nav.pop();
      } else {
        this.backgroundMode.moveToBackground();
      }

    }, 1);
  }
}
