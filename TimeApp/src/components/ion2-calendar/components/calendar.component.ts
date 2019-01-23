import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  forwardRef,
  Provider
} from '@angular/core';

import {
  CalendarMonth, CalendarModalOptions, CalendarComponentOptions, CalendarDay,
  CalendarComponentPayloadTypes, CalendarComponentMonthChange, CalendarComponentTypeProperty
} from '../calendar.model'
import { CalendarService } from "../services/calendar.service";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';
import { defaults, pickModes } from "../config";
import {XiaojiFeedbackService} from "../../../service/util-service/xiaoji-feedback.service";

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar',
  providers: [ION_CAL_VALUE_ACCESSOR],
  template: `
      <ion-card no-padding >
      <ion-card-header no-padding>
        
        <div class="title animated" [ngClass]="{'jello':css==1,'flash':css==2}" animationend="" >
          <ng-template [ngIf]="_showMonthPicker" [ngIfElse]="title" >
          <div float-left >
          <p  style="font-size: 30px;color: #222222;font-weight: bold;letter-spacing: -1px" float-left >{{monthOpt.original.month<9? "0" + (monthOpt.original.month+1):monthOpt.original.month + 1}}</p>
          <p  style="display: grid;padding-left:0px;padding-top:5px" float-left no-margin >
            <span style="font-size: 15px;height: 16px;color: #666666;">{{monthOpt.original.year}}</span>
            <span style="font-size: 10px;color: #666666;">month</span>
          </p>
            <ion-icon style="padding-top:10px;padding-left: 6px;color:#666666" class="arrow-dropdown"
                      [name]="_view === 'days' ? 'md-arrow-dropright' : 'md-arrow-dropdown'" (click)="switchView()"></ion-icon>
           </div>
          </ng-template>
          <ng-template #title>
            <div class="switch-btn" >
              <div float-left >
                <p  style="font-size: 2em" float-left>{{monthOpt.original.month<9? "0" + (monthOpt.original.month+1):monthOpt.original.month + 1}}</p>
                <p  style="display: grid;margin-left: 0px" float-left>
                  <span style="font-size: 1.3em">{{monthOpt.original.year}}</span>
                  <span>month</span>
                </p>
                <ion-icon float-left  padding-top class="arrow-dropdown"
                          [name]="_view === 'days' ? 'md-arrow-dropdown' : 'md-arrow-dropup'" (click)="switchView()"></ion-icon>
              </div>
            </div>
          </ng-template>
          <ng-template [ngIf]="_showToggleButtons">
            <button type='button' ion-button clear class="back" [disabled]="!canBack()" (click)="prev()">
              <ion-icon name="ios-arrow-back"></ion-icon>
            </button>
            <button type='button' ion-button clear class="forward" [disabled]="!canNext()" (click)="next()">
              <ion-icon name="ios-arrow-forward"></ion-icon>
            </button>
          </ng-template>
        </div>
      </ion-card-header>
      <ion-card-content>
        <ng-template [ngIf]="_view === 'days'" [ngIfElse]="monthPicker">
          <ion-calendar-week color="transparent"
                             [weekArray]="_d.weekdays"
                             [weekStart]="_d.weekStart">
          </ion-calendar-week>

          <ion-calendar-month class="component-mode animated faster"
                              [ngClass]="{'slideInLeft':css==1,'slideInRight':css==2}"
                              [(ngModel)]="_calendarMonthValue"
                              [month]="monthOpt"
                              [readonly]="readonly"
                              (onChange)="onChanged($event)"
                              (swipe)="swipeEvent($event)"
                              (cumClick)="monthClick($event)"
                              (onSelect)="onSelect.emit($event)"
                              (onPress)="onPress.emit($event)"
                              (onSelectStart)="onSelectStart.emit($event)"
                              (onSelectEnd)="onSelectEnd.emit($event)"
                              [pickMode]="_d.pickMode"
                              [color]="_d.color">
          </ion-calendar-month>
        </ng-template>

        <ng-template #monthPicker>
          <ion-calendar-month-picker [color]="_d.color"
                                     [monthFormat]="_options?.monthPickerFormat"
                                     (onSelect)="monthOnSelect($event)"
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
  css:number=1;

  _showToggleButtons = false;
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
      this.monthOpt = this.createMonth(this.monthOpt.original.time);

    }
  }

  get options(): CalendarComponentOptions {
    return this._options;
  }


  constructor(public calSvc: CalendarService, public xiaojiFeekback: XiaojiFeedbackService) {

  }

  ngOnInit(): void {
    this.initOpt();
    this.monthOpt = this.createMonth(new Date().getTime());
  }

  getViewDate() {
    return this._handleType(this.monthOpt.original.time);
  }

  setViewDate(value: CalendarComponentPayloadTypes) {
    this.monthOpt = this.createMonth(this._payloadToTimeNumber(value));
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
    if (moment(this.monthOpt.original.time).year() === 1970) return;
    const backTime = moment(this.monthOpt.original.time).subtract(1, 'year').valueOf();
    this.monthOpt = this.createMonth(backTime);
  }

  nextYear(): void {
    const nextTime = moment(this.monthOpt.original.time).add(1, 'year').valueOf();
    this.monthOpt = this.createMonth(nextTime);
  }

  nextMonth(): void {
    const nextTime = moment(this.monthOpt.original.time).add(1, 'months').valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(nextTime)
    });
    this.monthOpt = this.createMonth(nextTime);
  }

  canNext(): boolean {
    if (!this._d.to || this._view !== 'days') return true;
    return this.monthOpt.original.time < moment(this._d.to).valueOf();
  }

  backMonth(): void {
    const backTime = moment(this.monthOpt.original.time).subtract(1, 'months').valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(backTime)
    });
    this.monthOpt = this.createMonth(backTime);
  }
  //add by zhangjy
  // refresh(): void {
  //   this.monthOpt = this.createMonth(this.monthOpt.original.time);
  // }


  canBack(): boolean {
    if (!this._d.from || this._view !== 'days') return true;
    return this.monthOpt.original.time > moment(this._d.from).valueOf();
  }

  monthOnSelect(month: number): void {
    this._view = 'days';
    const newMonth = moment(this.monthOpt.original.time).month(month).valueOf();
    this.monthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth)
    });
    this.monthOpt = this.createMonth(newMonth);
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

  nextArray:Array<number>=new Array<number>();
  newstart:boolean = true;
  swipeEvent($event: any): void {
    const isNext = $event.deltaX < 0;
   // if (!this.newstart) return;
    if (isNext)
      this.nextArray.push(1);
    else
      this.nextArray.push(0);
    if (this.newstart){
      this.startSwipe();
    }
  }
  startSwipe(){
    this.newstart = false;
    this.swipeEventS().then((d)=>{
      console.info(d);
      if (this.nextArray.length > 0){
        this.startSwipe();
      }
      else{
        //this.configMonthEventDay
        this.newstart = true
      }
    });
  }
  swipeEventS():Promise<any>{
    return new Promise<any>((resolve,reject)=>{

      let n:number=this.nextArray.pop();
      if (n==1 && this.canNext()) {
        this.nextMonth();
        this.css =2;

      } else if (n==0 && this.canBack()) {
        this.backMonth()

        this.css = 1;
      }

      this.xiaojiFeekback.audioBass();

      window.setTimeout(()=>{
        this.css = 100;
        this.onSelect.emit();
        window.setTimeout(()=>{
          resolve(true);
        },100);
      },200);
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
    if (this.nextArray.length == 0){
      this.configMonthEventDay(date);
    }
    return this.calSvc.createMonthsByPeriod(date, 1, this._d)[0];
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
        this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
      } else {
        this.monthOpt = this.createMonth(new Date().getTime());
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

  monthClick(event: CalendarDay){
    if (event.isToday == false && event.isNextMonth) {
      this.nextMonth();
    } else if (event.isToday == false && event.isLastMonth) {
      this.backMonth()
    }
  }


  configMonthEventDay(time){
    let newMonth = this.calSvc.multiFormat(time);
    console.info(newMonth.dateObj);
    let month = moment(newMonth.dateObj).format('YYYY-MM');

    let len = this.options.daysConfig.length;
    this.options.daysConfig.splice(0,len-1);
    this.calSvc.findDayEventForMonth(month).then((data)=>{
      this.options.daysConfig.push(...data);
      this.monthOpt =  this.calSvc.createMonthsByPeriod(time, 1, this._d)[0];
    })
  }
}
