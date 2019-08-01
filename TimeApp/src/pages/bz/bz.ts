import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";

@IonicPage()
@Component({
  selector: 'page-bz',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>备注</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-textarea type="text" placeholder="备注" [(ngModel)]="bz" class="memo-set" autosize maxHeight="400" #bzRef></ion-textarea>
  </ion-content>

  <ion-footer class="foot-set">
    <ion-toolbar>
    <button ion-button full (click)="close()">
      关闭
    </button>
    </ion-toolbar>
  </ion-footer>
  `
})
export class BzPage {
  statusBarColor: string = "#3c4d55";

  @ViewChild("bzRef", {read: ElementRef})
  _bzRef: ElementRef;

  bz: string = "";  //备注

  constructor(public navCtrl: NavController,
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
    this.navCtrl.pop();
  }

}
