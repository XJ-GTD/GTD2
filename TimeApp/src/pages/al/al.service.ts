import {Injectable} from "@angular/core";
import {PermissionsService} from "../../service/cordova/permissions.service";
import {SqliteConfig} from "../../service/config/sqlite.config";
import {SqliteInit} from "../../service/sqlite/sqlite.init";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UtilService} from "../../service/util-service/util.service";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {RestFulConfig} from "../../service/config/restful.config";
import {WebsocketService} from "../../ws/websocket.service";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import * as moment from "moment";
import {Setting, UserConfig} from "../../service/config/user.config";
import {ContactsService} from "../../service/cordova/contacts.service";
import {DataConfig} from "../../service/config/data.config";
import {NotificationsService} from "../../service/cordova/notifications.service";
import {AlData, ScdPageParamter} from "../../data.mapping";
import {CalendarService} from "../../service/business/calendar.service";
import {EmitService} from "../../service/util-service/emit.service";
import {SettingsProvider} from "../../providers/settings/settings";
import {NetworkService} from "../../service/cordova/network.service";
import {Geolocation} from "@ionic-native/geolocation";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {JPushService} from "../../service/cordova/jpush.service";
import {RabbitMQService} from "../../service/cordova/rabbitmq.service";
import {EffectService} from "../../service/business/effect.service";
import {App, ModalController} from "ionic-angular";
import {StatusBar} from "@ionic-native/status-bar";
import {BackgroundMode} from "@ionic-native/background-mode";
import {RemindfeedbackService} from "../../service/cordova/remindfeedback.service";
import {PatchService} from "../../service/business/patch.service";
import {MytestPatch} from "../../service/patch/mytest.patch";

declare var cordova: any;
@Injectable()
export class AlService {

  constructor(private permissionsService: PermissionsService,
              private sqlLiteConfig: SqliteConfig,
              private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private emitService: EmitService,
              private restfulConfig: RestFulConfig,
              private wsserivce: WebsocketService,
              private userConfig: UserConfig,
              private contactsService: ContactsService,
              private notificationsService: NotificationsService,
              private calendarService: CalendarService,
              private settings: SettingsProvider,
              private networkService: NetworkService,
              private geolocation: Geolocation,
              private feekback: FeedbackService,
              private remindfeekback: RemindfeedbackService,
              private jpush: JPushService,
              private rabbitmq: RabbitMQService,
              private effectService: EffectService,
              private modalCtr: ModalController,
              private app: App,
              private statusBar: StatusBar,
              private backgroundMode:BackgroundMode,
              private patchService : PatchService) {

    this.statusBar.overlaysWebView(true);
    this.statusBar.hide();
  }


  theme: Setting;

//权限申请
  checkAllPermissions(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.permissionsService.checkAllPermissions().then(data => {

        alData.text = "权限申请完成"
        if (this.util.isMobile()){
          if (this.util.isAndroid()) {
            this.backgroundMode.setDefaults({silent: true, hidden: true, title:"冥王星在你的后台",text: "为了保证你的信息能实时更新，需要在手机后台运行"});
            //设置返回键盘（android）
            // backgroundModein.overrideBackButton();
            //Enable GPS-tracking in background (Android).
            this.backgroundMode.disableWebViewOptimizations();
            //忽略电源的优化管理
            cordova.plugins.backgroundMode.disableBatteryOptimizations();
          }

          this.backgroundMode.enable();

        }
        resolve(alData);
      }).catch(err => {
        alData.text = "权限申请失败"
        resolve(alData);
      });
    });
  }

//创建或连接数据库
  createDB(): Promise<AlData> {
    console.log(moment().add(DataConfig.REINTERVAL, "s").format("YYYY/MM/DD HH:mm"));
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.sqlLiteConfig.generateDb().then(data => {
        alData.text = "数据库初始化完成"
        resolve(alData);
      }).catch(err => {
        alData.text = "数据库初始化失败"
        resolve(alData);
      });
    })
  }

  version: number = -1;

//判断是否初始化完成
  checkSystem(): Promise<AlData> {
    return new Promise(async (resolve, reject) => {

      let alData: AlData = new AlData();
      let yTbl: YTbl = new YTbl();
      yTbl.yt = "FI";
      this.sqlExce.getList<YTbl>(yTbl).then(data => {

        let stbls: Array<YTbl> = data;
        if (stbls.length > 0) {
          this.version = Number(stbls[0].yv);

          alData.text = "系统完成初始化";
          resolve(alData);
        } else {
          alData.text = "系统开始初始化";
          resolve(alData);
        }

      }).catch(err => {
        alData.text = "系统开始初始化";
        resolve(alData);
      })
    })
  }

