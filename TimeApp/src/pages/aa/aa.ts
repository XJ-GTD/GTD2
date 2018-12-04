import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParamsService } from "../../service/util-service/params.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the AaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aa',
  templateUrl: 'aa.html',
})
export class AaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private paramsService: ParamsService,

              public util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AaPage');
  }


  logOut() {
    this.paramsService.user = null;
    window.localStorage.clear();
    console.log('AaPage跳转UbPage')
    this.navCtrl.push("UbPage");
  }

  accountSecurity() {

  }

  newsMessage() {

  }

  cleanCache() {

  }

  shareApp() {

  }

  aboutApp() {

  }

  helpAndFeedback() {
    console.log('AaPage跳转AdPage')
    this.navCtrl.push("AdPage");
  }


}

