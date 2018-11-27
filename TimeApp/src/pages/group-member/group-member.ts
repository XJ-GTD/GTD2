import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the GroupMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-member',
  templateUrl: 'group-member.html',
})
export class GroupMemberPage {
  indexs:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupMemberPage');
    this.indexs=[1,2,3,4,5,6,7,8,9]
  }

  toMemberDetail(){
    this.navCtrl.push("MemberDetailPage");
  }

  goBack(){
    this.navCtrl.pop()
  }


}
