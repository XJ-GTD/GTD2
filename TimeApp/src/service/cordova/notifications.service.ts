import {Injectable} from "@angular/core";
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  ILocalNotificationAction, ILocalNotificationProgressBar,
  ILocalNotificationTrigger,
  LocalNotifications
} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import {ScdData} from "../pagecom/pgbusi.service";
import * as moment from "moment";
import {UtilService} from "../util-service/util.service";
import {RemindService} from "../util-service/remind.service";
import {DataConfig} from "../config/data.config";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {File} from "@ionic-native/file";
import {EmitService, ScdEmData} from "../util-service/emit.service";

/**
 * 系统设置方法类
 *
 * create by wzy on 2019/01/29
 */
@Injectable()
export class NotificationsService {

  private index: number = 0;

  constructor(private localNotifications: LocalNotifications, private badge: Badge,
              private util: UtilService, private remindService: RemindService,
              private emitService: EmitService) {


  }

  ngOnInit() {
    if (this.util.isMobile()) {
      //提醒回馈处理 5分钟
      this.localNotifications.on('five').subscribe((next: ILocalNotification) => {
        let etbl: Array<ETbl> = next.data.val;
        let reDate: moment.Moment = moment().add(5, "m");
        this.remind(etbl);
        //this.localNotifications.clear(next.id);
        //this.localNotifications.cancel(next.id);
      });
      //提醒回馈处理 10分钟
      this.localNotifications.on('ten').subscribe((next: ILocalNotification) => {
        let etbl: Array<ETbl> = next.data.val;
        let reDate: moment.Moment = moment().add(10, "m");
        this.remind(etbl);
        //this.localNotifications.clear(next.id);
        //this.localNotifications.cancel(next.id);
      });

      //提醒回馈处理 关闭
      this.localNotifications.on('close').subscribe((next: ILocalNotification) => {
        // this.remindService.delRemin(next.data.val.wi);
        // this.remindService.delRemin(next.data.val);
      });
      this.localNotifications.on('click').subscribe((next: ILocalNotification) => {
        //跳转到界面处理
        if (next.data.type == "newSms") {
          let scd:ScdData = new ScdData()
          scd = next.data.val;
          let emMessage:ScdEmData = new ScdEmData();
          emMessage.id = scd.si;
          emMessage.d = scd.sd;
          this.emitService.emitNewMessageClick(emMessage);
        }

      });
      this.localNotifications.on('clear').subscribe((next: ILocalNotification) => {
      });
      this.localNotifications.on('clearAll').subscribe((next: ILocalNotification) => {
      });

      this.localNotifications.on('trigger').subscribe((next: ILocalNotification) => {
        if (next.data.type == "schedule") {
          this.schedule();
          this.remindService.getRemindLs().then(data => {
            if (data.length == 0) return;
            this.remind(data);
            this.remindService.delRemin(next.data.val);
          })
        }

        //自定定时启动防止后台js不执行
        if (next.data.type == "keeplive") {
          this.keeplive();
        }
        if (this.index > 99999) this.index = 0;
      });
    }
  }

  public badgeDecrease() {

    if (this.util.isMobile())
      this.badge.increase(-1);
  }


  public newSms(scd: ScdData) {
    //通知栏消息
    let notif: MwxNewMessage = new MwxNewMessage();
    notif.id = this.index++;
    notif.title = moment(scd.sd).format("YYYY年MM月DD天") + scd.st
    notif.text = scd.fs?scd.fs.ran + ":":"" + scd.sn;
    notif.data = {type: "newSms",val:scd};
    if (this.util.isMobile()) {
      this.badge.increase(1);
      this.localNotifications.schedule(notif);
    }
  }


  public schedule() {
    let notif: MwxSchedule = new MwxSchedule();
    notif.id = this.index++;
    notif.trigger = {in: DataConfig.REINTERVAL, unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data = {type: "schedule"};
    this.localNotifications.schedule(notif);
  }

  public keeplive() {
    let notif: MwxSchedule = new MwxSchedule();
    notif.id = this.index++;
    notif.trigger = {in: 60, unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data = {type: "keeplive"};

    this.localNotifications.schedule(notif);
  }


  public remind(reData: Array<ETbl>) {
    let notif: MwxRemind = new MwxRemind();
    notif.id = this.index++;
    notif.data = {type: "remind", val: reData};
    let text: string = "";
    for (let e of reData) {
      text = text + "[" + e.st + "]";
    }
    notif.text = text;
    notif.actions = [
      {id: 'close', title: '关闭'},
      {id: 'five', title: '5分钟后'},
      {id: 'ten', title: '10分钟后'}
    ];

    if (this.util.isMobile())
      this.localNotifications.schedule(notif);
  }

}

class MwxNewMessage implements ILocalNotification {
  actions: string | ILocalNotificationAction[];
  attachments: string[];
  autoClear: boolean = true;
  badge: number;
  channel: string = "cn.sh.com.xj.timeApp";
  //channel: string;
  clock: boolean | string = true;
  color: string;
  data: any;
  defaults: number;
  foreground: boolean = true;
  group: string = "【冥王星】收到活动"
  groupSummary: boolean = true;
  icon: string = "file://assets/icon/drawable-icon.png";
  id: number;
  launch: boolean = true;
  led: { color: string; on: number; off: number } | any[] | boolean | string;
  lockscreen: boolean = true;
  mediaSession: string;
  number: number;
  priority: number;
  progressBar: ILocalNotificationProgressBar | boolean;
  silent: boolean;
  smallIcon: string;
  sound: string ;
  sticky: boolean;
  summary: string;
  text: string | string[];
  timeoutAfter: number | false;
  title: string;
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = true;
  wakeup: boolean = true;
}

class MwxRemind implements ILocalNotification {
  actions: string | ILocalNotificationAction[];
  attachments: string[];
  autoClear: boolean = true;
  badge: number;
  channel: string = "cn.sh.com.xj.timeApp.remind";
  //channel: string;
  clock: boolean | string;
  color: string;
  data: any;
  defaults: number;
  foreground: boolean = true;
  group: string = "【冥王星】活动提醒"
  groupSummary: boolean = true;
  icon: string;
  id: number;
  launch: boolean = true;
  led: { color: string; on: number; off: number } | any[] | boolean | string;
  lockscreen: boolean = true;
  mediaSession: string;
  number: number;
  priority: number;
  progressBar: ILocalNotificationProgressBar | boolean;
  silent: boolean;
  smallIcon: string;
  sound: string = "file://assets/feedback/remind.mp3";
  sticky: boolean;
  summary: string;
  text: string | string[];
  timeoutAfter: number | false;
  title: string;
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = true;
  wakeup: boolean = true;
}


class MwxSchedule implements ILocalNotification {
  actions: string | ILocalNotificationAction[];
  attachments: string[];
  autoClear: boolean = true;
  badge: number;
  channel: string = "cn.sh.com.xj.timeApp";
  clock: boolean | string;
  color: string;
  data: any;
  defaults: number;
  foreground: boolean = true;
  group: string;
  groupSummary: boolean = false;
  icon: string = "file://assets/icon/drawable-icon.png";
  id: number;
  launch: boolean = true;
  led: { color: string; on: number; off: number } | any[] | boolean | string;
  lockscreen: boolean = false;
  mediaSession: string;
  number: number;
  priority: number;
  progressBar: ILocalNotificationProgressBar | boolean;
  silent: boolean = true;
  smallIcon: string;
  sound: string;
  sticky: boolean;
  summary: string;
  text: string | string[];
  timeoutAfter: number | false;
  title: string;
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = false;
  wakeup: boolean = false;
}
