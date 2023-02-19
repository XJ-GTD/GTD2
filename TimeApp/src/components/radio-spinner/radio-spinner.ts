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
      <label *ngIf="label">{{_value + label}}</label>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" >
        <ng-container *ngIf="option.icon">
          <ion-icon class="fal" [ngClass] = "option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
    </div>
    <div class="row" *ngIf="!isFull && isCenter" align-items-center justify-content-center>
      <label *ngIf="label">{{_value + label}}</label>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" >
        <ng-container *ngIf="option.icon">
          <ion-icon class="fal" [ngClass] = "option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    <div class="row" *ngIf="!isFull && !isCenter" align-items-center justify-content-start>
      <label *ngIf="label">{{_value + label}}</label>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == _value}" clear (click)="change($event, option.value)" >
        <ng-container *ngIf="option.icon">
          <ion-icon class="fal" [ngClass] = "option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
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
  @Input("value")
  _value: number = 1;
  @Input("min")
  _minValue: number = 1;
  @Output("onChanged")
  changedPropEvent = new EventEmitter();

  constructor() {
  }

  set value(v: any){
    if(v) {
      this._value = v;
      this.onModelChange(this._value);
    }
  }

  get value(){
      return this._value;
  }

  writeValue(val: any): void {
    if (val) {
      this._value = val;
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
    this.onModelChange(this._value);
    this.changedPropEvent.emit(this._value);
  }
}