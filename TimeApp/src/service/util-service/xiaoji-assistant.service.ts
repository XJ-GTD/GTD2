import { Injectable } from "@angular/core";
import { AppConfig } from "../../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "./params.service";
import { Base64 } from "@ionic-native/base64";
import { File } from "@ionic-native/file";
import { App, NavController } from "ionic-angular";
import {DataConfig} from "../../app/data.config";
import {UtilService} from "./util.service";
import {BsRestful} from "../restful/bs-restful";
declare var cordova: any;

/**
 * 小吉语音助手
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class XiaojiAssistantService extends BsRestful{

  private fileContent: any;
  private filePath: string;
  private speechText: any;

  public isSpeaking:boolean;
  public islistenAudioing:boolean;
  public isWakeUp:boolean;

  constructor(private base64: Base64,
              private http: HttpClient,
              private file: File,
              private util: UtilService,
              private paramsService: ParamsService) {
    super()
    this.isSpeaking = false;
    this.islistenAudioing = false;
  }


  /**
   * 语音助手录音录入 AUDIO
   */
  public listenAudio(success) {
    try {
      if (this.isSpeaking) return;
      this.islistenAudioing = true;

      cordova.plugins.XjBaiduSpeech.startListen(result=>{

        //讯飞语音录音设置默认存储路径
        // this.filePath = this.file.cacheDirectory + "/xjASR/iat.pcm";
        this.filePath = this.file.cacheDirectory + "/msc/iat.wav";
        console.log("文件路径：" + this.filePath);

        // 读取录音进行base64转码
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.fileContent = base64File;
          console.log("base64:" + this.fileContent);

          let data = {
            content: this.fileContent,
            userId: DataConfig.uInfo.uI,
            deviceId: this.util.getDeviceId(),
            flag: 0
          };

          this.connetXunfei(data, AppConfig.XF_AUDIO_URL);
        }, (err) => {
          console.log("异常" + err.toString());
        });

        this.islistenAudioing = false;

      },error=>{
        console.log("报错:" + error);
      },true,true);
    } catch (e) {
      console.log("问题："+ e)
    }

  }

  /**
   * 语音助手手动输入 TEXT
   */
  public listenText(text: string) {
    try {

      if (text == null){
        return 0;
      }
      this.fileContent = text;
      let data = {
        content: this.fileContent,
        userId: DataConfig.uInfo.uI,
        deviceId: this.util.getDeviceId(),
      };
      this.connetXunfei(data, AppConfig.XF_TEXT_URL);

    } catch (e) {
      console.log("问题："+ e)
    }

  }

  /**
   * 录音文件传输后台服务解析
   * @param {string} url 后台服务路径
   */
  private connetXunfei(audioData, url) {
    console.log("调用成功:" + this.fileContent);
    console.log("调用URL:" + url);
    //调用讯飞语音服务
    this.bsHttp(this.http ,url, audioData)
      .then(data => {
        console.log("data" + data);
        //接收Object JSON数据

        console.log("语音调用成功:" + this.speechText);
        this.speakText(this.speechText,rs=>{
          console.log("语音调用成功2:" + rs);
        });
      }).catch(e=>{
        console.error("XiaojiAssistantService connetXunfei error:" + JSON.stringify(e))
    })
  }

  /**
   * 返回语音播报
   */
  public speakText(speechText: string,success) {
    try {
      if (this.islistenAudioing) return;
      this.isSpeaking = true;

      cordova.plugins.XjBaiduTts.startSpeak(result=>{
        console.log("成功:" + result);
        this.isSpeaking = false;
        success(result);
      },error=>{
        console.log("报错:" + error);
        this.isSpeaking = false;
      }, speechText);
    } catch (e) {
      console.log("问题："+ e)
    }
  }

  /**
   * 启动监听WakeUp
   */
  public initbaiduWakeUp(success) {
    try {
      cordova.plugins.XjBaiduWakeUp.wakeUpStart(result=>{
        if (    this.isSpeaking || this.islistenAudioing) {

          success(false);
          return;
        }
        success(true);
      },error=>{
        alert("报错:" + error);
      },"");
    } catch (e) {
      alert("问题："+ e)
    }
  }

  /**
   * 停止监听WakeUp
   */
  public baiduWakeUpStop() {
    try {
        cordova.plugins.XjBaiduWakeUp.wakeUpStop();
    } catch (e) {
      alert("问题："+ e)
    }
  }
}
