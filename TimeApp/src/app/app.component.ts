import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, MenuController, IonicApp, App, Config} from 'ionic-angular';
import {MenuScalePushType} from "../components/menuType/customType";
import {BackgroundMode} from '@ionic-native/background-mode';
import {DataConfig} from "../service/config/data.config";
import {UtilService} from "../service/util-service/util.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {LsPushType} from "../components/menuType/LsPushType";
import {StatusBar} from "@ionic-native/status-bar";
import {Device} from "@ionic-native/device";
import {
  ModalFromLeftEnter,
  ModalFromLeftLeave,
  ModalFromRightEnter,
  ModalFromRightLeave, ModalFromTopEnter,
  ModalFromTopLeave, ModalScaleEnter, ModalScaleLeave
} from "./AppTransition";

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
              private device: Device,
              private screenOrientation: ScreenOrientation,
              public config: Config
            ) {
    //特殊菜单设置
    MenuController.registerType('scalePush', MenuScalePushType);
    MenuController.registerType('lsPush', LsPushType);
    this.setCustomTransitions();

    this.platform.ready().then(() => {
      //this.util.loadingEnd();

      //允许进入后台模式
      if (this.util.hasCordova()) {

        if (this.device.platform == "Android") {
          this.backgroundMode.setDefaults({silent: true, hidden: true}).then(d => {
            this.backgroundMode.enable();
            this.backgroundMode.isActive()
          })

          //设置返回键盘（android）
          this.registerBackButtonAction();
        }

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

  private setCustomTransitions() {
    this.config.setTransition('modal-from-right-enter', ModalFromRightEnter);
    this.config.setTransition('modal-from-right-leave', ModalFromRightLeave);
    this.config.setTransition('modal-from-left-enter', ModalFromLeftEnter);
    this.config.setTransition('modal-from-left-leave', ModalFromLeftLeave);
    this.config.setTransition('modal-from-top-enter', ModalFromTopEnter);
    this.config.setTransition('modal-from-top-leave', ModalFromTopLeave);
    this.config.setTransition('modal-scale-enter', ModalScaleEnter);
    this.config.setTransition('modal-scale-leave', ModalScaleLeave);
  }

}
