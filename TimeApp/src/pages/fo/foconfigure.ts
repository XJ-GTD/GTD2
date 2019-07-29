import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {SsService} from "../ss/ss.service";
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the 项目跟进 通知对象可选项 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-foconfigure',
  template:
  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
          <img class="img-header-left" src="./assets/imgs/back.png">
        </button>
      </ion-buttons>
      <ion-title>选项</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content padding>
    <ion-grid>
      <ion-row>
        <ion-grid>
          <ion-row align-items-center justify-content-center>
            {{item.name}}
          </ion-row>
          <ion-row align-items-center justify-content-center>
            {{item.description}}
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <small>共享给</small>
          </ion-row>
        </ion-grid>
      </ion-row>
    </ion-grid>
  </ion-content>
  `
})
export class FoConfigurePage {

  private target: any;
  private item: any = {
    name: "",
    description: "",
    from: [],
    shareto: []
  };

  constructor(public modalController: ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private iab: InAppBrowser,
              private ssService: SsService,
              private _renderer: Renderer2) {
    if (this.navParams.get('target')) {
      this.target = this.navParams.get('target');

      this.item = getItem(this.target);
    }
  }

  getItem(source: any): any {
    return {
      name: source.ins.keyname,
      description: source.ins.key,
      from: source.froms || [],
      shareto: source.shares || []
    };
  }

  goBack() {
    this.navCtrl.pop();
  }
}
