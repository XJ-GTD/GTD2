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
            <div class="days">
              <ng-container *ngIf="day">
                <div class="borderDiv"
                  [class.on-selected]="isSelected(day.time)  && !day.isLastMonth && !day.isNextMonth">
                  <button type='button'
                          [class]="'days-btn warp-days-btn'"      
                          (click)="onSelected(day)"
                          (press)="onPressed(day)"
                          [class.last-month-day]="day.isLastMonth"
                          [class.next-month-day]="day.isNextMonth"
                          [class.today]="day.isToday && !day.isLastMonth && !day.isNextMonth"
                          [disabled]="day.disable">
                    <p *ngIf="day.isToday">今</p>
                    <p *ngIf="!day.isToday">{{day.title}}</p>
                    <small>{{day.subTitle}}</small>
                    
                    <ion-icon class = "message fa fa-circle"  *ngIf="!day.isLastMonth && !day.isNextMonth && day.hasmessage" ></ion-icon>
                    <ion-icon class = "active fa fa-tasks" *ngIf="!day.isLastMonth && !day.isNextMonth  && day.hasevent"></ion-icon>
                    <ion-icon class = "diary fa fa-edit" *ngIf="!day.isLastMonth && !day.isNextMonth && day.hasMemo"></ion-icon>
                    <ion-icon class = "repeat fa fa-ellipsis-h" *ngIf="!day.isLastMonth && !day.isNextMonth && day.hasrepeat"></ion-icon>
                  </button>
               
                </div>
              </ng-container>
            </div>
          </ng-template>
        </div>
      
    </div>
  `
})
export class MonthComponent implements ControlValueAccessor, AfterViewInit {

  @Output() cumClick = new EventEmitter<any>();

  @Input() month: CalendarMonth;
  @Input() pickMode: PickMode;
  @Input() isSaveHistory: boolean;
  @Input() id: any;
  @Input() readonly = false;
  @Input() color: string = defaults.COLOR;

  @Output() onChange: EventEmitter<CalendarDay[]> = new EventEmitter();
  @Output() onSelect: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onPress: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<CalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<CalendarDay> = new EventEmitter();

  _date: Array<CalendarDay | null> = [null, null];
  _isInit = false;
  _onChanged: Function;
  _onTouched: Function;

  get _isRange(): boolean {
    return this.pickMode === pickModes.RANGE
  }

  constructor(public ref: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this._isInit = true;
  }

  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      this._date = obj;
    }
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

  isEndSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[1] === null) {
      return false;
    }

    return this._date[1].time === day.time;
  }

  isBetween(day: CalendarDay): boolean {
    if (!day) return false;

    if (this.pickMode !== pickModes.RANGE || !this._isInit) {
      return false;
    }

    if (this._date[0] === null || this._date[1] === null) {
      return false;
    }

    const start = this._date[0].time;
    const end = this._date[1].time;

    return day.time < end && day.time > start;
  }

  isStartSelection(day: CalendarDay): boolean {
    if (!day) return false;
    if (this.pickMode !== pickModes.RANGE || !this._isInit || this._date[0] === null) {
      return false;
    }

    return this._date[0].time === day.time && this._date[1] !== null;
  }

  isSelected(time: number): boolean {

    if (Array.isArray(this._date)) {

      if (this.pickMode !== pickModes.MULTI) {
        if (this._date[0] !== null) {
          return time === this._date[0].time
        }

        if (this._date[1] !== null) {
          return time === this._date[1].time
        }
      } else {
        return this._date.findIndex(e => e !== null && e.time === time) !== -1;
      }

    } else {
      return false
    }
  }

  onSelected(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onSelect.emit(item);
    if (this.pickMode === pickModes.SINGLE) {
      this._date[0] = item;
      this.onChange.emit(this._date);

      if (this._isRange == false) {
        this.cumClick.emit(item);
      }
      return;
    }

    if (this.pickMode === pickModes.RANGE) {
      if (this._date[0] === null) {
        this._date[0] = item;
        this.onSelectStart.emit(item);
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.onSelectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.onSelectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.onSelectStart.emit(item);
        }
      } else {
        this._date[0] = item;
        this.onSelectStart.emit(item);
        this._date[1] = null;
      }
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.MULTI) {

      const index = this._date.findIndex(e => e !== null && e.time === item.time);

      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.onChange.emit(this._date.filter(e => e !== null));
    }
  }


  onPressed(item: CalendarDay): void {
    if (this.readonly) return;
    item.selected = true;
    this.onPress.emit(item);
    if (this.pickMode === pickModes.SINGLE) {
      this._date[0] = item;
      this.onChange.emit(this._date);

      if (this._isRange == false) {
        this.cumClick.emit(item);
      }
      return;
    }

    if (this.pickMode === pickModes.RANGE) {
      if (this._date[0] === null) {
        this._date[0] = item;
        this.onSelectStart.emit(item);
      } else if (this._date[1] === null) {
        if (this._date[0].time < item.time) {
          this._date[1] = item;
          this.onSelectEnd.emit(item);
        } else {
          this._date[1] = this._date[0];
          this.onSelectEnd.emit(this._date[0]);
          this._date[0] = item;
          this.onSelectStart.emit(item);
        }
      } else {
        this._date[0] = item;
        this.onSelectStart.emit(item);
        this._date[1] = null;
      }
      this.onChange.emit(this._date);
      return;
    }

    if (this.pickMode === pickModes.MULTI) {

      const index = this._date.findIndex(e => e !== null && e.time === item.time);

      if (index === -1) {
        this._date.push(item);
      } else {
        this._date.splice(index, 1);
      }
      this.onChange.emit(this._date.filter(e => e !== null));
    }
  }

}
