import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Group} from "../../model/group.model";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "../../app/app.config";

/**
 * Generated class for the HomeGroupDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-group-detail',
  templateUrl: 'home-group-detail.html'
})
export class HomeGroupDetailPage {

  data: any;
  groupDetail: Group;
  groupScheduleList: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: HttpClient) {
    this.groupDetail = this.navParams.get("group");
    this.http.get(AppConfig.SCHEDULE_GROUP_ALL_URL + "/" + this.groupDetail.groupId)
      .subscribe(data => {
       console.log(data);
        this.data =data;
        if (this.data.code == "0") {
          this.groupScheduleList = this.data.data.scheduleInfoList;
        } else {
          this.groupScheduleList = null;
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeGroupDetailPage');
  }

  addScheduleByGroup() {
    this.navCtrl.push('ScheduleAddPage', {'groupId': this.groupDetail.groupId})
  }

  updateSchedule(scheduleId) {

  }
}
