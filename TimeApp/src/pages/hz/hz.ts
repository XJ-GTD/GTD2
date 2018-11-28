import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { BackButtonService } from "../../service/util-service/backbutton.service";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the HzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hz',
  templateUrl: 'hz.html',
  providers: []
})
export class HzPage {
  @ViewChild('myTabs') tabRef: Tabs;

  hzPage: any = PageConfig.HZ_PAGE;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform,
              public backButtonService: BackButtonService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HzPage');
  }


  userSet() {
    console.log("跳转设置页");
    this.navCtrl.push("AaPage");

  }

  inPrivate() {

  }

  groupListShow() {
    console.log("跳转参与人页");
    this.navCtrl.push('PaPage',{popPage:'HzPage'});
  }

  showHistory() {

  }
}
