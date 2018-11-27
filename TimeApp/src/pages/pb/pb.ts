import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pb',
  templateUrl: 'pb.html',
})
export class PbPage {

  name:any;
  state:any;//true 编辑 false 不可编辑
  isPush:any;
  lableColor:any = 'red'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PbPage');
    this.name = "旺财"
    this.state = false;
    console.log(this.name + this.state)
  }

  edit(){
    this.state = true;
  }

  confirm(){
    this.state = false;
    console.log(this.isPush);
  }


}
