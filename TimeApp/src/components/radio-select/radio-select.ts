import { Component, Input } from '@angular/core';

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
        <button ion-button *ngFor="let option of options;" clear (click)="change($event, option.value)" small>
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
        <button ion-button *ngFor="let option of options;" clear (click)="change($event, option.value)" small>
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
        <button ion-button *ngFor="let option of options;" clear (click)="change($event, option.value)" small>
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
export class RadioSelectComponent {

  @Input()
  label: string;
  @Input("full")
  isFull: boolean = false;
  @Input("center")
  isCenter: boolean = false;
  @Input()
  options: any = [];
  @Input()
  value: any;

  constructor() {
    console.log('Hello RadioSelectComponent Component');
  }

  change(e, val) {
    this.value = val;
  }
}
