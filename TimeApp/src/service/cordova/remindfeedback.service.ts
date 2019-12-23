import {Injectable} from "@angular/core";
import {ETbl} from "../sqlite/tbl/e.tbl";
import * as moment from "moment";
import {DataConfig} from "../config/data.config";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";
import {UserConfig} from "../config/user.config";

;

/**
 * 消息AI提醒处理
 */
@Injectable()
export class RemindfeedbackService {

  resouceMap:Array<any> = new Array<any>();

  constructor(private vibration: Vibration, private audio: NativeAudio) {
    this.resouceMap = [{key:'1',name:"尽快"},
      {key:'2',name:"短小"},
      {key:'3',name:"发条"},
      {key:'4',name:"安静"},
      {key:'5',name:"轻柔"},
      {key:'6',name:"活泼"},
      {key:'7',name:"惊讶"},
      {key:'8',name:"亲爱的"},
      {key:'9',name:"普通"}];
  }


  async initAudio() {

    //id为音频文件的唯一ID
    //assetPath音频资产的相对路径或绝对URL（包括http：//）
    //官网还有更多的配置，这里只需要两个参数就行了，后面的回调记得带上

    for (let r of this.resouceMap){
      var asset = 'assets/remind/' + r.key + '.mp3';
      await this.audio.preloadComplex( r.key, asset,1,1,0);
    }
    return;
  }

  public getMp3s():Array<any>{
    return this.resouceMap;
  }

  public remindAudio(key:string):Promise<any>{
    this.vibration.vibrate([200,100,200,500]);
    return this.audio.play(key);
  }

  public remindAudioStop(key:string):Promise<any>{
    return this.audio.stop(key);
  }
}