//创建数据库表,初始化系统数据,初始化数据完成写入
  createSystemData(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise(async (resolve, reject) => {
      try {

        //创建表结构
        if (this.version == -1) {
          await this.sqlLiteInit.createTables();

          //每次都先导入联系人
          if (this.util.isMobile()) {
            await this.contactsService.asyncPhoneContacts();
            //异步获取联系人信息
            this.contactsService.updateFs();

          }

          // 设置客户端初始化版本号
          let verTbl: YTbl = new YTbl();
          verTbl.yi = this.util.getUuid();
          verTbl.yt = "FI";
          verTbl.yk = "FI";
          verTbl.yv = "0";
          await this.sqlExce.save(verTbl);

          this.version = 0;

          await this.sqlLiteInit.initData();

          this.notificationsService.badgeClear();
        }


        //patch 修改DataConfig的version版本，只能改大，然后方法中例如createTablespath追加patch
        await this.patchService.updatePatch(this.version );


        alData.text = "系统数据初始化完成";

        resolve(alData);
      } catch (e) {
        alData.text = "系统数据初始化失败";

        resolve(alData);
      }
    })
  }


//连接webSocket
  connWebSocket(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      // 连接webSocket成功
      this.wsserivce.connect().then(data => {
        alData.text = "连接webSocket成功";
        resolve(alData);
      })
    });
  }

