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
    <div class="row" align-items-center justify-content-between>
      <label *ngIf="label">{{label}}</label>
      <button ion-button *ngFor="let option of options;" clear (click)="change($event, option.value)">{{option.caption}}</button>
    </div>
  </div>`
})
export class RadioSelectComponent {

  @Input()
  label: string;
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
