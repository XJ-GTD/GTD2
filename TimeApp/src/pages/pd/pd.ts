import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the PdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pd',
  templateUrl: 'pd.html',
})
export class PdPage {
  indexs:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');
    this.indexs=[1,2,3,4,5,6,7,8,9]
  }

  toMemberDetail(){
    this.navCtrl.push("PbPage");
  }

  goBack(){
    this.navCtrl.pop()
  }


}
