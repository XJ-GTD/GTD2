import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, IonicApp, App} from 'ionic-angular';
import {MenuScalePushType} from "../components/menuType/customType";
import {BackgroundMode} from '@ionic-native/background-mode';
import {DataConfig} from "../service/config/data.config";
import {UtilService} from "../service/util-service/util.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {LsPushType} from "../components/menuType/LsPushType";
import {StatusBar} from "@ionic-native/status-bar";

@Component({
  template: `
    <ion-nav></ion-nav>
  `
})
export class MyApp {
  constructor(public app: App,
              private platform: Platform,
              private appCtrl: IonicApp,
              private backgroundMode: BackgroundMode,
              private util: UtilService,
              private screenOrientation: ScreenOrientation,
              private statusBar: StatusBar,
            ) {
    //特殊菜单设置
    MenuController.registerType('scalePush', MenuScalePushType);
    MenuController.registerType('lsPush', LsPushType);

    // let status bar overlay webview
    // statusBar.overlaysWebView(true);

// set status bar to white
//     statusBar.backgroundColorByHexString('#000000');
    this.statusBar.overlaysWebView(true);
    //模态框进入时改变状态栏颜色
    // this.app.viewDidEnter.subscribe((event) => {
    //   if (event && event.instance && DataConfig.isPage(event.instance)) {
    //     if (event.instance.statusBarColor) {
    //       this.statusBar.backgroundColorByHexString(event.instance.statusBarColor);
    //       this.statusbarcolors.push(event.instance.statusBarColor);
    //     } else {
    //       this.statusBar.backgroundColorByHexString("#000");
    //       this.statusbarcolors.push("#000");
    //     }
    //   }
    // });

    //模态框退出时还原状态栏颜色
    // this.app.viewWillLeave.subscribe((event) => {
    //   if (event && event.instance && DataConfig.isPage(event.instance)) {
    //     //清除当前画面颜色
    //     this.statusbarcolors.pop();
    //     //取得上个画面的颜色
    //     if (this.statusbarcolors.length > 0) {
    //       let bgcolor = this.statusbarcolors[this.statusbarcolors.length - 1];
    //       this.statusBar.backgroundColorByHexString(bgcolor);
    //     } else {
    //       this.statusBar.backgroundColorByHexString("#000");
    //     }
    //   }
    // });

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


      //跳转页面（过渡页面）
      this.app.getRootNav().setRoot(DataConfig.PAGE._AL_PAGE);
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
