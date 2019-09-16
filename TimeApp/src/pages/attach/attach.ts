import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `
  <modal-box title="附件" (onClose)="close()">
    <ion-grid>
      <ion-row>
        暂无附件
      </ion-row>
      <ion-row>
        <button ion-button icon-start clear (click)="shot()">
          <ion-icon ios="ios-camera" md="ios-camera"></ion-icon>
          <div>拍照</div>
        </button>
        <button ion-button icon-start clear (click)="select()">
          <ion-icon ios="ios-albums" md="ios-albums"></ion-icon>
          <div>相册</div>
        </button>
      </ion-row>
    </ion-grid>
  </modal-box>
  `
})
export class AttachPage {
  statusBarColor: string = "#3c4d55";

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {

      }
    }
  }

  ionViewDidEnter() {

  }

  close() {
    let data: Object = {attach: {}};
    this.viewCtrl.dismiss(data);
  }

}
