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
import {AlData} from "../../data.mapping";
import {CalendarService} from "../../service/business/calendar.service";
import {EmitService} from "../../service/util-service/emit.service";
import {SettingsProvider} from "../../providers/settings/settings";

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
              private settings: SettingsProvider,) {
  }


  theme: Setting;

//权限申请
  checkAllPermissions(): Promise<AlData> {
    let alData: AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.permissionsService.checkAllPermissions().then(data => {

        alData.text = "权限申请完成"
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
        let fromversion = this.version;

        while (DataConfig.version > this.version) {

          await this.sqlLiteInit.createTablespath(this.version + 1, fromversion);
          let yTbl: YTbl = new YTbl();
          yTbl.yt = "FI";
          yTbl.yk = "FI";
          let stbls: Array<YTbl> = await this.sqlExce.getList<YTbl>(yTbl);
          if (stbls.length > 0) yTbl.yi = stbls[0].yi; else yTbl.yi = this.util.getUuid();
          yTbl.yv = (++this.version).toString();
          await this.sqlExce.replaceT(yTbl);

        }


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

        // TODO 系统设置 restHttps设置 用户偏好设置 用户信息 。。。
        await this.restfulConfig.init();

        //提醒定时
        this.notificationsService.schedule();
        //保持后台运行
        //this.notificationsService.keeplive();

        //用户设置信息初始化
        await this.userConfig.init();

        //设置主题
        this.theme = UserConfig.settins.get(DataConfig.SYS_THEME);

        if (this.theme){

          this.settings.setActiveTheme(this.theme.value);
        }

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
