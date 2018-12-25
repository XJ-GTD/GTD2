import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {RuModel} from "../../model/ru.model";
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {PageConfig} from "../../app/page.config";

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
  isPush:any;//接受用户推送 接受 true
  isPop:any;//是否被拒绝 拒绝 true
  u:RuModel = new RuModel();
  uo:UEntity;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PbPage');
    this.state = false;
    this.u = this.navParams.data.u;
    this.name = this.u.rN;
    if(this.u.rF == '0'){
      this.isPush = false;
    }
    if(this.u.rF == '1'){
      this.isPush = true;
    }
    this.isPop = false;
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


  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }



}
