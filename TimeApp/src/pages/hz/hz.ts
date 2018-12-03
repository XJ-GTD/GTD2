import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Tabs } from 'ionic-angular';
import { BackButtonService } from "../../service/util-service/backbutton.service";
import {PageConfig} from "../../app/page.config";
import {UserService} from "../../service/user.service";
import {UModel} from "../../model/u.model";
import {UEntity} from "../../entity/u.entity";

/**
 * Generated class for the HzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hz',
  templateUrl: 'hz.html',
  providers: []
})
export class HzPage {
  @ViewChild('myTabs') tabRef: Tabs;

  haPage: any = PageConfig.HA_PAGE;
  // uo: UModel;
  uo:UEntity;

  name:any="小强";
  tel:any="133****1233";


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform,
              public backButtonService: BackButtonService,
              public userService: UserService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HzPage');
    this.getuo();
  }


  userSet() {
    console.log("跳转设置页");
    this.navCtrl.push("AaPage");

  }

  inPrivate() {

  }

  playerListShow() {
    console.log("跳转参与人页");
    this.navCtrl.push('PaPage',{popPage:'HzPage'});
  }

  sbAdd(){
    console.log("跳转日程添加")
    this.navCtrl.push('SbPage',{popPage:'HzPage'});
  }

  toUc(){
    console.log("跳转用户详情")
    this.navCtrl.push('UcPage',{popPage:'HzPage'});
  }

  showHistory() {

  }

  getuo(){
    this.userService.getUo().then(data=>{
      if(data.code == 0){
        // this.uo = this.UeToUM(data.u);
        this.uo = data.u;
        this.name = this.uo.uN;
      }
      console.log(data)
      console.log(this.uo)
      console.log(this.uo.uN)
    }).catch(reason => {

    })
  }

  UeToUM(ue:UEntity){
    let um = new UModel();
    um.uI = ue.uI;

    return um;
  }


}
