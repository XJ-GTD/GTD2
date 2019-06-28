import {Injectable} from "@angular/core";
import {Vibration} from '@ionic-native/vibration';
import {NativeAudio} from '@ionic-native/native-audio';
import {UserConfig} from "../config/user.config";
import {DataConfig} from "../config/data.config";

/**
 * 界面操作回馈
 *
 * create by wzy on 2018/10/28.
 */
@Injectable()
export class FeedbackService {

  constructor(private vibration: Vibration, private audio: NativeAudio) {
  }


  async initAudio() {

    //id为音频文件的唯一ID
    //assetPath音频资产的相对路径或绝对URL（包括http：//）
    //官网还有更多的配置，这里只需要两个参数就行了，后面的回调记得带上


    var items = ['click', 'delete', 'press', 'save', 'send', 'trans', 'warning','option'];
    for (var i = 0; i < items.length; i++) {
      var asset = 'assets/feedback/' + items[i] + '.mp3';
      await this.audio.preloadSimple(items[i], asset);
    }
    return;
  }

  // public audioRemind() {
  //   return this.audio.play('remind').then(d => {
  //     if (UserConfig.getSetting(DataConfig.SYS_Z)) return;
  //     this.vibration.vibrate(200);
  //   });
  // }
  //
  // public audioSms() {
  //   if (UserConfig.settins.get(DataConfig.SYS_T).value == "0") return;
  //   return this.audio.play('sms').then(d => {
  //
  //     if (UserConfig.getSetting(DataConfig.SYS_Z)) return;
  //     this.vibration.vibrate(200);
  //   });
  // }
  public audioWarning() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('warning');
      this.vibration.vibrate(600);
    }
    return;
  }

  public audioOption() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('option');
      //this.vibration.vibrate(600);
    }
    return;
  }
  public audioTrans() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('trans');
      this.vibration.vibrate(100);
    }
    return;
  }
  public audioSend() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('send');
      this.vibration.vibrate(200);
    }
    return;
  }

  public audioSave() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('save');
      this.vibration.vibrate(300);
    }
    return;
  }

  public audioPress() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('press');
      this.vibration.vibrate(400);
    }
    return;
  }

  public audioDelete() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('delete');
      this.vibration.vibrate(300);
    }
    return;
  }

  public audioClick() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.audio.play('click');
      this.vibration.vibrate(200);
    }
    return;
  }

  public vibrate() {

    if (UserConfig.getSetting(DataConfig.SYS_Z)) {
      this.vibration.vibrate(400);
    }
    return;
  }
}
