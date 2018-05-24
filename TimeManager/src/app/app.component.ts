import { Component, ViewChild } from '@angular/core';

import {Platform, MenuController, Nav} from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any;// = 'UserLoginPage';
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage
  ) {
    //通过key，判断是否曾进入过引导页
    this.storage.get('firstIn').then((result) => {
      console.log('firstIn is', result);
      result = false;
      if (result) {
        this.rootPage = 'UserLoginPage';
      } else {
        this.storage.set('firstIn', true);
        this.rootPage = 'WelcomePage';
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

}
