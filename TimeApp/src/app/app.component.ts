import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, IonicApp} from 'ionic-angular';
import {MenuScalePushType} from "../components/menuType/customType";
import {BackgroundMode} from '@ionic-native/background-mode';
import {DataConfig} from "../service/config/data.config";
import {RestfulClient} from "../service/util-service/restful.client";
import {UtilService} from "../service/util-service/util.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {LsPushType} from "../components/menuType/LsPushType";

@Component({
  template: `
    <ion-nav></ion-nav>
  `
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  constructor(private platform: Platform,
              private appCtrl: IonicApp,
              private backgroundMode: BackgroundMode,
              private restfulClient: RestfulClient,
              private util: UtilService,
              private screenOrientation: ScreenOrientation) {
    //特殊菜单设置
    MenuController.registerType('scalePush', MenuScalePushType);
    MenuController.registerType('lsPush', LsPushType);
    this.platform.ready().then(() => {
      //this.util.loadingEnd();
      //允许进入后台模式
      if (this.util.hasCordova()) {
        this.backgroundMode.setDefaults({silent: true, hidden: true}).then(d => {
          this.backgroundMode.enable();
        })
        //设置返回键盘（android）
        this.registerBackButtonAction();

        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      }
      this.restfulClient.init();

      //跳转页面（过渡页面）
      this.nav.setRoot(DataConfig.PAGE._AL_PAGE);
    });
  }

  registerBackButtonAction(): void {
    this.platform.registerBackButtonAction(() => {

      if (this.util.toast || this.util.loading || this.util.popover || this.util.alter) {
        if (this.util.toast) this.util.toastEnd();
        if (this.util.loading) this.util.loadingEnd();
        if (this.util.popover) this.util.popoverEnd();
        if (this.util.alter) this.util.alterEnd();
      } else {
        if (this.appCtrl._modalPortal.length() > 0) {
          this.appCtrl._modalPortal.pop();
        } else {
          this.backgroundMode.moveToBackground();
        }

      }


    }, 1);
  }
}
