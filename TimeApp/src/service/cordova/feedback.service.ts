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

  constructor(private vibration: Vibration, private audio: NativeAudio) { }


  async initAudio() {

    //id为音频文件的唯一ID
    //assetPath音频资产的相对路径或绝对URL（包括http：//）
    //官网还有更多的配置，这里只需要两个参数就行了，后面的回调记得带上
    var items = ['snare', 'highhat', 'bongo', 'bass', 'snare','remind',"sms"];
    for (var i = 0; i < items.length; i++) {
      var asset = 'assets/feedback/' + items[i] + '.mp3';
      await this.audio.preloadSimple(items[i], asset);
    }
    return;
  }

  stopSms(){
    return this.audio.stop("sms")
  }

  public audioRemind():Promise<any> {
    return this.audio.play('remind').then(d => {
      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }

  public audioSms():Promise<any> {
    if (UserConfig.settins.get(DataConfig.SYS_T).value == "0")  return ;
    return this.audio.play('sms').then(d => {

      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }


  public audioBass():Promise<any> {
    return this.audio.play('bass').then(d => {

      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }

  public audioSnare():Promise<any> {
    return this.audio.play('snare').then(d => {
      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }

  public audioHighhat():Promise<any> {

    return this.audio.play('highhat').then(d => {
      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }

  public audioBongo():Promise<any> {

    return this.audio.play('bongo').then(d => {
      if (UserConfig.settins.get(DataConfig.SYS_Z).value == "0")  return ;
      this.vibration.vibrate(200);
    });
  }
}
