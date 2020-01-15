import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Provider, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';

import {
  CalendarMonth, CalendarModalOptions, CalendarComponentOptions, CalendarDay,
  CalendarComponentPayloadTypes, CalendarComponentMonthChange, CalendarComponentTypeProperty
} from '../calendar.model'
import {IonCalendarService} from "../services/calendar.service";
import { NG_VALUE_ACCESSOR} from '@angular/forms';

import * as moment from 'moment';
import {defaults} from "../config";
import {FeedbackService} from "../../../service/cordova/feedback.service";
import {Card, CardContent, Platform,} from "ionic-angular";
import {CalendarAnimation} from "../calendar-animation";
import {CalendarController} from "../calendar.controller";
import Swiper from "swiper";
import {EmitService} from "../../../service/util-service/emit.service";

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR],
  template: `
    <ion-card #monthcompent no-padding>
      <ion-card-header no-padding>

        <div class="title">
            <div float-left (click)="switchView()">
              <p><b [class.thisM]="_thisMonth">{{_showMonth}}</b>
              <b [class.thisM]="_thisMonth" class="font-normal animated flash" *ngIf = "_showYear">{{_showYear}}</b>
                <ion-icon class="arrow-dropdown"
                          [name]="_view ? 'md-arrow-dropdown' : 'md-arrow-dropright'"
                          [class.thisM]="_thisMonth"></ion-icon>
              </p>

            </div>
          <div class="tool" float-right>
            <div float-right (click)="gotoToday()">
              <ion-icon class="fal fa-calendar-day"></ion-icon>
            </div>
            <!--<div float-right (click)="newAgenda()">-->
              <!--<ion-icon class="fal fa-calendar-edit"></ion-icon>-->
            <!--</div>-->
            <!--<div float-right (click)="newMome()">-->
              <!--<ion-icon class="fal fa-file-signature"></ion-icon>-->
            <!--</div>-->
            <!--<div float-right (click)="newDay()">-->
              <!--<ion-icon class="fal fa-calendar-exclamation"></ion-icon>-->
            <!--</div>-->
            <!--<div float-right (click)="todoList()">-->
              <!--<ion-icon class="far fa-list"></ion-icon>-->
            <!--</div>-->
            <!--<div float-right (click)="aTDay()">-->
              <!--<ion-icon class="far fa-paperclip"></ion-icon>-->
            <!--</div>-->

          </div>
        </div>
      </ion-card-header>
      <ion-card-content>
        <!--<ion-slides (ionSlideWillChange)="slideChanged($event)" (ionSlidePrevStart)="ionSlidePrevStart()" (ionSlidePrevEnd)="ionSlidePrevEnd()" (ionSlideProgress)="ionSlideProgress()">-->
        <!--<ion-slide *ngFor="let monthOpt of monthOpts">-->
        <!--<div class="yearshow">{{monthOpt.original.year}}</div>-->
        <!--<ion-calendar-week color="transparent">-->
        <!--</ion-calendar-week>-->
        <!--<ion-calendar-month class="component-mode"-->
        <!--[month]="monthOpt"-->
        <!--[readonly]="readonly"-->
        <!--(onSelect)="select($event)"-->
        <!--(onPress)="onPress.emit($event)">-->

        <!--</ion-calendar-month>-->
        <!--</ion-slide>-->
        <!--</ion-slides>-->
        <div class="swiper-container">

          <div class="swiper-wrapper">
            <div *ngFor="let warp of monthOptsWarp" class="swiper-slide">
              <div class="yearshow">{{warp.opts.original.year}}</div>
              <ion-calendar-week color="transparent">
              </ion-calendar-week>
              <ion-calendar-month class="component-mode"
                                  [month]="warp.opts"
                                  [readonly]="readonly"
                                  (onSelect)="select($event)"
                                  (onPress)="onPress.emit($event)">

              </ion-calendar-month>
            </div>
          </div>

        </div>
      </ion-card-content>

    </ion-card>


  `,

  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {


  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: boolean = true
  _showMonth;
  _showYear;
   _thisMonth: boolean;
  swiper: Swiper;
  //swiper:any;

  change4emit: boolean = true;

  calendarAnimation: CalendarAnimation;

  selectedCalendarDay: CalendarDay;

  monthOptsWarp: Array<any> = new Array<any>();

  // monthOpts: Array<CalendarMonth> = new Array<CalendarMonth>();
  @ViewChild(Card)
  card: Card;
  @ViewChild(CardContent)
  cardContent: CardContent

  // @ViewChild(Slides)
  // slides: Slides;


  @Input() format: string = defaults.DATE_FORMAT;
  @Input() type: CalendarComponentTypeProperty = 'string';
  @Input() readonly = false;
  @Output() onChange: EventEmitter<CalendarComponentPayloadTypes> = new EventEmitter();
  @Output() monthChange: EventEmitter<CalendarComponentMonthChange> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPress: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() viewShow: EventEmitter<boolean> = new EventEmitter();

  //功能
  @Output() onNewAgenda: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onNewMome: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onTodoList: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onNewDay: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onATDay: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onGotoToday: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPlus: EventEmitter<CalendarDay> = new EventEmitter();


  constructor(public calSvc: IonCalendarService, private plt: Platform,
              public changeDetectorRef: ChangeDetectorRef, private emitService: EmitService) {

  }

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
  }

  select($event: CalendarDay) {
    this.selectedCalendarDay = $event;
    this.onSelect.emit($event)
  }


  // slideChanged($event: Slides) {
  //   this.feekback.audioTrans();
  //   let monthOpt = this.monthOpts[2];
  //   let monthTime;
  //
  //   if (!monthOpt) return;
  //   this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
  //   this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();
  //
  //   if ($event.swipeDirection == "next") {
  //     let lastmonth:CalendarMonth = this.monthOpts[this.monthOpts.length - 1]
  //
  //     let month_len:number = this.monthOpts.length;
  //       let time =  monthTime = moment(lastmonth.original.time).add(1, 'months').valueOf();
  //       let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
  //       this.monthOpts.push(months[0]);
  //       this.monthOpts.shift();
  //
  //   } else if ($event.swipeDirection == "prev") {
  //
  //     let firstmonth:CalendarMonth = this.monthOpts[0];
  //
  //       let time =  monthTime = moment(firstmonth.original.time).subtract(1, 'months').valueOf();
  //       let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
  //       this.monthOpts.unshift(months[0]);
  //       this.monthOpts.pop();
  //
  //       //this.slides.slideNext(0,false);
  //       //this.slides.update();
  //
  //   }
  //
  //   this.calSvc.getMonthData(monthOpt);
  //
  // }


  closeMonth() {
    this.calendarAnimation.closeView(() => {
      this._showYear = "";
      this.changestat();
    }, true);
  }

  changestat() {
    this._view = !this._view;
    this.viewShow.emit(this._view);
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  openMonth() {
    this.calendarAnimation.openView(() => {
      this._showYear = "";
      this.changestat();
    }, true);
  }


  get options(): CalendarComponentOptions {
    return this._options;
  }


  switchView(): void {
    if (this._view) {
      this.closeMonth();
    } else {
      this.openMonth();
    }
  }

  ngOnInit(): void {
    this.initOpt();


    let time = moment().subtract(1, "months").valueOf();

    let months: Array<CalendarMonth> = this.calSvc.createMonthsByPeriod(time, 3, this._d);
    months.forEach((v) => {

      let warp: any = {};
      warp.opts = v;
      this.monthOptsWarp.push(warp)
      // this.monthOpts.push(v);
    });
  }


  ngAfterViewInit() {

    setTimeout(() => {
      if (!this.calendarAnimation) {
        this.calendarAnimation = CalendarController.create(this, this.plt);
      }

    }, 1000);

    this.swiper = new Swiper('.swiper-container', {
      autoHeight: true, //高度随内容变化
      touchMoveStopPropagation:true,
      // initialSlide:1,
    });


    this.gotoToday();


    this.swiper.on("slideNextTransitionEnd", () => {
      this.slideNextEnd();
    });

    this.swiper.on("slidePrevTransitionEnd", () => {
      this.slidePrevEnd();
    });
  }

  slidePrevEnd() {

    // this.feekback.audioTrans();

    let firstmonth: CalendarMonth = this.monthOptsWarp[0].opts;

    let time = moment(firstmonth.original.time).subtract(1, 'months').valueOf();
    let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
    this.monthOptsWarp[2].opts = this.monthOptsWarp[1].opts;
    this.monthOptsWarp[1].opts = this.monthOptsWarp[0].opts;
    this.monthOptsWarp[0].opts = months[0];
    this.swiperover4data(1,"prev");

  }


  slideNextEnd() {


    // this.feekback.audioTrans();

    let lastmonth: CalendarMonth = this.monthOptsWarp[2].opts;
    let time = moment(lastmonth.original.time).add(1, 'months').valueOf();
    let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
    // this.monthOpts.shift();
    this.monthOptsWarp[0].opts = this.monthOptsWarp[1].opts;
    this.monthOptsWarp[1].opts = this.monthOptsWarp[2].opts;
    this.monthOptsWarp[2].opts = months[0];

    this.swiperover4data(1,"next");


  }


  swiperover4data(index: number,option:string, gototoday: boolean = false) {
    let monthOpt = this.monthOptsWarp[index].opts;

    if (!monthOpt) return;
    this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
    // this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();
    this.calSvc.getMonthData(monthOpt).then(()=>{
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    })

    // if (this.change4emit && !gototoday)
    // if ( !gototoday)
      this.emitService.emit("calendar.change.month",{month:moment(monthOpt.original.time).format("YYYYMM"),option:option});

    if (gototoday)
      this.emitService.emitSelectDate(moment());

    // this.change4emit = true;

    if (this.swiper) {
      this.swiper.slideTo(index, 0, false);
    }
    this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();
  }

  private initOpt(): void {
    this._d = this.calSvc.safeOpt(this._options || {});
  }


  gotoToday() {
    // this.feekback.audioTrans();

    let time = moment().subtract(1, "months").valueOf();

    let months: Array<CalendarMonth> = this.calSvc.createMonthsByPeriod(time, 3, this._d);
    // this.monthOpts.shift();
    this.monthOptsWarp[0].opts = months[0];
    this.monthOptsWarp[1].opts = months[1];
    this.monthOptsWarp[2].opts = months[2];
    this.swiperover4data(1, "today",true);
    IonCalendarService.selecttime = moment(moment().format("YYYY-MM-DD")).valueOf();
    this.onGotoToday.emit(this.selectedCalendarDay);
  }

  newAgenda() {
    this.onNewAgenda.emit(this.selectedCalendarDay);
  }

  newMome() {
    this.onNewMome.emit(this.selectedCalendarDay);
  }

  todoList() {
    this.onTodoList.emit(this.selectedCalendarDay);
  }

  newDay() {
    this.onNewDay.emit(this.selectedCalendarDay);
  }

  aTDay() {
    this.onATDay.emit(this.selectedCalendarDay);
  }

  plus() {
    this.onPlus.emit(this.selectedCalendarDay);
  }


}
