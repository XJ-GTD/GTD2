import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { HttpClient } from "@angular/common/http";
import { ScheduleModel } from "../../model/schedule.model";
import {AppConfig} from "../../app/app.config";

/**
 * Generated class for the ScheduleAddPage page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-add',
  templateUrl: 'schedule-add.html',
  providers: []
})
export class ScheduleAddPage {

  dataList = [];
  data: any;
  groupId: any;
  schedule: ScheduleModel;
  flag: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();

  }

  init() {
    if (this.paramsService.schedule != null) {
      this.schedule = this.paramsService.schedule;
    } else {
      this.schedule = new ScheduleModel();
    }
  }

  //发布任务入库
  newProject() {

    this.http.post(AppConfig.SCHEDULE_TASK_ISSUE, {
    }, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        if (this.data.code == 0) {
          let loader = this.loadingCtrl.create({
            content: this.data.message,
            duration: 1500
          });
          loader.present();
          // this.schedule.scheduleId = this.data.data.scheduleId;
          this.pushSchedule();
        } else {
          console.log("发布失败");
        }
      });
  }

  //发布任务推送给目标用户
  pushSchedule() {
    this.http.post(AppConfig.WEB_SOCKET_TASK_URL, {



    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        alert("推送成功" + data);

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleAddPage');
  }

  onBack() {
    this.navCtrl.pop(); /*返回上一个页面*/
  }
}
