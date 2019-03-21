import { Component } from '@angular/core';

/**
 * Generated class for the WaveTimePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'wave-time-picker',
  templateUrl: 'wave-time-picker.html'
})
export class WaveTimePickerComponent {

  text: string;

  constructor() {
    console.log('Hello WaveTimePickerComponent Component');
    this.text = 'Hello World';
  }

}
