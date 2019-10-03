import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController} from 'ionic-angular';
import {SsService} from "../../ss/ss.service";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {DataConfig} from "../../../service/config/data.config";

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
            <h3 class="h3-center">{{item.name}}</h3>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p class="p-center">{{item.description}}</p>
          </ion-row>
          <ion-row align-items-center justify-content-center>
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.button">
            <button ion-button color="light" class="border" clear round (click)="openUrl(item.button.url)">{{item.button.name}}</button>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.button">
            <p></p>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.from && item.from.length > 0">
            <small>来自于</small>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.from && item.from.length > 0">
            <div class="avatars">
              <div *ngFor="let from of item.from">
                <ion-avatar>
                  <img [src]="from.bhiu">
                </ion-avatar>
                {{from.name}}
              </div>
            </div>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.shareto && item.shareto.length > 0">
            <small>共享给</small>
          </ion-row>
          <ion-row align-items-center justify-content-center *ngIf="item.shareto && item.shareto.length > 0">
            <div class="avatars">
              <div *ngFor="let share of item.shareto">
                <ion-avatar>
                  <img [src]="share.bhiu">
                </ion-avatar>
                {{share.name}}
              </div>
            </div>
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

      this.item = this.getItem(this.target);
    }
  }

  getItem(source: any): any {
    if (source.ins.type == DataConfig.SYS_FOGH_INS
    || source.ins.type == DataConfig.SYS_FOGHIN_INS) {
      return {
        name: source.ins.keyname,
        description: source.ins.value.description || "",
        from: (source.from? source.from.froms : []) || [],
        shareto: (source.share? source.share.shares : []) || []
      };
    }
    if (source.ins.type == DataConfig.SYS_FOFIR_INS
    || source.ins.type == DataConfig.SYS_FOFIRIN_INS) {
      return {
        name: source.ins.keyname,
        description: source.ins.key,
        from: (source.from? source.from.froms : []) || [],
        shareto: (source.share? source.share.shares : []) || [],
        button: {
          name: "下载",
          url: source.ins.key
        }
      };
    }
  }

  openUrl(url: string) {
    const browser = this.iab.create(url, "_system");
  }

  goBack() {
    this.navCtrl.pop();
  }
}
