import { Component, Input, Output, ElementRef, ViewChild, EventEmitter } from "@angular/core";

@IonicPage()
@Component({
  selector: 'recording',
  template: `<ion-grid [ngClass]="{'active': active}">
    <ion-row justify-content-center>
      <ion-icon ios="ios-microphone" md="ios-microphone"></ion-icon>
      <svg width="32" height="56" xmlns="http://www.w3.org/2000/svg">
       <g>
        <title>Layer 1</title>
        <rect id="svg_1" height="2" width="3" y="45.63281" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_2" height="2" width="6" y="41.67448" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_3" height="2" width="9" y="37.71615" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_4" height="2" width="12" y="33.75781" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_5" height="2" width="15" y="29.59115" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_6" height="2" width="18" y="25.42448" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_7" height="2" width="21" y="21.25781" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_8" height="2" width="24" y="17.09115" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_9" height="2" width="27" y="12.71615" x="1" stroke="#fff" fill="#fff"/>
        <rect id="svg_10" height="2" width="30" y="8.34115" x="1" stroke="#fff" fill="#fff"/>
       </g>
      </svg>
    </ion-row>
    <ion-row justify-content-center *ngIf="!canceling">手指上划, 取消发送</ion-row>
    <ion-row justify-content-center *ngIf="canceling">松开手指, 取消发送</ion-row>
  </ion-grid>`
})
export class RecordingComponent {

  @Input("volume")
  volume: number = 0;

  @Input("active")
  active: boolean = false;

  @Input("canceling")
  canceling: boolean = false;

  constructor() {
  }

}
