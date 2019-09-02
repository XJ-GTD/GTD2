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
    <ion-row class="box-header">
      <h1>{{title}}</h1>
      <button ion-button icon-only (click)="goBack()">
        <ion-icon ios="md-arrow-back" md="md-arrow-back"></ion-icon>
      </button>
    </ion-row>
    <ion-row>
      <ion-grid>
        <ion-row class="box-content">
          <ion-scroll direction="y" zooming="false">
            <ng-content></ng-content>
          </ion-scroll>
        </ion-row>
      </ion-grid>
    </ion-row>
  </ion-grid>`
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
