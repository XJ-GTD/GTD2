import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Nav } from 'ionic-angular';
import { PageConfig } from "../../app/page.config";
import { PermissionsService } from "../../service/util-service/permissions.service";
import { UtilService } from "../../service/util-service/util.service";
import { ReadlocalService } from "../../service/readlocal.service";
import { ConfigService } from "../../service/config.service";
import { WebsocketService } from "../../service/util-service/websocket.service";
import { RoundProgressEase } from 'angular-svg-round-progressbar';
import { LsmService } from "../../service/lsm.service";
import { DataConfig } from "../../app/data.config";
import { BsRestful } from "../../service/restful/bs-restful";
import {SyncService} from "../../service/sync.service";
import {ContactsService} from "../../service/util-service/contacts.service";
import {WorkService} from "../../service/work.service";

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-al',
  template:'<div class="container">' +
  '  <div class="progress-wrapper">' +
  '    <div class="current" [ngStyle]="getOverlayStyle()">{{ current }}/{{ max }}</div>' +
  '    <round-progress' +
  '      [current]="current"' +
  '      [max]="max"' +
  '      [stroke]="stroke"' +
  '      [radius]="radius"' +
  '      [semicircle]="semicircle"' +
  '      [rounded]="rounded"' +
  '      [responsive]="responsive"' +
  '      [clockwise]="clockwise"' +
  '      [color]="gradient ? \'url(#gradient)\' : color"' +
  '      [background]="background"' +
  '      [duration]="duration"' +
  '      [animation]="animation"' +
  '      [animationDelay]="animationDelay"></round-progress>' +
  '  </div>' +
  '  <div class="text">{{ text }}</div>' +
  '</div>' +
  ''
})
export class AlPage {

  rootPage:any;

