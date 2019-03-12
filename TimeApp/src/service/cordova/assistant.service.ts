import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
import { UtilService } from "../util-service/util.service";
import {AibutlerRestful, AudioPro, TextPro} from "../restful/aibutlersev";
declare var cordova: any;

/**
 * 小吉语音助手
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class AssistantService{

  private failedText: string = '我没有听清楚你说什么';  //暂时替代，录入字典表后删除
  public isSpeaking:boolean;
  public islistenAudioing:boolean;
  public isWakeUp:boolean;

  constructor(private file: File,
             private util: UtilService,
              private aibutlerRestful: AibutlerRestful) {
    this.isSpeaking = false;
    this.islistenAudioing = false;
  }


  /**
   * 语音助手录音录入 AUDIO
   */
  public listenAudio(success) {
    try {
      console.log("开始语音录入 | isSpeaking:" + this.isSpeaking + "| islistenAudioing" + this.islistenAudioing)
      if (this.isSpeaking || this.islistenAudioing) {
        console.log("正在录入语音");
        return;
      }
      this.islistenAudioing = true;

      cordova.plugins.XjBaiduSpeech.startListen(result=>{

        //讯飞语音录音设置默认存储路径
        //this.filePath = this.file.cacheDirectory + "iat.pcm";

       //this.filePath = this.file.externalRootDirectory + "/xjASR/iat.pcm";
        console.log("文件路径：" + this.file.cacheDirectory);

        // 读取录音进行base64转码
        this.file.readAsDataURL(this.file.cacheDirectory,"iat.pcm").then((base64File: string) => {


          /**
           * 录音文件传输后台服务解析
           * @param {string} url 后台服务路径
           */
          let audioPro = new AudioPro();
          audioPro.d.vb64 = base64File;
          this.aibutlerRestful.postaudio(audioPro)
            .then(data => {
              console.log("data code：" + data.code);
              //接收Object JSON数据

            }).catch(e=>{
            console.error("XiaojiAssistantService connetXunfei error:" + JSON.stringify(e));
            this.speakText("现在我遇到了小麻烦，请您稍后再来找我吧", success=>{});
          });

          success(result);

        }, (err) => {
        });

        this.islistenAudioing = false;

      },error=>{
        this.islistenAudioing = false;
      },true,true);
    } catch (e) {
      this.islistenAudioing = false;
    }

  }

  testBase64Ios(sucess){
    console.log("testBase64Ios:" + 1);
    var c = document.createElement('canvas');

    console.log("testBase64Ios:" + 2);
    var ctx = c.getContext("2d");

    console.log("testBase64Ios:" + 3);
    var img = new Image();

    console.log("testBase64Ios:" + 4);

    img.onload = function() {

      console.log("testBase64Ios:" + 11);

      c.width = 100;
      c.height = 100;

      console.log("testBase64Ios:" + 12);

      ctx.drawImage(img, 0, 0);

      console.log("testBase64Ios:" + 13);

      var dataUri = c.toDataURL("image/png");

      console.log("testBase64Ios:" + 14);

      sucess(dataUri);

      console.log("testBase64Ios:" + 15);
    };
    var filePath = this.file.cacheDirectory + "xjASR/iat.pcm";
    console.log("testBase64Ios:" + 5 + "====>" + filePath);
    img.src = filePath;
    console.log("testBase64Ios:" + 5);
  }

  /**
   * 语音助手手动输入 TEXT
   */
  public listenText(text: string) {
    try {

      if (text == null){
        return 0;
      }
      let textPro = new TextPro();
      textPro.d.text = text;
      this.aibutlerRestful.posttext(textPro)
        .then(data => {
          console.log("data code：" + data.code);
          //接收Object JSON数据

        }).catch(e=>{
        console.error("XiaojiAssistantService connetXunfei error:" + JSON.stringify(e));
        this.speakText("现在我遇到了小麻烦，请您稍后再来找我吧", success=>{});
      });

    } catch (e) {
      console.log("问题："+ e)
    }

  }

  /**
   * 返回语音播报
   */
  public speakText(speechText: string,success) {
    try {
      if (this.islistenAudioing) return;
      this.stopSpeak();
      this.isSpeaking = true;

      if (speechText == null || speechText == "") {
        speechText = this.failedText;
      }

      cordova.plugins.XjBaiduTts.startSpeak(result=>{
        console.log("成功:" + result);
        this.isSpeaking = false;
        success(result);
      },error=>{
        console.log("报错:" + error);
        success(false);
        this.isSpeaking = false;
      }, speechText);
    } catch (e) {
      success(false);
      this.isSpeaking = false;
      console.log("问题："+ e)
    }
  }

  /**
   * 停止语音播报
   */
  public stopSpeak() {
    try {
      if (cordova.plugins.XjBaiduSpeech != null && cordova.plugins.XjBaiduSpeech != undefined) {
        console.log("停止播报 | isSpeaking:" + this.isSpeaking + "| islistenAudioing" + this.islistenAudioing);
        cordova.plugins.XjBaiduTts.speakStop();
        this.isSpeaking = false;
      } else {
        console.log("语音对象不存在");
        this.isSpeaking = false;
      }

    } catch (e) {
      this.isSpeaking = false;
      console.log("stopSpeak问题："+ e)
    }
  }

  /**
   * 停止监听
   */
  public stopListenAudio() {
    try {
      if (cordova.plugins.XjBaiduSpeech != null && cordova.plugins.XjBaiduSpeech != undefined) {
        console.log("停止监听");
        cordova.plugins.XjBaiduSpeech.stopListen();
      } else {
        console.log("停止监听失败");
      }
    } catch (e) {
      console.log("stopListenAudio问题："+ e)
    }

  }

  /**
   * 启动监听WakeUp
   */
  public initbaiduWakeUp(success) {
    try {
      cordova.plugins.XjBaiduWakeUp.wakeUpStart(result=>{
        if (this.isSpeaking || this.islistenAudioing) {
          success(false);
          return;
        }
        success(true);
      },error=>{
        console.log("问题："+ error)
      },"");
    } catch (e) {
      console.log("问题："+ e)
    }
  }

  /**
   * 停止监听WakeUp
   */
  public baiduWakeUpStop() {
    try {
        cordova.plugins.XjBaiduWakeUp.wakeUpStop();
    } catch (e) {
      console.log("问题："+ e)
    }
  }
}
