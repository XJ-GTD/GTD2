import {Injectable} from "@angular/core";
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  ILocalNotificationAction, ILocalNotificationProgressBar,
  ILocalNotificationTrigger,
  LocalNotifications
} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import {CTbl} from "../sqlite/tbl/c.tbl";
import {ScdData} from "../pagecom/pgbusi.service";
import * as moment from "moment";
import {UtilService} from "../util-service/util.service";

/**
 * 系统设置方法类
 *
 * create by wzy on 2019/01/29
 */
@Injectable()
export class NotificationsService {

  private index: number;

  constructor(private localNotifications: LocalNotifications,private badge:Badge,private util:UtilService) {

    if (util.isMobile()){
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

      this.localNotifications.on('trigger').subscribe((next: ILocalNotification) => {
        console.log("******************************定时器是否启用");

        if (next.data.type == "schedule"){
          this.schedule();
          this.newSms(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),new ScdData());
        }
        if (next.data.type == "keeplive"){
          this.keeplive();
        }
        // if (next.text == "111"){
        //   this.newSms("这是一个测试",new ScdData());
        // }
        console.log("******************************定时器是否启用是的");

      });
    }



    this.index = 0;
  }

  public badgeDecrease(){

    if (this.util.isMobile())
      this.badge.increase(-1);
  }


  public newSms(text: string,scd:ScdData) {
    //铃声启动
    // this.feedback.audioSms().then(success => {
    //   console.log("闹钟铃声播放成功");
    // }, error => {
    //   console.log("闹钟铃声播放失败：" + error.toString());
    // });

    //通知栏消息
    let notif: MwxNewMessage = new MwxNewMessage();
    notif.id = this.index++;
    notif.text = text;
    notif.data = scd;
    if (this.util.isMobile())
    this.localNotifications.schedule(notif);

  }


  public schedule() {
    let notif: MwxSchedule = new MwxSchedule();
    notif.id = this.index++;
    notif.trigger =  {in: 3,unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data ={type:"schedule"};

    this.localNotifications.schedule(notif);
  }

  public keeplive() {
    let notif: MwxSchedule = new MwxSchedule();
    notif.id = this.index++;
    notif.trigger =  {in: 3,unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data ={type:"keeplive"};

    this.localNotifications.schedule(notif);
  }


  public remind() {
    let notif: MwxSchedule = new MwxSchedule();
    notif.data ={str:"this test"};

    if (this.util.isMobile())
    this.localNotifications.schedule(notif);
  }

}

class MwxNewMessage implements ILocalNotification {
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
  group: string = "冥王星新日程"
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
  title: string = "收到新日程";
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = true;
  wakeup: boolean = true;
}

class MwxRemind implements ILocalNotification {
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
  group: string = "冥王星提醒"
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
  title: string = "活动提醒";
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = true;
  wakeup: boolean = true;
}


class MwxSchedule implements ILocalNotification {
  actions: string | ILocalNotificationAction[];
  attachments: string[];
  autoClear: boolean = false;
  badge: number;
  channel: string;
  clock: boolean | string = false;
  color: string;
  data: any;
  defaults: number;
  foreground: boolean = true;
  group: string;
  groupSummary: boolean = false;
  icon: string;
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
  title: string ;
  trigger: ILocalNotificationTrigger;
  vibrate: boolean = false;
  wakeup: boolean = false;
}
