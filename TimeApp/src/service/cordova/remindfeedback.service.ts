import {Injectable} from "@angular/core";
import {Vibration} from "@ionic-native/vibration";
import {File} from "@ionic-native/file";

declare var Media: any;
 ;

/**
 * 消息AI提醒处理
 */
@Injectable()
export class RemindfeedbackService {

  resouceMap:Array<any> = new Array<any>();
  media:any;
  // resoucePlayMap:Map<string,any> = new Map<string,any>();

  asset:string = this.file.applicationDirectory + 'www/assets/remind/';

  constructor(private vibration: Vibration,private file: File) {

    this.resouceMap =
      [{key:'1',name:"尽快",mp3:'1.mp3'},
      {key:'2',name:"短小",mp3:'2.mp3'},
      {key:'3',name:"发条",mp3:'3.mp3'},
      {key:'4',name:"安静",mp3:'4.mp3'},
      {key:'5',name:"轻柔",mp3:'5.mp3'},
      {key:'6',name:"活泼",mp3:'6.mp3'},
      {key:'7',name:"惊讶",mp3:'7.mp3'},
      {key:'8',name:"亲爱的",mp3:'8.mp3'},
      {key:'9',name:"普通",mp3:'9.mp3'}];
  }


  async initAudio() {

    //id为音频文件的唯一ID
    //assetPath音频资产的相对路径或绝对URL（包括http：//）
    //官网还有更多的配置，这里只需要两个参数就行了，后面的回调记得带上
    // for (let r of this.resouceMap){
    //   try{
    //     let o = new Media(asset);
    //     this.resoucePlayMap.set(r.key,o);
    //
    //   }catch (e) {
    //   }
    // }
    return;
  }

  public getMp3s():Array<any>{
    return this.resouceMap;
  }

  public remindAudio(key:string,succes:Function,error:Function){
    this.vibration.vibrate([200,100,200,500]);
    if (this.media){
      this.releaseMedia();
    }
    let mp3 = this.resouceMap.find((val)=>{
      return val.key == key;
    });
    console.log(mp3.mp3);
    this.media = new Media(this.asset + mp3.mp3,()=>{
      succes();
    },()=>{
      error();
    });

    this.media.play();
  }

  releaseMedia(){
    this.media.stop();
    this.media.release();
    this.media = null;
  }

  public remindAudioStop(){
    if (this.media){
      this.releaseMedia();
    }
  }
}
