import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";

@IonicPage()
@Component({
  selector: 'page-comment',
  template: `
  <modal-box title="备注" onClose="close()">
    <ion-textarea type="text" placeholder="备注" [(ngModel)]="bz" class="memo-set" autosize maxHeight="400" #bzRef></ion-textarea>
  </modal-box>
  `
})
export class CommentPage {
  statusBarColor: string = "#3c4d55";

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;

  bz: string = "";  //备注

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private keyboard: Keyboard) {
    if (this.navParams && this.navParams.data) {
      let value = this.navParams.data.value;

      if (value) {
        this.bz = value;
      }
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      let el = this._bzRef.nativeElement.querySelector('textarea');
      el.focus();
      this.keyboard.show();   //for android
    }, 500);
  }

  close() {
    let data: Object = {bz: this.bz};
    this.viewCtrl.dismiss(data);
  }

}
