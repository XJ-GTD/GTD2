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
  selector: 'page-group-personal-edit',
  templateUrl: 'group-personal-edit.html',
})
export class GroupPersonalEditPage {

  data3: string
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data3 = navParams.data.datas;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPersonalEditPage');
  }
}
