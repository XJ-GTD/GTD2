import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UEntity} from "../../entity/u.entity";
import {RuModel} from "../../model/ru.model";
import {RelmemService} from "../../service/relmem.service";
import {HzPage} from "../hz/hz";

/**
 * Generated class for the PePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pe',
  templateUrl: 'pe.html',
})
export class PePage {

  uo:UEntity;
  qcy:Array<RuModel>;

  qmc:any;//群名称


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private relmemService: RelmemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PePage');
  }

  toAddGroupMember(){
    console.log("PePage跳转PgPage")
    this.navCtrl.push("PgPage",{callback:this.getData,sel:this.qcy})
  }

  delete(select:any){
    let flag = this.qcy.indexOf(select);
    console.log(flag);
    let tmp = new Array<RuModel>();
    for(let i = 0; i< this.qcy.length;i++){
      if(i==flag){
        continue;
      }
      tmp.push(this.qcy[i]);
    }
    this.qcy = tmp;

  }

  getData = (data) =>
  {
    return new Promise((resolve, reject) => {
      console.log(data);
      this.qcy = data;
      resolve();
    });
  };

  save(){
    this.relmemService.aru(this.uo.uI,null,this.qmc,null,'1',null,this.qcy).then(data=>{
      if(data.code == 0){
        console.log("添加群成功");
        this.navCtrl.setRoot("PaPage",{popPage: 'HzPage'})

      }else{
        console.log("添加群失败")
      }
    }).catch(reason => {
      console.log("添加群失败")
    })
  }
}
