import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponent,
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";
import {BackComponent} from "../../components/backComponent/back";

/**
 * Generated class for the 首页 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-h',
  template: `
    <ion-content>
      <div class="haContent">
        <div class="haCalendar">
          <ion-calendar [options]="options"
                        (onSelect)="onSelect($event)"
                        (onPress)="onPress($event)">
          </ion-calendar>
        </div>
        <ng-template [ngIf]="showDay">
          <p class="tipDay"><span class="showDay">{{showDay}}</span><span
            class="showDay2">{{showDay2}}</span></p>
          <p class="tipDay"><a class="cls" (click)="gotolist()">
            <ion-icon name="done-all"></ion-icon>
            18 个事件</a></p>
          <p class="tipDay"><a class="cls" (click)="newcd()">
            <ion-icon name="add"></ion-icon>
            添加新事件</a></p>
        </ng-template>
      </div>
      <div class="rightm">
        &nbsp;
      </div>
      <BackComponent></BackComponent>
      <AiComponent></AiComponent>
    </ion-content>`,
  providers: []
})
export class HPage {
  @ViewChild(CalendarComponent) ion2calendar: CalendarComponent;
  @ViewChild(BackComponent) back: BackComponent;
  showDay: string;
  showDay2: string;
  selectDay: any;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1975, 0, 1),
    daysConfig: []
  };


  constructor(private modalCtr: ModalController,
              private utilService: UtilService,
              private xiaojiFeekback: FeedbackService,
              private events: Events,
              private navController: NavController) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {

    // let eventDate = new Date();
    // this.selectDay = eventDate;
    // let year = eventDate.getFullYear();
    // let month = eventDate.getMonth() + 1;
    // let day = eventDate.getDate();
    //
    // this.showDay = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd  MM月DD日');
    // this.showDay2 = this.utilService.showDay(moment().set({
    //   'year': year,
    //   'month': month - 1,
    //   'date': day
    // }).format('YYYY-MM-DD'))

    //
    // this.events.subscribe("flashDay", (data) => {
    //   let day = data.day;
    //   let event = data.event;
    //   this.ion2calendar.flashDay(day);
    //   this.onSelectDayEvent(event);
    // });
    //
    // this.events.subscribe("flashMonth", (data) => {
    //   this.ion2calendar.flashMonth(this.selectDay.getTime());
    //   if (this.event != undefined) {
    //     this.onSelectDayEvent(this.event);
    //   } else {
    //     //this.tdlPage.showScheduleLs({time:moment().valueOf()});
    //   }
    // });
  }

  ionViewWillEnter() {

  }


  onPress($event) {
    this.xiaojiFeekback.audioHighhat();
    this.selectDay = $event;
    this.newcd();
  }

  newcd() {
    let eventDate = new Date(this.selectDay);
    let tmp = moment(eventDate).format("YYYY/MM/DD");
    let sbPageModal = this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {dateStr: tmp, event: this.selectDay});
    sbPageModal.present();
  }

  //查询当天日程
  onSelect($event) {
    if (!$event) {
      this.selectDay = $event;
      this.showDay = null;
      return;
    }

    if (this.selectDay == $event) {
      this.gotolist();
    } else {
      this.selectDay = $event;
      let eventDate = new Date($event.time);
      let year = eventDate.getFullYear();
      let month = eventDate.getMonth() + 1;
      let day = eventDate.getDate();
      this.showDay = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd MM月DD日');
      this.showDay2 = this.utilService.showDay(moment().set({
        'year': year,
        'month': month - 1,
        'date': day
      }).format('YYYY-MM-DD'));
    }

    //
    //this.tdlPage.showScheduleLs($event);
  }

  gotolist() {

    this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.selectDay.time}, {direction: "back", animation: "push"});
  }

}

