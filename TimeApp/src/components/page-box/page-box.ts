import {Component, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Content, Events, IonicPage} from 'ionic-angular';
import {SettingsProvider} from "../../providers/settings/settings";
import {StatusType} from "../../data.enum";

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
            <!--<div (click)="goRecord()" *ngIf="buttons.record">-->
              <!--<ion-icon class="fal fa-microphone"></ion-icon>-->
            <!--</div>-->

            <div (click)="goRemove()" *ngIf="buttons.remove">
              <ion-icon class="fal fa-trash-alt"></ion-icon>
            </div>

            <!--<div  (click)="goShare()" *ngIf="buttons.share">-->
              <!--<ion-icon class="fal fa-share"></ion-icon>-->
            <!--</div>-->


            <div  (click)="goCreate()" *ngIf="buttons.create">
              <ion-icon class="fal fa-plus"></ion-icon>
            </div>

            <div  (click)="goSave()" *ngIf="buttons.save">
              <ion-icon class="fal fa-save"></ion-icon>
            </div>

            <!--<div  (click)="goSpeaker()" *ngIf="buttons.speaker">-->
              <!--<ion-icon class="fal fa-ear"></ion-icon>-->
            <!--</div>-->

            <!--<div  (click)="goAccept()" *ngIf="buttons.accept">-->
              <!--<ion-icon class="fal fa-hands-helping"></ion-icon>-->
            <!--</div>-->

            <!--<div  (click)="goReject()" *ngIf="buttons.reject">-->
              <!--<ion-icon class="fal fa-recycle"></ion-icon>-->
            <!--</div>-->

            <div (click)="goBack()" *ngIf="buttons.cancel">
              <ion-icon class="fal fa-times"></ion-icon>
            </div>
          </div>
        </ion-toolbar>
      </ion-header>
      <div class="plansbar" *ngIf="data && plans" [ngStyle]="{
        'background': (data | formatplan: 'summary': '#fff': plans)
      }"></div>
      <ion-content class="page-content" #pagecontent>
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
  plans: any;

  @Input()
  speakData:string;

  @Input()
  buttons: any = {
    // reject: false,
    // record: false,
    // speaker: false,
    // accept: false,
    remove: false,
    share: false,
    save: false,
    create: false,
    cancel: true
  };

  // @Output()
  // private onSubTitleClick: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onBack: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onSave: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onRemove: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  private onCreate: EventEmitter<any> = new EventEmitter<any>();

  // @Output()
  // private onRecord: EventEmitter<any> = new EventEmitter<any>();

  // @Output()
  // private onSpeaker: EventEmitter<any> = new EventEmitter<any>();

  // @Output()
  // private onAccept: EventEmitter<any> = new EventEmitter<any>();
  //
  // @Output()
  // private onReject: EventEmitter<any> = new EventEmitter<any>();

  constructor(private events: Events,
              private renderer2: Renderer2,
              private settings:SettingsProvider) {
    settings.setStatusBarColor(StatusType.page);
  }

  setBoxContent(){
    let height = this.pagecontent._scrollContent.nativeElement.clientHeight;
    this.renderer2.setStyle(this.pagecontent._scrollContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.pagecontent._scrollContent.nativeElement, "overflow-y", height + "hidden");
    this.renderer2.setStyle(this.pagecontent._fixedContent.nativeElement, "height", height + "px");
    this.renderer2.setStyle(this.pagecontent._fixedContent.nativeElement, "overflow-y", height + "hidden");

  }


  // clickSubtitle() {
  //   this.onSubTitleClick.emit(this);
  // }

  goRemove() {
    this.onRemove.emit(this);
  }

  // goShare() {
  //   this.onRemove.emit(this);
  // }

  goSave() {
    this.onSave.emit(this);
  }

  goBack() {
    this.onBack.emit(this);
  }

  goCreate() {
    this.onCreate.emit(this);
  }
  // goRecord() {
  //   this.buttons.record = false;
  //   this.onRecord.emit("开始说话");
  //   this.assistantService.audio2Text((text) => {
  //     this.onRecord.emit(text);
  //
  //   }, () => {
  //     this.buttons.record = true;
  //   }, () => {
  //     this.onRecord.emit("语音不可用");
  //     this.buttons.record = true;
  //   });
  // }
  //
  // goAccept() {
  //   this.onAccept.emit(this);
  // }
  //
  // goReject() {
  //   this.onReject.emit(this);
  // }

  // goSpeaker(){
  //   this.assistantService.speakText(this.speakData).then(()=>{
  //     this.onSpeaker.emit(this);
  //   })
  // }
}
