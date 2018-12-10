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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relme:RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
    this.name = this.navParams.get("name");
    this.tel=this.navParams.get("tel");
    this.code = this.navParams.get("code");
    this.uo = this.navParams.get("uo");
  }


  submit() {
    this.relme.aru(this.uo.uI,this.name, null, this.tel, '0','0',null).then(data => {
      if(data.code == 0){
        //添加成功
        console.log("添加成功::" + this.tel)
        this.navCtrl.setRoot("PaPage","HzPage")
      }else{
        //添加失败
        console.log("添加失败::" + this.tel);
      }

    }).catch(reason => {
      //添加失败
      console.log("添加失败::" + this.tel);
    })
  }
}
