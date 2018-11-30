import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RelmemService} from "../../service/relmem.service";
import {UEntity} from "../../entity/u.entity";


/**
 * Generated class for the PcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  templateUrl: 'pc.html',
})
export class PcPage {

  uo:UEntity;

  name:any;
  tel:any;
  code:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private relme:RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
    this.name = this.navParams.get("name");
    this.tel=this.navParams.get("tel");
    this.code = this.navParams.get("code");
    this.uo = this.navParams.get("uo");
  }

  submit() {
    this.relme.aru('', '', this.tel, '0').then(data => {

    }).catch(reason => {

    })
  }
}
