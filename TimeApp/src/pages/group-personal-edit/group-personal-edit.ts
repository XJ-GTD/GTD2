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

  data3: string;
  isEdit: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data3 = navParams.data.groupId;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPersonalEditPage');
  }

  personaledit(){
    if(this.isEdit==true){
      this.isEdit=false;
    }else {
      this.isEdit=true;
    }
  }

}
