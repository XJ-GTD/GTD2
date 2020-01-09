import {Injectable} from "@angular/core";
import {File} from "@ionic-native/file";
import {AibutlerRestful, AudioPro, TextPro} from "../restful/aibutlersev";
import * as moment from 'moment';
import {SuTbl} from "../sqlite/tbl/su.tbl";
import {DataConfig} from "../config/data.config";
import {SqliteExec} from "../util-service/sqlite.exec";
import {UtilService} from "../util-service/util.service";
import {UserConfig} from "../config/user.config";
import {EmitService} from "../util-service/emit.service";
import {FeedbackService} from "./feedback.service";

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
              private emitService: EmitService,
              private feedbackService:FeedbackService) {

    this.mp3Path = this.file.cacheDirectory;
    this.mp3Name = "iat.pcm";
    this.wakeuping = false;
    this.listening = false;
    this.emitService.register("ai.wakeup.setting",(setting:boolean) =>{
      if (!setting){


        console.log("======2这里不唤醒唤醒");
        this.stopWakeUp();
      }else{


        console.log("=======2这里唤醒");
        this.startWakeUp();
      }
    })
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
      this.speakText(UserConfig.user.realname + ",我在，请说：").then(()=>{
        this.listenAudio();
      })
    }, error => {
      // console.log("问题：" + error)
    });
  }


  /**
   * 停止监听WakeUp
   */
  public stopWakeUp() {
    this.wakeuping = false;
    if (!this.utilService.isMobile()) return;
    cordova.plugins.XjBaiduWakeUp.wakeUpStop();
    cordova.plugins.XjBaiduWakeUp.wakeUpRelease()
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

    //增加通用事件响应
    this.emitService.emit("on.speak.finished", "");
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
    // console.log("播报内容参数*******************t=" +sutbl.subt +";type="+sutbl.sust);
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

      // setTimeout(() => {
      //   cordova.plugins.XjBaiduTts.startSpeak(result => {
      //     this.stopSpeak(true);
      //     resolve();
      //   }, error => {
      //     this.stopSpeak(true);
      //     resolve(error);
      //   }, speechText);
      //
      // }, 100);
        cordova.plugins.XjBaiduTts.startSpeak(result => {
          this.stopSpeak(true);
          resolve();
        }, error => {
          this.stopSpeak(true);
          resolve(error);
        }, speechText);
    });
  }

  /**
   * 返回纯语音播报
   */
  pureSpeakText(speechText: string):Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (!this.utilService.isMobile()) {
        resolve() ;
        return;
      }
      if (speechText == null || speechText == "") {
        resolve();
        return;
      }

      cordova.plugins.XjBaiduTts.startSpeak(result => {
        this.stopSpeak(false);
        resolve();
      }, error => {
        this.stopSpeak(false);
        resolve(error);
      }, speechText);
    });
  }

  /**
   * 语音助手手动输入 TEXT
   */
  async putText(text: string) {

    let textPro = new TextPro();
    textPro.d.text = text;
    if (DataConfig.clearAIContext) {
      textPro.d.clean = "user";  // 清除对话历史
      DataConfig.clearAIContext = false;
    }
    textPro.c.client.time = moment().valueOf();
    textPro.c.client.cxt = DataConfig.wsContext;
    textPro.c.server = DataConfig.wsServerContext;
    textPro.c.client.option = DataConfig.wsWsOpt;
    textPro.c.client.processor = DataConfig.wsWsProcessor;
    // this.postAsk(text);
    await this.aibutlerRestful.posttext(textPro)
      .then(data => {
        // console.log("data code：" + data.code);
        //接收Object JSON数据
        return text;

      });
  }


  /**
   * 停止监听
   */
  public stopListenAudio() {
    if (!this.utilService.isMobile()) return;
    if (this.listening){
      cordova.plugins.XjBaiduSpeech.stopListen();
      this.startWakeUp();
      this.listening = false;
      let immediately:Immediately = new Immediately();
      immediately.fininsh = false;
      immediately.listening = false;
      this.emitService.emitImmediately(immediately);
      this.emitService.emitListener(false);
    }
  }


  /**
   * 语音助手录音录入 AUDIO
   */
  async listenAudio() {
    if (!this.utilService.isMobile()) {
      return;
    }

    if (this.listening) {
      this.stopListenAudio();
      return;
    }

    this.stopSpeak(false);
    this.stopWakeUp();
    this.listening = true;

    this.emitService.emitListener(true);
    this.feedbackService.vibrate();
    let immediately:Immediately = new Immediately();
    immediately.fininsh = false;
    immediately.listening = true;
    await cordova.plugins.XjBaiduSpeech.startListen(async result => {
      if (!result.finish) {
        immediately.immediatetext = result.text;
        this.emitService.emitImmediately(immediately);
        return ;
      }
      immediately.fininsh = true;
      immediately.immediatetext = result.text;
      this.emitService.emitImmediately(immediately);
      // 读取录音进行base64转码
      let base64File: string = await this.file.readAsDataURL(this.mp3Path, this.mp3Name);
      let audioPro = new AudioPro();
      audioPro.d.vb64 = base64File;
      if (DataConfig.clearAIContext) {
        audioPro.d.clean = "user";  // 清除对话历史
        DataConfig.clearAIContext = false;
      }
      audioPro.c.client.time = moment().valueOf();
      audioPro.c.client.cxt = DataConfig.wsContext;
      audioPro.c.client.option = DataConfig.wsWsOpt;
      audioPro.c.client.processor = DataConfig.wsWsProcessor;
      audioPro.c.server = DataConfig.wsServerContext;
      // this.postAsk(result.text);
      await this.aibutlerRestful.postaudio(audioPro);
      this.listening = false;
      this.emitService.emitListener(false);
      immediately.immediatetext = "";
      this.emitService.emitImmediately(immediately);
      this.startWakeUp();
      return result;
    }, async error => {
      let text = await this.getSpeakText(DataConfig.FF);
      this.speakText(text);
      this.listening = false;
      this.emitService.emitListener(false);
      this.startWakeUp();
      return text;
    });
  }

  private postAsk(text: string) {
    let ask: any = {
      header: {
        version: 'V1.1',
        sender: 'xunfei/aiui',
        datetime: moment().format("YYYY/MM/DD HH:mm"),
        describe: []
      },
      content: {}
    };

    ask['header']['describe'].push('TK');

    ask['content']['0'] = {
      processor: 'TK',
      option: 'TK.ASK',
      parameters: {
        ask: text
      }
    };

    this.emitService.emit('local.message.received', {body: JSON.stringify(ask)});
  }

  /**
   * 语音助手录音录入 AUDIO
   */
  audio2Text(callback,success,error) {
    if (this.listening) return;
    if (!this.utilService.isMobile()) {
      success();
      return;
    }
    this.listening = true;
    this.stopSpeak(false);
    this.stopWakeUp();
    cordova.plugins.XjBaiduSpeech.startListen(result => {
      callback(result.text);

      if (result.finish) {
        this.stopListenAudio();
        success();
        return;
      }
    }, async err => {
      this.stopListenAudio();
      setTimeout(async () => {
        let text = await this.getSpeakText(DataConfig.FF);
        this.speakText(text);
        error();
        return;
      }, 100);
    });

  }
}


export class Immediately{
  immediatetext:string = "";
  listening:boolean = false;
  fininsh:boolean = false;
  error:string = "";
}
