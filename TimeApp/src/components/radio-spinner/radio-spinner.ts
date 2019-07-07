import { Component, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

/**
 * Generated class for the RadioSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-spinner',
  template: `<div class="grid">
    <div class="row" *ngIf="isFull && isCenter" align-items-center justify-content-between>
      <label *ngIf="label">{{_valueshow + label}}</label>
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
    <div class="row" *ngIf="!isFull && isCenter" align-items-center justify-content-center>
      <label *ngIf="label">{{_valueshow + label}}</label>
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
    <div class="row" *ngIf="!isFull && !isCenter" align-items-center justify-content-start>
      <label *ngIf="label">{{_valueshow + label}}</label>
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
  </div>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioSpinnerComponent),
    multi: true
  }]
})
export class RadioSpinnerComponent implements ControlValueAccessor {

  @Input()
  label: string;
  @Input("full")
  isFull: boolean = false;
  @Input("center")
  isCenter: boolean = false;
  @Input("add")
  addOption: string = "add";
  @Input("subtract")
  subtractOption: string = "subtract";
  @Input()
  options: any = [];
  @Input("showInitial")
  isShowInitial: boolean = false;
  @Input("value")
  _value: number = 1;
  _valueshow: string = "";
  @Input("min")
  _minValue: number = 1;
  @Output("onChanged")
  changedPropEvent = new EventEmitter();

  constructor() {
  }

  set value(v: any){
    if(v) {
      this._value = v;
      if (this.isShowInitial)
        this._valueshow = this._value;
      else {
        if (this._value == this._minValue)
          this._valueshow = "";
        else
          this._valueshow = this._value;
      }
      this.onModelChange(this._value);
    }
  }

  get value(){
      return this._value;
  }

  writeValue(val: any): void {
    if (val) {
      this._value = val;
      if (this.isShowInitial)
        this._valueshow = this._value;
      else {
        if (this._value == this._minValue)
          this._valueshow = "";
        else
          this._valueshow = this._value;
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

  change(e, val) {
    let num: number = 0;

    if (this.addOption == val) {
      num = 1;
    }

    if (this.subtractOption == val) {
      num = -1;
    }

    this._value += num;
    this._value = (this._value < this._minValue)? this._minValue : this._value;
    if (this.isShowInitial)
      this._valueshow = this._value;
    else {
      if (this._value == this._minValue)
        this._valueshow = "";
      else
        this._valueshow = this._value;
    }
    this.onModelChange(this._value);
    this.changedPropEvent.emit(this._value);
  }
}
