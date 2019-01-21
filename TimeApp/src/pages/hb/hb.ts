import { Component, ViewChild } from '@angular/core';
import { Content, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/util-service/xiaoji-assistant.service";
import { ParamsService } from "../../service/util-service/params.service";
import { AiuiModel } from "../../model/aiui.model";
import { ScheduleModel } from "../../model/schedule.model";
import { XiaojiFeedbackService } from "../../service/util-service/xiaoji-feedback.service";
import { DwEmitService } from "../../service/util-service/dw-emit.service";
import { DataConfig } from "../../app/data.config";
import {WsEnumModel} from "../../model/ws/ws.enum.model";
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
  // templateUrl: 'hb.html',
  providers: [],
  template:'\n' +
  '<div  class="speechWarp">\n' +
  '\n' +
  '  <ion-header >\n' +
  '    <ion-toolbar>\n' +
  '      <ion-buttons left>\n' +
  '        <button ion-button icon-only (click)="goBack()">\n' +
  '          <ion-icon name="arrow-back" style=" color: white"></ion-icon>\n' +
  '        </button>\n' +
  '      </ion-buttons>\n' +
  '    </ion-toolbar>\n' +
  '  </ion-header>\n' +
  '  <ion-content>\n' +
  '\n' +
  '    <ion-list class="yyWarp">\n' +
  '      <ion-item  *ngFor="let message of messages"  on-hold="onMessageHold($event, $index, message)">\n' +
  '\n' +
  '        <!-- 判断消息是用户 -->\n' +
  '        <div *ngIf="U1 == message.tt" class="userTalk animated bounceIn">\n' +
  '          <h2 [innerHTML]="message.ut"></h2>\n' +
  '        </div>\n' +
  '\n' +
  '        <!-- 判断消息是讯飞 -->\n' +
  '        <div *ngIf="S1 == message.tt" class="XFTalk animated bounceIn">\n' +
  '          <!--  wave-->\n' +
  '          <h2 [innerHTML]="message.at"></h2>\n' +
  '          <h3></h3>\n' +
  '        </div>\n' +
  '\n' +
  '        <!-- 判断消息是数据：list -->\n' +
  '        <ion-card *ngIf="S5 == message.tt"  class="scl_list animated bounceIn">\n' +
  '          <ion-list>\n' +
  '            <ion-item *ngFor="let sj of message.scL" (click)="showScheduleDetail(sj)">\n' +
  '              <h2>{{sj.sd}}</h2>\n' +
  '              <p>\n' +
  '                <ion-badge>{{sj.sN}}</ion-badge>\n' +
  '              </p>\n' +
  '            </ion-item>\n' +
  '          </ion-list>\n' +
  '        </ion-card>\n' +
  '\n' +
  '        <!-- 判断消息是数据：新增日程 -->\n' +
  '        <div *ngIf="S4 == message.tt" class="userTalk animated bounceIn">\n' +
  '              <h2>{{message.sc.sd}}</h2>\n' +
  '              <p>\n' +
  '                <ion-badge>{{message.sc.sN}}</ion-badge>\n' +
  '              </p>\n' +
  '            <ion-item *ngFor="let ru of message.sc.rus">\n' +
  '              <p>{{ru.ran}}</p>\n' +
  '            </ion-item>\n' +
  '        </div>\n' +
  '      </ion-item>\n' +
  '    </ion-list>\n' +
  '\n' +
  '    <!--<ion-fab left bottom edge #fab1 color="dark">-->\n' +
  '    <!--<button ion-fab mini ><ion-icon name="arrow-dropup"></ion-icon></button>-->\n' +
  '    <!--<ion-fab-list  side="top">-->\n' +
  '    <!--<button ion-fab (click)="openSocial(1, fab1)" color="dark"><ion-icon name="create"></ion-icon></button>-->\n' +
  '    <!--<button ion-fab (click)="openSocial(2, fab1)" color="secondary"><ion-icon name="contacts"></ion-icon></button>-->\n' +
  '    <!--<button ion-fab (click)="openSocial(3, fab1)" color="danger"><ion-icon name="add"></ion-icon></button>-->\n' +
  '    <!--</ion-fab-list>-->\n' +
  '    <!--</ion-fab>-->\n' +
  '  </ion-content>\n' +
  '\n' +
  '  <ion-footer style="height: 94px">\n' +
  '    <ion-toolbar  *ngIf="modeFlag == true; else xjInput">\n' +
  '      <ion-buttons left>\n' +
  '        <button ion-button icon-only (click)="switchInput()">\n' +
  '          <ion-icon name="create" style=" color: white;font-size: 40px"></ion-icon>\n' +
  '        </button>\n' +
  '      </ion-buttons>\n' +
  '\n' +
  '      <img  src="./assets/imgs/yuying.png"   (click)="startXiaoJi()" class="animated bounceIn"/>\n' +
  '    </ion-toolbar>\n' +
  '    <ng-template #xjInput>\n' +
  '      <ion-toolbar style="margin-top: 18px" class="animated bounceIn faster">\n' +
  '        <ion-buttons left>\n' +
  '          <button ion-button icon-only (click)="switchInput()">\n' +
  '            <ion-icon name="mic" style=" color: white"></ion-icon>\n' +
  '          </button>\n' +
  '        </ion-buttons>\n' +
  '        <ion-input style="margin-left:10px" id="userInput" type="text" [(ngModel)]="inputText" placeholder="打字悄悄告诉我"></ion-input>\n' +
  '        <ion-buttons end>\n' +
  '          <button ion-button icon-end color="royal" (click)="startXiaojiText()">\n' +
  '            <ion-icon name="send" style=" color: white;font-size: 40px"></ion-icon>\n' +
  '          </button>\n' +
  '        </ion-buttons>\n' +
  '      </ion-toolbar>\n' +
  '    </ng-template>\n' +
  '    <!--<page-hb01></page-hb01>-->\n' +
  '  </ion-footer>\n' +
  '</div>\n',
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
    if (this.xiaojiSpeech.islistenAudioing) {
      this.xiaojiSpeech.stopSpeak();
      return;
    }
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
    this.xiaojiSpeech.stopListenAudio();
    this.xiaojiSpeech.stopSpeak();
    this.viewCtrl.dismiss();
  }

  // reset(){
  //   this.Hb01Page.startHue += 60;
  //   this.Hb01Page.reset();
  // }

}
