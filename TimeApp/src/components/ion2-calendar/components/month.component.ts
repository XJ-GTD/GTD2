import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarDay, CalendarMonth, CalendarOriginal, PickMode } from '../calendar.model'
import { defaults, pickModes } from "../config";
import {CalendarComponent} from "./calendar.component";
import * as moment from "moment";
import {IonCalendarService} from "../services/calendar.service";

export const MONTH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MonthComponent),
  multi: true
};

@Component({
  selector: 'ion-calendar-month',
  providers: [MONTH_VALUE_ACCESSOR],
  template: `
    
    <div [class]="color">
        <div class="days-box">
          <ng-template ngFor let-day [ngForOf]="month.days" [ngForTrackBy]="trackByTime">
            <div class="days" >
              <ng-container *ngIf="day">
                <div class="borderDiv" [class.on-selected]="isSelected(day.time)  && !day.isLastMonth && !day.isNextMonth">
                  <button type='button'
                          [class]="'days-btn warp-days-btn'"      
                          (click)="onSelected(day)"
                          [class.last-month-day]="day.isLastMonth"
                          [class.next-month-day]="day.isNextMonth"
                          [class.today]="day.isToday && !day.isLastMonth && !day.isNextMonth"
                          [disabled]="day.disable">
                    <p *ngIf="day.isToday"><span class="d">今</span></p>
                    <p *ngIf="!day.isToday"><span span class="d">{{day.title}}</span></p>
                  </button>
                  <ion-icon class = "message fas fa-circle"  *ngIf="!day.isLastMonth && !day.isNextMonth && day.accept > 0" ></ion-icon>
                  <ion-icon class = "active fas fa-hexagon" *ngIf="!day.isLastMonth && !day.isNextMonth  && day.hasevent"></ion-icon>
                  <ion-icon class = "diary fas fa-heart-circle" *ngIf="!day.isLastMonth && !day.isNextMonth && day.hasMemo"></ion-icon>
                  <ion-icon class = "repeat fas fa-repeat" *ngIf="!day.isLastMonth && !day.isNextMonth && day.hasrepeat"></ion-icon>
                  <small [class.calendaritem] = "day.calendaritem">{{day.subTitle}}</small>

                  <!--(press)="onPressed(day)"-->
                </div>
              </ng-container>
            </div>
          </ng-template>
        </div>
      
    </div>
  `
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {


  @Input() month: CalendarMonth;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() readonly = false;
  @Input() color: string = defaults.COLOR;

  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPress: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  constructor(public ref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  writeValue(obj: any): void {
    // if (Array.isArray(obj)) {
    //   this._date = obj;
    // }
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  trackByTime(index: number, item: CalendarOriginal): number {
    return item ? item.time : index;
  }






  // isSelected(time: number): boolean {
  //
  //   if (Array.isArray(this._date)) {
  //
  //     if (this.pickMode !== pickModes.MULTI) {
  //       if (this._date[0] !== null) {
  //         return time === this._date[0].time
  //       }
  //
  //       if (this._date[1] !== null) {
  //         return time === this._date[1].time
  //       }
  //     } else {
  //       return this._date.findIndex(e => e !== null && e.time === time) !== -1;
  //     }
  //
  //   } else {
  //     return false
  //   }
  // }

  isSelected(time: number): boolean {
    return time === IonCalendarService.selecttime;
  }


  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onSelect.emit(item);
    // if (this.pickMode === pickModes.SINGLE) {
    IonCalendarService.selecttime = item.time;

    return;
    // }
    //
    // if (this.pickMode === pickModes.RANGE) {
    //   if (this._date[0] === null) {
    //     this._date[0] = item;
    //     this.onSelectStart.emit(item);
    //   } else if (this._date[1] === null) {
    //     if (this._date[0].time < item.time) {
    //       this._date[1] = item;
    //       this.onSelectEnd.emit(item);
    //     } else {
    //       this._date[1] = this._date[0];
    //       this.onSelectEnd.emit(this._date[0]);
    //       this._date[0] = item;
    //       this.onSelectStart.emit(item);
    //     }
    //   } else {
    //     this._date[0] = item;
    //     this.onSelectStart.emit(item);
    //     this._date[1] = null;
    //   }
    //   this.onChange.emit(this._date);
    //   return;
    // }
    //
    // if (this.pickMode === pickModes.MULTI) {
    //
    //   const index = this._date.findIndex(e => e !== null && e.time === item.time);
    //
    //   if (index === -1) {
    //     this._date.push(item);
    //   } else {
    //     this._date.splice(index, 1);
    //   }
    //   this.onChange.emit(this._date.filter(e => e !== null));
    // }
  }


  onPressed(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onPress.emit(item);
    IonCalendarService.selecttime = item.time;
  }

}
