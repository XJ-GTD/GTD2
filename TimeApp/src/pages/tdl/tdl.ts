import {ChangeDetectorRef, Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import {
  Content, DomController,
  GestureController,
  MenuController,
  ModalController,
  Platform,
  ScrollEvent,
} from 'ionic-angular';
import {TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {DayActivityData, MonthActivityData} from "../../service/business/calendar.service";
import {PageDirection} from "../../data.enum";
import {TdlGesture} from "./tdl-gestures";
import {CalendarComponent} from "../../components/ion2-calendar";

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
      <ion-grid #grid4Hight class = "list-contont">
        <ng-template ngFor let-monthActivityData [ngForOf]="monthActivityDatas" >
          
          <ion-row class="list-dayagenda-month" id="month{{monthActivityData.month | formatedate:'YYYYMM'}}">
                <div class="back {{monthActivityData.month  | formatedate :'CSSMM'}}" >
                <p class="month-a">
                 
                  {{monthActivityData.month  | formatedate :"CYYYY/MM/ND"}}
                </p>
                <p class="month-b">
                  感知天气冷暖我们生来便会，感知人情冷暖还要慢慢体会。
                </p>
                </div>
          </ion-row>
          <ng-template ngFor let-days [ngForOf]="monthActivityData.arraydays">
            <ion-row class="list-dayagenda-week" *ngIf="(days.day | formatedate:'DWEEK') == '7'">
              <p>
                {{days.day | formatedate :"CYYYY/MM/DD"}}-{{days.day | formatedate :"ADD7CYYYY/MM/DD"}}
              </p>
            </ion-row>
            <ng-template [ngIf]="days.events.length > 0 || days.calendaritems.length > 0 || days.memos.length > 0 "
                         [ngIfElse]="noscd">
              <ion-row class="list-dayagenda-nav" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                  <div class="dayheader">

                    <div class="d-fsize text-center">{{days.day | formatedate :"CWEEK"}}</div>
                    <div class="ym-fsize text-center ">{{days.day | formatedate:"DD"}}</div>
                    <div class="ys-fsize text-center ">{{days.day | formatedate:"CMM"}}</div>
                  </div>
                  <div class="d-title text-center ">
                    <div class="first d-title-chr">日记</div>
                    <div class=" d-title-chr">
                      <span class="daycoment">{{this.util.lunar4str(days.day,"D")}}</span>
                      <span class="daycoment" *ngFor="let jt of days.calendaritems">{{jt.jtn}}</span>
                    </div>
                    <div class=" d-title-chr last"><span>{{days.events.length}}</span> 活动</div>
                  </div>
              </ion-row>
              <ion-row class="list-dayagenda-content" *ngFor="let event of days.events;" (click)="toDetail(event.evi,event.evd,event.gs)">

                  <div class="agendaline">
                    <div class="agenda-icon">
                      <ion-icon class = "tasks fa fa-tasks"></ion-icon>
                    </div>
                    <div class="agenda-sn">{{event.evn}}</div>
                  </div>
                  <div class="agendaline">
                    <div class="agenda-icon">
                      <ion-icon class = "tasks fa fa-clock-o clock-o "></ion-icon>
                    </div>
                    <div class="agenda-st">{{this.util.adStrShow(event.evt)}}</div>
                  </div>
                  <div class="agendaline">
                    <div class="agenda-icon">
                      <ion-icon class = "user-o fa fa-user-o"></ion-icon>
                    </div>
                    <div class="agenda-person">--来自小仙女</div>
                  </div>
              </ion-row>
            </ng-template>
            <ng-template #noscd>
              <ion-row class="dayagenda-no-content item-no-display" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                <div class=" " (click)="toAdd(days.day)">
                  <p>{{days.day | formatedate :"CYYYY/MM/DD"}}</p>
                </div>
              </ion-row>
            </ng-template>
          </ng-template>
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

   isgetData: boolean = false;
   loopmonth = false;
  //头部显示日期
  headerDate: string;
  headerMoment: moment.Moment;

  _gesture: TdlGesture;


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
              private _plt: Platform,
              private _gestureCtrl: GestureController,
              private _domCtrl: DomController,
              public changeDetectorRef:ChangeDetectorRef
  ) {
  }

  getNativeElement(): any {
    return this.contentD._scrollContent.nativeElement;
  }


  setScroll(scroll: boolean) {
    if (scroll) {
      this.renderer2.setStyle(this.contentD._scrollContent.nativeElement, "overflow-y", "auto");
      this._gesture.unlisten();
    } else {
      this.renderer2.setStyle(this.contentD._scrollContent.nativeElement, "overflow-y", "hidden");
      this._gesture.listen();
    }

  }

  regeditCalendar(calda: CalendarComponent) {
    this._gesture = new TdlGesture(this._plt, this, this._gestureCtrl, this._domCtrl, calda);
    this._gesture.listen();
  }

  ngOnInit() {
    this.tdlServ.initLsData().then(data => {
      this.monthActivityDatas = data;
      this.gotoEl("#day" + moment().format("YYYYMMDD"));
    });

    //this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {
      this.gotoEl("#day" + selectDate.format("YYYYMMDD"));
    });


    this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {
      try{

        //显示当前顶部滑动日期
        if (!this.loopmonth){
          this.loopmonth = !this.loopmonth;
          setTimeout(()=>{
            for (let i = this.monthActivityDatas.length -1; i >= 0; i-- ) {
              //let monthActivityData = this.monthActivityDatas[0];
              let scdId = this.monthActivityDatas[i].month;
              scdId = "#month" + moment(scdId+"/01").format("YYYYMM");
              let el = this.el.nativeElement.querySelector(scdId);
              console.log("###" + el);
              // if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
              if (el && $event.scrollTop - el.offsetTop > 0) {
                //this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
                //this.headerMoment = moment(scdlData.d);
                //this.feedback.audioTrans();
                this.loopmonth = !this.loopmonth;
                console.log("###" + scdId);

                //准备发出emit
                //TODO
                break;
              }
            }

          },500);

        }

        if (this.isgetData) return;

        if ($event.directionY == 'up') {
          if ($event.scrollTop < 100) {
            this.isgetData  = !this.isgetData;
            let monthActivityData = this.monthActivityDatas[0];
            let scdId = monthActivityData.month;
             scdId = "#month" + moment(scdId+"/01").format("YYYYMM");

            this.tdlServ.throughData(PageDirection.PageDown).then(data => {
              this.gotoEl4month(scdId);
              this.changeDetectorRef.markForCheck();
              this.changeDetectorRef.detectChanges();
              setTimeout(()=>{
                this.isgetData  = !this.isgetData;
              },200);
            })
          }
        }

        if ($event.directionY == 'down') {
          if ($event.scrollTop + 100 > this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {
            this.isgetData  = !this.isgetData;

            this.tdlServ.throughData(PageDirection.PageUp).then(data=>{

              this.changeDetectorRef.markForCheck();
              this.changeDetectorRef.detectChanges();
              setTimeout(()=>{
                this.isgetData  = !this.isgetData;

              },200);
            })
          }
        }

      }catch (e) {
        console.log(e);

      }

      // //显示当前顶部滑动日期
      // for (let scdlData of this.monthActivityDatas) {
      //   let el = this.el.nativeElement.querySelector("#day" + scdlData.id);
      //   if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
      //     this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
      //     this.headerMoment = moment(scdlData.d);
      //     //this.feedback.audioTrans();
      //     break;
      //   }
      // }

    });
  }


  currDayel: any;

  gotoEl(id) {
    setTimeout(() => {
      try {
        if (this.currDayel) {
          this.renderer2.removeClass(this.currDayel, "item-display");
          this.renderer2.addClass(this.currDayel, "item-no-display");
        }
        this.currDayel = this.el.nativeElement.querySelector(id);
        this.renderer2.removeClass(this.currDayel, "item-no-display");
        this.renderer2.addClass(this.currDayel, "item-display");

        this.headerDate = moment(id).format("YYYY/MM/DD");
        this.headerMoment = moment(id);
        if (this.currDayel) {
          this.gridHight = this.grid.nativeElement.clientHeight;
          this.contentD.scrollTo(0, this.currDayel.offsetTop + 2, 200).then(datza => {
            this.gridHight = this.grid.nativeElement.clientHeight;
          })
        } else {
          this.gotoEl(id);
        }
      } catch (e) {
      }

    }, 100);
  }

  gotoEl4month(id) {
    setTimeout(() => {
      try {
        let currmonthel = this.el.nativeElement.querySelector(id);

        if (currmonthel) {
          this.gridHight = this.grid.nativeElement.clientHeight;
          this.contentD.scrollTo(0, currmonthel.offsetTop + 2, 200).then(datza => {
            this.gridHight = this.grid.nativeElement.clientHeight;
          })
        } else {
          this.gotoEl4month(id);
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
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }

  }

  toAdd(d) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = moment(d);
    this.feedback.audioClick();
    this.modalCtr.create(DataConfig.PAGE._AGENDA_PAGE, p).present();
  }

}
