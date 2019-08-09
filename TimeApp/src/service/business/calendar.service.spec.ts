import {} from 'jasmine';
import { TestBed, async } from '@angular/core/testing';

import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../../test-config/mocks-ionic';

import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, Platform, IonicErrorHandler} from 'ionic-angular';
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
import {Geolocation} from '@ionic-native/geolocation';
import {NativeAudio} from "@ionic-native/native-audio";
import {Clipboard} from '@ionic-native/clipboard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {MyApp} from '../../app/app.component';
import {SqliteExec} from "../util-service/sqlite.exec";
import {PermissionsService} from "../cordova/permissions.service";
import {UtilService} from "../util-service/util.service";
import {SqliteConfig} from "../config/sqlite.config";
import {AibutlerRestful} from "../restful/aibutlersev";
import {RestfulClient} from "../util-service/restful.client";
import {RestFulConfig} from "../config/restful.config";
import {SyncRestful} from "../restful/syncsev";
import {SqliteInit} from "../sqlite/sqlite.init";
import {PersonRestful} from "../restful/personsev";
import {SmsRestful} from "../restful/smssev";
import {AuthRestful} from "../restful/authsev";
import {AgdRestful} from "../restful/agdsev";
import {AssistantService} from "../cordova/assistant.service";
import {BlaRestful} from "../restful/blasev";
import {BacRestful} from "../restful/bacsev";
import {ShaeRestful} from "../restful/shaesev";
import {EmitService} from "../util-service/emit.service";
import {WebsocketModule} from "../../ws/websocket.module";
import {FeedbackService} from "../cordova/feedback.service";
import {AlarmService} from "../cordova/alarm.service";
import {UserConfig} from "../config/user.config";
import {HammerDIRECTIONALLConfig} from "../../app/my-hammer.config";
import {Keyboard} from "@ionic-native/keyboard";
import {PgBusiService} from "../pagecom/pgbusi.service";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
import {ContactsService} from "../cordova/contacts.service";
import {NetworkService} from "../cordova/network.service";
import {LocalcalendarService} from "../cordova/localcalendar.service";
import {NotificationsService} from "../cordova/notifications.service";
import {JPushService} from "../cordova/jpush.service";
import {RabbitMQService} from "../cordova/rabbitmq.service";
import {MIPushService} from "../cordova/mipush.service";
import {Badge} from "@ionic-native/badge";
import {RemindService} from "../util-service/remind.service";
import {TdcPageModule} from "../../pages/tdc/tdc.module";
import {TdmPageModule} from "../../pages/tdm/tdm.module";
import {FsPageModule} from "../../pages/fs/fs.module";
import {AlPageModule} from "../../pages/al/al.module";
import {BlPageModule} from "../../pages/bl/bl.module";
import {BrPageModule} from "../../pages/br/br.module";
import {FdPageModule} from "../../pages/fd/fd.module";
import {GaPageModule} from "../../pages/ga/ga.module";
import {GcPageModule} from "../../pages/gc/gc.module";
import {GlPageModule} from "../../pages/gl/gl.module";
import {HPageModule} from "../../pages/h/h.module";
import {HlPageModule} from "../../pages/hl/hl.module";
import {LpPageModule} from "../../pages/lp/lp.module";
import {LsPageModule} from "../../pages/ls/ls.module";
import {MPageModule} from "../../pages/m/m.module";
import {PPageModule} from "../../pages/p/p.module";
import {PcPageModule} from "../../pages/pc/pc.module";
import {PdPageModule} from "../../pages/pd/pd.module";
import {PfPageModule} from "../../pages/pf/pf.module";
import {PlPageModule} from "../../pages/pl/pl.module";
import {PsPageModule} from "../../pages/ps/ps.module";
import {RPageModule} from "../../pages/r/r.module";
import {SsPageModule} from "../../pages/ss/ss.module";
import {TdlPageModule} from "../../pages/tdl/tdl.module";
import {PipesModule} from "../../pipes/pipes.module";
import {ConfirmboxComponentModule} from "../../components/confirmbox/confirmbox.module";
import {LogPageModule} from "../../pages/log/log.module";
import {AtPageModule} from "../../pages/at/at.module";
import {DaPageModule} from "../../pages/da/da.module";
import {DoPageModule} from "../../pages/do/do.module";
import {DrPageModule} from "../../pages/dr/dr.module";
import {TxPageModule} from "../../pages/tx/tx.module";
import {BzPageModule} from "../../pages/bz/bz.module";
import {JhPageModule} from "../../pages/jh/jh.module";
import {DzPageModule} from "../../pages/dz/dz.module";
import {CfPageModule} from "../../pages/cf/cf.module";
import {FoPageModule} from "../../pages/fo/fo.module";
import {CardListComponentModule} from "../../components/card-list/card-list.module";
import {ScrollSelectComponentModule} from "../../components/scroll-select/scroll-select.module";
import {RadioSelectComponentModule} from "../../components/radio-select/radio-select.module";
import {ScrollRangePickerComponentModule} from "../../components/scroll-range-picker/scroll-range-picker.module";
import {SpeechBubbleComponentModule} from "../../components/speech-bubble/speech-bubble.module";
import { WeatherIconsModule } from 'ngx-icons';
import { JPush } from '@jiguang-ionic/jpush';
import { DirectivesModule } from "../../directives/directives.module";
import { BaiduMapModule } from 'angular2-baidu-map';

