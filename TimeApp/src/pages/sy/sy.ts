import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {JhModel} from "../../model/jh.model";

/**
 * Generated class for the SyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sy',
  templateUrl: 'sy.html',
})
export class SyPage {

  jh: JhModel;
  isEdit:boolean;

  jn:string;
  jg:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyPage');
  }

  ionViewWillEnter(){
    this.jh = this.navParams.get("jh");
    this.isEdit = false;
  }

  edit(){
    this.isEdit = !this.isEdit;
  }

  save(){
    console.log("输入计划名称 :: " + this.jn);
    console.log("输入计划描述 :: " + this.jg);
    if(this.jn !== undefined){
      this.jh.jn = this.jn;
    }
    if(this.jg !== undefined){
      this.jh.jg = this.jg;
    }
    this.jn = undefined;
    this.jg = undefined;
    this.isEdit = !this.isEdit;
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
