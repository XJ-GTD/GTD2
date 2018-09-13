import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

  data: any;
  scheduleList: Array<ScheduleModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService) {

    this.init();

  }

  init() {
    this.scheduleList = [];
    this.scheduleList = this.paramsService.scheduleList;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScheduleListPage');
  }

}
