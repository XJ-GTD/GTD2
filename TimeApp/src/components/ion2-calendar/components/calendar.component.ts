import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Provider, ViewChild, ChangeDetectorRef
} from '@angular/core';

import {
  CalendarMonth, CalendarModalOptions, CalendarComponentOptions, CalendarDay,
  CalendarComponentPayloadTypes, CalendarComponentMonthChange, CalendarComponentTypeProperty, DayConfig
} from '../calendar.model'
import {IonCalendarService} from "../services/calendar.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import * as moment from 'moment';
import {defaults, pickModes} from "../config";
import {FeedbackService} from "../../../service/cordova/feedback.service";
import {Card, CardContent, Platform, Slides} from "ionic-angular";
import {CalendarAnimation} from "../calendar-animation";
import {CalendarController} from "../calendar.controller";
import set = Reflect.set;
import Swiper, {SwiperEvent} from "swiper";
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
          <div float-left>
            <div float-left (click)="switchView()">
              <p><b [class.thisM]="_thisMonth">{{_showMonth}}</b>
                <ion-icon class="arrow-dropdown"
                          [name]="_view ? 'md-arrow-dropdown' : 'md-arrow-dropright'"
                          [class.thisM]="_thisMonth"></ion-icon>
              </p>

            </div>
          </div>
          <div float-right (click)="gotoToday()">
            <img src="./assets/imgs/fhby.png"/>
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
            <div *ngFor="let monthOpt of monthOpts" class="swiper-slide">
              <div class="yearshow">{{monthOpt.original.year}}</div>
              <ion-calendar-week color="transparent">
              </ion-calendar-week>
              <ion-calendar-month class="component-mode"
                                  [month]="monthOpt"
                                  [readonly]="readonly"
                                  (onSelect)="select($event)"
                                  (onPress)="onPress.emit($event)">

              </ion-calendar-month>
            </div>
          </div>

        </div>
      </ion-card-content>

    </ion-card>


  `
})
export class CalendarComponent implements OnInit {





  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: boolean = true
  _showMonth;
  _thisMonth: boolean;
  swiper:Swiper;
  //swiper:any;

  change4emit:boolean = true;

  calendarAnimation: CalendarAnimation;

  monthOpts: Array<CalendarMonth> = new Array<CalendarMonth>();
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


  constructor(public calSvc: IonCalendarService, public feekback: FeedbackService, private plt: Platform,
    public changeDetectorRef:ChangeDetectorRef,private emitService:EmitService) {

  }

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
  }

  select($event: CalendarDay) {
    this.onSelect.emit($event)
  }

  slidePrevEnd(){

      let firstmonth:CalendarMonth = this.monthOpts[0];

      let time  = moment(firstmonth.original.time).subtract(1, 'months').valueOf();
      let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
      this.monthOpts.pop();
      this.monthOpts.unshift(months[0]);
      //不影响编译
      // this.swiper.setTransition(10);
     // this.swiper.setTranslate(this.swiper.translate - window.innerWidth);

  }


  slideNextEnd(){


      let lastmonth:CalendarMonth = this.monthOpts[2];

      let month_len:number = this.monthOpts.length;
      let time  = moment(lastmonth.original.time).add(1, 'months').valueOf();
      let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
      this.monthOpts.shift();
      this.monthOpts.push(months[0]);
    // this.swiper.setTransition(10);
    // this.swiper.setTranslate(this.swiper.translate + window.innerWidth);



  }

  slideChanged($event: Slides) {
    this.feekback.audioTrans();
    let monthOpt = this.monthOpts[2];
    let monthTime;

    if (!monthOpt) return;
    this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
    this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();

    if ($event.swipeDirection == "next") {
      let lastmonth:CalendarMonth = this.monthOpts[this.monthOpts.length - 1]

      let month_len:number = this.monthOpts.length;
        let time =  monthTime = moment(lastmonth.original.time).add(1, 'months').valueOf();
        let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
        this.monthOpts.push(months[0]);
        this.monthOpts.shift();

    } else if ($event.swipeDirection == "prev") {

      let firstmonth:CalendarMonth = this.monthOpts[0];

        let time =  monthTime = moment(firstmonth.original.time).subtract(1, 'months').valueOf();
        let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
        this.monthOpts.unshift(months[0]);
        this.monthOpts.pop();

        //this.slides.slideNext(0,false);
        //this.slides.update();

    }

    this.calSvc.getMonthData(monthOpt);

  }


  closeMonth() {
    this.calendarAnimation.closeView(() => {
      this.changestat();
    }, true);
  }

  changestat() {
    this._view = !this._view;
    this.viewShow.emit(this._view);
  }

  openMonth() {
    this.calendarAnimation.openView(() => {
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
    this.initMonthData();
  }


  ngAfterViewInit() {

    setTimeout(()=>{
      if (!this.calendarAnimation) {
        this.calendarAnimation = CalendarController.create(this, this.plt);
      }

    },1000);

    this.swiper  = new Swiper('.swiper-container', {
      autoHeight: true, //高度随内容变化
      initialSlide:1
    });


    this.swiperover4data(1);

    this.swiper.on("slideNextTransitionEnd", ()=>{
      this.slideNextEnd();
      this.swiper.activeIndex = this.swiper.activeIndex -1;
      this.swiperover4data(this.swiper.activeIndex);

    });

    this.swiper.on("slidePrevTransitionEnd", ()=>{

      this.slidePrevEnd();
      this.swiper.activeIndex = this.swiper.activeIndex  + 1;
      this.swiperover4data(this.swiper.activeIndex);


      // this.changeDetectorRef.markForCheck();
      // this.changeDetectorRef.detectChanges();
      // this.swiper.updateSlides();
    });

    this.swiper.on("slideNextTransitionStart", ()=> {

      this.feekback.audioTrans();

    });

    this.swiper.on("slidePrevTransitionStart", ()=> {
      this.feekback.audioTrans();
    });



    //
    // this.swiper  = new Swiper('.swiper-container');

    // this.swiper.on("slideNextTransitionEnd", ()=>{
    //   this.slideNextEnd();
    // });
    //



    // this.swiper.slideTo(2 ,500,false);


    this.emitService.register("list.change.month",($data)=>{
      if ($data =="next"){
        this.change4emit = false;
        this.swiper.slideNext(100,true);

      }
      if ($data =="prev"){
        this.change4emit = false;
        this.swiper.slidePrev(100,true);
      }

    });

  }

  swiperover4data(index:number){

    this.swiper.update();
    this.swiper.updateSlidesClasses();

    let monthOpt = this.monthOpts[index];

    if (!monthOpt) return;
    this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
    this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();
    this.calSvc.getMonthData(monthOpt);

    if (this.change4emit)
      this.emitService.emit("calendar.change.month",moment(monthOpt.original.time).format("YYYYMM"));

    this.change4emit = true;

    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }

  initMonthData() {

    let time = moment().valueOf();

    time = moment().subtract( 1,"months").valueOf();

    let months:Array<CalendarMonth> = this.calSvc.createMonthsByPeriod(time,  3, this._d);
    months.forEach((v)=>{
      this.monthOpts.push(v);
    })
  }


  // canNext(): boolean {
  //   if (!this._d.to) return true;
  //   return this.monthOpt.original.time < moment(this._d.to).valueOf();
  // }
  // canBack(): boolean {
  //   if (!this._d.from) return true;
  //   return this.monthOpt.original.time > moment(this._d.from).valueOf();
  // }


  private initOpt(): void {
    this._d = this.calSvc.safeOpt(this._options || {});
  }


  gotoToday() {
    let year = moment().year();
    let month = moment().month();
    let index = this.monthOpts.findIndex((value, index, arr)=>{
      return value.original.year == year && value.original.month == month;
    });
    this.swiper.slideTo(index,500,true);
  }
}
