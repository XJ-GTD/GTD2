import {Component} from '@angular/core';
import {IonicPage, MenuController, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import {DataConfig} from "../../service/config/data.config";
import {HData, HService} from "./h.service";
import  * as Hammer from 'hammerjs'
import {createElementCssSelector} from "@angular/compiler";
import * as moment from "moment";

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
    <ion-content #ha  (swipe)="swipeEvent($event)">
      <div class="haContent" >
        <div class="haCalendar" class="animated fadeInDownBig">
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
      <BackComponent></BackComponent>
      <AiComponent class="animated fadeInUpBig"></AiComponent>
    </ion-content>
    `,
})
export class HPage {

  hdata: HData;
  options: CalendarComponentOptions = {
    pickMode: 'single',
    from: new Date(1900, 0, 1),
    to: new Date(2299, 0, 1),
    daysConfig: []
  };


  constructor(private hService: HService,
              private navController: NavController,
              private menuController:MenuController) {
    this.hdata = new HData();

  }

  ngOnInit() {
  }

  onPress(pressDay) {
    this.hService.centerShow(pressDay).then(d => {
      this.hdata = d;
      this.newcd();
    })

  }

  newcd() {
    //this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {dateStr: this.hdata.selectDay.time}).present();
  }

  //查询当天日程
  onSelect(selectDay) {
    this.hService.centerShow(selectDay).then(d => {
      //双机进入列表
      if (this.hdata.selectDay == selectDay && selectDay) {
        this.gotolist();
      }
      this.hdata = d;
    })
  }

  gotolist() {
    this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.hdata.selectDay.time}, {
      direction: "back",
      animation: "push"
    });
  }

  public swipeEvent($event:HammerInput){
    // let dir:number = $event.direction;
    // if (dir == Hammer.DIRECTION_RIGHT){
    //   if (!this.hdata.selectDay)
    //     this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: moment().unix()}, {
    //       direction: "back",
    //       animation: "push",
    //       isNavRoot:false,
    //     });
    //     else
    //   this.navController.push(DataConfig.PAGE._TDL_PAGE, {selectDay: this.hdata.selectDay.time}, {
    //     direction: "back",
    //     animation: "push",
    //     isNavRoot:false,
    //   });
    // }
    //
    // if (dir == Hammer.DIRECTION_LEFT)
    //   this.menuController.open();

  }

}

