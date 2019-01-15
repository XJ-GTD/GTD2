import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { ParamsService } from "../../service/util-service/params.service";
import { AiuiModel } from "../../model/aiui.model";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import { DwEmitService } from "../../service/util-service/dw-emit.service";
import { DataConfig } from "../../app/data.config";
import {WsEnumModel} from "../../model/ws.enum.model";
import {NetworkService} from "../../service/util-service/network.service";

declare var cordova: any;
/**
 * Generated class for the HbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hb',
  templateUrl: 'hb.html',
  providers: []
})
export class HbPage {
  // @ViewChild(Hb01Page) Hb01Page:Hb01Page;
  @ViewChild(Content) content: Content;


  data: any;
  modeFlag: boolean = true;   //判断助手模式 true语音false手输
  initFlag:boolean = false;   //页面初始化

  U1: string = DataConfig.U1;
  S1: string = DataConfig.S1;
  S4: string = DataConfig.S4;
  S5: string = DataConfig.S5;
  S6: string = DataConfig.S6;

  userText: string; //用户输入显示文本
  speech: string;   //语音助手显示文本
  inputText: string = "";    //手动模式输入数据
  filePath: string;   //语音文件路径

  schedule: ScheduleModel;
  inputData: AiuiModel;
  aiuiData: AiuiModel;
  messages: Array<AiuiModel>; //聊天数据队列
  //语音界面数据传递

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              private dwEmit: DwEmitService,
              public paramsService: ParamsService,
              public xiaojiSpeech: XiaojiAssistantService,
              private networkService: NetworkService,
              public xiaojiFeekback: XiaojiFeedbackService) {

  }


  ionViewDidLoad() {

    this.dwEmit.getHbData((data)=>{
      this.messageHanding(data);
    });

    this.netNetwork();

    this.messages = [];
    this.aiuiData = new AiuiModel();
    this.inputData = new AiuiModel();

    //语音唤醒冲突暂时关闭
    //this.initWakeUp();

    console.log('ionViewDidLoad HbPage');
    // this.Hb01Page.loadScene();
  }



  initWakeUp(){
    this.xiaojiSpeech.initbaiduWakeUp(isWakeUp=>{
      this.xiaojiSpeech.baiduWakeUpStop();
      if (!isWakeUp)  {
        this.initWakeUp();
      }
      this.xiaojiSpeech.speakText("请说出你让我做的事情",speakRs=>{
        this.xiaojiSpeech.listenAudio(data=>{
          this.initWakeUp();
          this.messageHanding(data);
        })
      })
    });

  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("SbPage")
  }

  //群组详情
  groupListShow() {
    this.navCtrl.push('GroupListPage', {popPage:'HbPage'});
  }

  /*==================== 聊天界面 start ===================*/

  switchInput() {
    this.xiaojiFeekback.audioBass();

    //切换手动输入模式
    this.modeFlag = !this.modeFlag;
    this.initFlag = false;
    return;
  }

  //启动语音输入
  startXiaoJi() {
    console.log("开始语音输入");
    if (this.xiaojiSpeech.islistenAudioing) return;
    this.xiaojiSpeech.listenAudio(rs =>{
      rs = rs.replace("[asr.partial]","");
      this.speechInputHanding(rs);
      this.xiaojiFeekback.audioSnare();
    });
  }

  //启动手动输入
  startXiaojiText() {

    if (this.inputText != null && this.inputText != "") {
      this.speechInputHanding(this.inputText);
      this.xiaojiSpeech.listenText(this.inputText);
    }
    this.inputText = "";
  }

  //语音输入页面处理
  speechInputHanding(text) {
    this.inputData.tt = this.U1;
    this.inputData.at = text;
    this.messages.unshift(this.inputData);
    this.inputData = new AiuiModel();

  }

  //回传数据处理
  messageHanding($event: AiuiModel) {

    console.log("这是语音HbPage页面数据处理：messageHanding方法");

    let textU = new AiuiModel();
    let textX = new AiuiModel();
    let data = new AiuiModel();

    if ($event.tt == DataConfig.U1) {
      textU = $event;
      this.messages.push(textU);
    } else if ($event.tt == DataConfig.S1) {
      textX = $event;
      this.messages.push(textX);
      this.xiaojiSpeech.speakText(textX.at, success=>{});
    } else if ($event.tt == DataConfig.S5) {
      textX.tt = DataConfig.S1;
      textX.at = $event.at;
      this.messages.push(textU);
      this.xiaojiSpeech.speakText(textX.at, success=>{});

      setTimeout(() => {
        data.tt = $event.tt;
        data.scL = $event.scL;
        this.messages.push(data);
      }, 1000);
    }

    this.aiuiData = new AiuiModel();

  }

  //展示数据详情
  showScheduleDetail(schedule){
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtrl.push("SaPage");
  }

  scrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  /**
   * 没网络禁用语音按钮
   */
  private netNetwork() {
    if (this.networkService.getNetworkType() === 'none') {
      //WsEnumModel["E04"] + UtilService.randInt(0,10);
      let aiui = new AiuiModel();
      aiui.tt = this.S1;
      aiui.at = WsEnumModel["E04"] + "1";
      this.messages.push(aiui);
      this.xiaojiSpeech.speakText(DataConfig.TEXT_CONTENT.get(aiui.at), success=>{});
    }
  }

  /*==================== 聊天界面 end ===================*/

  //返回方法
  goBack() {
    this.dwEmit.destroyHbData();
    this.viewCtrl.dismiss();
  }

  // reset(){
  //   this.Hb01Page.startHue += 60;
  //   this.Hb01Page.reset();
  // }

}
