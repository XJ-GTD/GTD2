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
  template: `
  <div class="outground" align-items-center *ngIf="backgroundColor" [ngStyle]="{'background-color': backgroundColor }">
    <ion-icon name="radio"></ion-icon> <span>{{seconds}}"</span>
  </div>
  <div class="outground" align-items-center *ngIf="!backgroundColor">
    <ion-icon name="radio"></ion-icon> <span>{{seconds}}"</span>
  </div>
  `
})
export class SpeechBubbleComponent {

  @Input("bgcolor")
  backgroundColor: string = "";
  @Input("seconds")
  seconds: number = 1;

  constructor(public events: Events) {
    console.log('Hello SpeechBubbleComponent Component');

  }

  ngOnInit() {

  }

}
