import { Component, Input, Output, ElementRef, ViewChild, EventEmitter } from "@angular/core";

@Component({
  selector: 'message-send',
  template: `
  <ion-grid>
    <!-- 文字输入 -->
    <ion-row>
      <button ion-button clear small icon-only>
        <ion-icon ios="md-volume-up" md="md-volume-up"></ion-icon>
      </button>
      <ion-textarea rows="1" type="text" [(ngModel)]="text" class="text-message" autosize maxHeight="400" #textMessage></ion-textarea>
      <button ion-button color="secondary" small>
      发送
      </button>
    </ion-row>
    <!-- 语音输入 -->
    <ion-row>
      <button ion-button clear small icon-only>
        <ion-icon ios="md-keypad" md="md-keypad"></ion-icon>
      </button>
      <button ion-button clear small>
      按住 说话
      </button>
      <button ion-button clear small>
        <ion-icon ios="ios-add-circle-outline" md="ios-add-circle-outline"></ion-icon>
      </button>
    </ion-row>
  </ion-grid>
  `
})
export class MessageSendComponent {

  @ViewChild("textMessage", {read: ElementRef})
  _textMessage: ElementRef;

  @Input("mobile")
  isMobile: boolean = false;

  text: string = "";

  constructor() {
  }

}
