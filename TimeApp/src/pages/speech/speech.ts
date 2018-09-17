import { Component } from '@angular/core';
import {AlertController, FabContainer, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";
import { ParamsService } from "../../service/params.service";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";

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
  modeFlag: number = 0;
  inputText: string;    //手动模式输入数据
  findSchedule: ScheduleOutModel; //查询日程条件

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

  switchMode() {
    this.modeFlag = 1;//切换至手动输入模式
  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("ScheduleAddPage")
  }

  //启动语音助手
  startXiaoJi() {
    this.navCtrl.push('CharPage');
    this.xiaojiSpeech.listenAudio();
  }

  //启动语音助手手动输入模式
  startXiaojiText() {
    this.xiaojiSpeech.listenText(this.inputText);
  }

  //群组详情
  groupListShow() {
    this.navCtrl.push('GroupListPage');
  }

  /*==================== 聊天界面 start ===================*/

  /*==================== 聊天界面 end ===================*/

}
