import { Component, Input, Output, EventEmitter, ViewChild ,ElementRef} from '@angular/core';
import { Events } from 'ionic-angular';

/**
 * Generated class for the SpeechBubbleComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'speech-bubble',
  template: `<div class="outground" align-items-center [ngStyle]="{'background-color': backgroundColor }">
    <ion-icon name="radio"></ion-icon> <span>4"</span>
  </div>`
})
export class SpeechBubbleComponent {

  @Input("bgcolor")
  backgroundColor: string = `transparent`;

  constructor(public events: Events) {
    console.log('Hello SpeechBubbleComponent Component');

  }

  ngOnInit() {

  }

}
