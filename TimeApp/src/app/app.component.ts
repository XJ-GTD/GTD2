import { Component } from '@angular/core';
import {Platform, Nav,IonicApp} from 'ionic-angular';
import {BackgroundMode} from '@ionic-native/background-mode';
import {BaseSqliteService} from "../service/sqlite-service/base-sqlite.service";
import {ConfigService} from "../service/config.service";
import {PageConfig} from "./page.config";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = PageConfig.AL_PAGE;

  constructor(
    public platform: Platform,
    public appCtrl: IonicApp,
    public backgroundMode: BackgroundMode,
    private nav:Nav,
    private configService:ConfigService
  ) {
  }

  ionViewDidLoad() {
    console.debug(' time app start ');
    this.platform.ready().then(() => {
      //允许进入后台模式
      this.backgroundMode.enable();
      //设置返回键（android）
      this.registerBackButtonAction();


      //判断是否进入boot页面
      this.configService.isIntoBoot().then(isInto=>{
        if (isInto){
          this.rootPage = PageConfig.AZ_PAGE;
        }

      }).then(data=>{
        alert(1)
      }).then(data=>{
        console.debug(' time app into go to ' +  this.rootPage);
        this.nav.setRoot(this.rootPage);
      }).catch(err=>{
        this.rootPage = PageConfig.AZ_PAGE;
        console.debug(' time app start err' +  err + 'go to ' + this.rootPage);
        this.nav.setRoot(this.rootPage);
      })
    });
  }

  registerBackButtonAction(): void {
    this.platform.registerBackButtonAction(() => {
      //如果想点击返回按钮隐藏toast或loading或Overlay就把下面加上
      // this.appCtrl._toastPortal.getActive() || this.appCtrl._loadingPortal.getActive() || this.appCtrl._overlayPortal.getActive();
      let activePortal = this.appCtrl._modalPortal.getActive();
      if (activePortal) {
        activePortal.dismiss().catch(() => {
        });
        activePortal.onDidDismiss(() => {
        });
        return;
      }

      if (this.nav.canGoBack())  {
        this.nav.pop();
      } else {
        this.backgroundMode.moveToBackground();
      }

    }, 1);
  }

}
