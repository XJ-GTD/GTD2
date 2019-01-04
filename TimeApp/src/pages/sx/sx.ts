import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PageConfig} from "../../app/page.config";
import {JhService} from "../../service/jh.service";
import {JhModel} from "../../model/jh.model";

/**
 * Generated class for the SxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sx',
  templateUrl: 'sx.html',
})
export class SxPage {

  jhs:Array<JhModel>;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private jhService: JhService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SxPage');
  }

  toSy(jh:JhModel){
    console.log("跳转计划详情页");
    this.navCtrl.push(PageConfig.SY_PAGE,{"jh":jh});
  }

  toSz(){
    console.log("跳转添加计划页");
    this.navCtrl.push(PageConfig.SZ_PAGE,{});
  }

  toSw(){
    console.log("跳转该计划的所有日程");
    this.navCtrl.push(PageConfig.SW_PAGE,{});

  }



  getAllJh(){
    this.jhService.getJhs(null).then(data=>{
      this.jhs = data.jhs;
      console.log("获取计划成功")
    }).catch(reason => {
      console.log("获取计划失败")
    });
  }


  delJh(jh:JhModel) {
    console.log("Sz点击删除 :: ")
  }

  ionViewWillEnter(){
    this.getAllJh();
  }




}
