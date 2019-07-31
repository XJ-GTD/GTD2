import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'message-send',
  template: `
  <ion-grid>
    <!-- 文字输入 -->
    <ion-row>
      <button ion-button clear small>
        <ion-icon ios="md-volume-up" md="md-volume-up"></ion-icon>
      </button>
    </ion-row>
    <!-- 语音输入 -->
    <ion-row>
      <button ion-button clear small>
        <ion-icon ios="md-keypad" md="md-keypad"></ion-icon>
      </button>
      <button ion-button clear small>
      按住 说话
      </button>
    </ion-row>
  </ion-grid>
  `
})
export class MessageSendComponent {

  @Input("mobile")
  isMobile: boolean = false;

  constructor() {
  }

}
