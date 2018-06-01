import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from "@angular/common/http";
import { Group } from "../../model/group.model";
import { AppConfig } from "../../app/app.config";
import {ParamsService} from "../../service/params.service";

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

  data: any;
  userInfo: any;
  groupList: Array<Group> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService) {
    this.userInfo = this.paramsService.user;
    this.data = this.http.get(AppConfig.GROUP_FIND_URL + "/" + this.userInfo.userId)
      .subscribe(data => {
        console.log(data);
        this.data = data;
        if (this.data.code == "0") {
          this.groupList = this.data.data.groupInfoList;
        } else {
          this.groupList = null;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeGroupPage');
  }

  groupDetailShow() {
    this.navCtrl.push('HomeGroupDetailPage');
  }

  addSchedule(groupId) {
    this.navCtrl.push('ScheduleAddPage', {"groupId": groupId});
  }
}