  current: number = 0;
  max: number = 100;
  stroke: number = 10;
  radius: number = 80;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#45ccce';
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 50
  animations: string[] = [];
  gradient: boolean = false;
  text:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              public util: UtilService,
              private lsm:LsmService,
              private readlocal:ReadlocalService,
              private nav:Nav,
              private bsRestful: BsRestful,
              private permissionsService: PermissionsService,
              private configService:ConfigService,
              private webSocketService: WebsocketService,
              private sync:SyncService,
              private _ease: RoundProgressEase,
              private work:WorkService,
              private ContactsService: ContactsService) {
    this.text="正在初始化";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlPage');
    this.initSystem();
    for (let prop in this._ease) {
      if (prop.toLowerCase().indexOf('ease') > -1) {
        this.animations.push(prop);
      };
    }
  }

  increment(amount = 1) {
    this.current += amount;
  }

  getOverlayStyle() {
    let isSemi = this.semicircle;
    let transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

    return {
      'top': isSemi ? 'auto' : '50%',
      'bottom': isSemi ? '5%' : 'auto',
      'left': '50%',
      'transform': transform,
      '-moz-transform': transform,
      '-webkit-transform': transform,
      'font-size': this.radius / 3.5 + 'px'
    };
  }

  initSystem() {
    let loading = this.loadingCtrl.create({
      enableBackdropDismiss:false,
      spinner:'bubbles',
      content: 'Please wait...<ion-label></ion-label>'
    });
    //loading.present();
    this.rootPage = PageConfig.HZ_PAGE;

    console.log("权限申请开始");
    this.permissionsService.checkAllPermissiions()
      .then(res => {
        this.text="权限申请完成";
        console.log("权限申请完成");
        //初始化创建数据库
        this.text=" 初始化创建数据库开始";
        console.log("al :: 初始化创建数据库开始");
        this.increment(10);
        console.log("al :: 初始化https协议开始");
        this.bsRestful.init();
        return this.configService.initDataBase();
      })
      .then(data => {
        console.log("al :: 初始化创建数据库结束");
        console.log("al :: 初始化https协议结束");
        console.log("al :: 游客登录开始");
        this.increment(10);
        //游客登陆
        return this.lsm.visitor()
      })
      .then(data => {
        console.log("al :: 游客登录结束，获取登录信息:"+JSON.stringify(DataConfig.uInfo));
        //初始化本地变量
        this.text=" 初始化本地变量";
        console.log("al :: 初始化本地变量开始");
        this.increment(10);
        return this.sync.initzdlb()
      })
      .then(data => {
        console.log("al :: 初始化本地变量结束");
        //同步服务器
        console.log("al :: 同步服务器开始");
        this.text=" 同步服务器";
        this.increment(10);
      })
      .then(data => {
        console.log("al :: 同步服务器结束");
        //同步本地日历
      //   console.log("al :: 导入用户本地日历开始");
      //   this.text=" 导入本地日程";
      //   this.increment(10);
      //   return this.readlocal.uploadLocal();
      // })
      // .then(data => {
      //   console.log("al :: 导入用户本地日历结束");
        //初始化本地参数
        console.log("al :: 初始化本地参数开始")
        this.increment(10);
        return this.sync.initLocalData()
      }).then(data => {
        console.log("al :: 初始化本地参数结束")
        //连接webSocket
        console.log("al :: 开始连接webSocket");
        return this.webSocketService.connect(DataConfig.uInfo.aQ);
      }).then(data => {
        console.log("al :: 连接websockte成功")
      this.increment(10);
        //检车websockte的状态
        console.log("al :: 查询联系人开始");
        if(DataConfig.uInfo.uty == '1' && DataConfig.IS_MOBILE){
          return this.ContactsService.getContacts();
        }
      }).then(data=>{
        console.log("al :: 查询联系人成功");
      }).then(data=>{
        console.log("al :: 开始更新版本表");
        return this.configService.ufi(null,0)
      }) .then(data => {
      console.log("al :: 开始更新版本表结束");
      if(DataConfig.uInfo.uty=='1'){
        //定时同步
        console.log("al :: 定时同步");
        this.sync.syncTime();
      }
      console.log("al ::定时查询闹铃");
      this.work.setColckWork();
    }).then(data => {
        //进入主页
        //loading.dismiss();
      console.log("al :: 进入主页");
        this.increment(10);
        this.text=" 进入主页";
        this.nav.setRoot(this.rootPage);

      }).catch(res => {
        console.log("al error :: "+JSON.stringify(res));
        //loading.dismiss();
       this.nav.setRoot(this.rootPage);
      })


    //   //
    //   //
    //   // 查询版本
    //   this.fisqlite.getfi(1).then(data=>{
    //     let istrue:boolean = false
    //     if(data && data.rows && data.rows.length>0){
    //       if(data.rows.item(0).isup==1){
    //         istrue=true;
    //         this.fisqlite.ufi(null,0)
    //       }
    //     }else{
    //       istrue=true;
    //       this.fisqlite.afi(1,0)
    //     }
    //     //如果发现最新更新则跳转引导页
    //     if(istrue){
    //       this.uploadLocal();
    //       loading.dismiss();
    //       this.nav.setRoot(this.rootPage);
    //
    //     }else{
    //       //获取Token
    //       this.userSqlite.getUo().then(data=>{
    //         // AppConfig.Token=data.u.uT;
    //         if(data && data.u && data.u.uT && data.u.uT !='null' && data.u.uT !=''){
    //           AppConfig.Token=data.u.uT;
    //           console.debug('MyApp初始化Token'+AppConfig.Token)
    //         }
    //         console.debug(JSON.stringify(data))
    //         loading.dismiss();
    //         this.nav.setRoot(this.rootPage);
    //       }).catch(e=>{
    //         alert("MyApp获取Token失败")
    //         console.error("MyApp获取Token失败"+e.message)
    //         loading.dismiss();
    //         this.nav.setRoot(this.rootPage);
    //       })
    //
    //     }
    //
    //   }).catch(e=>{
    //     // alert("MyApp查询版本号失败")
    //     //首次打开App,初始化创建数据库建表
    //     this.baseSqlite.createTable();
    //     this.rootPage = PageConfig.HZ_PAGE;
    //     this.events.subscribe('db:create', () => {
    //       //创建数据库与表成功
    //
    //     })
    //
    //     this.uploadLocal().then(data=>{
    //
    //     }).catch(reason => {
    //
    //     });
    //
    //   })
    //
    // }
    //
    // init() {
    //   //查询版本
    //   this.fisqlite.getfi(1).then(data => {
    //     let istrue: boolean = false;
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
    //         alert("MyApp获取Token失败");
    //         console.error("MyApp获取Token失败" + e.message)
    //       });
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
    //   //确保异步执行完后才隐藏启动动画
    //   this.events.subscribe('db:create', () => {
    //     //创建数据库与表成功后才关闭动画跳转页面
    //     this.statusBar.styleDefault();
    //     this.splashScreen.hide();
    //   });
    //   //初始化创建数据库
    //   this.baseSqlite.createDb();
    // }

  }
}
