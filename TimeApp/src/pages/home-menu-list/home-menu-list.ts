import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HomeMenuListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-menu-list',
  templateUrl: 'home-menu-list.html',
})
export class HomeMenuListPage {
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  rootPage = 'FooterPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeMenuListPage');
  }

  itemTapped(event, item) {
    this.navCtrl.push('HomeMenuItemDetailPage', {
      item: item
    });
  }
}
