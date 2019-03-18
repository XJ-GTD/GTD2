import { Component } from '@angular/core';

/**
 * Generated class for the ColorSliderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'color-slider',
  templateUrl: 'color-slider.html'
})
export class ColorSliderComponent {

  isPanned: Array<boolean> = [false, false, false, false, false];

  constructor() {
    console.log('Hello ColorSliderComponent Component');
    this.text = 'Hello World';
  }

  panEvent(e) {
    let index = e.target.attributes['index'];
    console.log(parseInt(index.value));
    
    this.isPanned = [false, false, false, false, false];;
    
    this.isPanned[parseInt(index.value)] = true;
  }
}
