import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html',
})
export class GroupEditPage {

  public name1
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.name1)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPage');
    this.name1 = this.navParams.get('username');
  }
}
