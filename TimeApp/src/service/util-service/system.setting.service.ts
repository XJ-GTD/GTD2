import {Injectable} from "@angular/core";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {NativeAudio} from "@ionic-native/native-audio";
import {XiaojiAssistantService} from "./xiaoji-assistant.service";

/**
 * 系统设置方法类
 *
 * create by wzy on 2019/01/29
 */
@Injectable()
export class SystemSettingService {

  private index: number;

  //软件音效+震动
  //新消息提醒
  //闹铃设置

  constructor(private localNotifications: LocalNotifications,
              private nativeAudio: NativeAudio,
              private xiaojiSpeech: XiaojiAssistantService) {
    //id为音频文件的唯一ID
    //assetPath音频资产的相对路径或绝对URL（包括http：//）
    //官网还有更多的配置，这里只需要两个参数就行了，后面的回调记得带上
    this.nativeAudio.preloadSimple("sms", "assets/audio/sms.mp3").then(success => {
      console.log("音频执行成功");
    }, error => {
      console.log("音频执行失败");
    });

    this.localNotifications.on('click').subscribe(success => {
      console.log("点击消息通知关闭短信铃声");
      this.nativeAudio.stop("sms");
    }, error => {

    });
    this.localNotifications.on('clear').subscribe(success => {
      console.log("清除消息通知关闭短信铃声");
      this.nativeAudio.stop("sms");
    }, error => {

    });

    this.index = 1;
  }


  public newSms() {
    this.xiaojiSpeech.speakText("你有一条新消息", success => {});
    //铃声启动
    this.nativeAudio.play('sms').then(success => {
      console.log("闹钟铃声播放成功");
    }, error => {
      console.log("闹钟铃声播放失败：" + error.toString());
    });

    //通知栏消息
    this.localNotifications.schedule({
      id: this.index,//将来清除，取消，更新或检索本地通知所需的唯一标识符默认值：0
      icon: 'assets/icon/drawable-icon.png',
      title:"冥王星",
      text: "你有一条新消息",
      trigger: {at: new Date(new Date().getTime())},//何时触发通知
      //声音设置了无效
      sound: null,//显示警报时包含播放声音的文件的Uri默认值：res：// platform_default
      launch:true,
      //在我手机上也是无效的
      lockscreen:true//仅限ANDROID如果设置为true，则通知将在所有锁定屏幕上完整显示。如果设置为false，则不会在安全锁屏上显示。
    });

    this.index++;
  }
}
