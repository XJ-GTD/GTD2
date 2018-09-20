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

  private data: any;
  private fileContent: any;
  private filePath: string;
  private speechText: any;

  constructor(public appCtrl : App,
              private base64: Base64,
              private http: HttpClient,
              private file: File,
              private paramsService: ParamsService) {

  }


  /**
   * 语音助手录音录入 AUDIO
   */
  public listenAudio() {
    try {
      cordova.plugins.xjvoicefromXF.startListen(result=>{
        // alert("成功:" + result);
        //讯飞语音录音设置默认存储路径
        this.filePath = this.file.externalRootDirectory + "/msc/iat.wav";
        console.log("文件路径：" + this.filePath);


        let url = AppConfig.XUNFEI_URL_AUDIO;

        // 读取录音进行base64转码
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.fileContent = base64File;
          console.log("base64:" + this.fileContent);
          this.connetXunfei(url);
        }, (err) => {
          console.log("异常" + err.toString());
        });

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
      let url = AppConfig.XUNFEI_URL_TEXT;
      this.connetXunfei(url);

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
  private connetXunfei(url: string) {
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
        this.data = data;
        //接收Object JSON数据
        this.paramsService.aiuiData = this.data.data.aiuiData;

        //分离出需要语音播报的内容
        this.speechText = this.paramsService.aiuiData.speech;

        console.log("语音调用成功:" + this.speechText);
        this.speakText(this.speechText);
      })
  }

  /**
   * 返回语音播报
   */
  public speakText(speechText: string) {
    try {
      cordova.plugins.xjvoicefromXF.startSpeak(result=>{
        console.log("成功:" + result);
      },error=>{
        console.log("报错:" + error);
      }, speechText);
    } catch (e) {
      console.log("问题："+ e)
    }
  }

  //获取base64文件转码
  public getFileContent() {
    try {
      cordova.plugins.xjvoicefromXF.startListen(result=>{
        // alert("成功:" + result);
        //讯飞语音录音设置默认存储路径
        this.filePath = this.file.externalRootDirectory + "/msc/iat.wav";
        console.log("文件路径：" + this.filePath);

        // 读取录音进行base64转码
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.fileContent = base64File;
          console.log("base64:" + this.fileContent);
          return this.fileContent;
        }, (err) => {
          console.log("异常" + err.toString());
        });

      },error=>{
        console.log("报错:" + error);
      },true,true);
    } catch (e) {
      console.log("问题："+ e)
    }
  }

  //获取语音输入
  public getAudioBase64() {
    try {
      cordova.plugins.xjvoicefromXF.startListen(result=>{
        // alert("成功:" + result);
        //讯飞语音录音设置默认存储路径
        this.filePath = this.file.externalRootDirectory + "/msc/iat.wav";
        console.log("文件路径：" + this.filePath);


        let url = AppConfig.XUNFEI_URL_AUDIO;

        // 读取录音进行base64转码
        this.base64.encodeFile(this.filePath).then((base64File: string) => {
          this.fileContent = base64File;
          console.log("base64:" + this.fileContent);
          this.paramsService.speech = this.fileContent;
        }, (err) => {
          console.log("异常" + err.toString());
        });

      },error=>{
        console.log("报错:" + error);
      },true,true);
    } catch (e) {
      console.log("问题："+ e)
    }
  }
}
