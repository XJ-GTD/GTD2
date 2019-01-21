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
  // templateUrl: 'ha.html',
  template:'<ion-header no-border>\n' +
  '  <ion-toolbar color="none">\n' +
  '    <ion-buttons left no-margin padding-left>\n' +
  '      <button ion-button icon-only menuToggle no-margin>\n' +
  '        <img src="./assets/imgs/menu.png"/>\n' +
  '      </button>\n' +
  '    </ion-buttons>\n' +
  '    <ion-buttons end no-margin padding-right>\n' +
  '      <button ion-button icon-only no-margin (click)="gotoToday()">\n' +
  '        <img src="./assets/imgs/today.png"/>\n' +
  '      </button>\n' +
  '    </ion-buttons>\n' +
  '  </ion-toolbar>\n' +
  '</ion-header>\n' +
  '<ion-content>\n' +
  '  <div class="haContent">\n' +
  '    <div class="haCalendar">\n' +
  '      <ion-calendar [options]="options"\n' +
  '                    (onSelect)="onSelectDayEvent($event)"\n' +
  '                    (onPressup)="creNewEvent($event)">\n' +
  '      </ion-calendar>\n' +
  '    </div>\n' +
  '    <p class="tipDay"><span class="showDay animated flipInX">{{showDay}}</span><span\n' +
  '      class="showDay2">{{showDay2}}</span></p>\n' +
  '    <page-ha01></page-ha01>\n' +
  '  </div>\n' +
  '  <div class=" animated swing  assistant" (click)="openVoice()" #assistant>\n' +
  '    <img src="./assets/imgs/yuying.png"/>\n' +
  '  </div>\n' +
  '</ion-content>',
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

  ionViewWillEnter(){
    console.log("ionViewWillEnter 刷新HaPage :: ")
  }


  creNewEvent($event) {
    this.xiaojiFeekback.audioHighhat();
    console.log($event);
    let eventDate = new Date($event.time);
    let tmp = moment(eventDate).format("YYYY-MM-DD");
    let sbPageModal = this.modalCtr.create(PageConfig.SB_PAGE,{dateStr:tmp});
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

