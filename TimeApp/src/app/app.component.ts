import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { ParamsService } from "../service/params.service";
import { WebsocketService } from "../service/websocket.service";
import { XiaojiAssistantService } from "../service/xiaoji-assistant.service";
import { XiaojiAlarmclockService } from "../service/xiaoji-alarmclock.service";
import { TimeService } from "../service/time.service";


@Component({
  templateUrl: 'app.html',
  providers: [ ParamsService, WebsocketService, XiaojiAssistantService, XiaojiAlarmclockService, TimeService ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage:any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private paramsService: ParamsService
  ) {
    //通过key，判断是否曾进入过引导页
    this.storage.get('firstIn').then((result) => {
      console.log('firstIn is', result);
      if (this.paramsService.user == null) {
        if (result != null && result) {
          this.rootPage = 'UserLoginPage';
        } else {
          this.storage.set('firstIn', true);
          this.rootPage = 'WelcomePage';
        }
      } else {
        this.rootPage = 'HomePage';
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
