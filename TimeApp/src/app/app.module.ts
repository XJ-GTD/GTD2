import {BrowserModule} from '@angular/platform-browser';
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
import {ErrorCodeService} from "../service/util-service/error-code.service";
import {EmitSpeechService} from "../service/util-service/emit-speech.service";
import {HTTP} from "@ionic-native/http";
import {HttpClientModule} from "@angular/common/http";
import {Network} from "@ionic-native/network";
import {Contacts} from "@ionic-native/contacts";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";
import {ElModule} from 'element-angular'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule} from '@angular/router'
import {MyApp} from './app.component';
import {SqliteExec} from "../service/util-service/sqlite.exec";
import {PermissionsService} from "../service/cordova/permissions.service";
import {UtilService} from "../service/util-service/util.service";
import {SqliteConfig} from "../service/config/sqlite.config";
import {XiaojiAssistantService} from "../service/cordova/assistant.service";
import {AibutlerRestful} from "../service/restful/aibutlersev";
import {RestfulClient} from "../service/util-service/restful.client";
import {RestFulConfig} from "../service/config/restful.config";
import {SyncRestful} from "../service/restful/syncsev";
import {SqliteInit} from "../service/sqlite/sqlite.init";
import {ParamsService} from "../service/util-service/params.service";
import {PersonRestful} from "../service/restful/personsev";
import {SmsRestful} from "../service/restful/smssev";
import {AuthRestful} from "../service/restful/authsev";
import {LpService} from "../pages/lp/lp.service";
import {AgdRestful} from "../service/restful/agdsev";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    ElModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',

      //强制使用IOS风格
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    ElModule,
    HTTP,
    Network,
    Contacts,
    StatusBar,
    SplashScreen,
    File,
    Device,
    Vibration,
    NativeAudio,
    LocalNotifications,
    SQLite,
    Calendar,
    SQLitePorter,
    BackgroundMode,
    AndroidPermissions,
    ErrorCodeService,
    EmitSpeechService,
    UtilService,
    SqliteConfig,
    SqliteExec,
    RestFulConfig,
    PermissionsService,
    XiaojiAssistantService,
    AibutlerRestful,
    RestfulClient,
    SyncRestful,
    SqliteInit,
    ParamsService,
    PersonRestful,
    SmsRestful,
    AuthRestful,
    LpService,
    AgdRestful,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
