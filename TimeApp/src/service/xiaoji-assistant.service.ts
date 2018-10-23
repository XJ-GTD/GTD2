import { Injectable } from "@angular/core";
import { AppConfig } from "../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "./params.service";
import { Base64 } from "@ionic-native/base64";
import { File } from "@ionic-native/file";
import { App, NavController } from "ionic-angular";

declare var cordova: any;

/**
 * 小鸡语音助手
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class XiaojiAssistantService {

  private fileContent: any;
  private filePath: string;
  private speechText: any;

  public isSpeaking:boolean;
  public islistenAudioing:boolean;
  public isWakeUp:boolean;

  constructor(public appCtrl : App,
              private base64: Base64,
              private http: HttpClient,
              private file: File,
              private paramsService: ParamsService) {
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
        // alert("成功:" + result);
        //讯飞语音录音设置默认存储路径
        this.filePath = this.file.externalRootDirectory + "/xjASR/iat.pcm";
        console.log("文件路径：" + this.filePath);


        let url = AppConfig.XUNFEI_URL_AUDIO;

        // 读取录音进行base64转码
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.fileContent = base64File;
          console.log("base64:" + this.fileContent);
          this.connetXunfei(url,success);
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
  public listenText(text: string,success) {
    try {

      if (text == null){
        return 0;
      }
      this.fileContent = text;
      let url = AppConfig.XUNFEI_URL_TEXT;
      this.connetXunfei(url,success);

    } catch (e) {
      console.log("问题："+ e)
    }

  }

  //文件上传
  fileUpload(filePath, url) {

    /*  this.file

      this.http.post(url, {
        content: this.fileContent
      },{
        headers: {
          "Content-Type": "application/json"
        },
        responseType: 'json'
      })*/



  }

  /**
   * 录音文件传输后台服务解析
   * @param {string} url 后台服务路径
   */
  private connetXunfei(url: string,success) {
    console.log("调用成功:" + this.fileContent);
    console.log("调用URL:" + url);
    //调用讯飞语音服务
    this.http.post(url, {
      content: this.fileContent,
      userId: this.paramsService.user.userId
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log("data" + data);
        //接收Object JSON数据
        success(data);
        //this.paramsService.aiuiData = this.data.data.aiuiData;

        //分离出需要语音播报的内容
        this.speechText = this.paramsService.aiuiData.speech;

        console.log("语音调用成功:" + this.speechText);
        this.speakText(this.speechText,rs=>{
          console.log("语音调用成功:" + rs);
        });
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
