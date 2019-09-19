import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {File} from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `
  <modal-box title="附件" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
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

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private file :File,
              private fileTransfer:FileTransfer,
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {

      }
    }
  }

  ionViewDidEnter() {

  }

  save() {
    let data: Object = {attach: {}};
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.navCtrl.pop();
  }

  /**
  * 拍照  ying<343253410@qq.com>
  */
  shot() {

  }

  /**
  * 文件上传  ying<343253410@qq.com>
  */
  select() {

  }
}
