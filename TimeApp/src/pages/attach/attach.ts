import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-attach',
  template: `
  <modal-box title="附件" (onClose)="close()">

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
