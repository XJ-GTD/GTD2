import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms'

/**
 * Generated class for the RadioSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-select',
  template: `<div class="grid">
    <div class="row" *ngIf="isFull && isCenter" align-items-center justify-content-between>
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == value}" clear (click)="change($event, option.value)" small>
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
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == value}" clear (click)="change($event, option.value)" small>
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
      <label *ngIf="label">{{label}}</label>
      <div>
        <button ion-button *ngFor="let option of options;" [ngClass]="{'checked': option.value == value}" clear (click)="change($event, option.value)" small>
        <ng-container *ngIf="option.icon">
          <ion-icon [name]="option.icon"></ion-icon>
        </ng-container>
        <ng-container *ngIf="!option.icon">
          {{option.caption}}
        </ng-container>
        </button>
      </div>
    </div>
  </div>`
})
export class RadioSelectComponent implements ControlValueAccessor {

  @Input()
  label: string;
  @Input("full")
  isFull: boolean = false;
  @Input("center")
  isCenter: boolean = false;
  @Input()
  options: any = [];
  @Input()
  value: any = "";
  @Output("onChanged")
  changedPropEvent = new EventEmitter();

  constructor() {
    console.log('Hello RadioSelectComponent Component');
  }

  set value(v: any){
    if(v) {
      this.value = v;
      this.propagateChange(this.value);
    }
  }

  get value(){
      return this.value;
  }

  writeValue(val: any): void {
    if (val) {
      this.value = val;
    }
  }

  propagateChange(val) {

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnChange', fn);
  }

  change(e, val) {
    this.value = val;
    this.changedPropEvent.emit(this.value);
    this.propagateChange(val);
  }
}
