import {Injectable} from "@angular/core";
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  ILocalNotificationAction, ILocalNotificationProgressBar,
  ILocalNotificationTrigger,
  LocalNotifications
} from "@ionic-native/local-notifications";
import {Badge} from "@ionic-native/badge";
import * as moment from "moment";
import {UtilService} from "../util-service/util.service";
import {DataConfig} from "../config/data.config";
import {ETbl} from "../sqlite/tbl/e.tbl";
import {EmitService, ScdEmData} from "../util-service/emit.service";
import {ScdData} from "../../data.mapping";

/**
 * 系统设置方法类
 *
 * create by wzy on 2019/01/29
 */
@Injectable()
export class NotificationsService {

  private index: number = 0;

  constructor(private localNotifications: LocalNotifications, private badge: Badge,
              private util: UtilService,
              private emitService: EmitService) {
    if (this.util.isMobile()) {
      //提醒回馈处理 5分钟
      this.localNotifications.on('five').subscribe((next: ILocalNotification) => {
        this.localNotifications.get(next.id).then(notifi=>{
          let reDate: moment.Moment = moment().add(5, "m");
          notifi.trigger = {at:reDate.toDate()}
          this.localNotifications.schedule(notifi);
        });
        //this.localNotifications.clear(next.id);
        //this.localNotifications.cancel(next.id);
      });
      //提醒回馈处理 10分钟
      this.localNotifications.on('ten').subscribe((next: ILocalNotification) => {
        this.localNotifications.get(next.id).then(notifi=>{
          let reDate: moment.Moment = moment().add(10, "m");
          notifi.trigger = {at:reDate.toDate()}
          this.localNotifications.schedule(notifi);
        });
      });

      //提醒回馈处理 15分钟
      this.localNotifications.on('tenfive').subscribe((next: ILocalNotification) => {
        this.localNotifications.get(next.id).then(notifi=>{
          let reDate: moment.Moment = moment().add(15, "m");
          notifi.trigger = {at:reDate.toDate()}
          this.localNotifications.schedule(notifi);
        });
      });

      //提醒回馈处理 关闭
      this.localNotifications.on('close').subscribe((next: ILocalNotification) => {
        this.localNotifications.clear(next.id);
      });

      //提醒回馈处理 关闭
      this.localNotifications.on('schedule').subscribe((next: ILocalNotification) => {
      });
      //提醒回馈处理 关闭
      this.localNotifications.on('update').subscribe((next: ILocalNotification) => {
      });
      //提醒回馈处理 关闭
      this.localNotifications.on('cancel').subscribe((next: ILocalNotification) => {
      });
      //提醒回馈处理 关闭
      this.localNotifications.on('cancelall').subscribe((next: ILocalNotification) => {
      });

      this.localNotifications.on('click').subscribe((next: ILocalNotification) => {
        //跳转到界面处理
        this.emitPage(next);

      });
      this.localNotifications.on('clear').subscribe((next: ILocalNotification) => {
        this.localNotifications.clear(next.id);
      });
      this.localNotifications.on('clearAll').subscribe((next: ILocalNotification) => {
      });

      this.localNotifications.on('trigger').subscribe((next: ILocalNotification) => {

        //自定定时启动防止后台js不执行
        if (next.data.type == "keeplive") {
          this.keeplive();
        }

        if (next.data.type == "systimeout") {
          this.emitService.emit(next.data.emitkey);
        }


        if (this.index > 99999) this.index = 0;
      });
    }
  }

  emitPage(next:ILocalNotification){
    if (next.data.type == "newSms") {
      let scd:ScdData = new ScdData()
      scd = next.data.val;
      let emMessage:ScdEmData = new ScdEmData();
      emMessage.id = scd.si;
      emMessage.d = scd.sd;
      this.emitService.emitNewMessageClick(emMessage);
      this.localNotifications.clear(next.id);
    }

    if (next.data.type == "newMessage") {
      let data: any = next.data.val;
      let eventhandler: string = data? data.eventhandler : "";

      if (eventhandler) {
        this.emitService.emit(eventhandler, data);
      }

      this.localNotifications.clear(next.id);
    }
  }

  public badgeDecrease() {

    if (this.util.isMobile())
      this.badge.increase(-1);
  }

  public badgeClear() {

    if (this.util.isMobile()){
      this.badge.clear();
      this.localNotifications.clearAll();
    }
  }

  public newSms(scd: ScdData) {
    //通知栏消息
    let notif: MwxNewMessage = new MwxNewMessage();
    notif.id = this.index++;
    notif.title = moment(scd.sd).format("YYYY-MM-DD ") + " " + this.util.adStrShow(scd.st);
    notif.text = (scd.fs?scd.fs.ran + ":":"") + scd.sn;
    notif.data = {type: "newSms",val:scd};
    //notif.trigger = {at:new Date()}
    if (this.util.isMobile()) {
      this.badge.increase(1);
      this.localNotifications.schedule(notif);
      this.emitService.emitRef(scd.sd);
    }
  }

  public newMessage(title: string, text: string, data: any) {
    //非日程通知栏消息
    let notif: MwxNewMessage = new MwxNewMessage();
    notif.id = this.index++;
    notif.title = title;
    notif.text = text;
    notif.data = {type: "newMessage", val: data};

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
    notif.trigger = {in: 1, unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data = {type: "keeplive"};

    this.localNotifications.schedule(notif);
  }

  public sysTimeout(key:string,mi:number):number {
    let notif: MwxSchedule = new MwxSchedule();
    notif.id = this.index++;
    notif.trigger = {in: mi, unit: ELocalNotificationTriggerUnit.SECOND};
    notif.data = {type: "systimeout",emitkey:key};

    this.localNotifications.schedule(notif);
    return notif.id;
  }

  public cancel(id:number) {

    this.localNotifications.cancel(id);
  }


  public remind(reData: Array<ETbl>) {
    let notif: MwxRemind = new MwxRemind();
    notif.id = this.index++;
    notif.data = {type: "remind", val: reData};
    let text: string = "";
    for (let e of reData) {
      text = text +  e.st + "\r\n";
    }
    notif.text = text;
    notif.title = "【冥王星】活动提醒"
    notif.actions = [
      {id: 'close', title: '知道了'},
      {id: 'five', title: '5分钟后'},
      {id: 'ten', title: '10分钟后'},
      {id: 'tenfive', title: '15分钟后'}
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
  sticky: boolean = true;
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
  priority: number = 5;
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
