import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {XiaojiAssistantService} from "../service/util-service/xiaoji-assistant.service";
import {XiaojiFeedbackService} from "../service/util-service/xiaoji-feedback.service";
import {SQLite} from '@ionic-native/sqlite';
import {Calendar} from "@ionic-native/calendar";
import {ReadlocalService} from "../service/readlocal.service";
import {Device} from "@ionic-native/device";
import {SQLitePorter} from '@ionic-native/sqlite-porter';
import {UserService} from "../service/user.service";
import {LsmService} from "../service/lsm.service";
import {PlayerService} from "../service/player.service";
import {MsService} from "../service/ms.service";
import {RelmemService} from "../service/relmem.service";
import {RemindService} from "../service/remind.service";
import {SystemService} from "../service/system.service";
import {XiaojiAlarmclockService} from "../service/util-service/xiaoji-alarmclock.service";
import {DwEmitService} from "../service/util-service/dw-emit.service";
import {ParamsService} from "../service/util-service/params.service";
import {WebsocketService} from "../service/util-service/websocket.service";
import {DwMqService} from "../service/util-service/dw-mq.service";
import {UtilService} from "../service/util-service/util.service";
import {BackgroundMode} from '@ionic-native/background-mode';
import {PermissionsService} from "../service/util-service/permissions.service";
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {ErrorCodeService} from "../service/util-service/error-code.service";
import {EmitSpeechService} from "../service/util-service/emit-speech.service";
import {SyncService} from "../service/sync.service";
import {HTTP} from "@ionic-native/http";
import {HttpClientModule} from "@angular/common/http";
import {NetworkService} from "../service/util-service/network.service";
import {Network} from "@ionic-native/network";
import {Contacts} from "@ionic-native/contacts";
import {ContactsService} from "../service/util-service/contacts.service";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";
import {SystemSettingService} from "../service/util-service/system.setting.service";
import {ElModule} from 'element-angular'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {RouterModule} from '@angular/router'

import {RestFulConfig} from "../service/config/restful.config";

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
    RestFulConfig,
    UserService,
    LsmService,
    PlayerService,
    MsService,
    RelmemService,
    RemindService,
    SystemService,
    ParamsService,
    WebsocketService,
    DwMqService,
    BackgroundMode,
    AndroidPermissions,
    PermissionsService,
    ErrorCodeService,
    EmitSpeechService,
    SyncService,
    NetworkService,
    ContactsService,
    SystemSettingService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
