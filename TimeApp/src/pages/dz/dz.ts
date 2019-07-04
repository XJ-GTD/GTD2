import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { MapOptions } from 'angular2-baidu-map';

@IonicPage()
@Component({
  selector: 'page-dz',
  template: `
  <ion-content>
    <baidu-map [options]="options"></baidu-map>
    <ion-fab>
      <button ion-fab>
        <ion-icon name="logo-facebook"></ion-icon>
      </button>
    </ion-fab>
  </ion-content>
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
