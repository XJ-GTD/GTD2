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
import {CalendarService} from "../services/calendar.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import * as moment from 'moment';
import {defaults, pickModes} from "../config";
import {FeedbackService} from "../../../service/cordova/feedback.service";
import {Card} from "ionic-angular";

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR],
  template: `
    <ion-card #monthcompent no-padding class="animated faster"
              [class.fadeInUp]="_fadeInUp"
              [class.fadeInDown]="_fadeInDown">
      <ion-card-header no-padding>

        <div class="title">
          <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title">
            <div float-left>
              <p><b [class.thisM]="_thisMonth">{{_showMonth}}</b></p>
              <p float-left no-margin>
                <span [class.thisM]="_thisMonth">{{monthOpt.original.year}}</span>
              </p>

              <ion-icon class="arrow-dropdown"
                        [name]="_view === 'days' ? 'md-arrow-dropright' : 'md-arrow-dropdown'"
                        (click)="switchView()" [class.thisM]="_thisMonth"></ion-icon>
            </div>
            <div float-right *ngIf="!_thisMonth" (click)="gotoToday()">
              <img src="./assets/imgs/fhby.png"/>
            </div>
          </ng-template>
          <ng-template [ngIf]="_showToggleButtons">
            <button type='button' ion-button clear class="back" [disabled]="!canBack()" (click)="prev()">
              <ion-icon name="ios-arrow-back"></ion-icon>
            </button>
            <button type='button' ion-button clear class="forward" [disabled]="!canNext()" (click)="next()">
              <ion-icon name="ios-arrow-forward"></ion-icon>
            </button>?.dsa
          </ng-template>
        </div>
      </ion-card-header>
      <ion-card-content>
        <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
          <ion-calendar-week color="transparent"
                             [weekArray]="_d.weekdays"
                             [weekStart]="_d.weekStart">
          </ion-calendar-week>

          <ion-calendar-month class="component-mode"
                              [(ngModel)]="_calendarMonthValue"
                              [month]="monthOpt"
                              [readonly]="readonly"
                              (onChange)="onChanged($event)"
                              (swipe)="swipeEvent($event)"
                              (cumClick)="monthClick($event)"
                              (onSelect)="select($event)"
                              (onPress)="onPress.emit($event)"
                              (onSelectStart)="onSelectStart.emit($event)"
                              (onSelectEnd)="onSelectEnd.emit($event)"
                              [pickMode]="_d.pickMode"
                              [color]="_d.color">
          </ion-calendar-month>
        </ng-template>

        <ng-template #monthPicker>
          <!--<ion-calendar-month-picker [color]="_d.color"-->
                                     <!--[monthFormat]="_options?.monthPickerFormat"-->
                                     <!--(onMonthSelect)="monthOnSelect($event)"-->
                                     <!--(onYearSelect)="yearOnSelect($event)"-->
                                     <!--[month]="monthOpt">-->
          <!--</ion-calendar-month-picker>-->
          <ion-calendar-month-picker (onMonthSelect)="monthOnSelect($event)"
                                     (onYearSelect)="yearOnSelect($event)"
                                     [month]="monthOpt">
          </ion-calendar-month-picker>
        </ng-template>
      </ion-card-content>
    </ion-card>


  `
})
export class CalendarComponent implements ControlValueAccessor, OnInit {


  _d: CalendarModalOptions;
  _options: CalendarComponentOptions;
  _view: 'month' | 'days' = 'days';
  _calendarMonthValue: CalendarDay[] = [null, null];
  css: number = 1;
  _showMonth;
  string;
  _thisMonth: boolean;

  _showToggleButtons = false;

  selectDay: CalendarDay;

  select($event: CalendarDay) {
    this.selectDay = $event;
    this.onSelect.emit($event)
  }

  get showToggleButtons(): boolean {
    return this._showToggleButtons;
  }

  set showToggleButtons(value: boolean) {
    this._showToggleButtons = value;
  }

  _showMonthPicker = true;
  get showMonthPicker(): boolean {
    return this._showMonthPicker;
  }

  set showMonthPicker(value: boolean) {
    this._showMonthPicker = value;
  }

  monthOpt: CalendarMonth;
  @ViewChild(Card)
  card: Card;