//系统设置
  setSetting(): Promise<AlData> {
    let alData: AlData = new AlData();

    return new Promise(async (resolve, reject) => {


      try {

        //重新获取服务器数据
        await this.sqlLiteInit.initDataSub();

        await this.restfulConfig.init();

        // //提醒定时
        // this.notificationsService.schedule();
        //保持后台运行
        // this.notificationsService.keeplive();

        //用户设置信息初始化
        await this.userConfig.init();


        this.settings.getActiveTheme().subscribe(val => {

          let blackTheme: string = "black-theme";
          let whiteTheme: string = "white-theme";

          this.app.setElementClass(whiteTheme, false);
          this.app.setElementClass(blackTheme, false);
          this.app.setElementClass(val, true);
        });

        //设置主题
        this.theme = UserConfig.settins.get(DataConfig.SYS_THEME);

        if (this.theme) {

          this.settings.setActiveTheme(this.theme.value);
        }


        //显示状态栏
        this.statusBar.show();
        //监听statusbar颜色变化
        this.settings.getStatusBarColor().subscribe(val => {
          let color:string = this.settings.getStatusColor(val);
          this.statusBar.backgroundColorByHexString(color);
        });

        // this.app.viewDidLoad.subscribe((event) => {
        //   if (event && event.instance && DataConfig.isPage(event.instance)) {
        //     this.settings.popStatusBarColor();
        //   }
        // });




        //模态框退出时还原状态栏颜色
        this.app.viewWillUnload.subscribe((event) => {
          if (event && event.instance && DataConfig.isPage(event.instance)) {
            this.settings.popStatusBarColor();
          }
        });


        //允许进入后台模式
        if (this.util.hasCordova()) {
          //全局网络监控
          this.networkService.monitorNetwork();

          this.feekback.initAudio();

          this.remindfeekback.initAudio()

          this.jpush.init();
          //window.plugins.MiPushPlugin.init();
          // 初始化GPS
          let watch = this.geolocation.watchPosition();
          watch.subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            if (data && data.coords) {
              RestFulConfig.geo.latitude = data.coords.latitude;
              RestFulConfig.geo.longitude = data.coords.longitude;
            } else {
              console.log('Error getting location', data);
            }
          });
        }

        // websocket连接成功消息回调
        // 初始化同步
        this.effectService.syncStart();
        this.effectService.registerSyncEvents();

        this.emitService.register("on.websocket.connected", () => {
          DataConfig.RABBITMQ_STATUS = "connected";
        });

        // websocket断开连接消息回调
        this.emitService.register("on.websocket.closed", () => {
          DataConfig.RABBITMQ_STATUS = "";
        });

        //本地通知跳转共享日程页面
        this.emitService.registerNewMessageClick((data) => {

          let p: ScdPageParamter = new ScdPageParamter();
          p.si = data.id;
          p.d = moment(data.d);
          this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
        });

        // this.emitService.registerRef(data => {
        //   //this.calendar.createMonth(this.calendar.monthOpt.original.time);
        // });

        //极光推送跳转打开外部网页
        // this.emitService.register('on.urlopen.message.click', (data) => {
        //   console.log("Open extend url message to show " + JSON.stringify(data));
        //
        //   if (data && data.eventdata && data.eventdata.url) {
        //     console.log("Open href " + data.eventdata.url);
        //     let browser = this.iab.create(data.eventdata.url, "_system");
        //     //browser.show();
        //   }
        // });

        //极光推送跳转共享日程页面
        // {type: type, id: id}
        this.emitService.register('on.agendashare.message.click', (data) => {
          console.log("Share agenda message to show " + JSON.stringify(data));

          if (data && data.type == "Agenda") {
            let p: ScdPageParamter = new ScdPageParamter();
            p.si = data.id;
            this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
          }
        });

        // this.emitService.register('on.agenda.shareevents.message.click', (data) => {
        //   console.log("Agenda share events message to show " + JSON.stringify(data));
        //
        //   let p: ScdPageParamter = new ScdPageParamter();
        //   p.si = data.si;
        //   p.d = moment(data.sd);
        //   this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
        // });

        //冥王星远程服务地址刷新完成
        //更新每小时天气服务任务
        // this.emitService.register('on.mwxing.global.restful.flashed', () => {
        //   this.hService.putHourlyWeather(UserConfig.account.id);
        // });
        // //初始化时自动触发一次
        // this.hService.putHourlyWeather(UserConfig.account.id);

        //每日简报消息回调
        this.emitService.register('on.dailyreport.message.click', (data) => {
          console.log("Daily report message clicked.")
          let timestamp: number = data.eventdata ? data.eventdata['timestamp'] : (moment().unix() * 1000);

          if (!timestamp) {
            timestamp = moment().unix() * 1000;
          }

          // this.todoList({
          //   time: timestamp,
          //   isToday: false,
          //   selected: false,
          //   disable: false,
          //   cssClass: ''
          // });
        });

        //操作反馈消息回调
        this.emitService.register('on.feedback.message.click', (data) => {
          let scd = data.eventdata ? data.eventdata['scd'] : null;
          if (scd && scd.si) {

            let p: ScdPageParamter = new ScdPageParamter();
            p.si = scd.si;
            p.d = moment(scd.sd);
            p.gs = scd.gs;

            if (scd.gs == "0") {
              //本人画面
              this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
            } else if (scd.gs == "1") {
              //受邀人画面
              this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
            } else {
              //系统画面
              this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
            }
          }
        });


        alData.text = "系统设置完成";
        resolve(alData)
      } catch (e) {
        alData.text = "系统设置失败";
        resolve(alData)
      }

    })
  }

//判断用户是否登陆
  checkUserInfo(): Promise<AlData> {
    return new Promise((resolve, reject) => {
      // TODO 判断用户是否登陆
      let aTbl: ATbl = new ATbl();
      let alData: AlData = new AlData();

      this.sqlExce.getList<ATbl>(aTbl).then(async (data) => {
        UserConfig.publicplans = await this.calendarService.fetchPublicPlans();

        UserConfig.privateplans = await this.calendarService.fetchPrivatePlans();

        this.emitService.destroy("mwxing.calendar.plans.changed");
        this.emitService.register("mwxing.calendar.plans.changed", (data) => {
          if (!data) {
            return;
          }

          // 多条数据同时更新/单条数据更新
          if (data instanceof Array) {
            for (let single of data) {
              UserConfig.privateplans = this.calendarService.mergePlans(UserConfig.privateplans, single);
            }
          } else {
            UserConfig.privateplans = this.calendarService.mergePlans(UserConfig.privateplans, data);
          }
        });

        if (data.length > 0) {
          alData.text = "用户已登录";
          alData.islogin = true;
          this.effectService.syncCompareInitial();
        } else {
          alData.text = "用户未登录";
          alData.islogin = false;
          resolve(alData);
        }

        resolve(alData);
      }).catch(err => {
        alData.text = "用户未登录";
        alData.islogin = false;
        resolve(alData);

      });
    });
  }

}
