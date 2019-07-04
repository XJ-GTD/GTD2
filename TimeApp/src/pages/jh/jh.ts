import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-jh',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>日历</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list radio-group>
      <ion-item>
        <ion-label>Go</ion-label>
        <ion-radio checked="true" value="go"></ion-radio>
      </ion-item>
      <ion-item>
        <ion-label>Rust</ion-label>
        <ion-radio value="rust"></ion-radio>
      </ion-item>
    </ion-list>
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
export class JhPage {

  constructor(public navCtrl: NavController) {

  }

  close() {
    this.navCtrl.pop();
  }

}
