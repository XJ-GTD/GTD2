import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";
import {ScdData, ScdlData, TdlService} from "./tdl.service";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template: `<ion-content>
    <ion-grid>
      <ion-row *ngFor="let sdl of scdlData">
        <div class="w-15 leftside">{{sdl.d}}</div>
        <div class="w-auto rightside" *ngFor ="let scd of sdl.scdl">{{scd.sn}}</div>
      </ion-row>
    </ion-grid>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private tdlServ : TdlService) {
  }

  scdlData :Array<ScdlData> = new Array<ScdlData>();

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');
  }

  ionViewWillEnter() {
    this.init();
  }

  init() {
    let condi =this.navParams.get("dt");
    condi = "2019/01/01";
    this.tdlServ.get(condi).then(data =>{
      this.scdlData = data;
    })
  }


}
