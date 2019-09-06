import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChildren, QueryList} from '@angular/core';
import {Events} from 'ionic-angular';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-box',
  template:
      `
    <div class="box-page">
      <ion-header class="box-header">
        <ion-toolbar >
          <ion-title>{{title}}</ion-title>
          <ion-buttons end>
            <button (click)="goBack()">
              <ion-icon ios="md-arrow-back" md="md-arrow-back"></ion-icon>
            </button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="box-content">
        <ng-content></ng-content>
      </ion-content>
    </div>
  `
})
export class PageBoxComponent {
  @Input()
  title: string = "";

  @Output()
  private onBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(public events: Events) {

  }

  goBack() {
    this.onBack.emit(this);
  }
}
