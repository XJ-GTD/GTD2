import {Component, ViewChild} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController, Platform} from 'ionic-angular';
import {CalendarComponent, CalendarComponentOptions, CalendarDay} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import * as moment from "moment";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";
import {HData, ScdPageParamter} from "../../data.mapping";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DataConfig} from "../../service/config/data.config";
import {MemoData, MemoService} from "../../service/business/memo.service";
import {AipPage} from "../aip/aip";
import {TdlPage} from "../tdl/tdl";
import {TestDataService} from "../../service/testData.service";
import {UtilService} from "../../service/util-service/util.service";
import {ModalTranType, TellyouIdType, TellyouType} from "../../data.enum";
import {TellYouBase, TellyouService} from "../../components/ai/tellyou/tellyou.service";

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
    <!--<ion-header>-->
      <!---->
    <!--</ion-header>-->
    <ion-content>
      <ion-calendar #calendar
                    [options]="options"
                    (onSelect)="onSelect($event)"
                    (onPress)="onPress($event)"
                    (viewShow)="viewShow($event)"
                    (onGotoToday)="gototoday($event)"
                    (onATDay)="aTday($event)"
                    (onTodoList)="todoList($event)"
                    (onNewAgenda)="newAgenda($event)"
                    (onNewDay)="newDay($event)"
                    (onNewMome)="newMome($event)"
                    (onPlus)="newPlus($event)">
      </ion-calendar>

      <page-tdl #tdl></page-tdl>
        <PointComponent  #aiDiv [showInput] = "false" (onPonintClick)="openAi()"></PointComponent>
      <!--<div style="background: red;position: fixed;z-index: 999;top:0px;height: 30px;width: 100%">{{process}}</div>-->
      <!--<ion-fab bottom right>-->
        <!--<button ion-fab mini (click)="openAi()">-->
          <!--<ion-icon name="chatbubbles"></ion-icon>-->
        <!--</button>-->
      <!--</ion-fab>-->
    </ion-content>
  `,
})
export class HPage {
  // process:string;

  // @ViewChild('aiDiv')
  // aiDiv: AiComponent;
  @ViewChild('calendar')
  calendar: CalendarComponent;
  @ViewChild('tdl')
  tdl: TdlPage;
  aiready: boolean = true;

  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1900, 0, 1),
    to: new Date(2299, 0, 1),
    daysConfig: []
  };

 i:number = 0;
  constructor(private hService: HService,
              private navController: NavController,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private feedback: FeedbackService,
              private  momserv: MemoService,
              private testDataService: TestDataService,
              private emitService: EmitService,
              private util:UtilService) {
  }

  viewShow($event: boolean) {
    this.tdl.setScroll(!$event);
  }

  openm() {
    this.menuController.open();
  }

  openAi() {
    this.modalCtr.create(AipPage).present();
  }

  ionViewDidLoad() {
    this.tdl.regeditCalendar(this.calendar);
  }

  onPress(pressDay) {
    // this.hService.centerShow(pressDay).then(d => {
    //   this.newAgenda(pressDay);
    // })
  }


//查询当天日程
  onSelect(selectDay: CalendarDay
  ) {
    // let tel:TellYouBase = new TellYouBase();
    // tel.id = '255aef9cdc9b42a510a154d80292d026';
    // tel.idtype = TellyouIdType.Agenda
    // tel.tellType = TellyouType.remind_planitem;
    // this.tellyouService.tellyou4remind(tel);
    // let tel2:TellYouBase = new TellYouBase();
    // tel2.id = 'ce856d34844eabc6de200376c55b77bf';
    // tel2.idtype = TellyouIdType.PlanItem
    // tel2.tellType = TellyouType.remind_planitem;
    // this.tellyouService.tellyou4remind(tel2);
    this.feedback.audioClick();
    if (selectDay) this.emitService.emitSelectDate(moment(selectDay.time));
    this.hService.centerShow(selectDay).then(d => {
      //双机进入列表
      // this.hdata = d;
    })
  }


  // todoscrumList(day ?: CalendarDay) {
  //   let selectDay: CalendarDay = day ? day : this.hdata.selectDay;
  //
  //   // this.modalCtr.create(DataConfig.PAGE._DOSCRUM_PAGE, selectDay).present();
  // }

  //创建测试数据
  //
  // testDate() {
  //   this.testDataService.createcal();
  // }


  gototoday() {

  }

  newAgenda(day ?: CalendarDay) {

    let p: ScdPageParamter = new ScdPageParamter();

    if (day) {
      p.d = moment(day.time);
      if (p.d.isBefore(moment())){
        this.util.tellyou(DataConfig.NOTCREATEAGENDABEOORE);
        return;
      }
    } else {
      p.d = moment();
    }

    this.feedback.audioPress();
    this.util.createModal(DataConfig.PAGE._AGENDA_PAGE,p,ModalTranType.scale).present();
  }


  newDay(day ?: CalendarDay) {
    let p: ScdPageParamter = new ScdPageParamter();

    if (day) {
      p.d = moment(day.time);
    } else {
      p.d = moment();
    }

    this.feedback.audioPress();
    this.util.createModal(DataConfig.PAGE._COMMEMORATIONDAY_PAGE,p,ModalTranType.scale).present();
  }

  newMome(day ?: CalendarDay) {

    let todayday: string = moment().format("YYYY/MM/DD");
    let modal = this.util.createModal(DataConfig.PAGE._MEMO_PAGE,{day: todayday},ModalTranType.scale);
    modal.onDidDismiss(async (data) => {
      if (data && data.memo && typeof data.memo === 'string') { // 创建新备忘
        let memo: MemoData = {} as MemoData;

        memo.sd = data.day;
        memo.mon = data.memo;

        await this.momserv.saveMemo(memo);
      }
    });
    modal.present();
  }

  newPlus(day ?: CalendarDay) {

    this.util.createModal(DataConfig.PAGE._PLUS_MODAL,day,ModalTranType.bottom).present();
  }
}
