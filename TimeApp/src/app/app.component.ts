import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, Tabs, Events  } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { ParamsService } from "../service/params.service";
import { WebsocketService } from "../service/websocket.service";
import { XiaojiAssistantService } from "../service/xiaoji-assistant.service";
import { XiaojiAlarmclockService } from "../service/xiaoji-alarmclock.service";
import { BackButtonService } from "../service/backbutton.service";
import { XiaojiFeedbackService } from "../service/xiaoji-feedback.service";
import {AndroidFullScreen} from "@ionic-native/android-full-screen";
import {SqliteService} from "../service/sqlite.service";

@Component({
  templateUrl: 'app.html',
  providers: [ ParamsService, WebsocketService, XiaojiAssistantService, XiaojiAlarmclockService, BackButtonService ,XiaojiFeedbackService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('myTabs') tabRef: Tabs;

  // make HelloIonicPage the root (or first) page
  rootPage:any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    private paramsService: ParamsService,
    public backButtonService: BackButtonService,
    public feedbackService: XiaojiFeedbackService,
    private androidFullScreen: AndroidFullScreen,
    private events: Events,
    private nativeProvider:SqliteService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      feedbackService.initAudio();
      this.backButtonService.registerBackButtonAction(null);

      /*statusBar.styleDefault();
      splashScreen.hide();*/
      this.init();
    });

    this.androidFullScreen.immersiveMode()
      .then(() => console.log('Immersive mode supported'))
      .catch(err => console.log(err));
  }
  init(){
    //确保异步执行完后才隐藏启动动画
    this.events.subscribe('db:create', () => {
      //创建数据库与表成功后才关闭动画跳转页面
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    })
    //初始化创建数据库
    this.nativeProvider.createDb();
  }
  ngAfterViewInit(){
    //通过key，判断是否曾进入过引导页
    this.storage.get('firstIn').then((result) => {
      if (this.paramsService.user == null) {
        if (result != null && result) {
          this.rootPage = 'UserLoginPage';
        } else {
          this.storage.set('firstIn', true);
          this.rootPage = 'WelcomePage';
        }
      } else {
        // this.rootPage = 'HomePage';
        this.rootPage = 'HomeMenuPage';
      }

      if (this.nav.getViews().length == 0){
        this.nav.setRoot(this.rootPage);
      }

    });
  }

}
