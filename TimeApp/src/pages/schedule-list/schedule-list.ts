import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import { ParamsService } from "../../service/params.service";
import { ScheduleModel } from "../../model/schedule.model";

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
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
