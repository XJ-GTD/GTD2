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
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {Network} from "@ionic-native/network";
import {Contacts} from "@ionic-native/contacts";
import {Vibration} from "@ionic-native/vibration";
import {Geolocation} from '@ionic-native/geolocation';
import {NativeAudio} from "@ionic-native/native-audio";
import {Clipboard} from '@ionic-native/clipboard';
import { Camera } from '@ionic-native/camera';
import { Chooser } from '@ionic-native/chooser';
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
import {DataRestful} from "../service/restful/datasev";
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
import {NetworkService} from "../service/cordova/network.service";
import {LocalcalendarService} from "../service/cordova/localcalendar.service";
import {NotificationsService} from "../service/cordova/notifications.service";
import {JPushService} from "../service/cordova/jpush.service";
import {RabbitMQService} from "../service/cordova/rabbitmq.service";
import {MIPushService} from "../service/cordova/mipush.service";
import {Badge} from "@ionic-native/badge";
import {RemindService} from "../service/util-service/remind.service";
import {TdcPageModule} from "../pages/tdc/tdc.module";
import {TdmPageModule} from "../pages/tdm/tdm.module";
import {FsPageModule} from "../pages/fs/fs.module";
import {AlPageModule} from "../pages/al/al.module";
import {AgendaPageModule} from "../pages/agenda/agenda.module";
import {MemoPageModule} from "../pages/memo/memo.module";
import {DailyMemosPageModule} from "../pages/dailymemos/dailymemos.module";
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
import {DoPageModule} from "../pages/do/do.module";
import {DrPageModule} from "../pages/dr/dr.module";
import {TxPageModule} from "../pages/tx/tx.module";
import {BzPageModule} from "../pages/bz/bz.module";
import {JhPageModule} from "../pages/jh/jh.module";
import {DzPageModule} from "../pages/dz/dz.module";
import {CfPageModule} from "../pages/cf/cf.module";
import {FoPageModule} from "../pages/fo/fo.module";
import {CommentPageModule} from "../pages/comment/comment.module";
import {RepeatPageModule} from "../pages/repeat/repeat.module";
import {RemindPageModule} from "../pages/remind/remind.module";
import {PlanPageModule} from "../pages/plan/plan.module";
import {InvitesPageModule} from "../pages/invites/invites.module";
import {LocationPageModule} from "../pages/location/location.module";
import {AttachPageModule} from "../pages/attach/attach.module";
import { CommemorationDayPageModule } from "../pages/commemorationday/commemorationday.module";
import {CardListComponentModule} from "../components/card-list/card-list.module";
import {TaskListComponentModule} from "../components/task-list/task-list.module";
import {ScrollSelectComponentModule} from "../components/scroll-select/scroll-select.module";
import {RadioSelectComponentModule} from "../components/radio-select/radio-select.module";
import {ScrollRangePickerComponentModule} from "../components/scroll-range-picker/scroll-range-picker.module";
import {SpeechBubbleComponentModule} from "../components/speech-bubble/speech-bubble.module";
import { WeatherIconsModule } from 'ngx-icons';
import { JPush } from '@jiguang-ionic/jpush';
import { DirectivesModule } from "../directives/directives.module";
import { BaiduMapModule } from 'angular2-baidu-map';
import {EventService} from "../service/business/event.service";
import {MemoService} from "../service/business/memo.service";
import {AipPageModule} from "../pages/aip/aip.module";
import { SettingsProvider } from '../providers/settings/settings';
import {CalendarService} from "../service/business/calendar.service";
import {EffectService} from "../service/business/effect.service";
import {LocalRestful} from "../service/restful/localsev";

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BaiduMapModule.forRoot({ ak: 'zD6zCIA9w7ItoXwxQ8IRPD4rk5E9GEew' }),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',
      //强制使用IOS风格
      mode: 'ios'
    }),
    IonicStorageModule.forRoot(),
    DirectivesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    WebsocketModule,
    WeatherIconsModule,
    PipesModule,
    TdcPageModule,
    TdmPageModule,
    FsPageModule,
    AlPageModule,
    AgendaPageModule,
    MemoPageModule,
    DailyMemosPageModule,
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
    DoPageModule,
    DrPageModule,
    TxPageModule,
    BzPageModule,
    JhPageModule,
    DzPageModule,
    CfPageModule,
    FoPageModule,
    AipPageModule,
    RepeatPageModule,
    RemindPageModule,
    CommentPageModule,
    PlanPageModule,
    InvitesPageModule,
    LocationPageModule,
    AttachPageModule,
    CommemorationDayPageModule,
    ConfirmboxComponentModule,
    CardListComponentModule,
    TaskListComponentModule,
    ScrollSelectComponentModule,
    RadioSelectComponentModule,
    ScrollRangePickerComponentModule,
    SpeechBubbleComponentModule,
    HttpClientJsonpModule
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
    Geolocation,
    NativeAudio,
    Keyboard,
    Clipboard,
    Camera,
    Chooser,
    ContactsService,
    NetworkService,
    ScreenOrientation,
    LocalNotifications,
    SQLite,
    Calendar,
    JPush,
    SQLitePorter,
    BackgroundMode,
    AndroidPermissions,
    UtilService,
    EmitService,
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
    LocalRestful,
    SmsRestful,
    AuthRestful,
    AgdRestful,
    BlaRestful,
    BacRestful,
    ShaeRestful,
    DataRestful,
    AssistantService,
    FeedbackService,
    AlarmService,
    UserConfig,
    PgBusiService,
    LocalcalendarService,
    NotificationsService,
    JPushService,
    RabbitMQService,
    MIPushService,
    RemindService,
    EventService,
    MemoService,
    SettingsProvider,
    CalendarService,
    EffectService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerDIRECTIONALLConfig}
  ]
})
export class AppModule {
}
