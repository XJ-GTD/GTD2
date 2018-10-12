import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { BackButtonService } from "../../service/backbutton.service";

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
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.backButtonService.registerBackButtonAction(null);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuPage');
  }


  userSet() {
    console.log("跳转设置页");
    this.navCtrl.push("UserSetPage");
  }


}
