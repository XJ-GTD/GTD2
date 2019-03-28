import { Component, Input } from '@angular/core';

/**
 * Generated class for the RadioSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-select',
  templateUrl: 'radio-select.html'
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
