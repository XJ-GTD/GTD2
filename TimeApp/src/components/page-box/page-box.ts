import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChildren, QueryList } from '@angular/core';
import { Events } from 'ionic-angular';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-box',
  template: `<ion-grid class="box-page">
    <ion-row>
      {{title}}
    </ion-row>
    <ion-row>
      <ion-grid>
        <ion-row class="box-content">
          <ng-content></ng-content>
        </ion-row>
      </ion-grid>
    </ion-row>
  </ion-grid>`
})
export class PageBoxComponent {
  @Input()
  title: string = "";

  constructor(public events: Events) {

  }
}
