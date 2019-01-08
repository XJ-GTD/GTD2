import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController} from 'ionic-angular';
import {RemindModel} from "../../model/remind.model";
import {
  CalendarComponent,
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import * as moment from "moment";
import {Ha01Page} from "../ha01/ha01";
import {PageConfig} from "../../app/page.config";
import {UtilService} from "../../service/util-service/util.service";
import {XiaojiFeedbackService} from "../../service/util-service/xiaoji-feedback.service";

/**
 * Generated class for the HaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha',
  templateUrl: 'ha.html',
  providers: []
})
export class HaPage {
  @ViewChild(CalendarComponent) ion2calendar: CalendarComponent;
  @ViewChild(Ha01Page) ha01Page: Ha01Page;

  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  showDay: string;
  showDay2: string;

  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1975, 0, 1),
    daysConfig: []
  };

  constructor(private modalCtr: ModalController,
              private utilService: UtilService,
              private xiaojiFeekback: XiaojiFeedbackService) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HaPage');

    let eventDate = new Date();
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();
    this.showDay = this.utilService.showDay(moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD'))
    this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');
  }


  creNewEvent($event) {
    this.xiaojiFeekback.audioHighhat();
    let sbPageModal = this.modalCtr.create(PageConfig.SB_PAGE);
    sbPageModal.present();
  }

  //查询当天日程
  onSelectDayEvent($event) {
    if (!$event) {
      return;
    }
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();
    this.showDay = this.utilService.showDay(moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD'));
    this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');

    this.ha01Page.showEvents($event);


  }

  gotoToday() {
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }

  openVoice() {
    let tab1RootModal = this.modalCtr.create(PageConfig.HB_PAGE);
    tab1RootModal.present();
  }


}

