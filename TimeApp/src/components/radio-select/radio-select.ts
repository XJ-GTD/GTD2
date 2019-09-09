import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

/**
 * Generated class for the RadioSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-select',
  template: `<div class="grid">
    <div class="row" *ngIf="isFull && isCenter && !isMultiSelect" align-items-center justify-content-between>
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" small>
        <ng-container *ngIf="option.icon">
          <ion-icon [name]="option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    </div>
    <div class="row" *ngIf="!isFull && isCenter && !isMultiSelect" align-items-center justify-content-center>
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" small>
        <ng-container *ngIf="option.icon">
          <ion-icon [name]="option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    </div>
    <div class="row" *ngIf="!isFull && !isCenter && !isMultiSelect" align-items-center justify-content-start>
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" small>
        <ng-container *ngIf="option.icon">
          <ion-icon [name]="option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    </div>
    <div class="row" *ngIf="!isFull && !isCenter && isMultiSelect" align-items-center justify-content-start>
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options; let i = index;" [ngClass]="{'checked': option.value == _values[i]}" clear (click)="change($event, option.value, i)" small>
        <ng-container *ngIf="option.icon">
          <ion-icon [name]="option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    </div>
  </div>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioSelectComponent),
    multi: true
  }]
})
export class RadioSelectComponent implements ControlValueAccessor {

  @Input()
  label: string;
  @Input("full")
  isFull: boolean = false;
  @Input("center")
  isCenter: boolean = false;
  @Input("multiple")
  isMultiSelect: boolean = false;
  @Input()
  options: any = [];
  @Input("value")
  _value: any = "";
  @Input("values")
  _values: Array<any> = new Array<any>();
  @Output("onChanged")
  changedPropEvent = new EventEmitter();

  constructor() {
  }

  set value(v: any){
    if (this.isMultiSelect) {
      if (v && v instanceof Array) {
        if (this._values.length != this.options.length) {
          this._values = new Array<any>(this.options.length);
        }

        this.options.reduce((target, curr, currindex) => {
          if (v.indexOf(curr.value) >= 0) {
            target[currindex] = curr.value;
          } else {
            target[currindex] = null;
          }
        }, this._values);
      }
      this.onModelChange(this._values);
    } else {
      if(v) {
        this._value = v;
        this.onModelChange(this._value);
      }
    }
  }

  get value(){
    if (this.isMultiSelect) {
      let values: Array<any> = new Array<any>();
      return this._values.reduce((target, curr) => {
        if (curr) {
          target.push(curr);
        }
      }, values);
    } else {
      return this._value;
    }
  }

  writeValue(val: any): void {
    if (this.isMultiSelect) {
      if (val && val instanceof Array) {
        if (this._values.length != this.options.length) {
          this._values = new Array<any>(this.options.length);
        }

        this.options.reduce((target, curr, currindex) => {
          if (val.indexOf(curr.value) >= 0) {
            target[currindex] = curr.value;
          } else {
            target[currindex] = null;
          }
        }, this._values);
      }
    } else {
      if (val) {
        this._value = val;
      }
    }
  }

  public onModelChange: Function = () => {};
  public onModelTouched: Function = () => {};

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

  change(e, val, index) {
    if (this.isMultiSelect) {
      this._values[index] = val;
      this.onModelChange(this._values);
      this.changedPropEvent.emit(this._values);
    } else {
      this._value = val;
      this.onModelChange(val);
      this.changedPropEvent.emit(this._value);
    }
  }
}
