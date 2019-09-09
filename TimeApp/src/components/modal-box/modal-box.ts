import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, ContentChildren, QueryList} from '@angular/core';
import {Events} from 'ionic-angular';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-box',
  template:
      `
    <div class="box-modal">
      <ion-header class="box-header">
        <ion-toolbar >
          <ion-title>
          {{title}}
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="box-content">
        <ng-content></ng-content>
      </ion-content>
      <ion-footer class="foot-set">
        <ion-toolbar>
        <button ion-button full (click)="close()">
          关闭
        </button>
        </ion-toolbar>
      </ion-footer>
    </div>
  `
})
export class PageBoxComponent {
  @Input()
  title: string = "";

  @Output()
  private onClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(public events: Events) {

  }

  close() {
    this.onClose.emit(this);
  }

}
