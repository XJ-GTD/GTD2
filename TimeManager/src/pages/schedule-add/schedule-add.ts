import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ParamsService} from "../../service/params.service";
import {WebsocketService} from "../../service/websocket.service";
import 'rxjs/add/operator/map';

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

  public dataList = [];
  groupId: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private paramsService: ParamsService,
              private webSocket: WebsocketService) {

    this.groupId = navParams.get("groupId");
    this.init();
    console.log(this.groupId);
  }

  init() {
    const url = "ws:127.0.0.1:8081/webSocket";
    const nodeid = '{ "userName": "吴大大", "taskName": "今日任务", "taskContent": "5km往返跑" }';
    this.webSocket.create(url, nodeid).map((response: MessageEvent): string => {
      let data = response.data;
      return data;
    })
      .subscribe(msg => {
        let data = eval('(' + msg + ')');
        this.dataList.push(data);
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleAddPage');
  }

}
