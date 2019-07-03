import { Component, Input, Output, EventEmitter, ViewChild ,ElementRef} from '@angular/core';
import { Events } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'scroll-select-option',
  template: `
  <div class="option align-items-center">
    <ng-content></ng-content>
  </div>
  `
})
export class ScrollSelectOptionComponent {
  @Input("value")
  value: any;

  constructor() {

  }
}
