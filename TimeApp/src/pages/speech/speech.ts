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

  //展示日程列表
  scheduleShow() {
    this.findSchedule = new ScheduleOutModel();
    this.findSchedule.scheduleStartTime = "2018-09-01 00:00";
    this.findSchedule.scheduleDeadline = "2018-09-13 00:00";
    this.findSchedule.userId = this.paramsService.user.userId;
    this.http.post(AppConfig.SCHEDULE_FIND_URL, this.findSchedule, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log("data:" + this.data.toString());
        let loader = this.loadingCtrl.create({
          content: this.data.message,
          duration: 1000
        });

        if (this.data.code == 0) {
          this.paramsService.scheduleList = this.data.data.scheduleJoinList;
          console.log("data:" + this.data.data);
          this.navCtrl.push("ScheduleListPage");
        } else {
          console.log("error message:" + this.data.message);
          loader.present();
        }
      })
  }

  //扩展按钮
  openSocial(flag: number, fab: FabContainer) {
    console.log('Share in ' + flag);
    if (flag == 1) {
      this.groupListShow();
    }
    if (flag == 2) {
      this.scheduleShow();
    }
    if (flag == 3) {
      this.addSchedule();
    }
    fab.close();
  }

  //添加日程
  addSchedule() {
    this.navCtrl.push("ScheduleAddPage")
  }

  //启动语音助手
  startXiaoJi() {
    this.navCtrl.push('CharPage');
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
