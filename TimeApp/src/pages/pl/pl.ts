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
  template:
    `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>计划</ion-title>
        <ion-buttons right>
          <button ion-button (click)="newPlan()" color="danger">
            <ion-icon name="add"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-list-header class="plan-list-item">
              全部计划
            </ion-list-header>
            <ion-list>
              <ion-item-sliding *ngFor="let jh of jhs">
                <ion-item class="plan-list-item" (click)="toPd(jh)" *ngIf="jh.jt=='2'">
                  {{jh.jn}}({{jh.js}})
                </ion-item>
              </ion-item-sliding>
            </ion-list>
            <!--<ion-item class="plan-list-item">
              <div class="color-dot color-blue" item-start></div>
              普吉岛休闲游计划 (自由行)
            </ion-item>
            <ion-item class="plan-list-item">
              <div class="color-dot color-pink" item-start></div>
              冥王星计划
            </ion-item>-->
            <ion-list-header class="plan-list-item">
              <div>系统计划</div><small>长按系统计划可清除</small>
            </ion-list-header>
            <!--<ion-item class="plan-list-item">
              节假日
              <button ion-button color="danger" clear item-end>下载</button>
            </ion-item>
            <ion-item class="plan-list-item">
              世界杯小组赛
              <button ion-button color="danger" clear item-end>
                <ion-icon name="sync"></ion-icon>
              </button>
            </ion-item>-->
            <ion-list>
            <ion-item-sliding *ngFor="let jh of jhs">
              <ion-item class="plan-list-item" (click)="toPd(jh)" *ngIf="jh.jt=='1'">
                  {{jh.jn}}({{jh.js}})
                <button ion-button color="danger" clear item-end>
                  <ion-icon name="sync"></ion-icon>
                </button>
              </ion-item>
            </ion-item-sliding>
            </ion-list>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
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
  }

  ionViewWillEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.plService.getPlan().then(data=>{
      //console.debug("获取计划成功，成功返回信息::" + JSON.stringify(data));
      this.jhs = data.pl;
    }).catch(res=>{
      console.log("获取计划失败")
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  newPlan(){
    console.log("跳转添加计划页");
    this.navCtrl.push(DataConfig.PAGE._PC_PAGE,{});
  }

  toPd(jh:PagePDPro){
    console.debug("跳转该计划的所有日程::" + JSON.stringify(jh));
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});

  }

/*  toSy(jh:JhModel){
    console.log("跳转计划详情页");
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});
  }*/

/*  delJh(jh:JhModel) {
    console.log("Pc点击删除 :: ")
    // this.jhService.djh(jh.ji).then(data=>{
    //   this.getAllJh();
    // }).catch(reason => {
    //
    // });
  }*/





}
