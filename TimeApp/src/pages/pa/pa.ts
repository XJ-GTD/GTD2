import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pa',
  templateUrl: 'pa.html',
})
export class PaPage {

  relation: any = 'persional' ;
  indexs : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaPage');
    this.indexs=[1,2,3,4,5,6,7,8,9];
  }

  toAddMemebr(){
    this.navCtrl.push('PfPage');
  }

  toGroupMember(){
    this.navCtrl.push('PdPage');
  }

  toGroupCreate(){
    this.navCtrl.push("PePage");
  }

  toMemberDetail(){
    this.navCtrl.push("PbPage");
  }

  goBack() {
    this.navCtrl.pop();
  }

}
