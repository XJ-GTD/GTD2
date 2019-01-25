import {Component, ElementRef, ViewChild} from '@angular/core';
import {App, Events, IonicPage, ModalController, Nav, NavController, ViewController} from 'ionic-angular';
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
import {ScheduleModel} from "../../model/schedule.model";

/**
 * Generated class for the HaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ha',
  template:'<ion-header no-border>' +
  '  <ion-toolbar color="none">' +
  '    <ion-buttons left no-margin padding-left>' +
  '      <button ion-button icon-only menuToggle no-margin>' +
  '        <img src="./assets/imgs/menu.png"/>' +
  '      </button>' +
  '    </ion-buttons>' +
  '    <ion-buttons end no-margin padding-right>' +
  '      <button ion-button icon-only no-margin (click)="gotoToday()">' +
  '        <img src="./assets/imgs/today.png"/>' +
  '      </button>' +
  '    </ion-buttons>' +
  '  </ion-toolbar>' +
  '</ion-header>' +
  '<ion-content>' +
  '  <div class="haContent">' +
  '    <div class="haCalendar">' +
  '      <ion-calendar [options]="options"' +
  '                    (onSelect)="onSelectDayEvent($event)"' +
  '                    (onPress)="creNewEvent($event)">' +
  '      </ion-calendar>' +
  '    </div>' +
  '    <p class="tipDay"><span class="showDay animated flipInX">{{showDay}}</span><span' +
  '      class="showDay2">{{showDay2}}</span></p>' +
  '    <page-ha01></page-ha01>' +
  '  </div>' +
  '  <div class=" animated swing  assistant" (click)="openVoice()" #assistant>' +
  '    <img src="./assets/imgs/yuying.png"/>' +
  '  </div>' +
  '</ion-content>' +
  '<div [hidden]="noShow" class="backdrop-div" (click)="backdropclick($event)" >' +
  '  <ion-backdrop disable-activated class="itemClass" role="presentation" tappable' +
  '                style="opacity: 0.3; transition-delay: initial; transition-property: none;"></ion-backdrop>' +
  '  <div class="pop-css" padding style="position: absolute"' +
  '       *ngFor="let event of dayEvents"  (swipe)="swipeEvent($event)">' +
  '      <ion-item style="border-top-left-radius: 20px;border-top-right-radius: 20px;">' +
  '        <div item-end>' +
  '          <button (click)="editEvent(event)" ion-item class="buttonWan">编辑</button>' +
  '        </div>' +
  '      </ion-item>' +
  '      <ion-item style="border-top-left-radius: 20px;border-top-right-radius: 20px;">' +
  '        <img src="./assets/imgs/h.png" style="width: 20px" item-start>' +
  '        <ion-label col-3>任务</ion-label>' +
  '        <ion-label>{{event.scheduleName}}</ion-label>' +
  '      </ion-item>' +
  '      <ion-item>' +
  '        <img src="./assets/imgs/g.png" style="width: 20px" item-start>' +
  '        <ion-label col-3 item-left style="margin-right: 0px !important;">参与人</ion-label>' +
  '        <div item-left margin-left>' +
  '          <div>' +
  '            <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '              <img src="http://pics.sc.chinaz.com/files/pic/pic9/201811/bpic9202.jpg"' +
  '                   style="border-radius: 50%;width: 40px;height: 40px">' +
  '            </ion-thumbnail>' +
  '            <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center>' +
  '              张三' +
  '            </div>' +
  '          </div>' +
  '        </div>' +
  '        <div item-left>' +
  '          <div>' +
  '            <ion-thumbnail style="min-width: 40px !important;min-height: 40px !important;">' +
  '              <img src="http://pics.sc.chinaz.com/files/pic/pic9/201811/bpic9202.jpg"' +
  '                   style="border-radius: 50%;width: 40px;height: 40px">' +
  '            </ion-thumbnail>' +
  '            <div style="clear: both; font-size:10px;width:40px;overflow: hidden;text-overflow: ellipsis;" text-center>' +
  '              李四' +
  '            </div>' +
  '          </div>' +
  '        </div>' +
  '      </ion-item>' +
  '      <ion-item>' +
  '        <img src="./assets/imgs/b.png" style="width: 20px" item-start>' +
  '        <ion-label col-3>备注</ion-label>' +
  '        <ion-label>哈哈哈</ion-label>' +
  '      </ion-item>' +
  '    </div>' +
  '</div>',
  providers: []
})
export class HaPage {
  @ViewChild(CalendarComponent) ion2calendar: CalendarComponent;
  @ViewChild(Ha01Page) ha01Page: Ha01Page;

  remindScheduleList: Array<RemindModel>;//提醒时间数据
  remindList: Array<string>;  //全部提醒时间

  showDay: string;
  showDay2: string;
  active: number = 0;//当前页面
  noShow: boolean = true;
  dayEvents: Array<ScheduleModel>;

  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1975, 0, 1),
    daysConfig: []
  };

  constructor(private modalCtr: ModalController,
              private utilService: UtilService,
              private xiaojiFeekback: XiaojiFeedbackService,
              private events: Events,
              private el: ElementRef,
              private navCtrl: NavController,
              private app: App) {
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
    this.events.subscribe("showSchedule",(data)=>{
      this.dayEvents = data.dayEvents;
      this.active = data.index;
      setTimeout(()=>{
        let domList = this.el.nativeElement.querySelectorAll(".pop-css");
        console.log(domList.length);

        for (let i = 0; i < domList.length; i++) {
          if (this.active == i) {
            domList.item(i).className = "pop-css activeCss";
          }
          if (i == this.active - 1) {
            domList.item(i).className = "pop-css activeCssLeft";
          }
          if (i == this.active + 1) {
            domList.item(i).className = "pop-css activeCssRight";
          }
          if (i < this.active - 1) {
            domList.item(i).className = "pop-css activeCssLeft-1";
          }
          if (i > this.active + 1) {
            domList.item(i).className = "pop-css activeCssRight-1";
          }
          console.log("i :: " + i);
        }
        this.noShow = false;
      },100)

    });

    this.events.subscribe("noshow",()=>{
      this.noShow = true;
    });
    this.events.subscribe("flashDay",(data)=>{
      let day = data.day;
      let event = data.event;
      console.log(JSON.stringify(day));
      this.ion2calendar.flashDay(day);
      this.onSelectDayEvent(event);
    });
  }

  ionViewWillEnter(){
    console.log("ionViewWillEnter 刷新HaPage :: ")

  }


  creNewEvent($event) {
    this.xiaojiFeekback.audioHighhat();
    console.log($event);
    let eventDate = new Date($event.time);
    let tmp = moment(eventDate).format("YYYY-MM-DD");
    let sbPageModal = this.modalCtr.create(PageConfig.SB_PAGE,{dateStr:tmp,event:$event});
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

    // this.ion2calendar.flashDay('2019-02-28');



  }



  gotoToday() {
    this.ion2calendar.setViewDate(moment().format("YYYY-MM-DD"));
  }

  openVoice() {
    let tab1RootModal = this.modalCtr.create(PageConfig.HB_PAGE);
    tab1RootModal.present();
  }


  swipeEvent(event) {
    console.log(event);
    console.log("当前页面 :: " + this.active);
    let domList = this.el.nativeElement.querySelectorAll(".pop-css");


    if (event.direction == 2) {
      let index = this.active;

      //   3 4 5 6
      // 2 3 4 5
      console.log("向左滑 :: ");
      if (index == this.dayEvents.length - 1) {
        console.log("划不动了 :: ");
        return;
      }

      //左一左移
      if (index - 1 >= 0) {
        let dom2 = domList.item(index - 1);
        dom2.className = "pop-css activeCssLeft-1";
      }
      //当前页面左移
      let dom: HTMLElement = domList.item(index);
      console.log(dom)
      // dom.style.transform = "translate(-105%,10%)"
      dom.className = "pop-css activeCssLeft ";
      //右一左移
      if (index + 1 < this.dayEvents.length) {
        let dom2 = domList.item(index + 1);
        dom2.className = "pop-css activeCss";
      }
      //右二左移
      if (index + 2 < this.dayEvents.length) {
        let dom2 = domList.item(index + 2);
        dom2.className = "pop-css activeCssRight";
      }

      this.active++;
    }
    if (event.direction == 4) {
      console.log("向右滑 :: ");
      let index = this.active;
      if (this.active == 0) {
        console.log("划不动了 :: ")
        return;
      }
      let dom = domList.item(index);
      dom.className = "pop-css activeCssRight ";
      //右一右移
      if (index + 1 < domList.length) {
        let dom2 = domList.item(index + 1);
        dom2.className = "pop-css activeCssRight-1";
      }
      //左一右移
      if (index - 1 >= 0) {
        let dom2 = domList.item(index - 1);
        dom2.className = "pop-css activeCss";
      }
      //左二右移
      if (index - 2 >= 0) {
        let dom2 = domList.item(index - 2);
        dom2.className = "pop-css activeCssLeft";
      }
      this.active--;
    }
  }

  backdropclick = function (e) {
    //判断点击的是否为遮罩层，是的话隐藏遮罩层
    if (e.srcElement.className == 'itemClass') {
      this.noShow = true;
    }
    //隐藏滚动条
    //阻止冒泡
    // e.stopPropagation();
  }

  editEvent(schedule:ScheduleModel){
    setTimeout(()=>{
      this.noShow = true;
    },1000);
    this.app.getRootNav().push("SaPage", schedule);
  }

}

