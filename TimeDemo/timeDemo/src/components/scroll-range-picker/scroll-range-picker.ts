import { Component } from '@angular/core';

/**
 * Generated class for the ScrollRangePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-range-picker',
  templateUrl: 'scroll-range-picker.html'
})
export class ScrollRangePickerComponent {

  text: string;

  constructor() {
    console.log('Hello ScrollRangePickerComponent Component');
    this.text = 'Hello World';
  }

}
