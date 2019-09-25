import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ContentChildren,
  QueryList,
  Renderer2
} from '@angular/core';
import {Content, Events, Ion, IonicPage} from 'ionic-angular';

/**
 * Generated class for the ScrollSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@IonicPage()
@Component({
  selector: 'page-box',
  template:
  `
    <div class="box-page">
      <ion-header class="box-header">
        <ion-toolbar >
          <ion-title>
          {{title}}
            <span *ngIf="subtitle" class="subtilte">
              {{subtitle}}
            </span>
          </ion-title>
          <div class="toolbar">
            <div (click)="goRemove()" *ngIf="buttons.remove">
              <ion-icon class="fal fa-trash"></ion-icon>
            </div>

            <div  (click)="goShare()" *ngIf="buttons.share">
              <ion-icon class="fal fa-share"></ion-icon>
            </div>


            <div  (click)="goCreate()" *ngIf="buttons.create">
              <ion-icon class="fal fa-plus"></ion-icon>
            </div>
            

            <div  (click)="goSave()" *ngIf="buttons.save">
              <ion-icon class="fal fa-save"></ion-icon>
            </div>
            <div (click)="goBack()" *ngIf="buttons.cancel">
              <ion-icon class="fal fa-undo"></ion-icon>
            </div>
          </div>
        </ion-toolbar>
      </ion-header>
      <ion-content class="box-content" #pagecontent>
        <ng-content></ng-content>
      </ion-content>
    </div>
  `
})
export class PageBoxComponent{

  @ViewChild('pagecontent') pagecontent: Content;

  @Input()
  title: string = "";

  @Input()
  subtitle: string = "";

  @Input()
  data: any;

  @Input()
  buttons: any = {
    remove: false,
    share: false,
    save: false,
    create: false,
    cancel: true
  };

  @Output()
  private onSubTitleClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onBack: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onSave: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onRemove: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCreate: EventEmitter<any> = new EventEmitter<any>();

  constructor(public events: Events,
            private renderer2: Renderer2,) {

  }

  setBoxContent(){
    let height = this.pagecontent._scrollContent.nativeElement.clientHeight;
    this.renderer2.setStyle(this.pagecontent._scrollContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.pagecontent._scrollContent.nativeElement, "overflow-y", height + "hidden");
    this.renderer2.setStyle(this.pagecontent._fixedContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.pagecontent._fixedContent.nativeElement, "overflow-y", height + "hidden");

  }


  clickSubtitle() {
    this.onSubTitleClick.emit(this);
  }

  goRemove() {
    this.onRemove.emit(this);
  }

  goShare() {
    this.onRemove.emit(this);
  }

  goSave() {
    this.onSave.emit(this);
  }

  goBack() {
    this.onBack.emit(this);
  }

  goCreate() {
    this.onCreate.emit(this);
  }
}
