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
          <div class="toolbar">
            <div (click)="goRemove()" *ngIf="buttons.remove">
              <ion-icon class="fa fa-trash-o"></ion-icon>
            </div>

            <div  (click)="goRemove()" *ngIf="buttons.share">
              <ion-icon class="fa fa-share-square-o"></ion-icon>
            </div>

            <div  (click)="save()" *ngIf="buttons.save">
              <ion-icon class="fa fa-floppy-o"></ion-icon>
            </div>
            <div (click)="cancel()" *ngIf="buttons.cancel">
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
export class ModalBoxComponent {
  @Input()
  title: string = "";

  @Input()
  buttons: any = {
    remove: false,
    share: false,
    save: false,
    cancel: true
  };

  @Output()
  private onSave: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCancel: EventEmitter<any> = new EventEmitter<any>();

  constructor(public events: Events) {

  }

  save() {
    this.onSave.emit(this);
  }

  cancel() {
    this.onCancel.emit(this);
  }
}
