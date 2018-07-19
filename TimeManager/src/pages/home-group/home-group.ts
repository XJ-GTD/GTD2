import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { Group } from "../../model/group.model";
import { AppConfig } from "../../app/app.config";
import {ParamsService} from "../../service/params.service";
import {WebsocketService} from "../../service/websocket.service";

/**
 * Generated class for the HomeGroupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-group',
  templateUrl: 'home-group.html',
  providers: []
})
export class HomeGroupPage {

  dataList = [];
  data: any;
  userInfo: any;
  groupList: Array<Group> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService,
              private webSocket: WebsocketService) {
    this.userInfo = this.paramsService.user;
    this.http.get(AppConfig.GROUP_FIND_URL + "/" + this.userInfo.userId)
      .subscribe(data => {
        console.log(data);
        this.data = data;
        if (this.data.code == "0") {
          this.groupList = this.data.data.groupInfoList;
        } else {
          this.groupList = null;
        }
      })
    this.customer();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeGroupPage');
  }

  groupDetailShow(group) {
    this.navCtrl.push('HomeGroupDetailPage', {"group": group});
  }

  addSchedule() {
    this.navCtrl.push('ScheduleAddPage');
  }

  customer() {
    const url = "ws:192.168.0.176:8081/customer";
    const nodeid = '{ "userName": "吴大大", "taskName": "今日任务", "taskContent": "5km往返跑" }';
    this.webSocket.create(url, nodeid).map((request: MessageEvent): string => {
      let data = request.data;
      return data;
    })
      .subscribe(msg => {
        let data = eval('(' + msg + ')');
        this.dataList.push(data);
        alert(this.dataList[0]);
      });
  }
}
