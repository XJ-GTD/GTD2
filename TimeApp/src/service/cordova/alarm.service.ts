import { Injectable } from "@angular/core";
import { LocalNotifications } from "@ionic-native/local-notifications";
import {NativeAudio} from "@ionic-native/native-audio";
import {Vibration} from "@ionic-native/vibration";

declare var cordova: any;

/**
 * 小鸡闹钟设置
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class AlarmService {

  private index: number;
  private date: string[];
  private dateOfHM: string[];
  private dateOfYMD: string[];
  private year: number;
  private month: number;
  private day: number;
  private hour: number;
  private minute: number;

  constructor(private localNotifications: LocalNotifications,
              private vibration: Vibration,
              private nativeAudio: NativeAudio){


    this.localNotifications.on('click').subscribe(success => {
      console.log("点击消息通知关闭了闹钟");
      this.nativeAudio.stop("schedule1");
    }, error => {

    });
    this.localNotifications.on('clear').subscribe(success => {
      console.log("清除消息通知关闭了闹钟");
      this.nativeAudio.stop("schedule1");
    }, error => {

    });

    this.index = 1;
  }

  public setAlarmClock(date: string, scheduleName: string) {

    //data 入参格式 YYYY/MM/DD HH:ss
    this.formatDate(date);

    //铃声设置
    this.vibration.vibrate(1000);

    console.log("开始设定闹钟");
    // set wakeup timer
    cordova.plugins.xjalarmclock.wakeup( result => {
        if (result.type==='wakeup') {
          console.log("检测到闹钟 启动成功: " + result.extra);

          //铃声启动
          this.nativeAudio.play('schedule1').then(success => {
            console.log("闹钟铃声播放成功");
          }, error => {
            console.log("闹钟铃声播放失败：" + error.toString());
          });

          //通知栏消息
          this.localNotifications.schedule({
            id: this.index,//将来清除，取消，更新或检索本地通知所需的唯一标识符默认值：0
            icon: '../resources/android/icon/drawable-icon.png',
            title:"闹钟提醒",
            text: "来自日程["+ scheduleName + "]",
            trigger: {at: new Date(new Date().getTime())},//何时触发通知
            //声音设置了无效
            sound: null,//显示警报时包含播放声音的文件的Uri默认值：res：// platform_default
            launch:true,
            //在我手机上也是无效的
            lockscreen:true//仅限ANDROID如果设置为true，则通知将在所有锁定屏幕上完整显示。如果设置为false，则不会在安全锁屏上显示。
          });

          this.index++;

        } else if(result.type==='set'){
          console.log("检测到闹钟 设定: " + result);
        } else {
          console.log('检测到未处理的类型 ( '+ result + '|' + result.type + ')');
        }

      },
      error => {
        console.log("闹钟设定失败: " + error.toString());
      },
      // a list of alarms to set
      {
        alarms : [{
          type : 'onetime',
          time : { year: this.year, month: this.month, day: this.day, hour : this.hour, minute : this.minute },
          extra : { message : '来自日程[' + scheduleName + ']' },
          message : '闹钟已经过时！'
        }]
      }
    );

  }

  /**
   * 设定闹钟延迟唤醒
   */
  private setAlarmSnooze() {

    cordova.plugins.xjalarmclock.snooze( result => {
        if (result.type==='wakeup') {
          console.log('wakeup alarm detected--' + result.extra);
        } else if(result.type==='set'){
          console.log('wakeup alarm set--' + result);
        } else {
          console.log('wakeup unhandled type (' + result.type + ')');
        }
      },
      error => {

      },
      {
        alarms : [{
          type : 'snooze',
          time : { seconds : 60 }, // snooze for 60 seconds
          extra : { }, // json containing app-specific information to be posted when alarm triggers
          message : 'message',
          sound : 'sound',
          action : 'action'
        }]
      }
    );
  }

  /**
   * 分割年月日时分
   * @param {string} date
   */
  private formatDate(date: string) {

    this.date = date.split(" ");

    this.dateOfYMD = this.date[0].split("/"); //分割年月日
    this.dateOfHM = this.date[1].split(":");  //分割时分

    this.year = parseInt(this.dateOfYMD[0]);
    this.month = parseInt(this.dateOfYMD[1]);
    this.day = parseInt(this.dateOfYMD[2]);

    this.hour = parseInt(this.dateOfHM[0]);
    this.minute = parseInt(this.dateOfHM[1]);

    console.log("format 完成:" + this.year +" "+ this.month +" "+ this.day +" "+ this.hour +" "+ this.minute);
  }


}
