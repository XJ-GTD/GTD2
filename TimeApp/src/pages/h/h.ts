import {Component, ComponentRef, ElementRef, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponentOptions, CalendarDay
} from "../../components/ion2-calendar";
import {HService} from "./h.service";
import  * as Hammer from 'hammerjs'
import * as moment from "moment";
import {AiComponent} from "../../components/ai/answer/ai";
import {EmitService} from "../../service/util-service/emit.service";
import {TdcPage} from "../tdc/tdc";
import {TddiPage} from "../tdc/tddi";
import {HData, ScdPageParamter} from "../../data.mapping";

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
      <div class="haContent" >
        <div #calendarDiv class="haCalendar">
          <ion-calendar [options]="options"
                        (onSelect)="onSelect($event)"
                        (onPress)="onPress($event)">
          </ion-calendar>
        </div>
        <ng-template [ngIf]="hdata.isShow">
          <p class="tipDay"><span class="showDay">{{hdata.showDay}}</span><span
            class="showDay2">{{hdata.showDay2}}</span></p>
          <p class="tipDay"><a class="cls" (click)="gotolist()">
            <ion-icon name="done-all"></ion-icon>
            {{hdata.things}} 个事件,{{hdata.newmessge}}条新消息</a></p>
          <p class="tipDay"><a class="cls" (click)="newcd()">
            <ion-icon name="add"></ion-icon>
            添加新事件</a></p>
        </ng-template>
      </div>
      <!--<div class="rightm">-->
        <!--&nbsp;-->
      <!--</div>-->
      <AiComponent #aiDiv></AiComponent>
    </ion-content>
    `,
})
export class HPage {

  @ViewChild('calendarDiv')
  calendarDiv: ElementRef;
  @ViewChild('aiDiv')
  aiDiv: AiComponent;

  hdata: HData;
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1900, 0, 1),
    to: new Date(2299, 0, 1),
    daysConfig: []
  };


  constructor(private hService: HService,
              private navController: NavController,
              private renderer2:Renderer2,
              private modalCtr:ModalController,
              private menuController:MenuController,
              private emitService:EmitService) {
    this.hdata = new HData();
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    this.emitService.registerNewMessageClick((data)=>{

      let p:ScdPageParamter = new ScdPageParamter();
      p.si= data.id;
      p.d = moment(data.d);
      this.modalCtr.create(TddiPage, p).present();
    })
  }

  onPress(pressDay) {
    this.hService.centerShow(pressDay).then(d => {
      this.hdata = d;
      this.newcd();
    })

  }

  newcd() {
    let p:ScdPageParamter = new ScdPageParamter();
    p.d = moment(this.hdata.selectDay.time);
    this.modalCtr.create(TdcPage, p).present();
  }

  //查询当天日程
  onSelect(selectDay:CalendarDay) {
    if (selectDay)this.emitService.emitSelectDate(moment(selectDay.time));
    this.hService.centerShow(selectDay).then(d => {
      //双机进入列表
      if (this.hdata.selectDay == selectDay && selectDay) {
        this.gotolist();
      }
      this.hdata = d;
    })
  }

  gotolist() {
    this.menuController.open("ls");
    //this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.hdata.selectDay.time});
  }
}

