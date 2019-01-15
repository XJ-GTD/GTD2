import { BrowserModule } from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
import { File } from "@ionic-native/file";

import { LocalNotifications } from "@ionic-native/local-notifications";
import { XiaojiAssistantService } from "../service/util-service/xiaoji-assistant.service";
import { XiaojiFeedbackService } from "../service/util-service/xiaoji-feedback.service";
import { SQLite } from '@ionic-native/sqlite';
import { Calendar } from "@ionic-native/calendar";
import { ReadlocalService } from "../service/readlocal.service";
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
import { FiSqlite } from "../service/sqlite/fi-sqlite";
import { ParamsService } from "../service/util-service/params.service";
import { WebsocketService } from "../service/util-service/websocket.service";
import { DwMqService } from "../service/util-service/dw-mq.service";
import { UtilService } from "../service/util-service/util.service";
import { BackgroundMode } from '@ionic-native/background-mode';
import { PermissionsService } from "../service/util-service/permissions.service";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { ConfigService } from "../service/config.service";
import { ErrorCodeService } from "../service/util-service/error-code.service";
import { EmitSpeechService } from "../service/util-service/emit-speech.service";
import { JhSqlite } from "../service/sqlite/jh-sqlite";
import { LbSqlite } from "../service/sqlite/lb-sqlite";
import { RelmemSqlite } from "../service/sqlite/relmem-sqlite";
import { UserSqlite } from "../service/sqlite/user-sqlite";
import { WorkSqlite } from "../service/sqlite/work-sqlite";
import { AuRestful } from "../service/restful/au-restful";
import { BsRestful } from "../service/restful/bs-restful";
import { DxRestful } from "../service/restful/dx-restful";
import { PnRestful } from "../service/restful/pn-restful";
import { RcRestful } from "../service/restful/rc-restful";
import { SyncRestful } from "../service/restful/sync-restful";
import { SyncService } from "../service/sync.service";
import { HTTP } from "@ionic-native/http";
import { ZtdSqlite } from "../service/sqlite/ztd-sqlite";
import { HttpClientModule } from "@angular/common/http";
import { SyncSqlite } from "../service/sqlite/sync-sqlite";
import { NetworkService } from "../service/util-service/network.service";
import { Network } from "@ionic-native/network";
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
    HTTP,
    Network,
    StatusBar,
    SplashScreen,
    File,
    Device,
    XiaojiAssistantService,
    XiaojiAlarmclockService,
    UtilService,
    LocalNotifications,
    XiaojiFeedbackService,
    SQLite,
    Calendar,
    ReadlocalService,
    DwEmitService,
    SQLitePorter,
    BaseSqlite,
    FiSqlite,
    JhSqlite,
    LbSqlite,
    MsSqlite,
    PlayerSqlite,
    RelmemSqlite,
    RemindSqlite,
    SystemSqlite,
    UserSqlite,
    WorkSqlite,
    ZtdSqlite,
    SyncSqlite,
    AuRestful,
    BsRestful,
    DxRestful,
    PnRestful,
    RcRestful,
    SyncRestful,
    UserService,
    WorkService,
    LsmService,
    PlayerService,
    MsService,
    RelmemService,
    RemindService,
    SystemService,
    JhService,
    ParamsService,
    WebsocketService,
    DwMqService,
    BackgroundMode,
    AndroidPermissions,
    PermissionsService,
    ConfigService,
    ErrorCodeService,
    EmitSpeechService,
    SyncService,
    NetworkService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
