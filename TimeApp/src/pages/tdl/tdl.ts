import {ChangeDetectorRef, Component, ElementRef, Renderer, Renderer2, ViewChild} from '@angular/core';
import {
  Content, DomController,
  GestureController, IonicPage,
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
@IonicPage()
@Component({
  selector: 'page-tdl',
  template:
      `
    <!--<div class="header-set">-->
    <!--<div class="daynav">-->
    <!--<div class="dayheader">-->

    <!--<div class="d-fsize ">{{headerDate | formatedate :"CWEEK"}}</div>-->
    <!--<div class="ym-fsize  ">{{headerDate | formatedate:"DD"}}</div>-->
    <!--&lt;!&ndash;<div class="ys-fsize  " *ngFor="let jt of headerData.jtl" (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>&ndash;&gt;-->
    <!--</div>-->
    <!--<div class="d-title  ">-->
    <!--<div class="first d-title-chr">日记</div>-->
    <!--<div class=" d-title-chr">10条日程</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--<div class=" d-title-chr">10条任务</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    
    <ion-content #contentD>
      <ion-grid #grid4Hight class = "list-grid-content">
        <ng-template ngFor let-monthActivityData [ngForOf]="monthActivityDatas" >
          <ion-row class="item-content dayagenda-month {{monthActivityData.month  | formatedate :'CSSMM'}}" id="month{{monthActivityData.month | formatedate:'YYYYMM'}}">
            <div class="line">
                <p class="month-a font-large">
                  {{monthActivityData.month  | formatedate :"CYYYY/MM/ND"}}
                </p>
            </div>
            <div class="line font-normal">
              <p class="month-b">
                感知天气冷暖我们生来便会，感知人情冷暖还要慢慢体会。
              </p>
            </div>
          </ion-row>
          <ng-template ngFor let-days [ngForOf]="monthActivityData.arraydays">
            <ion-row class="item-content dayagenda-week" *ngIf="(days.day | formatedate:'DWEEK') == '7'">
              <div class="line">
                <p>
                  {{days.day | formatedate :"CYYYY/MM/DD"}}-{{days.day | formatedate :"ADD7CYYYY/MM/DD"}}
                </p>
              </div>
            </ion-row>
            <ng-template [ngIf]="days.events.length > 0 || days.calendaritems.length > 0 || days.memos.length > 0 "
                         [ngIfElse]="noscd">
              <ion-row class="item-content dayagenda-nav" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                <div class="line">
                  <div class="dayheader">
                    <div class="d-fsize">{{days.day | formatedate :"CWEEK"}}</div>
                    <div class="ym-fsize">{{days.day | formatedate:"DD"}}</div>
                    <div class="ys-fsize">{{days.day | formatedate:"CMM"}}</div>
                  </div>
                  <div class="d-title  ">
                    <div class="d-title-chr" >{{this.util.lunar4str(days.day,"D")}}</div>
                    <div class=" d-title-chr"><span>{{days.events.length}}</span> 活动</div>
                    <div class=" d-title-chr"><span>{{days.calendaritems.length}}</span> 纪念日</div>
                    <div class=" d-title-chr mome " (click)="toMemo(days)" *ngIf="days.memos.length > 0" [class.item-no-display]="days.memos.length == 0"><span>{{days.events.length}}</span>备忘</div>               
                  </div>
                </div>
              </ion-row>
              
              <ion-row class="item-content  calendaritem-content item-content-backgroud" *ngFor="let jt of days.calendaritems;" (click)="toPlanItem(jt)">
                <div class="line font-small">
                  <div class="icon">
                    <ion-icon class = "fal fa-gift"></ion-icon>
                  </div>
                  <div class="sn">{{jt.jtn}}</div>                 
                </div>
                <div class="line font-small">
                  <div class="icon">
                    <ion-icon class = "fal fa-user-tag"></ion-icon>
                  </div>
                  <div class="person ">--来自小仙女</div>
                  <div class="invite" end><span>接受</span><span>拒绝</span></div>
                  
                </div>
              </ion-row>
              <ion-row class="item-content dayagenda-content item-content-backgroud" *ngFor="let event of days.events;" (click)="toDetail(event.evi,event.evd,event.gs)">
                  <div class="line font-small">
                    <div class="icon">
                      <ion-icon class = "fal fa-calendar-star"></ion-icon>
                    </div>
                    <div class="sn">{{event.evn}}</div>
                  </div>
                  <div class="line font-small">
                    <div class="icon">
                      <ion-icon class = "fal fa-alarm-exclamation "></ion-icon>
                    </div>
                    <div class="st">{{event.evt}}</div>
                  </div>
                  <div class="line font-small">
                    <div class="icon ">
                      <ion-icon class = "user-o fal fa-user-tag"></ion-icon>
                    </div>
                    <div class="person">--来自小仙女</div>
                    <div class="invite" end><span>接受</span><span>拒绝</span></div>
                  </div>
              </ion-row>
              
            </ng-template>
            
            <ng-template #noscd>
              <ion-row class="item-content no-content item-no-display" id="day{{days.day | formatedate:'YYYYMMDD'}}">
                <div class="line" (click)="toAdd(days.day)">
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



   isgetData: boolean = false;
   loopmonth = false;
   canscroll:boolean = false;

  listmonth:moment.Moment = moment(moment().format("YYYYMM") + "01");

  _gesture: TdlGesture;


  currDayel: any;


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
    this.canscroll = scroll;
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


  ngAfterViewInit() {
    this.tdlServ.initLsData().then(data => {
      this.monthActivityDatas = data;
      this.gotoEl("#day" + moment().format("YYYYMMDD"));
    });

    // this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {
      this.gotoEl("#day" + selectDate.format("YYYYMMDD"));

    });

    this.emitService.register("calendar.change.month",($data)=>{
      this.gotoEl4month("#month" + $data);
      this.listmonth = moment($data + "01");
    });
    setTimeout(()=>{

      this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {
        try{

          if (!$event) return;

          //显示当前顶部滑动日期
          if (!this.loopmonth){
            this.loopmonth = !this.loopmonth;
            setTimeout(()=>{
              for (let i = this.monthActivityDatas.length -1; i >= 0; i-- ) {
                //let monthActivityData = this.monthActivityDatas[0];
                let monobj = moment(this.monthActivityDatas[i].month +"/01");
                let key = "#month" + monobj.format("YYYYMM");
                let el = this.el.nativeElement.querySelector(key);
                // if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
                if (el && $event.scrollTop - el.offsetTop > 0) {
                  //this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
                  //this.headerMoment = moment(scdlData.d);
                  //this.feedback.audioTrans();
                  this.loopmonth = !this.loopmonth;

                  //准备发出emit
                  if (this.canscroll){
                    if (this.listmonth.isBefore(monobj)){
                      this.emitService.emit("list.change.month","next");
                    }
                    if (this.listmonth.isAfter(monobj)){
                      this.emitService.emit("list.change.month","prev");
                    }

                  }
                  this.listmonth = monobj;
                  break;
                }
              }

            },500);

          }

          if (this.isgetData) return;

          if ($event.directionY == 'up') {
            if ($event.scrollTop < 1000) {
              this.isgetData  = !this.isgetData;
              //this.setScroll(false);
              // let monthActivityData = this.monthActivityDatas[0];
              // let scdId = monthActivityData.month;
              //  scdId = "#month" + moment(scdId+"/01").format("YYYYMM");
              //  this.gotoEl4month(scdId);
              // this.renderer2.setStyle(this.contentD._scrollContent.nativeElement, "overflow-y", "hidden");

              // this.tdlServ.throughData(PageDirection.PageDown).then(data => {
              //   //this.gotoEl4month(scdId);
              //   this.changeDetectorRef.markForCheck();
              //   this.changeDetectorRef.detectChanges();
              //   // setTimeout(()=>{
              //
              //   // this.setScroll(false);
              //   // this.isgetData  = !this.isgetData;
              //   // },200);
              // })
              this.tdlServ.throughData(PageDirection.PageDown).then(data => {
                // this.gotoEl4month(scdId);

                this.isgetData  = !this.isgetData;
                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
                // setTimeout(()=>{

                // this.setScroll(false);
                // this.isgetData  = !this.isgetData;
                // },200);
              })
            }
          }

          if ($event.directionY == 'down') {
            if ($event.scrollTop + 300 > this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {
              this.isgetData  = !this.isgetData;

              this.tdlServ.throughData(PageDirection.PageUp).then(data=>{

                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();
                this.isgetData  = !this.isgetData;
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
    },2000);
  }

  gotoEl(id) {
    setTimeout(() => {
      try {
        if (this.currDayel && this.currDayel.className.indexOf("ayagenda-no-content") > -1) {
          this.renderer2.removeClass(this.currDayel, "item-display");
          this.renderer2.addClass(this.currDayel, "item-no-display");
        }
        this.currDayel = this.el.nativeElement.querySelector(id);
        console.log(this.currDayel.className);
        this.renderer2.removeClass(this.currDayel, "item-no-display");
        this.renderer2.addClass(this.currDayel, "item-display");

        if (this.currDayel) {
          this.contentD.scrollTo(0, this.currDayel.offsetTop + 2, 300);
        } else {
          this.gotoEl(id);
        }
      } catch (e) {
      }

    }, 200);
  }

  gotoEl4month(id) {
      setTimeout(()=>{
        try{
        let currmonthel = this.el.nativeElement.querySelector(id);

        if (currmonthel) {
          this.contentD.scrollTo(0, currmonthel.offsetTop + 2, 300);
        } else {
          this.gotoEl4month(id);
        }
      } catch (e) {
      console.log(e)
    }
      },200);

  }

  toMemo(day) {
    this.modalCtr.create(DataConfig.PAGE._DAILYMEMOS_PAGE, day).present();
  }

  toPlanItem(item) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.si = item.jti;

    this.modalCtr.create(DataConfig.PAGE._COMMEMORATIONDAY_PAGE, p).present();
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
