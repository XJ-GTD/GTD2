import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RelationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relation-list',
  templateUrl: 'relation-list.html',
})
export class RelationListPage {

  relation: any = 'persional' ;
  indexs : any;
  popPage:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelationListPage');
    this.indexs=[1,2,3,4,5,6,7,8,9];
    this.popPage = this.navParams.get('popPage');
  }

  toAddMemebr(){
    this.navCtrl.push('PersonalAddPage');
  }

  toGroupMember(){
    this.navCtrl.push('GroupMemberPage');
  }

  toGroupCreate(){
    this.navCtrl.push("GroupCreatePage");
  }

  toMemberDetail(){
    this.navCtrl.push("MemberDetailPage");
  }

  goBack() {
    this.navCtrl.pop();
  }


}
