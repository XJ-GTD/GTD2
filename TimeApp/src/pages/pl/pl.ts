import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, ViewController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {PagePlData, PlService} from "./pl.service";
import {PageRData} from "../r/r.service";
import {PagePDPro} from "../pd/pd.service";

/**
 * Generated class for the PlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pl',
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>计划一览</ion-title>' +
  '    <ion-buttons right>' +
  '      <button ion-button (click)="toPc()">添加</button>' +
  '    </ion-buttons>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <!--<button (click)="toTmd()">1!!!!</button>-->' +
  '  <ion-list>' +
  '    <ion-item-sliding *ngFor="let jh of jhs">' +
  '      <ion-item (click)="toPd(jh)">' +
  '        <p style="font-size: 1.7rem;line-height: 20px;">{{jh.jn}}<strong>({{jh.js}})</strong></p>' +
  '        <p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{jh.jg}}</p>' +
  '      </ion-item>' +
  '      <ion-item-options side="right">' +
  '        <button ion-button color="primary" (click)="toSy(jh)">详情</button>' +
  '        <button ion-button color="danger" (click)="delJh(jh)">删除</button>' +
  '      </ion-item-options>' +
  '    </ion-item-sliding>' +
  '  </ion-list>' +
  '</ion-content>',
})
export class PlPage {

  @ViewChild(Navbar) navBar: Navbar;

  jhs:any;

  //jhs:Array<JhModel>;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private plService:PlService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  ionViewWillEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.plService.getPlan().then(data=>{
      console.log("获取计划成功");
      console.debug("成功返回信息::" + JSON.stringify(data));
      this.jhs = data.pl;
    }).catch(res=>{
      console.log("获取计划失败")
    });
  }

  toPc(){
    console.log("跳转添加计划页");
    this.navCtrl.push(DataConfig.PAGE._PC_PAGE,{});
  }

  toPd(jh:PagePDPro){
    console.debug("PD_PAGE::" + JSON.stringify(jh));
    console.log("跳转该计划的所有日程");
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});

  }

/*  toSy(jh:JhModel){
    console.log("跳转计划详情页");
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});
  }*/

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  }

/*  delJh(jh:JhModel) {
    console.log("Pc点击删除 :: ")
    // this.jhService.djh(jh.ji).then(data=>{
    //   this.getAllJh();
    // }).catch(reason => {
    //
    // });
  }*/





}
