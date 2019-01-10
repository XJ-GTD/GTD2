import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, Tabs, ViewController } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { ParamsService } from "../../service/util-service/params.service";
import { AiuiModel } from "../../model/aiui.model";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import { Hb01Page } from "../hb01/hb01";
import { DwEmitService } from "../../service/util-service/dw-emit.service";
import {SkillConfig} from "../../app/skill.config";
import {RcModel} from "../../model/rc.model";

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
  @ViewChild(Hb01Page) Hb01Page:Hb01Page;
  @ViewChild(Content) content: Content;


  data: any;
  modeFlag: boolean = true;   //判断助手模式 true语音false手输
  initFlag:boolean = false;   //页面初始化

  tdl: number = 4;    //数据多条
  tds: number = 3;     //数据单条
  tx: number = 2;       //讯飞
  tu: number = 1;     //用户

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
              public xiaojiFeekback: XiaojiFeedbackService) {

  }


  ionViewDidLoad() {

    this.dwEmit.getHbData((data)=>{
      this.messageHanding(data);
    });


    this.messages = [];
    this.aiuiData = new AiuiModel();
    this.inputData = new AiuiModel();

    //语音唤醒冲突暂时关闭
    //this.initWakeUp();

    console.log('ionViewDidLoad HbPage');
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
    this.inputData.tt = this.tu;
    this.inputData.at = text;
    this.messages.unshift(this.inputData);
    this.inputData = new AiuiModel();

  }

  //回传数据处理
  messageHanding($event) {

    console.log("这是语音HbPage页面数据处理：messageHanding方法");
    let at;
    if ($event == 1) {
      at = "我不太明白您的意思";
    } else {
      if ($event.at != undefined) {
        at = $event.at;
        //讯飞查询日程 dch测试
        if($event.sk && $event.sk==SkillConfig.XF_SCF){
          if($event.qData && $event.qData.code==0){
            let data:Array<RcModel>=$event.qData.rcL;
            for(let i=0;i<data.length;i++){
              at += "<p>" + data[i].sd +" : " + data[i].sN+"</p>";
            }
          }
        }
      }
      if ($event.au != undefined) {
        at += "\n" + $event.au;
      }
      if ($event.ai != undefined) {
        at += "\n" + $event.ai;
      }
    }


    this.aiuiData.tt = this.tx;
    this.aiuiData.at = at;
    this.messages.unshift(this.aiuiData);
    this.xiaojiSpeech.speakText(at, success=>{});
    // if($event != null) {
    //   let messageData = new AiuiModel();
    //   messageData.at = $event.res.data.st;
    //   messageData.tt = this.tu;
    //   this.messages.push(messageData);
    // } else {
    //   let messageUser = new AiuiModel();
    //   messageUser.at = this.inputText;
    //   messageUser.tt = this.tx;
    //   this.messages.push(messageUser);
    // }
    //
    // this.inputText = "";

/*
    if (xfdata.code == 0) {
      //接收Object JSON数据
      this.aiuiData = xfdata.data.aiuiData;

      let messageUser = new AiuiModel();
      messageUser.talkType = this.talkUser;
      messageUser.userText = this.aiuiData.userText;
      this.messages.push(messageUser);

      setTimeout(() => {
        let messageXF = new AiuiModel();
        messageXF.talkType = this.talkXF;
        messageXF.speech = this.aiuiData.speech;
        this.messages.push(messageXF);
        //分离出需要语音播报的内容
        console.log("语音调用成功:" + this.aiuiData.speech);
        this.xiaojiSpeech.speakText(this.aiuiData.speech,speakRs=>{

        });
      }, 1000);

      if (this.aiuiData.dataType == "1"
        && this.aiuiData.scheduleCreateList != null &&  this.aiuiData.scheduleCreateList.length != 0) {
        setTimeout(() => {
          let messageData = new AiuiModel();
          messageData.talkType = this.talkDataSingle;
          messageData.scheduleName = this.aiuiData.scheduleCreateList[0].scheduleName;
          messageData.scheduleStartTime = this.aiuiData.scheduleCreateList[0].scheduleStartTime;
          messageData.scheduleDeadline = this.aiuiData.scheduleCreateList[0].scheduleDeadline;

          this.messages.push(messageData);
        }, 1500);
      } else if (this.aiuiData.dataType == "2"
        && this.aiuiData.scheduleJoinList != null &&  this.aiuiData.scheduleJoinList.length != 0) {
        setTimeout(() => {
          let messageData = new AiuiModel();
          messageData.talkType = this.talkDataList;
          messageData.scheduleJoinList = this.aiuiData.scheduleJoinList;
          this.messages.push(messageData);

        }, 1500);
      }

      this.inputText = "";
    }
    else if (this.data.code == -1) {

      // this.xiaojiSpeech.speakText();
      this.inputText = "";
    }*/
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

  // //修改输入
  // changeText(data) {
  //   if (data != null && data != "") {
  //     let url = AppConfig.XUNFEI_URL_TEXT;
  //     this.messageHanding(url, data);
  //   }
  // }

  scrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  /*==================== 聊天界面 end ===================*/


  //返回方法
  goBack() {
    this.dwEmit.destroyHbData();
    this.viewCtrl.dismiss();
  }

  reset(){
    this.Hb01Page.startHue += 60;
    this.Hb01Page.reset();
  }

}
