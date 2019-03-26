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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule} from '@angular/router'
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
import {LpService} from "../pages/lp/lp.service";
import {AgdRestful} from "../service/restful/agdsev";
import {AssistantService} from "../service/cordova/assistant.service";
import {BlaRestful} from "../service/restful/blasev";
import {BacRestful} from "../service/restful/bacsev";
import {ShaeRestful} from "../service/restful/shaesev";
import {EmitService} from "../service/util-service/emit.service";
import {WebsocketModule} from "../ws/websocket.module";
import {AgdbusiService} from "../service/util-service/agdbusi.service";
import {FeedbackService} from "../service/cordova/feedback.service";
import {AlarmService} from "../service/cordova/alarm.service";
import {UserConfig} from "../service/config/user.config";
import {PipesModule} from "../pipes/pipes.module";
import {HammerDIRECTIONALLConfig} from "./my-hammer.config";
import {TddjService} from "../pages/tddj/tddj.service";
import {TddiService} from "../pages/tddi/tddi.service";
import {Keyboard} from "@ionic-native/keyboard";
import {AiService} from "../components/ai/answer/ai.service";
import {AlService} from "../pages/al/al.service";

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
    PipesModule
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
    LocalNotifications,
    SQLite,
    Calendar,
    SQLitePorter,
    BackgroundMode,
    AndroidPermissions,
    UtilService,
    SqliteConfig,
    SqliteExec,
    RestFulConfig,
    PermissionsService,
    AibutlerRestful,
    RestfulClient,
    SyncRestful,
    SqliteInit,
    PersonRestful,
    SmsRestful,
    AuthRestful,
    LpService,
    AgdRestful,
    BlaRestful,
    BacRestful,
    ShaeRestful,
    AiService,
    AlService,
    AssistantService,
    EmitService,
    AgdbusiService,
    FeedbackService,
    AlarmService,
    UserConfig,
    TddjService,
    TddiService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HAMMER_GESTURE_CONFIG,useClass: HammerDIRECTIONALLConfig }
  ]
})
export class AppModule {
}
