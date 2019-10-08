import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ContentChildren,
  QueryList,
  Renderer2, ChangeDetectorRef
} from '@angular/core';
import {Content, Events} from 'ionic-angular';
import {AssistantService} from "../../service/cordova/assistant.service";
import {EmitService} from "../../service/util-service/emit.service";

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
        <ion-toolbar>
          <ion-title>
            {{title}}
          </ion-title>
          <div class="toolbar">
            <div (click)="record()" *ngIf="buttons.record">
              <ion-icon class="fal fa-microphone"></ion-icon>
            </div>
            <div (click)="goRemove()" *ngIf="buttons.remove">
              <ion-icon class="fal fa-eraser"></ion-icon>
            </div>
            <div (click)="goRemove()" *ngIf="buttons.share">
              <ion-icon class="fal fa-share"></ion-icon>
            </div>
            <div (click)="create()" *ngIf="buttons.create">
              <ion-icon class="fal fa-plus"></ion-icon>
            </div>
            <div (click)="save()" *ngIf="buttons.save">
              <ion-icon class="fal fa-check"></ion-icon>
            </div>
            <div (click)="cancel()" *ngIf="buttons.cancel">
              <ion-icon class="fal fa-times"></ion-icon>
            </div>
          </div>
        </ion-toolbar>
      </ion-header>
      <ion-content class="box-content" #modalcontent>
        <ng-content></ng-content>
      </ion-content>
    </div>
  `
})
export class ModalBoxComponent {
  @Input()
  title: string = "";

  @ViewChild('modalcontent') modalcontent: Content;

  @Input()
  buttons: any = {
    remove: false,
    share: false,
    save: false,
    record: false,
    create: false,
    cancel: true
  };

  @Output()
  private onSave: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCancel: EventEmitter<any> = new EventEmitter<any>();


  @Output()
  private onCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onRecord: EventEmitter<any> = new EventEmitter<any>();


  constructor(public events: Events, private renderer2: Renderer2,
              private assistantService: AssistantService) {

  }

  setBoxContent() {
    let height = this.modalcontent._scrollContent.nativeElement.clientHeight;
    this.renderer2.setStyle(this.modalcontent._scrollContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.modalcontent._scrollContent.nativeElement, "overflow-y", height + "hidden");
    this.renderer2.setStyle(this.modalcontent._fixedContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.modalcontent._fixedContent.nativeElement, "overflow-y", height + "hidden");

  }

  save() {
    this.onSave.emit(this);
  }

  cancel() {
    this.onCancel.emit(this);
  }

  create() {
    this.onCreate.emit(this);
  }

  record() {
    this.buttons.record = false;
    this.onRecord.emit("开始说话");
    this.assistantService.audio2Text((text) => {
      this.onRecord.emit(text);

    }, () => {
      this.buttons.record = true;
    }, () => {
      this.onRecord.emit("语音不可用");
      this.buttons.record = true;
    });
  }
}
