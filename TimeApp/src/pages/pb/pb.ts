import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RuModel} from "../../model/ru.model";
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";

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
  u:RuModel;
  uo:UEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PbPage');
    this.state = false;
    this.u = this.navParams.get("u")
    this.name = this.u.rN;
    if(this.u.rF == '0'){
      this.isPush = false;
    }
    if(this.u.rF == '1'){
      this.isPush = true;
    }
    console.log(this.name + this.state)
  }

  edit(){
    this.state = true;
  }

  confirm(){
    console.log(this.u.rF);
    if(this.isPush){
      this.u.rF = '1';
    }else{
      this.u.rF = '0';
    }
    console.log(this.u.id)
    this.relmemService.upr(this.u.id,this.u.ran,this.u.rN,this.u.rC,this.u.rel,this.u.rF,null).then(data=>{
      if(data.code == 0){
        this.state = false;
      }
    })
    console.log(this.isPush);
  }


}
