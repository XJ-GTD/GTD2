import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponent,
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import * as moment from "moment";
import {TdlPage} from "../tdl/tdl";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 首页 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-h',
  template:`<ion-header no-border>
    <ion-toolbar color="none">
      <ion-buttons left no-margin padding-left>
        <button ion-button icon-only menuToggle no-margin>
          <img src="./assets/imgs/menu.png"/>
        </button>
      </ion-buttons>
      <ion-buttons end no-margin padding-right>
        <button ion-button icon-only no-margin (click)="gotoToday()">
          <img src="./assets/imgs/today.png"/>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
   <div class="haContent">
      <div class="haCalendar">
        <ion-calendar [options]="options"
                      (onSelect)="onSelectDayEvent($event)"
                      (onPress)="creNewEvent($event)">
        </ion-calendar>
      </div>
      <p class="tipDay"><span class="showDay animated flipInX">{{showDay}}</span><span
       class="showDay2">{{showDay2}}</span></p>
    </div>
    <div class=" animated swing  assistant" (click)="openVoice()" #assistant>
      <img src="./assets/imgs/yuying.png"/>
    </div>
  </ion-content>`,
  providers: []
})
export class HPage {
  @ViewChild(CalendarComponent) ion2calendar: CalendarComponent;


  showDay: string;
  showDay2: string;
  selectDay: Date;
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1975, 0, 1),
    daysConfig: []
  };

  event:any ;
  constructor(private modalCtr: ModalController,
              private utilService: UtilService,
              private xiaojiFeekback: FeedbackService,
              private events: Events,
              private navController:NavController) {
    moment.locale('zh-cn');
  }

  ionViewDidLoad() {

    let eventDate = new Date();
    this.selectDay = eventDate;
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();
    this.showDay = this.utilService.showDay(moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD'))
    this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');

    this.events.subscribe("flashDay",(data)=>{
      let day = data.day;
      let event = data.event;
      this.ion2calendar.flashDay(day);
      this.onSelectDayEvent(event);
    });

    this.events.subscribe("flashMonth",(data)=>{
      this.ion2calendar.flashMonth(this.selectDay.getTime());
      if(this.event != undefined){
        this.onSelectDayEvent(this.event);
      }else{
        //this.tdlPage.showScheduleLs({time:moment().valueOf()});
      }
    });
  }

  ionViewWillEnter(){

  }


  creNewEvent($event) {
    this.xiaojiFeekback.audioHighhat();
    this.event = $event;
    let eventDate = new Date($event.time);
    let tmp = moment(eventDate).format("YYYY-MM-DD");
    //let sbPageModal = this.modalCtr.create(PageConfig._TDC_PAGE,{dateStr:tmp,event:$event});
    //sbPageModal.present();
  }

  //查询当天日程
  onSelectDayEvent($event) {
    // if (!$event) {
    //   return;
    // }
    // this.event = $event;
    // let eventDate = new Date($event.time);
    // this.selectDay = eventDate;
    // let year = eventDate.getFullYear();
    // let month = eventDate.getMonth() + 1;
    // let day = eventDate.getDate();
    // this.showDay = this.utilService.showDay(moment().set({
    //   'year': year,
    //   'month': month - 1,
    //   'date': day
    // }).format('YYYY-MM-DD'));
    // this.showDay2 = moment().set({'year': year, 'month': month - 1, 'date': day}).format('dddd YYYY 年 MM 月 DD 日');

    this.navController.push(DataConfig.PAGE._TDL_PAGE,{selectDay:$event},{direction:"back",animation:"push"});
    //this.tdlPage.showScheduleLs($event);
  }

  gotoToday() {
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }

  openVoice() {
    // let tab1RootModal = this.modalCtr.create(PageConfig._HB_PAGE);
    // tab1RootModal.onDidDismiss(()=>{
    //   //刷新月份事件标识
    //   console.log(this.selectDay);
    //   this.events.publish("flashMonth");
    // });
    // tab1RootModal.present();
  }


}

