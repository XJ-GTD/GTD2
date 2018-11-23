import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PersonalAddDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-personal-add-detail',
  templateUrl: 'personal-add-detail.html',
})
export class PersonalAddDetailPage {

  name:any;
  tel:any;
  code:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalAddDetailPage');
    this.name = this.navParams.get("name");
    this.tel=this.navParams.get("tel");
    this.code = this.navParams.get("code");
  }

}
