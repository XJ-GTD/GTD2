import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ParamsService} from "../../service/params.service";
import {WebsocketService} from "../../service/websocket.service";
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the ScheduleAddPage page.
 *
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService) {

    this.groupId = navParams.get("groupId");
    this.init();
    console.log(this.groupId);
  }

  init() {
    this.http.post("http://192.168.0.176:8080/gtd/schedule/test", {
      "scheduleName": "我发布了任务！"
    },{
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        console.log(data);
        alert(data);

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleAddPage');
  }

}
