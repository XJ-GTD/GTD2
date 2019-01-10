import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, ViewController} from 'ionic-angular';
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

  @ViewChild(Navbar) navBar: Navbar;

  jhs:Array<JhModel>;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private jhService: JhService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SxPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
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

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
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
    this.jhService.djh(jh.ji).then(data=>{
      this.getAllJh();
    }).catch(reason => {

    });
  }

  ionViewWillEnter(){
    this.getAllJh();
  }




}
