import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {SQLite} from '@ionic-native/sqlite';
import {Calendar} from "@ionic-native/calendar";
import {Device} from "@ionic-native/device";
import {SQLitePorter} from '@ionic-native/sqlite-porter';
import {BackgroundMode} from '@ionic-native/background-mode';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {HTTP} from "@ionic-native/http";
import {HttpClientModule} from "@angular/common/http";
import {Network} from "@ionic-native/network";
import {Contacts} from "@ionic-native/contacts";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";
import {Clipboard} from '@ionic-native/clipboard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {MyApp} from './app.component';
import {SqliteExec} from "../service/util-service/sqlite.exec";
import {PermissionsService} from "../service/cordova/permissions.service";
import {UtilService} from "../service/util-service/util.service";
import {SqliteConfig} from "../service/config/sqlite.config";
import {AibutlerRestful} from "../service/restful/aibutlersev";
import {RestfulClient} from "../service/util-service/restful.client";
import {RestFulConfig} from "../service/config/restful.config";
import {SyncRestful} from "../service/restful/syncsev";
import {SqliteInit} from "../service/sqlite/sqlite.init";
import {PersonRestful} from "../service/restful/personsev";
import {SmsRestful} from "../service/restful/smssev";
import {AuthRestful} from "../service/restful/authsev";
import {AgdRestful} from "../service/restful/agdsev";
import {AssistantService} from "../service/cordova/assistant.service";
import {BlaRestful} from "../service/restful/blasev";
import {BacRestful} from "../service/restful/bacsev";
import {ShaeRestful} from "../service/restful/shaesev";
import {EmitService} from "../service/util-service/emit.service";
import {WebsocketModule} from "../ws/websocket.module";
import {FeedbackService} from "../service/cordova/feedback.service";
import {AlarmService} from "../service/cordova/alarm.service";
import {UserConfig} from "../service/config/user.config";
import {HammerDIRECTIONALLConfig} from "./my-hammer.config";
import {Keyboard} from "@ionic-native/keyboard";
import {PgBusiService} from "../service/pagecom/pgbusi.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {ContactsService} from "../service/cordova/contacts.service";
import {LocalcalendarService} from "../service/cordova/localcalendar.service";
import {NotificationsService} from "../service/cordova/notifications.service";
import {Badge} from "@ionic-native/badge";
import {RemindService} from "../service/util-service/remind.service";
import {TdcPageModule} from "../pages/tdc/tdc.module";
import {FsPageModule} from "../pages/fs/fs.module";
import {AlPageModule} from "../pages/al/al.module";
import {BlPageModule} from "../pages/bl/bl.module";
import {BrPageModule} from "../pages/br/br.module";
import {FdPageModule} from "../pages/fd/fd.module";
import {GaPageModule} from "../pages/ga/ga.module";
import {GcPageModule} from "../pages/gc/gc.module";
import {GlPageModule} from "../pages/gl/gl.module";
import {HPageModule} from "../pages/h/h.module";
import {HlPageModule} from "../pages/hl/hl.module";
import {LpPageModule} from "../pages/lp/lp.module";
import {LsPageModule} from "../pages/ls/ls.module";
import {MPageModule} from "../pages/m/m.module";
import {PPageModule} from "../pages/p/p.module";
import {PcPageModule} from "../pages/pc/pc.module";
import {PdPageModule} from "../pages/pd/pd.module";
import {PfPageModule} from "../pages/pf/pf.module";
import {PlPageModule} from "../pages/pl/pl.module";
import {PsPageModule} from "../pages/ps/ps.module";
import {RPageModule} from "../pages/r/r.module";
import {SsPageModule} from "../pages/ss/ss.module";
import {TdlPageModule} from "../pages/tdl/tdl.module";
import {PipesModule} from "../pipes/pipes.module";
import {ConfirmboxComponentModule} from "../components/confirmbox/confirmbox.module";
import {LogPageModule} from "../pages/log/log.module";
import {AtPageModule} from "../pages/at/at.module";
import {DaPageModule} from "../pages/da/da.module";
import {DrPageModule} from "../pages/dr/dr.module";
import {CardListComponentModule} from "../components/card-list/card-list.module";

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
    BrowserAnimationsModule,
    RouterModule,
    WebsocketModule,
    PipesModule,
    TdcPageModule,
    FsPageModule,
    AlPageModule,
    BlPageModule,
    BrPageModule,
    FdPageModule,
    GaPageModule,
    GcPageModule,
    GlPageModule,
    HPageModule,
    HlPageModule,
    LpPageModule,
    LsPageModule,
    MPageModule,
    PPageModule,
    PcPageModule,
    PdPageModule,
    PfPageModule,
    PlPageModule,
    PsPageModule,
    RPageModule,
    SsPageModule,
    TdlPageModule,
    LogPageModule,
    AtPageModule,
    DaPageModule,
    DrPageModule,
    ConfirmboxComponentModule,
    CardListComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    HTTP,
    Network,
    Contacts,
    StatusBar,
    SplashScreen,
    File,
    Device,
    Vibration,
    NativeAudio,
    Keyboard,
    Clipboard,
    ContactsService,
    ScreenOrientation,
    LocalNotifications,
    SQLite,
    Calendar,
    SQLitePorter,
    BackgroundMode,
    AndroidPermissions,
    UtilService,
    SqliteConfig,
    SqliteExec,
    Badge,
    RestFulConfig,
    PermissionsService,
    AibutlerRestful,
    RestfulClient,
    SyncRestful,
    SqliteInit,
    PersonRestful,
    SmsRestful,
    AuthRestful,
    AgdRestful,
    BlaRestful,
    BacRestful,
    ShaeRestful,
    AssistantService,
    EmitService,
    FeedbackService,
    AlarmService,
    UserConfig,
    PgBusiService,
    LocalcalendarService,
    NotificationsService,
    RemindService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerDIRECTIONALLConfig}
  ]
})
export class AppModule {
}
