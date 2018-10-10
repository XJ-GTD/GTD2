import { Component, ViewChild } from '@angular/core';
import { AlertController, Content, FabContainer, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";
import { ParamsService } from "../../service/params.service";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "../../app/app.config";
import { AiuiModel } from "../../model/aiui.model";
import { ScheduleModel } from "../../model/schedule.model";
import { File } from "@ionic-native/file";
import { Base64 } from "@ionic-native/base64";
import { NativePageTransitions, NativeTransitionOptions } from "@ionic-native/native-page-transitions";

declare var cordova: any;

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

  @ViewChild(Content) content: Content;

  data: any;
  modeFlag: boolean = true;   //判断助手模式 true语音false手输
  initFlag:boolean = false;   //页面初始化

  talkDataList: number = 4;    //数据多条
  talkDataSingle: number = 3;     //数据单条
  talkXF: number = 2;       //讯飞
  talkUser: number = 1;     //用户

  userText: string; //用户输入显示文本
  speech: string;   //语音助手显示文本
  inputText: string = "";    //手动模式输入数据
  inputAudio: string = "";  //语音模式输入数据
  fileContent: any;   //语音文件内容
  filePath: string;   //语音文件路径

  schedule: ScheduleModel;
  aiuiData: AiuiModel;
  messages: Array<AiuiModel>; //聊天数据队列

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private http: HttpClient,
              private file: File,
              private base64: Base64,
              private loadingCtrl: LoadingController,
              private alert: AlertController,
              private nativePageTransitions: NativePageTransitions,
              private xiaojiSpeech: XiaojiAssistantService) {

    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeechPage');
  }

  init() {
    this.messages = [];
    this.aiuiData = new AiuiModel();
  }

  //扩展按钮
  openSocial(flag: number, fab: FabContainer) {
    console.log('Share in ' + flag);
    if (flag == 1) {
      //切换手动输入模式
      this.modeFlag = !this.modeFlag;
      this.initFlag = false;
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

          if (this.fileContent != null && this.fileContent != "") {
            this.inputAudio = this.fileContent;
            let url = AppConfig.XUNFEI_URL_AUDIO;
            this.messageHanding(url, this.inputAudio);
          }

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

  //启动手动输入
  startXiaojiText() {
    if (this.inputText != null && this.inputText != "") {
      let url = AppConfig.XUNFEI_URL_TEXT;
      this.messageHanding(url, this.inputText);
    }
  }

  //回传数据处理
  messageHanding(url, input) {

    this.http.post(url, {
      content: input,
      userId: this.paramsService.user.userId
    },AppConfig.HEADER_OPTIONS_JSON)
      .subscribe(data => {
        console.log("back data：" + data);
        this.data = data;

        if (this.data.code == 0) {
          //接收Object JSON数据
          this.aiuiData = this.data.data.aiuiData;

          let messageUser = new AiuiModel();
          messageUser.talkType = this.talkUser;
          messageUser.userText = this.aiuiData.userText;
          this.messages.push(messageUser);

          this.scrollToBottom();

          setTimeout(() => {
            let messageXF = new AiuiModel();
            messageXF.talkType = this.talkXF;
            messageXF.speech = this.aiuiData.speech;
            this.messages.push(messageXF);
            //分离出需要语音播报的内容
            console.log("语音调用成功:" + this.aiuiData.speech);
            this.xiaojiSpeech.speakText(this.aiuiData.speech);
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

      });

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
    if (data != null && data != "") {
      let url = AppConfig.XUNFEI_URL_TEXT;
      this.messageHanding(url, data);
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }

  /*==================== 聊天界面 end ===================*/

  ionViewWillLeave() {
    let options: NativeTransitionOptions = {
      direction: 'down',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
    };

    this.nativePageTransitions.slide(options)
      .then(onSuccess => {

      })
      .catch(onError => {

      });
  }
  //返回方法
  goBack() {
    this.navCtrl.pop();
  }

}
