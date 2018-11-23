import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { BackButtonService } from "../../service/util-service/backbutton.service";

/**
 * Generated class for the HomeMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-menu',
  templateUrl: 'home-menu.html',
  providers: []
})
export class HomeMenuPage {
  @ViewChild('myTabs') tabRef: Tabs;

  menuPage: any = 'HomePage';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform,
              public backButtonService: BackButtonService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuPage');
  }


  userSet() {
    console.log("跳转设置页");
    this.navCtrl.push("UserSetPage");

  }

  inPrivate() {

  }

  groupListShow() {
    console.log("跳转参与人页");
    this.navCtrl.push('GroupListPage',{popPage:'HomeMenuPage'});
  }

  showHistory() {

  }
}
