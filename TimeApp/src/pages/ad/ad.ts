import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import {DwEmitService} from "../../service/util-service/dw-emit.service";

/**
 * Generated class for the AdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ad',
  templateUrl: 'ad.html',
})
export class AdPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private dwEmit: DwEmitService) {
    this.dwEmit.getAdPage(this);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdPage');
  }

  test($event) {
    alert("测试adpage");
  }
}
