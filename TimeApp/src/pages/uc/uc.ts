import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ParamsService} from "../../service/util-service/params.service";
import {UEntity} from "../../entity/u.entity";
import {RelmemService} from "../../service/relmem.service";
import {UserService} from "../../service/user.service";

/**
 * Generated class for the UcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-uc',
  templateUrl: 'uc.html',
  providers: []
})
export class UcPage {
  //编辑控制
  state:any = false;
  uo:UEntity;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              private userService: UserService,
              private loadingCtrl: LoadingController,
              private paramsService: ParamsService) {
    this.init();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UcPage');
  }

  init() {
    this.uo = this.navParams.get("uo");
  }

  updateUserInfo() {

  }

  relation() {
    console.log("UcPage跳转PaPage");
    this.navCtrl.push("PaPage");
  }

  edit(){
    this.state = true;
  }

  confirm(uo:UEntity){
    this.userService.upu(uo.uI,uo.oUI,uo.uN,uo.hIU,uo.biy,uo.uS,uo.uCt,uo.aQ,uo.uT,uo.uty).then(data=>{
      if(data.code == 0){
        this.state = false;
        console.log("修改信息成功")
      }else{
        this.state = true;
        console.log("修改信息失败")
      }
    }).catch(reason => {
      this.state = true;
      console.log("修改信息失败")
    })

  }

}