import { CalendarService, PlanData, PlanType } from "./calendar.service";

/**
 * 日历Service 持续集成CI 自动测试Case
 * 确保问题修复的过程中, 保持原有逻辑的稳定
 *
 * 使用 karma jasmine 进行 unit test
 * 参考: https://github.com/ionic-team/ionic-unit-testing-example
 *
 * @author leon_xi@163.com
 **/
describe('CalendarService test suite', () => {
  let fixture;
  let calendarService: CalendarService;
  let planforUpdate: PlanData;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
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
        ConfirmboxComponentModule,
        CardListComponentModule,
        ScrollSelectComponentModule,
        RadioSelectComponentModule,
        ScrollRangePickerComponentModule,
        SpeechBubbleComponentModule,
        BaiduMapModule.forRoot({ ak: 'zD6zCIA9w7ItoXwxQ8IRPD4rk5E9GEew' })
      ],
      providers: [
        HTTP,
        Network,
        Contacts,
        File,
        Device,
        Vibration,
        Geolocation,
        NativeAudio,
        Keyboard,
        Clipboard,
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
        SmsRestful,
        AuthRestful,
        AgdRestful,
        BlaRestful,
        BacRestful,
        ShaeRestful,
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
        IonicApp,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {provide: HAMMER_GESTURE_CONFIG, useClass: HammerDIRECTIONALLConfig},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
  }));

  beforeEach(() => {
    calendarService = TestBed.get(CalendarService);
  });

  it('Case 1 - 3 use savePlan to update an exist plan\'s color', async(() => {
    if (planforUpdate && planforUpdate.ji) {
      let plan: PlanData = planforUpdate;

      plan.jc = '#1a1a1a';

      calendarService.savePlan(plan).then(savedPlan => {
        planforUpdate = savedPlan;  // 保存用于后面的测试用例

        expect(savedPlan.jc).toBe('#1a1a1a');
      });
    }
  }));

  it('Case 1 - 2 use savePlan to create a new plan', async(() => {
    let plan: PlanData = {} as PlanData;

    plan.jn = '冥王星服务类 自动测试';
    plan.jc = '#f1f1f1';
    plan.jt = PlanType.PrivatePlan;

    calendarService.savePlan(plan).then(savedPlan => {
      planforUpdate = savedPlan;  // 保存用于后面的测试用例

      expect(savedPlan.ji).toBeDefined();
      expect(savedPlan.ji).not.toBe('');
    });
  }));

  it('Case 1 - 1 service should be created', () => {
    expect(calendarService).toBeTruthy();
  });
});
