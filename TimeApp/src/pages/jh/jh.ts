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
