import {Component, ComponentRef, ElementRef, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponent,
  CalendarComponentOptions, CalendarDay
} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import * as moment from "moment";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";
import {TdcPage} from "../tdc/tdc";
import {TddiPage} from "../tdc/tddi";
import {HData, ScdPageParamter} from "../../data.mapping";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";

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
        <div #calendarDiv class="haCalendar">
          <ion-calendar #calendar
                        [options]="options"
                        (onSelect)="onSelect($event)"
                        (onPress)="onPress($event)">
          </ion-calendar>
        </div>
        <ng-template [ngIf]="hdata.isShow">
          <p class="tipDay">
            <span class="showDay">{{hdata.showDay}}</span>
            <span class="showDay2">{{hdata.showDay2}}</span>
            <span class="showDay3" *ngFor="let jt of hdata.jtl" (click)="gotojt(jt)">{{jt.spn}}</span>
          </p>
          <p class="tipDay" *ngIf="hdata.things > 0"><a class="cls" (click)="gotodaily()">
            <ion-icon name="done-all"></ion-icon>
            {{hdata.things}} 个活动,{{hdata.newmessge}}条新消息</a></p>
          <p class="tipDay"><a class="cls" (click)="newcd()">
            <ion-icon name="add"></ion-icon>
            添加新事件</a></p>
        </ng-template>
      </div>
      <!--<div class="rightm">-->
      <!--&nbsp;-->
      <!--</div>-->
      <AiComponent [ready]="aiready" #aiDiv></AiComponent>
    </ion-content>
  `,
})
export class HPage {

  @ViewChild('calendarDiv')
  calendarDiv: ElementRef;
  @ViewChild('aiDiv')
  aiDiv: AiComponent;
  @ViewChild('calendar')
  calendar: CalendarComponent;

  aiready: boolean = false;

  hdata: HData;
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1900, 0, 1),
    to: new Date(2299, 0, 1),
    daysConfig: []
  };


  constructor(private hService: HService,
              private navController: NavController,
              private renderer2: Renderer2,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private emitService: EmitService,
              private feedback: FeedbackService) {
    this.hdata = new HData();
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    // websocket连接成功消息回调
    this.emitService.register("on.websocket.connected", () => {
      this.aiready = true;
      DataConfig.RABBITMQ_STATUS = "connected";
    });

    // websocket断开连接消息回调
    this.emitService.register("on.websocket.closed", () => {
      this.aiready = false;
      DataConfig.RABBITMQ_STATUS = "";
    });

    this.emitService.registerNewMessageClick((data) => {

      let p: ScdPageParamter = new ScdPageParamter();
      p.si = data.id;
      p.d = moment(data.d);
      this.modalCtr.create(TddiPage, p).present();
    });

    this.emitService.registerRef(data => {
      this.calendar.createMonth(this.calendar.monthOpt.original.time);
    });

    //冥王星远程服务地址刷新完成
    //更新每小时天气服务任务
    this.emitService.register('on.mwxing.global.restful.flashed', () => {
      this.hService.putHourlyWeather(UserConfig.account.id);
    });
    //初始化时自动触发一次
    this.hService.putHourlyWeather(UserConfig.account.id);

    //每日简报消息回调
    this.emitService.register('on.dailyreport.message.click', (data) => {
      console.log("Daily report message clicked.")
      let timestamp: number = data.eventdata? data.eventdata['timestamp'] : (moment().unix() * 1000);

      if (!timestamp) {
        timestamp = moment().unix() * 1000;
      }

      this.gotodaily({
        time: timestamp,
        isToday: false,
        selected: false,
        disable: false,
        cssClass: '',
        hassometing: false,
        busysometing: false,
        allsometing: false,
        onlyRepeat: false
      });
    });

    //操作反馈消息回调
    this.emitService.register('on.feedback.message.click', (data) => {
      let scd = data.eventdata? data.eventdata['scd'] : null;
      if (scd && scd.si) {
        this.gotodetail(scd);
      }
    });

    this.emitService.emit("on.homepage.init");
    console.log("MWxing initialized.")
  }

  onPress(pressDay) {
    this.hService.centerShow(pressDay).then(d => {
      this.hdata = d;
      this.newcd();
    })

  }

  newcd() {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = moment(this.hdata.selectDay.time);
    this.feedback.audioPress();
    this.modalCtr.create(TdcPage, p).present();
  }

  //查询当天日程
  onSelect(selectDay: CalendarDay) {
    this.feedback.audioClick();
    if (selectDay) this.emitService.emitSelectDate(moment(selectDay.time));
    this.hService.centerShow(selectDay).then(d => {
      //双机进入列表
      if (this.hdata.selectDay == selectDay && selectDay) {
        this.gotolist();
      }
      this.hdata = d;
    })
  }

  gotodaily(day?: CalendarDay) {
    let selectDay: CalendarDay = day? day : this.hdata.selectDay;

    this.modalCtr.create(DataConfig.PAGE._DA_PAGE, selectDay).present();
  }

  gotolist() {
    this.menuController.open("ls");
    //this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.hdata.selectDay.time});
  }

  gotojt(jt){
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = jt.si;
    p.d = moment(jt.sd);
    p.gs = "3";

    this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
  }

  gotodetail(scd) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = scd.si;
    p.d = moment(scd.sd);
    p.gs = scd.gs;

    if (scd.gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (scd.gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }
  }
}
