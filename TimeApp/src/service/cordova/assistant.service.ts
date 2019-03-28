import {Injectable} from "@angular/core";
import {File} from "@ionic-native/file";
import {AibutlerRestful, AudioPro, TextPro} from "../restful/aibutlersev";
import * as moment from 'moment';
import {WsModel} from "../../ws/model/ws.model";
import {STbl} from "../sqlite/tbl/s.tbl";
import {DataConfig} from "../config/data.config";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";

declare var cordova: any;

/**
 * 小吉语音助手
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class AssistantService {

  public isSpeaking: boolean;
  public islistenAudioing: boolean;
  public isWakeUp: boolean;
  constructor(private file: File,
              private aibutlerRestful: AibutlerRestful,
              private sqliteExec: SqliteExec,
              private utilService: UtilService) {

    this.isSpeaking = false;
    this.islistenAudioing = false;
  }


  /**
   * 停止语音播报
   */
  public stopSpeak() {

    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduTts.speakStop();
    this.isSpeaking = false;
  }

  /**
   * 停止监听
   */
  public stopListenAudio() {

    if (!this.utilService.isMobile()) return;

    cordova.plugins.XjBaiduSpeech.stopListen();
  }

  /**
   * 启动监听WakeUp
   */
  public startWakeUp() {
    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduWakeUp.wakeUpStart(async (result) => {
      if (this.isSpeaking || this.islistenAudioing) {
        this.stopWakeUp();
        setTimeout(() => {
          this.startWakeUp();
        }, 2000);
        return;
      } else {
        let text: string = await this.getSpeakText(DataConfig.HL);
        await this.speakText(text);
        this.listenAudio().then(data => {
          this.startWakeUp();
        })

      }
    }, error => {
      console.log("问题：" + error)
    });
  }


  /**
   * 停止监听WakeUp
   */
  public stopWakeUp() {
    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduWakeUp.wakeUpStop();
  }


  public async getSpeakText(t: string) {

    let stbl: STbl = new STbl();
    stbl.st = DataConfig.SPEECH;
    stbl.yk = t;

    //获取本地回答语音文本
    let datas = await this.sqliteExec.getList<STbl>(stbl);
    //回答语音list
    let len = datas.length;
    //随机选取一条
    let rand = this.utilService.randInt(0, len - 1);
    let an: STbl = datas[rand];

    return an.yv;
  }


  /**
   * 返回语音播报
   */
  async speakText(speechText: string) {
    if  (!this.utilService.isMobile()) return "";

    if (speechText == null || speechText == "" || this.islistenAudioing) {
      return ""
    }

    setTimeout(() => {
      this.stopSpeak();
      this.isSpeaking = true;
      cordova.plugins.XjBaiduTts.startSpeak(result => {
      this.isSpeaking = false;
      return result;
    }, error => {
      this.isSpeaking = false;
      return error;
    }, speechText);

    }, 50)

  }



  /**
   * 语音助手手动输入 TEXT
   */
  async putText(text:string){
    let textPro = new TextPro();
    textPro.d.text = text;
    textPro.c.client = {time: moment().unix(), context: new WsModel()};
    this.aibutlerRestful.posttext(textPro)
      .then(data => {
        console.log("data code：" + data.code);
        //接收Object JSON数据

      }).catch(async e => {
      let text = await this.getSpeakText(DataConfig.FF);
      this.speakText(text);
    });

    return text;
  }




  /**
   * 语音助手录音录入 AUDIO
   */
   listenAudio():Promise<string>{

    return new Promise<string>(async (resolve, reject) => {
      if (!this.utilService.isMobile())  resolve("");;
      if (!this.isSpeaking && !this.islistenAudioing ) {
        this.islistenAudioing = true;

        await cordova.plugins.XjBaiduSpeech.startListen(async result => {
          this.islistenAudioing = false;

          // 读取录音进行base64转码
          let base64File: string = await this.file.readAsDataURL(this.file.cacheDirectory, "iat.pcm");
          let audioPro = new AudioPro();
          audioPro.d.vb64 = base64File;
          audioPro.c.client = {time: moment().unix(), context: new WsModel()};
          await this.aibutlerRestful.postaudio(audioPro)
          resolve(result);
        }, async error => {
          this.islistenAudioing = false;
          let text = await this.getSpeakText(DataConfig.FF);
          this.speakText(text);
          resolve(text);
        });
      }
    })

  }
}
