import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { ScheduleModel } from "../../model/schedule.model";
import {AppConfig} from "../../app/app.config";
import {HttpClient} from "@angular/common/http";
import {ScheduleOutModel} from "../../model/out/schedule.out.model";

/**
 * Generated class for the ScheduleListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-list',
  templateUrl: 'schedule-list.html',
  providers: []
})
export class ScheduleListPage {
  @ViewChild(Navbar) navBar: Navbar;

  data: any;
  scheduleList: Array<ScheduleModel>;
  schedule: ScheduleModel;
  findSchedule: ScheduleOutModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http: HttpClient,
              private paramsService: ParamsService) {

    this.init();

  }

  init() {
    this.scheduleList = [];
    this.scheduleList = this.paramsService.scheduleList;

  }

  //展示数据详情
  showScheduleDetail(schedule){
    this.schedule = new ScheduleModel();
    this.schedule = schedule;
    this.paramsService.schedule = this.schedule;
    console.log("schedule:" + this.paramsService.schedule);
    this.navCtrl.push("ScheduleDetailPage");
  }

  //删除日程
  deleteSchedule(schedule: ScheduleModel){
    this.findSchedule = new ScheduleOutModel();
    this.findSchedule.userId = this.paramsService.user.userId;
    this.findSchedule.scheduleId = schedule.scheduleId;
    this.http.post(AppConfig.SCHEDULE_DELETE_URL, this.findSchedule, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json'
    })
      .subscribe(data => {
        this.data = data;
        console.log("data:" + this.data.toString());

        if (this.data.code == 0) {
          this.scheduleList = [];
          this.scheduleList = this.data.data.scheduleJoinList;
          console.log("data:" + this.data.data);
        } else {
          console.log("error message:" + this.data.message);
        }
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleListPage');
    this.navBar.backButtonClick = this.backButtonClick;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.paramsService.schedule=null;
    this.navCtrl.pop();
  }
}
