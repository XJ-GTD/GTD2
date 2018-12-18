import { BrowserModule } from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { File } from "@ionic-native/file";
import { Base64 } from "@ionic-native/base64";
import { LocalNotifications } from "@ionic-native/local-notifications";
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification'
import { XiaojiAssistantService } from "../service/util-service/xiaoji-assistant.service";
import { XiaojiFeedbackService } from "../service/util-service/xiaoji-feedback.service";
import { SQLite } from '@ionic-native/sqlite';
import { Calendar } from "@ionic-native/calendar";
import { CalendarService } from "../service/calendar.service";
import { Device } from "@ionic-native/device";
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { BaseSqlite } from "../service/sqlite/base-sqlite";

import { UserService } from "../service/user.service";
import { WorkService } from "../service/work.service";
import { LsmService } from "../service/lsm.service";
import { PlayerService } from "../service/player.service";
import { PlayerSqlite} from "../service/sqlite/player-sqlite";
import { MsService } from "../service/ms.service";
import { MsSqlite } from "../service/sqlite/ms-sqlite";
import { RelmemService } from "../service/relmem.service";
import { RemindService} from "../service/remind.service";
import { RemindSqlite } from "../service/sqlite/remind-sqlite";
import { SystemService } from "../service/system.service";
import { SystemSqlite } from "../service/sqlite/system-sqlite";
import { XiaojiAlarmclockService } from "../service/util-service/xiaoji-alarmclock.service";
import { JhService } from "../service/jh.service";
import { DwEmitService } from "../service/util-service/dw-emit.service";
import {FiSqlite} from "../service/sqlite/fi-sqlite";
import {ParamsService} from "../service/util-service/params.service";
import {WebsocketService} from "../service/util-service/websocket.service";
import {DwMqService} from "../service/util-service/dw-mq.service";
import {UtilService} from "../service/util-service/util.service";
import {BackgroundMode} from '@ionic-native/background-mode';
import {PermissionsService} from "../service/util-service/permissions.service";
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {ConfigService} from "../service/config.service";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',

      //强制使用IOS风格
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Base64,
    Device,
    XiaojiAssistantService,
    XiaojiAlarmclockService,
    UtilService,
    LocalNotifications,
    PhonegapLocalNotification,
    XiaojiFeedbackService,
    SQLite,
    Calendar,
    CalendarService,
    DwEmitService,
    SQLitePorter,
    BaseSqlite,
    UserService,
    WorkService,
    LsmService,
    PlayerService,
    PlayerSqlite,
    MsService,
    MsSqlite,
    RelmemService,
    RemindService,
    RemindSqlite,
    SystemService,
    SystemSqlite,
    FiSqlite,
    JhService,
    ParamsService,
    WebsocketService,
    DwMqService,
    BackgroundMode,
    AndroidPermissions,
    PermissionsService,
    ConfigService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
