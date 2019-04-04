import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarMonth } from "../calendar.model";
import { defaults } from "../config";
import * as moment from 'moment';

@Component({
  selector: 'ion-calendar-month-picker',
  template: `
    <div class="warp">
      <scroll-select [options]="years" [value]="thisYear" [type]="'scroll-without-button'" [items]="7"  (changed)="_onYearSelect($event)"></scroll-select>
      <scroll-select [options]="months" [value]="thisMonth" [type]="'scroll-without-button'" [items]="7"  (changed)="_onMonthSelect($event)"></scroll-select>
    </div>
  `
})

export class MonthPickerComponent {

  months: Array<any> = [{value:1,caption:'一月'}, {value:2,caption:'二月'}, {value:3,caption:'三月'}, {value:4,caption:'四月'}, {value:5,caption:'五月'}, {value:6,caption:'六月'}, {value:7,caption:'七月'}, {value:8,caption:'八月'}, {value:9,caption:'九月'}, {value:10,caption:'十月'}, {value:11,caption:'十一月'}, {value:12,caption:'十二月'}];
  years: Array<any> = [];
  thisYear:number = 1930;
  thisMonth:number = 6;

  @Input() month: CalendarMonth;
  @Input() color = defaults.COLOR;
  @Output() onMonthSelect: EventEmitter<number> = new EventEmitter();
  @Output() onYearSelect: EventEmitter<number> = new EventEmitter();
  _thisMonth = new Date();
  _monthFormat = defaults.MONTH_FORMAT;

  @Input()
  set monthFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._monthFormat = value;
    }
  }

  get monthFormat(): string[] {
    return this._monthFormat;
  }

  constructor() {
  }
  ngOnInit(){
    for (let year = 1900; year <= moment().year() + 2299; year++) {
      this.years.push({value:year,caption:year.toString()});
    }
    this.thisMonth = this.month.original.month + 1;
    this.thisYear = this.month.original.year;

  }

  _onMonthSelect(month: number): void {
    this.onMonthSelect.emit(month);
  }

  _onYearSelect(year: number): void {
    this.onYearSelect.emit(year);
  }
}
