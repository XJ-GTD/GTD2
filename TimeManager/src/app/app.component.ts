import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { ParamsService } from "../service/params.service";
import { WebsocketService } from "../service/websocket.service";

@Component({
  templateUrl: 'app.html',
  providers: [ ParamsService, WebsocketService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any;
  pages: Array<{title: string, component: any}>;
  backButtonPressed: boolean = false; //返回键是否已c触发

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
      if (result != null && result) {
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
