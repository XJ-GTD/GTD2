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
          <ion-title>
          {{title}}
          <ion-badge *ngIf="data" (click)="clickSubtitle()">{{subtitle}}</ion-badge>
          </ion-title>
          <div class="toolbar">
            <div (click)="goRemove()">
              <ion-icon class="fa fa-trash-o"></ion-icon>
            </div>

            <div  (click)="goRemove()">
              <ion-icon class="fa fa-share-square-o"></ion-icon>
            </div>

            <div  (click)="goRemove()">
              <ion-icon class="fa fa-floppy-o"></ion-icon>
            </div>
            <div (click)="goBack()">
              <ion-icon class="fa fa-undo"></ion-icon>
            </div>
          </div>
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

  @Input()
  subtitle: string = "";

  @Input()
  data: any;

  @Output()
  private onSubTitleClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onBack: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onRemove: EventEmitter<any> = new EventEmitter<any>();

  constructor(public events: Events) {

  }

  clickSubtitle() {
    this.onSubTitleClick.emit(this);
  }

  goRemove() {
    this.onRemove.emit(this);
  }

  goBack() {
    this.onBack.emit(this);
  }
}
