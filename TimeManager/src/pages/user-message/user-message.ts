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

  schedule: ScheduleModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.schedule = this.paramsService.schedule;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserMessagePage');
  }

  //接受任务
  acceptTask() {
    this.http.post(AppConfig.WEB_SOCKET_TASK_URL, {
      target: "15000",
      scheduleName: "接受任务"
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

  //拒绝任务
  refuseTask() {
    this.http.post(AppConfig.WEB_SOCKET_TASK_URL, {
      target: "15000",
      scheduleName: "拒绝任务"
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
}
