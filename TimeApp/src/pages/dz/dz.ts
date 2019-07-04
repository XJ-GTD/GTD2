import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Scroll } from 'ionic-angular';
import { MapOptions, NavigationControlOptions, NavigationControlType } from 'angular2-baidu-map';

@IonicPage()
@Component({
  selector: 'page-dz',
  template: `
  <ion-content>
    <baidu-map [options]="options">
      <control type="navigation" [options]="navOptions"></control>
    </baidu-map>
    <ion-fab bottom center>
      <button ion-fab (click)="close()">
        <ion-icon name="checkmark"></ion-icon>
      </button>
    </ion-fab>
  </ion-content>
  `
})
export class DzPage {
  options: MapOptions;  //百度地图选项
  navOptions: NavigationControlOptions; //百度导航条选项

  constructor(public navCtrl: NavController) {

    //百度地图设置
    this.options = {
      centerAndZoom: {
        lat: 39.920116,
        lng: 116.403703,
        zoom: 8
      },
      enableKeyboard: true
    };

    //百度地图导航条选项
    this.navOptions = {
  		anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
  		type: NavigationControlType.BMAP_NAVIGATION_CONTROL_PAN
	  };
  }

  close() {
    this.navCtrl.pop();
  }

}
