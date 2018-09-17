import { Component } from '@angular/core';
import { AlertController, FabContainer, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";
import { ParamsService } from "../../service/params.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { AiuiModel } from "../../model/aiui.model";
import {ScheduleModel} from "../../model/schedule.model";

/**
 * Generated class for the SpeechPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-speech',
  templateUrl: 'speech.html',
  providers: []
})
export class SpeechPage {

  data: any;
  modeFlag: boolean = true;   //判断助手模式 true语音false手输
  initFlag:boolean = false;   //页面初始化

  userText: string; //用户输入显示文本
  speech: string;   //语音助手显示文本
  inputText: string;    //手动模式输入数据

  schedule: ScheduleModel;
  messages: Array<AiuiModel>; //聊天数据队列

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alert: AlertController,
              private xiaojiSpeech: XiaojiAssistantService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeechPage');
  }

  //扩展按钮
  openSocial(flag: number, fab: FabContainer) {
    console.log('Share in ' + flag);
    if (flag == 1) {
      //切换手动输入模式
      this.modeFlag = !this.modeFlag;
    }
    if (flag == 2) {
      //进入群组
      this.groupListShow();
    }
    if (flag == 3) {
      //添加日程
      this.addSchedule();
    }
    fab.close();
  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("ScheduleAddPage")
  }

  //群组详情
  groupListShow() {
    this.navCtrl.push('GroupListPage');
  }

  /*==================== 聊天界面 start ===================*/

  //启动语音输入
  startXiaoJi() {
    this.xiaojiSpeech.listenAudio();

    this.messageHanding();
  }

  //启动手动输入
  startXiaojiText() {
    this.xiaojiSpeech.listenText(this.inputText);

    this.messageHanding();
  }

  //回传数据处理
  messageHanding() {

    this.initFlag = true;

    this.messages = [];

    let aiuiDetail = new AiuiModel();
    aiuiDetail.userText = this.paramsService.aiuiData.userText;
    this.messages.push(aiuiDetail);
    aiuiDetail = new AiuiModel();
    aiuiDetail.speech = this.paramsService.aiuiData.speech;
    this.messages.push(aiuiDetail);
    aiuiDetail = new AiuiModel();
    if (this.paramsService.aiuiData.dataType == "1") {
      aiuiDetail.scheduleName = this.paramsService.aiuiData.scheduleName;
      aiuiDetail.scheduleStartTime = this.paramsService.aiuiData.scheduleStartTime;
      aiuiDetail.scheduleDeadline = this.paramsService.aiuiData.scheduleDeadline;
      aiuiDetail.userNameList = this.paramsService.aiuiData.userNameList;
      this.messages.push(aiuiDetail);
    } else if (this.paramsService.aiuiData.dataType == "2"){
      aiuiDetail.scheduleJoinList = this.paramsService.aiuiData.scheduleJoinList;
      this.messages.push(aiuiDetail);
    }

  }

  //展示数据详情
  showScheduleDetail(schedule){
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtrl.push("ScheduleDetailPage");
  }

  //修改输入
  changeText(data) {
    this.xiaojiSpeech.listenText(data);

    this.messageHanding();
  }

  /*==================== 聊天界面 end ===================*/

}
