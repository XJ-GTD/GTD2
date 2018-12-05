import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";


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
  uo:UEntity;
  g:RuModel;
  us:Array<RuModel>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PdPage');
    this.indexs=[1,2,3,4,5,6,7,8,9]
    this.g = this.navParams.get('g');
    this.init();
  }

  init(){
    this.queryGAll();
  }

  toMemberDetail(u){
    console.log("PdPage跳转PbPage")
    this.navCtrl.push("PbPage",{u:u});
  }

  goBack(){
    this.navCtrl.pop()
  }

  queryGAll(){
    this.relmemService.getRgus(this.g.id).then(data=>{
      if(data.code == 0){
        console.log("查询群组成员成功")
        this.us = data.us;
      }else{
        console.log("查询群组成员失败")
      }
    }).catch(reason => {
      console.log("查询群组成员失败")
    })
  }

  delete(u){
    this.relmemService.delRgu(u.id).then(data=>{
      if(data.code == 0 ){
        console.log("删除群组成员成功")
        this.queryGAll();
      }else{
        console.log("删除群组成员失败")
      }
    }).catch(reason => {
      console.log("删除群组成员失败")
    })
  }
}
