import {Injectable} from "@angular/core";
import {Vibration} from "@ionic-native/vibration";
import {Media,MediaObject} from "@ionic-native/media";
import {File} from "@ionic-native/file";

// declare var Media: any;
//  ;

/**
 * 消息AI提醒处理
 */
@Injectable()
export class RemindfeedbackService {

  resouceMap:Array<any> = new Array<any>();
  resoucePlayMap:Map<string,MediaObject> = new Map<string,MediaObject>();

  asset:string = this.file + 'www/assets/remind/';
  mediaObject: MediaObject;

  constructor(private vibration: Vibration,private file: File,private media: Media) {

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
    for (let r of this.resouceMap){
      try{
        let o = this.media.create(this.asset + r.mp3);
        this.resoucePlayMap.set(r.key,o);

      }catch (e) {
        console.log(e)

      }
    }
    return;
  }

  public getMp3s():Array<any>{
    return this.resouceMap;
  }

  public remindAudio(key:string,succes:Function,error:Function){
    if (this.mediaObject){
      this.releaseMedia();
    }
    this.vibration.vibrate([200,100,200,500]);

    this.mediaObject = this.resoucePlayMap.get(key);

    if (this.mediaObject){

        this.mediaObject.onSuccess.subscribe(() => {
          this.releaseMedia();
          if (succes) succes();
        });
        this.mediaObject.onError.subscribe(()=>{
          this.releaseMedia();
          if (error) error();
        });
      this.mediaObject.play();
    }
  }

  releaseMedia(){
    if (this.mediaObject){

      this.mediaObject.onSuccess.subscribe(() => {
      });
      this.mediaObject.onError.subscribe(()=>{
      });
      this.mediaObject.stop();
    }

  }

  public remindAudioStop(){
    if (this.mediaObject){
      this.releaseMedia();
    }
  }
}
