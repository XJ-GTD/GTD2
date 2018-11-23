import { Injectable } from "@angular/core";
import { LocalNotifications } from "@ionic-native/local-notifications";

declare var cordova: any;

/**
 * 小鸡闹钟设置
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class XiaojiAlarmclockService {

  private success: any;
  private date: string[];
  private dateOfHM: string[];
  private dateOfYMD: string[];
  private year: number;
  private month: number;
  private day: number;
  private hour: number;
  private minute: number;

  constructor(private localNotifications: LocalNotifications){}

  public setAlarmClock(date: string, scheduleName: string) {

    //data 入参格式 yyyy-MM-dd HH:ss
    this.formatDate(date);

    console.log("开始设定");
    // set wakeup timer
    cordova.plugins.xjalarmclock.wakeup( result => {
        if (result != "OK") {
          this.success = JSON.stringify(result);

          //通知栏消息
          this.localNotifications.schedule({
            id: 1,//将来清除，取消，更新或检索本地通知所需的唯一标识符默认值：0
            title:"消息通知",
            text: "来自"+ scheduleName + "的提醒",
            trigger: {at: new Date(new Date().getTime())},//何时触发通知
            //声音设置了无效
            sound: null,//显示警报时包含播放声音的文件的Uri默认值：res：// platform_default
            launch:true,
            //在我手机上也是无效的
            lockscreen:true//仅限ANDROID如果设置为true，则通知将在所有锁定屏幕上完整显示。如果设置为false，则不会在安全锁屏上显示。
          });

        } else {

          console.log("设定成功2: " + result);
        }


      },
      err => {
        console.log("设定失败: " + err.toString());
      },
      // a list of alarms to set
      {
        alarms : [{
          type : 'onetime',
          time : { year: this.year, month: this.month, day: this.day, hour : this.hour, minute : this.minute },
          extra : { message : '提醒闹钟设定完成' },
          message : 'Alarm has expired!'
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

    this.dateOfYMD = this.date[0].split("-"); //分割年月日
    this.dateOfHM = this.date[1].split(":");  //分割时分

    this.year = parseInt(this.dateOfYMD[0]);
    this.month = parseInt(this.dateOfYMD[1]);
    this.day = parseInt(this.dateOfYMD[2]);

    this.hour = parseInt(this.dateOfHM[0]);
    this.minute = parseInt(this.dateOfHM[1]);

    console.log("format 完成:" + this.year +" "+ this.month +" "+ this.day +" "+ this.hour +" "+ this.minute);
  }


}
