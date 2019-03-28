import {Component} from '@angular/core';
import { IonicPage, ModalController, NavController} from 'ionic-angular';
import {
  CalendarComponentOptions
} from "../../components/ion2-calendar";
import {DataConfig} from "../../service/config/data.config";
import {HData, HService} from "./h.service";

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
    <ion-content #ha >
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
      <div class="rightm">
        &nbsp;
      </div>
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
              private modalCtr: ModalController) {
    this.hdata = new HData();

  }
  ngOnInit(){

   // this.hService.configDay().then(data=>{
   //   this.options.daysConfig.push(...data);
   //   //
   //   // setTimeout(()=>{
   //   //   console.log("********************" + data.length);
   //   //   this.options.daysConfig.splice(0,this.options.daysConfig.length);
   //   //   //this.options.daysConfig.push(...data);
   //   // },2000);
   // })
  }

  onPress(pressDay) {
    this.hService.centerShow(pressDay).then(d => {
      this.hdata = d;
      this.newcd();
    })
  }

  newcd() {
    this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {dateStr: this.hdata.selectDay}).present();
    ;
  }

  //查询当天日程
  onSelect(selectDay) {
    console.log("**********************************1111");

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

}

