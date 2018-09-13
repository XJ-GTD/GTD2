import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { XiaojiAssistantService } from "../../service/xiaoji-assistant.service";
import { ParamsService } from "../../service/params.service";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";

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

  findSchedule: ScheduleOutModel; //查询日程条件

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,
              private xiaojiSpeech: XiaojiAssistantService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SpeechPage');
  }

  //展示日程列表
  scheduleShow() {
    this.findSchedule = new ScheduleOutModel();
    this.paramsService.findSchedule = this.findSchedule;
    this.navCtrl.push("ScheduleListPage");
  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("ScheduleAddPage")
  }

  //启动语音助手
  startXiaoJi() {

    this.xiaojiSpeech.listenAudio('ScheduleAddPage');

  }

  //启动语音助手手动输入模式
  startXiaojiText() {

  }

  //群组详情
  groupListShow() {
    this.navCtrl.push('GroupListPage');
  }

}
