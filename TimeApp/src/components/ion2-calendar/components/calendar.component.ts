import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Provider, ViewChild
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
        <ion-slides (ionSlideWillChange)="slideChanged($event)" (ionSlidePrevStart)="ionSlidePrevStart()" (ionSlidePrevEnd)="ionSlidePrevEnd()" (ionSlideProgress)="ionSlideProgress()">
          <ion-slide *ngFor="let monthOpt of monthOpts">
            <div class="yearshow">{{monthOpt.original.year}}</div>
            <ion-calendar-week color="transparent">
            </ion-calendar-week>
            <ion-calendar-month class="component-mode"
                                [month]="monthOpt"
                                [readonly]="readonly"
                                (onSelect)="select($event)"
                                (onPress)="onPress.emit($event)">

            </ion-calendar-month>
          </ion-slide>
        </ion-slides>
      </ion-card-content>

    </ion-card>


  `
})
export class CalendarComponent implements OnInit {

  ionSlidePrevStart(ss){
    console.log("ionSlidePrevStart");
  }
  ionSlideProgress(ss){
    console.log("ionSlideProgress");
  }

  ionSlidePrevEnd(ss){
    console.log("ionSlidePrevEnd");
  }


  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: boolean = true
  _showMonth;
  string;
  _thisMonth: boolean;


  calendarAnimation: CalendarAnimation;

  monthOpts: Array<CalendarMonth> = new Array<CalendarMonth>();
  @ViewChild(Card)
  card: Card;
  @ViewChild(CardContent)
  cardContent: CardContent;
  @ViewChild(Slides)
  slides: Slides;


  @Input() format: string = defaults.DATE_FORMAT;
  @Input() type: CalendarComponentTypeProperty = 'string';
  @Input() readonly = false;
  @Output() onChange: EventEmitter<CalendarComponentPayloadTypes> = new EventEmitter();
  @Output() monthChange: EventEmitter<CalendarComponentMonthChange> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPress: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() viewShow: EventEmitter<boolean> = new EventEmitter();


  constructor(public calSvc: IonCalendarService, public feekback: FeedbackService, private plt: Platform) {

  }

  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
  }

  select($event: CalendarDay) {
    this.onSelect.emit($event)
  }

  slideChanged($event: Slides) {
    this.feekback.audioTrans();
    let i = $event.getActiveIndex();
    let monthOpt = this.monthOpts[i];
    let monthTime;

    if (!monthOpt) return;
    this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
    this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();

    if ($event.swipeDirection == "next") {
      let lastmonth:CalendarMonth = this.monthOpts[this.monthOpts.length - 1]

      let month_len:number = this.monthOpts.length;
      if (month_len - i <= 2){
        let time =  monthTime = moment(lastmonth.original.time).add(1, 'months').valueOf();
        let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
        this.monthOpts.push(months[0]);
      }

    } else if ($event.swipeDirection == "prev") {

      let firstmonth:CalendarMonth = this.monthOpts[0];

      if (i <= 2){
        let time =  monthTime = moment(firstmonth.original.time).subtract(1, 'months').valueOf();
        let months = this.calSvc.createMonthsByPeriod(time, 1, this._d);
        this.monthOpts.unshift(months[0]);
        this.slides.slideNext(0,false);
        this.slides.update();

      }

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
    this.gotoToday();
  }

  ngAfterViewInit() {
    setTimeout(()=>{
      if (!this.calendarAnimation) {
        this.calendarAnimation = CalendarController.create(this, this.plt)
      }

    },1000)
  }

  initMonthData() {

    let time = moment().valueOf();

    let months = this.calSvc.createMonthsByPeriod(time, 3, this._d);
    this.monthOpts.push(months[0]);
    this.monthOpts.push(months[1]);
    this.monthOpts.push(months[2]);
    let monthOpt = this.monthOpts[0];
    this._showMonth = defaults.MONTH_FORMAT[monthOpt.original.month];
    this._thisMonth = monthOpt.original.month == moment().month() && monthOpt.original.year == moment().year();
    this.calSvc.getMonthData(monthOpt);
    setTimeout(()=>{
      let time = moment().subtract(2,"months").valueOf();
      let months = this.calSvc.createMonthsByPeriod(time, 2, this._d);
      this.monthOpts.unshift(months[1]);
      this.monthOpts.unshift(months[0]);
      this.slides.slideNext(0,false);
      this.slides.slideNext(0,false);
      this.slides.update();
    },500)
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
    this.initMonthData();
  }
}
