import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {Content, MenuController, ModalController, ScrollEvent,} from 'ionic-angular';
import {TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DayActivityData, MonthActivityData} from "../../service/business/calendar.service";
import {PageDirection} from "../../data.enum";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tdl',
  template:
      `
    <!--<div class="header-set">-->
    <!--<div class="daynav">-->
    <!--<div class="dayheader">-->

    <!--<div class="d-fsize text-center">{{headerDate | formatedate :"CWEEK"}}</div>-->
    <!--<div class="ym-fsize text-center ">{{headerDate | formatedate:"DD"}}</div>-->
    <!--&lt;!&ndash;<div class="ys-fsize text-center " *ngFor="let jt of headerData.jtl" (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>&ndash;&gt;-->
    <!--</div>-->
    <!--<div class="d-title text-center ">-->
    <!--<div class="first d-title-chr">日记</div>-->
    <!--<div class=" d-title-chr">10条日程</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <ion-content #contentD>
      <ion-grid #grid4Hight>
        <ng-template ngFor let-monthActivityData [ngForOf]="monthActivityDatas">
          <ion-row class="dayagenda-month" [class.month7]="true" >
            <p>
              {{monthActivityData.month  | formatedate :"CYYYY/MM/ND"}}
            </p>
            <p>
              感知天气冷暖我们生来便会，感知人情冷暖还要慢慢体会。
            </p>
          </ion-row>
          <ion-row>
            <ion-grid>
              <ng-template ngFor let-days [ngForOf]="monthActivityData.lsdays">
                <ion-row class="dayagenda-week"  *ngIf="(days.day | formatedate:'DWEEK') == '7'">
                  <p>
                    {{days.day | formatedate :"CYYYY/MM/DD"}}-{{days.day | formatedate :"ADD7CYYYY/MM/DD"}}
                  </p>
                </ion-row>
                <ng-template [ngIf]="days.events.length > 0 || days.calendaritems.length > 0 || days.memos.length > 0 "
                             [ngIfElse]="noscd">
                  <ion-row class="anch" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                    <div class="daynav">
                      <div class="dayheader">

                        <div class="d-fsize text-center">{{days.day | formatedate :"CWEEK"}}</div>
                        <div class="ym-fsize text-center ">{{days.day | formatedate:"DD"}}</div>
                        <div class="ys-fsize text-center " *ngFor="let jt of days.calendaritems"
                             (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>
                      </div>
                      <div class="d-title text-center ">
                        <div class="first d-title-chr">日记</div>
                        <div class=" d-title-chr">{{days.events.length}}条日程</div>
                        <div class=" d-title-chr">{{days.calendaritems.length}}条日历项</div>
                        <div class=" d-title-chr">{{days.memos.length}}条日记</div>
                      </div>
                    </div>
                    <ion-grid>
                      <ion-row *ngFor="let event of days.events;" (click)="toDetail(event.evi,event.evd,event.gs)">
                        <div class="dayagenda-content">
                          <div class="agendaline2">
                            <div class="agenda-icon">
                              <div class="icon icon1"></div>
                              <div class="icon icon2"></div>
                            </div>
                            <div class="agenda-sn">{{event.evn}}</div>
                          </div>
                          <div class="agendaline1">
                            <div class="agenda-st">{{this.util.adStrShow("09:00")}}</div>
                            <!--<div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}"></div>-->

                            <!--<ion-chip *ngIf="scd.gs == '1'" >-->
                            <!--<ion-avatar>-->
                            <!--<img src="{{scd.fs.bhiu}}"/>-->
                            <!--</ion-avatar>-->
                            <!--<ion-label [class.newMessage]="scd.du != '0'">{{scd.fs.ran}}</ion-label>-->
                            <!--</ion-chip>-->
                          </div>
                        </div>
                      </ion-row>
                    </ion-grid>
                  </ion-row>
                </ng-template>
                <ng-template #noscd>
                  <ion-row class="anch dayagenda-none-display" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                    <div class="dayagenda-no-content " (click)="toAdd(days.day)">
                      <p>{{days.day | formatedate :"CYYYY/MM/DD"}}</p>
                    </div>
                  </ion-row>
                </ng-template>
              </ng-template>
            </ion-grid>
          </ion-row>
        </ng-template>
      </ion-grid>
    </ion-content>
  `


})
export class TdlPage {

  @ViewChild('contentD') contentD: Content;
  @ViewChild('grid4Hight') grid: ElementRef;


  //取底部数据
  gridHight: number = 0;
  gridHightsub: number = 0;

  // isgetData: boolean = false;
  //头部显示日期
  headerDate: string;
  headerMoment: moment.Moment;


  //画面数据List
  monthActivityDatas: Array<MonthActivityData> = new Array<MonthActivityData>();


  constructor(private tdlServ: TdlService,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private emitService: EmitService,
              private el: ElementRef,
              private util: UtilService,
              private feedback: FeedbackService,
              private renderer2: Renderer2,
  ) {
  }

  ngOnInit() {

    //this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {
      this.gotoEl(selectDate.format("YYYYMMDD"));

      // this.createData(selectDate, 0, 0).then(data => {
      //   // this.scdlDataList.push(...data);
      //
      //   // this.isgetData = !this.isgetData;
      //
      //   this.gotoEl(selectDate.format("YYYYMMDD"));
      // }).catch(error => {
      //   // this.isgetData = !this.isgetData;
      // });
    });



    // this.emitService.registerRef((data) => {
    //   this.createData(this.headerMoment, 0, 0).then(data => {
    //     this.scdlDataList.push(...data);
    //
    //     this.isgetData = !this.isgetData;
    //
    //     this.gotoEl(this.headerMoment.format("YYYYMMDD"));
    //   }).catch(error => {
    //     this.isgetData = !this.isgetData;
    //   });
    // })


    this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {

      if ($event.directionY == 'up') {
        if ($event.scrollTop < 10) {
          this.tdlServ.throughData(PageDirection.PageDown);
        }
      }

      if ($event.directionY == 'down') {
        if ($event.scrollTop == this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {
          this.tdlServ.throughData(PageDirection.PageUp);
        }
      }
    });
    this.tdlServ.initLsData().then(data => {
      setTimeout(() => {
        for(let ss of data){
          ss.days.forEach((v,k,m)=>{
            ss.lsdays.push(v);
          })
        }
        this.monthActivityDatas = data;
      },500)
    })
  }


  currDayel: any;

  gotoEl(id) {
    setTimeout(() => {
      try {
        if (this.currDayel) {
          this.renderer2.removeClass(this.currDayel, "dayagenda-display");
          this.renderer2.addClass(this.currDayel, "dayagenda-none-display");
        }
        this.currDayel = this.el.nativeElement.querySelector("#day" + id);
        this.renderer2.removeClass(this.currDayel, "dayagenda-none-display");
        this.renderer2.addClass(this.currDayel, "dayagenda-display");

        this.headerDate = moment(id).format("YYYY/MM/DD");
        this.headerMoment = moment(id);
        if (this.currDayel) {
          this.gridHight = this.grid.nativeElement.clientHeight;
          this.contentD.scrollTo(0, this.currDayel.offsetTop + 2, 0).then(datza => {
            this.gridHight = this.grid.nativeElement.clientHeight;
          })
        } else {
          this.gotoEl(id);
        }
      } catch (e) {
      }

    }, 100);
  }

  toDetail(si, d, gs) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = si;
    p.d = moment(d);
    p.gs = gs;

    this.feedback.audioClick();
    if (gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }

  }

  toAdd(d) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = moment(d);
    this.feedback.audioClick();
    this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, p).present();
  }

}
