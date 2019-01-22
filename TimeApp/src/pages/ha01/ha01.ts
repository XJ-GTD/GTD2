import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ScheduleModel} from "../../model/schedule.model";
import {UtilService} from "../../service/util-service/util.service";
import {WorkService} from "../../service/work.service";
import * as moment from "moment";

/**
 * Generated class for the Ha01Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha01',
  template:'<ion-scroll scrollY="true">' +
  '  <ul>' +
  '    <li ion-item *ngFor="let itm of dayEvents ;let i = index" (click)="showScheduleDetail(i)">' +
  '      <p item-start>' +
  '        {{itm.scheduleStartTime}}' +
  '      </p>' +
  '      <ion-icon  [ngStyle]="{\'color\':itm.labelColor}" style="font-size: smaller">{{itm.scheduleType}}</ion-icon>' +
  '      <span>' +
  '     {{itm.scheduleName}}' +
  '    </span>' +
  '    </li>' +
  '  </ul>' +
  '</ion-scroll>' ,

})
export class Ha01Page {

  dayEvents: Array<ScheduleModel>;


  showNow: ScheduleModel;


  dateStr:string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private util: UtilService,
              private rnd: Renderer2,
              private workService: WorkService,
              private el: ElementRef,
              private events: Events) {
    console.log('ionViewDidLoad Ha01Page');
    this.height = window.document.body.clientHeight - 350 - 110;

  }

  /**
   * Height of the tabs
   */
  @Input()
  set height(val: number) {
    this.rnd.setStyle(this.el.nativeElement, 'height', val + 'px');
  }

  //展示数据详情
  showScheduleDetail(index) {
    console.log("schedule :: " + JSON.stringify(index));
    this.events.publish('showSchedule',{index:index,dayEvents:this.dayEvents});

    //
  }

  editEvent(schedule:ScheduleModel){
    this.navCtrl.push("SaPage", schedule);
  }

  //查询当天日程
  showEvents($event) {
    console.log($event);
    let eventDate = new Date($event.time);
    let year = eventDate.getFullYear();
    let month = eventDate.getMonth() + 1;
    let day = eventDate.getDate();

    this.dayEvents = [];
    let dateStr = moment().set({
      'year': year,
      'month': month - 1,
      'date': day
    }).format('YYYY-MM-DD');
    this.dateStr = dateStr;
    this.workService.getOd(dateStr).then(data => {
      if (data.code == 0) {
        for (let i = 0; i < data.slc.length; i++) {
          this.dayEvents.push(data.slc[i]);
        }
      }
    })




  }

  ionViewWillEnter(){
    if(this.dateStr != undefined){
      this.workService.getOd(this.dateStr).then(data => {
        if (data.code == 0) {
          for (let i = 0; i < data.slc.length; i++) {
            this.dayEvents.push(data.slc[i]);
          }
        }
      })
    }
  }



}
