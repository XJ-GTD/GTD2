import {Injectable} from "@angular/core";
import {
  ILocalNotification,
  ILocalNotificationAction, ILocalNotificationProgressBar,
  ILocalNotificationTrigger,
  LocalNotifications
} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {ScdData} from "../pagecom/pgbusi.service";

/**
 * 系统设置方法类
 *
 * create by wzy on 2019/01/29
 */
@Injectable()
export class NotificationsService {

  private index: number;

  constructor(private localNotifications: LocalNotifications,private badge:Badge) {


    this.localNotifications.on('click').subscribe((next: ILocalNotification) => {
      //跳转到界面处理
      this.localNotifications.clear(next.id);
      this.localNotifications.cancel(next.id);
      this.index--;
    });
    this.localNotifications.on('clear').subscribe((next: ILocalNotification) => {
      this.localNotifications.clear(next.id);
      this.localNotifications.cancel(next.id);
      this.index--;
    });
    this.localNotifications.on('clearAll').subscribe((next: ILocalNotification) => {
      this.localNotifications.clearAll();
      this.localNotifications.cancelAll();
      this.index = 0;
    });

    this.index = 0;
  }


  public newSms(text: string,scd:ScdData) {
    //铃声启动
    // this.feedback.audioSms().then(success => {
    //   console.log("闹钟铃声播放成功");
    // }, error => {
    //   console.log("闹钟铃声播放失败：" + error.toString());
    // });

    //通知栏消息
    let notif: MwxNotification = new MwxNotification();
    notif.id = this.index++;
    notif.trigger = {at: new Date(new Date().getTime())};
    notif.text = text;
    notif.data = scd;

    this.localNotifications.schedule(notif);
    this.badge.increase(1);

  }
}

class MwxNotification implements ILocalNotification {
  actions: string | ILocalNotificationAction[];
  attachments: string[];
  autoClear: boolean = true;
  badge: number;
  channel: string;
  clock: boolean | string = true;
  color: string;
  data: any;
  defaults: number;
  foreground: boolean = true;
  group: string = "冥王星新消息提醒"
  groupSummary: boolean = true;
  icon: string = "assets/icon/drawable-icon.png";
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
  sound: string;
  sticky: boolean;
  summary: string;
  text: string | string[];
  timeoutAfter: number | false;
  title: string = "冥王星";
  trigger: ILocalNotificationTrigger = {at: new Date(new Date().getTime())};
  vibrate: boolean = true;
  wakeup: boolean = true;
}
