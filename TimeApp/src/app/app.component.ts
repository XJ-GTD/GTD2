import {Component, ViewChild} from '@angular/core';

import {Platform, MenuController, Nav, Tabs, Events} from 'ionic-angular';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from "@ionic/storage";
import {ParamsService} from "../service/util-service/params.service";
import {BackButtonService} from "../service/util-service/backbutton.service";
import {XiaojiFeedbackService} from "../service/util-service/xiaoji-feedback.service";
import {BaseSqliteService} from "../service/sqlite-service/base-sqlite.service";
import {PageConfig} from "./page.config";
import {FiSqliteService} from "../service/sqlite-service/fi-sqlite.service";
import {UserService} from "../service/user.service";
import {AppConfig} from "./app.config";
import {BackgroundMode} from '@ionic-native/background-mode';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('myTabs') tabRef: Tabs;

  // make HelloIonicPage the root (or first) page
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public backButtonService: BackButtonService,
    public feedbackService: XiaojiFeedbackService,
    private events: Events,
    private fisqlite: FiSqliteService,
    private baseSqlite: BaseSqliteService,
    private storage: Storage,
    private paramsService: ParamsService,
    private user: UserService,
    private backgroundMode: BackgroundMode,
  ) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();
      this.backgroundMode.enable();
      this.platform.registerBackButtonAction(() => {
        this.backgroundMode.moveToBackground();
      });


    });
  }

  //
  // init() {
  //   //查询版本
  //   this.fisqlite.getfi(1).then(data => {
  //     let istrue: boolean = false
  //     if (data && data.rows && data.rows.length > 0) {
  //       if (data.rows.item(0).isup == 1) {
  //         istrue = true;
  //         this.fisqlite.ufi(null, 0)
  //       }
  //     } else {
  //       istrue = true;
  //       this.fisqlite.afi(1, 0)
  //     }
  //     //如果发现最新更新则跳转引导页
  //     if (istrue) {
  //       this.rootPage = PageConfig.AZ_PAGE;
  //     } else {
  //       //获取Token
  //       this.user.getUo().then(data => {
  //         // AppConfig.Token=data.u.uT;
  //         if (data && data.u && data.u.uT && data.u.uT != 'null' && data.u.uT != '') {
  //           AppConfig.Token = data.u.uT;
  //           console.debug('MyApp初始化Token' + AppConfig.Token)
  //         }
  //         console.debug(JSON.stringify(data))
  //       }).catch(e => {
  //         alert("MyApp获取Token失败")
  //         console.error("MyApp获取Token失败" + e.message)
  //       })
  //       this.rootPage = PageConfig.HZ_PAGE;
  //     }
  //     this.nav.setRoot(this.rootPage);
  //   }).catch(e => {
  //     // alert("MyApp查询版本号失败")
  //     //首次打开App,初始化创建数据库建表
  //     this.baseSqlite.createTable();
  //     this.rootPage = PageConfig.AZ_PAGE;
  //     this.nav.setRoot(this.rootPage);
  //
  //   })
  // }
  //
  // ngAfterViewInit() {
  //   //通过key，判断是否曾进入过引导页
  //   // this.storage.get('firstIn').then((result) => {
  //   //
  //   //   if (result != null && result) {
  //   //     this.rootPage = PageConfig.HZ_PAGE;
  //   //   } else {
  //   //     //初始化创建数据库建表
  //   //     this.baseSqlite.createTable();
  //   //     this.storage.set('firstIn', true);
  //   //     this.rootPage = PageConfig.AZ_PAGE;
  //   //   }
  //   //
  //   //   if (this.nav.getViews().length == 0){
  //   //     this.nav.setRoot(this.rootPage);
  //   //   }
  //   //
  //   // });
  //   //确保异步执行完后才隐藏启动动画
  //   this.events.subscribe('db:create', () => {
  //     //创建数据库与表成功后才关闭动画跳转页面
  //     this.statusBar.styleDefault();
  //     this.splashScreen.hide();
  //   })
  //   //初始化创建数据库
  //   this.baseSqlite.createDb();
  // }

}
