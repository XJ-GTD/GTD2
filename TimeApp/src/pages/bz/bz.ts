import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';

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
    <ion-textarea type="text" placeholder="备注" [(ngModel)]="bz" class="memo-set" autosize maxHeight="400"></ion-textarea>
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

  bz: string = "";  //备注

  constructor(public navCtrl: NavController) {

  }

  close() {
    this.navCtrl.pop();
  }

}
