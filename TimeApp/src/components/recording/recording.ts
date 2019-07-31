import { Component, Input, Output, ElementRef, ViewChild, EventEmitter } from "@angular/core";

@IonicPage()
@Component({
  selector: 'recording',
  template: `
  <ion-grid [ngClass]="{'active': active}">
    <ion-row>
      <ion-icon ios="ios-microphone" md="ios-microphone"></ion-icon>
      <svg width="50" height="56" xmlns="http://www.w3.org/2000/svg">
       <g>
        <title>background</title>
        <rect fill="#fff" id="canvas_background" height="58" width="52" y="-1" x="-1"/>
        <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
         <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%"/>
        </g>
       </g>
       <g>
        <title>Layer 1</title>
        <rect id="svg_1" height="2" width="3" y="45.63281" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_2" height="2" width="6" y="41.67448" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_3" height="2" width="9" y="37.71615" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_4" height="2" width="12" y="33.75781" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_5" height="2" width="15" y="29.59115" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_6" height="2" width="18" y="25.42448" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_7" height="2" width="21" y="21.25781" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_8" height="2" width="24" y="17.09115" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_9" height="2" width="27" y="12.71615" x="10" stroke="#000" fill="#000000"/>
        <rect id="svg_10" height="2" width="30" y="8.34115" x="10" stroke="#000" fill="#000000"/>
       </g>
      </svg>
    </ion-row>
    <ion-row>手指上划, 取消发送</ion-row>
    <ion-row>松开手指, 取消发送</ion-row>
  </ion-grid>`
})
export class RecordingComponent {

  @Input("volume")
  volume: number = 0;

  @Input("active")
  active: boolean = false;

  constructor() {
  }

}