import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";
import { ParamsService } from "../../service/params.service";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private xiaojiSpeech: XiaojiAssistantService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeechPage');
  }

  //展示日程列表
  scheduleShow() {

  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("ScheduleAddPage")
  }

  //启动语音助手
  startXiaoJi() {

    this.xiaojiSpeech.listenAudio('ScheduleAddPage');

  }

  groupListShow() {
    this.navCtrl.push('GroupListPage');
  }

}
