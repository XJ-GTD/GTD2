import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Renderer2
} from '@angular/core';
import {Content, Events} from 'ionic-angular';
import {StatusType} from "../../data.enum";
import {SettingsProvider} from "../../providers/settings/settings";

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
    <div class="box-modal" >

      <ion-header class="box-header">
        <ion-toolbar>
          <ion-title>
            {{title}}
          </ion-title>
          <div class="toolbar">
            <div (click)="goRefresh()" *ngIf="buttons.refresh">
              <ion-icon class="fal fa-sync"></ion-icon>
            </div>
            <div (click)="create()" *ngIf="buttons.create">
              <ion-icon class="fal fa-plus"></ion-icon>
            </div>
            <div  (click)="goShare()" *ngIf="buttons.share">
                <ion-icon class="fad fa-share-alt"></ion-icon>
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
        <div class = "disdiv" [hidden]="enableEdit" ></div>
        <ng-content ></ng-content>
      </ion-content>
    </div>
  `
})
export class ModalBoxComponent {
  @Input()
  title: string = "";

  @Input()
  speakData:string;

  @Input()
  enableEdit:boolean = true;

  @ViewChild('modalcontent') modalcontent: Content;

  @Input()
  buttons: any = {
    save: false,
    refresh: false,
    create: false,
    // remove: false,
     share: false,
    // record: false,
    // speaker: false,
    cancel: true
  };

  @Output()
  private onSave: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onCreate: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onShare: EventEmitter<any> = new EventEmitter<any>();
  // @Output()
  // private onRecord: EventEmitter<any> = new EventEmitter<any>();
  // @Output()
  // private onSpeaker: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  private onRefresh: EventEmitter<any> = new EventEmitter<any>();


  constructor(public events: Events, private renderer2: Renderer2,
              private settings:SettingsProvider) {
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

  goRefresh() {
    this.onRefresh.emit(this);
  }

  goShare() {
    this.onShare.emit(this);
  }

}
