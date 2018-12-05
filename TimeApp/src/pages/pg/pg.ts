import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {RuModel} from "../../model/ru.model";

/**
 * Generated class for the PgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pg',
  templateUrl: 'pg.html',
})
export class PgPage {

  indexs:any;
  uo:UEntity;

  us:Array<RuModel>;
  sel:Array<RuModel> =  Array<RuModel>();
  callback:any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PgPage');
    this.indexs=[{"name":"张三","select":"false"},{"name":"李四","select":"false"}]
    this.queryAllRel();
    this.callback = this.navParams.get("callback");
    this.sel = this.navParams.get("sel");
    if(this.sel != undefined){
      console.log(this.sel.length)
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  showSelect(){
    console.log("点击确定")

    this.callback(this.sel).then(()=>{
      console.log("PgPage跳转PePage")
      this.navCtrl.pop();
    })
  }


  queryAllRel(){
    this.relmemService.getrus(null,null,null,null,'0').then(data=>{
      console.log(data.us.length)
      if(data.code == 0){
        this.us = data.us;
      }
    }).catch(reason => {

    })
  }

  selected(u,event){
    if(this.sel == undefined){
      this.sel = new Array<RuModel>();
    }
    if(event.checked){
      this.sel.push(u)
    }else{
      let tmp = new Array<RuModel>();
      for(let i = 0;i<this.sel.length;i++){
        if(u.id != this.sel[i].id){
          tmp.push(this.sel[i]);
        }
      }
      this.sel = tmp;
    }
    console.log(this.sel.length)
  }

  checkSel(u){
    if(this.sel == undefined){
      return false;
    }
    let tmp = new Array<RuModel>();
    for(let i = 0;i<this.sel.length;i++){
      if(u.id == this.sel[i].id){
        return true;
      }
    }
    return false;
  }

}
