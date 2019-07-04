import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { MapOptions } from 'angular2-baidu-map';

@IonicPage()
@Component({
  selector: 'page-dz',
  template: `
  <ion-header no-border>
    <ion-toolbar>
      <ion-title>地址</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <baidu-map [options]="options"></baidu-map>
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
export class DzPage {
  options: MapOptions;  //百度地图选项

  constructor(public navCtrl: NavController) {

    //百度地图设置
    this.options = {
      centerAndZoom: {
        lat: 39.920116,
        lng: 116.403703,
        zoom: 8
      },
      enableKeyboard: true
    }
  }

  close() {
    this.navCtrl.pop();
  }

}
