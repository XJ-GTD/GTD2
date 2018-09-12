import { Injectable } from "@angular/core";
import { AppConfig } from "../app/app.config";
import { HttpClient } from "@angular/common/http";
import { ParamsService } from "./params.service";
import { Base64 } from "@ionic-native/base64";
import { File } from "@ionic-native/file";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
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
  private redirect: string;

  constructor(public appCtrl : App,
              private base64: Base64,
              private http: HttpClient,
              private file: File,
              private transfer: FileTransfer,
              private paramsService: ParamsService) {

  }


  /**
   * 语音助手录音录入 AUDIO
   */
  public listenAudio(redirect: string) {
    this.redirect = redirect;
    try {
      cordova.plugins.xjvoicefromXF.startListen(result=>{
        alert("成功:" + result);
        //讯飞语音录音设置默认存储路径
        this.filePath = this.file.externalRootDirectory + "/msc/";
        this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(directoryUrl=>{
          this.file.getFile(directoryUrl,"iat.wav",{}).then((file)=>{
            // let b = new Blob(ret);
          })
        });

        alert(this.filePath);
        this.file.readAsText(this.filePath,"iat.wav").then(fileSrc=>{
          let b = new Blob([fileSrc]);
          let ff = new FormData();
          ff.append('file',b);
          this.http.post(url,ff).subscribe(data=>{
            alert(data);
          })
        })


        alert(this.filePath);
        let url = AppConfig.XUNFEI_URL_AUDIO;
        this.fileUpload(this.filePath, url);
        // 读取录音进行base64转码
        // this.base64.encodeFile(this.filePath).then((base64File: string) => {
        //   this.fileContent = base64File;
        //   alert(this.fileContent);
        //   this.connetXunfei(url);
        // }, (err) => {
        //   alert("异常" + err.toString());
        // });

      },error=>{
        alert("报错:" + error);
      },true,true);
    } catch (e) {
      alert("问题："+ e)
    }

  }

  /**
   * 语音助手手动输入 TEXT
   */
  public listenText(text: string) {
    try {

      this.fileContent = text;
      let url = AppConfig.XUNFEI_URL_TEXT;
      this.connetXunfei(url);

    } catch (e) {
      alert("问题："+ e)
    }

  }

  //文件上传
  fileUpload(filePath, url) {

    const fileTransfer: FileTransferObject = this.transfer.create();
    /*  this.file

      this.http.post(url, {
        content: this.fileContent
      },{
        headers: {
          "Content-Type": "application/json"
        },
        responseType: 'json'
      })*/

    fileTransfer.upload(filePath, url, {
      fileKey: 'file',
      fileName: 'iat.wav',
      mimeType: 'audio/wav',
      headers:{
        "Content-Type":"multipart/form-data;boundary=----WebKitFormBoundaryOYfIlq2tLIjhsanZ"
      }

    }).then(data => {
      console.log(data);
      this.data = data;
      alert(this.data.message);
    }, err => {
      alert(err.toString());
    });

  }

  /**
   * 录音文件传输后台服务解析
   * @param {string} url 后台服务路径
   */
  private connetXunfei(url: string) {
    alert("调用成功:" + this.fileContent);
    //调用讯飞语音服务
    this.http.post(url, {
      content: this.fileContent
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        this.data = data;
        //接收Object JSON数据
        this.paramsService.voice = this.data.voice;
        this.paramsService.schedule = JSON.parse(this.data.schedule);

        //分离出需要语音播报的内容
        this.speechText = "收到消息:" + this.paramsService.schedule.scheduleName;

        alert("成功:" + this.speechText);
        this.speakText(this.speechText);
        let activeNav: NavController = this.appCtrl.getActiveNav();
        activeNav.push(this.redirect);
      })
  }

  /**
   * 返回语音播报
   */
  public speakText(speechText: string) {
    try {
      cordova.plugins.xjvoicefromXF.startSpeak(result=>{
        alert("成功:" + result);
      },error=>{
        alert("报错:" + error);
      }, speechText);
    } catch (e) {
      alert("问题："+ e)
    }
  }

}