  @Input() format: string = defaults.DATE_FORMAT;
  @Input() type: CalendarComponentTypeProperty = 'string';
  @Input() readonly = false;
  @Output() onChange: EventEmitter<CalendarComponentPayloadTypes> = new EventEmitter();
  @Output() monthChange: EventEmitter<CalendarComponentMonthChange> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPress: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<CalendarDay> = new EventEmitter();


  @Input()
  set options(value: CalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      //新日程进来不需要刷新日历
      this.createMonth(this.monthOpt.original.time);
    }
  }


  constructor(public calSvc: CalendarService, public feekback: FeedbackService) {
  }

  get options(): CalendarComponentOptions {
    return this._options;
  }

  showMonth() {
    this._showMonth = defaults.MONTH_FORMAT[this.monthOpt.original.month];
  }

  thisMonth() {
    this._thisMonth = this.monthOpt.original.month == moment().month() && this.monthOpt.original.year == moment().year();
  }


  webkitAnimationEnd: boolean = true;

  ngOnInit(): void {
    this.card.getElementRef().nativeElement.addEventListener("webkitAnimationEnd", () => {
      this._fadeInUp = false;
      this._fadeInDown = false;
      this.webkitAnimationEnd = true;
    });
    this.card.getElementRef().nativeElement.addEventListener("webkitAnimationStart", () => {
      this.webkitAnimationEnd = false;
    });

    requestAnimationFrame(() => {
      this.startSwipe();
    });
    this.initOpt();
    this.createMonth(new Date().getTime());
  }

  getViewDate() {
    return this._handleType(this.monthOpt.original.time);
  }

  setViewDate(value: CalendarComponentPayloadTypes) {
    this.createMonth(this._payloadToTimeNumber(value));
  }

  switchView(): void {
    this._view = this._view === 'days' ? 'month' : 'days';
  }

  prev(): void {
    if (this._view === 'days') {
      this.backMonth();
    } else {
      this.prevYear();
    }
  }

  next(): void {
    if (this._view === 'days') {
      this.nextMonth();
    } else {
      this.nextYear();
    }
  }

  prevYear(): void {

    //重新创建月清除选择状态    //
    // this.monthComponent.onSelected(null);
    if (moment(this.monthOpt.original.time).year() === 1970) return;
    const backTime = moment(this.monthOpt.original.time).subtract(1, 'year').valueOf();
    this.createMonth(backTime);

  }

  nextYear(): void {

    //重新创建月清除选择状态    //
    // this.monthComponent.onSelected(null);
    const nextTime = moment(this.monthOpt.original.time).add(1, 'year').valueOf();
    this.createMonth(nextTime);

  }

  nextMonth(): void {

    //重新创建月清除选择状态

    // this.monthComponent.onSelected(null);
    const nextTime = moment(this.monthOpt.original.time).add(1, 'months').valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(nextTime)
    });

    this._fadeInUp = false;
    this._fadeInDown = !this._fadeInUp;
    this.createMonth(nextTime);

  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') return true;
    return this.monthOpt.original.time < moment(this._d.to).valueOf();
  }

  backMonth(): void {

    //重新创建月清除选择状态
    // this.monthComponent.onSelected(null);

    const backTime = moment(this.monthOpt.original.time).subtract(1, 'months').valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(backTime)
    });
    this._fadeInUp = true;
    this._fadeInDown = !this._fadeInUp;
    this.createMonth(backTime);

  }

  canBack(): boolean {
    if (!this._d.from || this._view !== 'days') return true;
    return this.monthOpt.original.time > moment(this._d.from).valueOf();
  }


  yearOnSelect(year: number): void {
    this._view = 'days';
    const newMonth = moment(this.monthOpt.original.time).year(year).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth)
    });
    this.createMonth(newMonth);
  }

  monthOnSelect(month: number): void {
    this._view = 'days';
    const newMonth = moment(this.monthOpt.original.time).month(month).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth)
    });
   this.createMonth(newMonth);
  }

  onChanged($event: CalendarDay[]): void {
    switch (this._d.pickMode) {
      case pickModes.SINGLE:
        const date = this._handleType($event[0].time);
        this._onChanged(date);
        this.onChange.emit(date);
        break;

      case pickModes.RANGE:
        if ($event[0] && $event[1]) {
          const rangeDate = {
            from: this._handleType($event[0].time),
            to: this._handleType($event[1].time)
          };
          this._onChanged(rangeDate);
          this.onChange.emit(rangeDate);
        }
        break;

      case pickModes.MULTI:
        let dates = [];

        for (let i = 0; i < $event.length; i++) {
          if ($event[i] && $event[i].time) {
            dates.push(this._handleType($event[i].time));
          }
        }

        this._onChanged(dates);
        this.onChange.emit(dates);
        break;

      default:

    }
  }

  nextArray: Array<boolean> = new Array<boolean>();
  _fadeInUp: boolean = true;
  _fadeInDown: boolean = false;

  swipeEvent($event: any): void {

    let nextan: boolean = false;
    if (45 < $event.angle && $event.angle < 135) nextan = true;
    if (-45 > $event.angle && $event.angle > -135) nextan = false;
    this.nextArray.push(nextan);
  }

  startSwipe() {
    this.swipeEventS().then((d) => {
      requestAnimationFrame(() => {
        this.startSwipe();
      });
    });
  }

  swipeEventS(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.nextArray.length > 0) {

        if (this.webkitAnimationEnd) {
          let next = this.nextArray.pop();
          if (next && this.canNext()) {
            this.nextMonth();

          } else if (!next && this.canBack()) {
            this.backMonth();
          }

          this.feekback.audioBass().then(d => {
            this.onSelect.emit();

          }, e => {
            this.onSelect.emit();

          });
        }
      }
      resolve(true);
    })
  }

  _onChanged: Function = () => {
  };

  _onTouched: Function = () => {
  };

  _payloadToTimeNumber(value: CalendarComponentPayloadTypes): number {
    let date;
    if (this.type === 'string') {
      date = moment(value, this.format);
    } else {
      date = moment(value);
    }
    return date.valueOf();
  }

  _monthFormat(date: number): string {
    return moment(date).format(this._d.monthFormat.replace(/y/g, 'Y'))
  }

  private initOpt(): void {
    if (this._options && typeof this._options.showToggleButtons === 'boolean') {
      this.showToggleButtons = this._options.showToggleButtons;
    }
    if (this._options && typeof this._options.showMonthPicker === 'boolean') {
      this.showMonthPicker = this._options.showMonthPicker;
      if (this._view !== 'days' && !this.showMonthPicker) {
        this._view = 'days';
      }
    }
    this._d = this.calSvc.safeOpt(this._options || {});
  }

  createMonth(date: number): CalendarMonth {
    this.monthOpt = this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
    this.showMonth();
    this.thisMonth();
    this.calSvc.getMonthData(this.monthOpt);
    return this.monthOpt;
  }

  _createCalendarDay(value: CalendarComponentPayloadTypes): CalendarDay {
    return this.calSvc.createCalendarDay(this._payloadToTimeNumber(value), this._d);
  }

  _handleType(value: number): CalendarComponentPayloadTypes {
    let date = moment(value);
    switch (this.type) {
      case 'string':
        return date.format(this.format);
      case 'js-date':
        return date.toDate();
      case 'moment':
        return date;
      case 'time':
        return date.valueOf();
      case 'object':
        return date.toObject();
    }
    return date;
  }

  writeValue(obj: any): void {
    this._writeValue(obj);
    if (obj) {
      if (this._calendarMonthValue[0]) {
        this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.createMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: () => {}): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  _writeValue(value: any): void {
    if (!value) {
      this._calendarMonthValue = [null, null];
      return;
    }

    switch (this._d.pickMode) {
      case 'single':
        this._calendarMonthValue[0] = this._createCalendarDay(value);
        break;

      case 'range':
        if (value.from) {
          this._calendarMonthValue[0] = value.from ? this._createCalendarDay(value.from) : null;
        }
        if (value.to) {
          this._calendarMonthValue[1] = value.to ? this._createCalendarDay(value.to) : null;
        }
        break;

      case 'multi':
        if (Array.isArray(value)) {
          this._calendarMonthValue = value.map(e => {
            return this._createCalendarDay(e)
          });
        } else {
          this._calendarMonthValue = [null, null];
        }
        break;

      default:

    }
  }

  monthClick(event: CalendarDay) {
    if (event.isToday == false && event.isNextMonth) {
      this.nextMonth();
    } else if (event.isToday == false && event.isLastMonth) {
      this.backMonth()
    }
  }

  gotoToday() {
    this.setViewDate(moment().format("YYYY/MM/DD"));
  }
}
