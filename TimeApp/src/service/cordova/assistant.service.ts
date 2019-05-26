import {Injectable} from "@angular/core";
import {File} from "@ionic-native/file";
import {AibutlerRestful, AudioPro, TextPro} from "../restful/aibutlersev";
import * as moment from 'moment';
import {WsModel} from "../../ws/model/ws.model";
import {SuTbl} from "../sqlite/tbl/su.tbl";
import {DataConfig} from "../config/data.config";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";
import {SsService} from "../../pages/ss/ss.service";
import {UserConfig} from "../config/user.config";
import {EmitService} from "../util-service/emit.service";

declare var cordova: any;

/**
 * 小吉语音助手
 *
 * create by wzy on 2018/08/07.
 */
@Injectable()
export class AssistantService {

  private mp3Path: string;
  private mp3Name: string;
  private wakeuping:boolean;
  private listening:boolean;

  constructor(private file: File,
              private aibutlerRestful: AibutlerRestful,
              private sqliteExec: SqliteExec,
              private utilService: UtilService,
              private emitService: EmitService) {

    this.mp3Path = this.file.cacheDirectory;
    this.mp3Name = "iat.pcm";
    this.wakeuping = false;
    this.listening = false;
  }


  /**
   * 启动监听WakeUp
   */
  public startWakeUp() {
    if (!UserConfig.getSetting(DataConfig.SYS_H)) return;
    if (!this.utilService.isMobile()) return;
    if  (this.wakeuping) return ;
    this.wakeuping = true;
    cordova.plugins.XjBaiduWakeUp.wakeUpStart(async (result) => {
      this.listenAudio();
    }, error => {
      console.log("问题：" + error)
    });
  }


  /**
   * 停止监听WakeUp
   */
  public stopWakeUp() {
    this.wakeuping = false;
    if (!this.utilService.isMobile()) return;
    if (!UserConfig.getSetting(DataConfig.SYS_H)) return;
    cordova.plugins.XjBaiduWakeUp.wakeUpStop();
  }



  /**
   * 停止语音播报
   */
  public stopSpeak(emit:boolean, open:boolean = false) {
    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduTts.speakStop();
    if (emit){
      this.emitService.emitSpeak(false);
    }
    if (open) this.listenAudio();
  }



  public async getSpeakText(t: string, type: string = '') {

    let sutbl: SuTbl = new SuTbl();
    //sutbl.st = DataConfig.SPEECH;
    sutbl.subt = t;
    if (type) sutbl.sust = type; else sutbl.sust = 'NONE';

    // TODO:播报内容类型 NONE, ONE, MULTI
    //if (type) sutbl.yt = type;

    //获取本地回答语音文本
    let datas = await this.sqliteExec.getList<SuTbl>(sutbl);
    //回答语音list
    let len = datas.length;
    //随机选取一条
    let rand = this.utilService.randInt(0, len - 1);
    let an: SuTbl = datas[rand];

    return an.suc;
  }

  public async getSpeakTextObject(t: string, type: string = '') {

    let sutbl: SuTbl = new SuTbl();
    //sutbl.st = DataConfig.SPEECH;
    sutbl.subt = t;
    if (type) sutbl.sust = type; else sutbl.sust = 'NONE';

    // TODO:播报内容类型 NONE, ONE, MULTI
    //if (type) sutbl.yt = type;

    //获取本地回答语音文本
    let datas = await this.sqliteExec.getList<SuTbl>(sutbl);
    //回答语音list
    let len = datas.length;
    console.log("播报内容参数*******************t=" +sutbl.subt +";type="+sutbl.sust);
    if (len == 0){
      let an: SuTbl = new SuTbl();
      an.suc= "您交代的事情已经办好了, 我正在学习怎么更准确的告诉您";
      an.sus="false";
      return an;
    }
    //随机选取一条
    let rand = this.utilService.randInt(0, len - 1);
    let an: SuTbl = datas[rand];

    return an;
  }


  /**
   * 返回语音播报
   */
  speakText(speechText: string):Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.utilService.isMobile()) {
        resolve() ;
        return;
      }
      if (speechText == null || speechText == "") {
        resolve();
        return;
      }
      if (!UserConfig.getSetting(DataConfig.SYS_B)) {
        resolve();
        return;
      }

      this.stopListenAudio();
      this.emitService.emitSpeak(true);

      setTimeout(() => {
        cordova.plugins.XjBaiduTts.startSpeak(result => {
          this.stopSpeak(true);
          resolve();
        }, error => {
          this.stopSpeak(true);
          resolve(error);
        }, speechText);

      }, 100);
    });
  }


  /**
   * 语音助手手动输入 TEXT
   */
  async putText(text: string) {

    let textPro = new TextPro();
    textPro.d.text = text;
    textPro.c.client.time = moment().valueOf();
    textPro.c.client.cxt = DataConfig.wsContext;
    textPro.c.server = DataConfig.wsServerContext;
    textPro.c.client.option = DataConfig.wsWsOpt;
    textPro.c.client.processor = DataConfig.wsWsProcessor;
    await this.aibutlerRestful.posttext(textPro)
      .then(data => {
        console.log("data code：" + data.code);
        //接收Object JSON数据
        return text;

      });
  }


  /**
   * 停止监听
   */
  public stopListenAudio() {
    this.listening = false;
    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduSpeech.stopListen();
    this.startWakeUp();
    this.emitService.emitListener(false);
  }


  /**
   * 语音助手录音录入 AUDIO
   */
  async listenAudio() {
    if (this.listening) return;
    if (!this.utilService.isMobile()) {
      return;
    }
    this.listening = true;
    this.stopSpeak(false);
    this.stopWakeUp();
    this.emitService.emitListener(true);
    await cordova.plugins.XjBaiduSpeech.startListen(async result => {

      this.stopListenAudio();
      // 读取录音进行base64转码
      let base64File: string = await this.file.readAsDataURL(this.mp3Path, this.mp3Name);
      let audioPro = new AudioPro();
      audioPro.d.vb64 = base64File;
      audioPro.c.client.time = moment().valueOf();
      audioPro.c.client.cxt = DataConfig.wsContext;
      audioPro.c.client.option = DataConfig.wsWsOpt;
      audioPro.c.client.processor = DataConfig.wsWsProcessor;
      audioPro.c.server = DataConfig.wsServerContext;
      await this.aibutlerRestful.postaudio(audioPro)
      return result;
    }, async error => {
      this.stopListenAudio();
      setTimeout(async () => {
        let text = await this.getSpeakText(DataConfig.FF);
        this.speakText(text);
        return text;
      }, 100);
    });
  }
}
