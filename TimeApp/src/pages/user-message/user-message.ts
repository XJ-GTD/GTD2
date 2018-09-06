import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import {AppConfig} from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {ScheduleModel} from "../../model/schedule.model";

/**
 * Generated class for the UserMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-message',
  templateUrl: 'user-message.html',
  providers: []
})
export class UserMessagePage {

  data: any;
  schedule: ScheduleModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.init();

  }

  init() {
    alert("跳转了");
    this.schedule = this.paramsService.schedule;
    // this.schedule.scheduleStartDate = this.schedule.scheduleStartDate.replace(" ", "T");
    // this.schedule.scheduleEndDate = this.schedule.scheduleEndDate.replace(" ", "T");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserMessagePage');
  }

  //接受任务
  acceptTask() {

    this.http.post(AppConfig.SCHEDULE_UPDATE_STATE_URL, {
      code: "0",
      userId: this.paramsService.user.userId,
      scheduleState: "1",
      scheduleId: this.schedule.scheduleId


    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log(this.data);
        if (this.data.code == "0") {
          this.goBackInfo(this.paramsService.user.userName + "接受了任务", "1");
          alert("接受成功");

        } else {
          alert("接受失败");
        }


      });
  }

  //拒绝任务
  refuseTask() {
    this.goBackInfo(this.paramsService.user.userName + "拒绝了任务", "-1");
  }

  goBackInfo(data, code) {
    this.http.post(AppConfig.WEB_SOCKET_TASK_URL, {
      code: code,
      target: "15000,",
      scheduleName: data


    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        alert("推送成功" + data);
        this.navCtrl.pop(); /*返回上一个页面*/
      });
  }
}
