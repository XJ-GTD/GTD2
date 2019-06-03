import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SsService} from "../ss/ss.service";
import {Setting, UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";
import * as moment from "moment";
import {PageY} from "../../data.mapping";

/**
 * Generated class for the 每日简报设置 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dr',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <!--<ion-icon name="arrow-back"></ion-icon>-->
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>每日简报</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-grid>
            <ion-row align-items-center justify-content-center>
              获得每天的日程安排摘要
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <p></p>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <h1 class="h1-danger">{{notifytime| formatedate:"HH:mm"}} <small>{{notifytime| formatedate:"A"}}</small></h1>
            </ion-row>
            <ion-row align-items-center justify-content-center class="golden-margin">
              <small>每天</small>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <ion-list>
                <ion-item class="bg-transparent no-border" no-margin>
                  <ion-range [(ngModel)]="notifytime" (ionChange)="save(defaultnotifytime, getTime(notifytime))" debounce="1000" [min]="min" [max]="max" [step]="step" pin="false" dualKnobs="false" snaps="false"></ion-range>
                </ion-item>
              </ion-list>
            </ion-row>
            <ion-row align-items-center justify-content-center>
              <button ion-button full outline class="no-border" color="danger" (click)="save(dr, !bdr)">{{bdr? '关闭' : '打开'}}</button>
            </ion-row>
          </ion-grid>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class DrPage {
  min: number = moment('2019/6/3 00:00:00').unix() * 1000;
  max: number = moment('2019/6/3 23:59:59').unix() * 1000;
  step: number = 5 * 60 * 1000; //15分钟
  notifytime: number = moment('2019/6/3 08:30:00').unix() * 1000;

  dr:Setting;//每日简报 智能提醒
  bdr:boolean;//每日简报 页面显示和修改

  defaultnotifytime: Setting;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public ssService: SsService,
              private util : UtilService,
              private modalCtrl: ModalController) {
    this.dr = UserConfig.settins.get(DataConfig.SYS_DR);
    this.defaultnotifytime = UserConfig.settins.get(DataConfig.SYS_DRP1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrPage');
    this.bdr = (this.dr.value == "1") ? true : false;
    this.notifytime = moment('2019/6/3 ' + (this.defaultnotifytime? this.defaultnotifytime.value : '08:30') + ':00').unix() * 1000;
  }

  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
  }

  getTime(selecttime: number): string {
    return moment(selecttime).format('HH:mm');
  }

  save(setting, value){

    let set:PageY = new PageY();
    set.yi = setting.yi;//偏好主键ID
    set.ytn = setting.bname; //偏好设置类型名称
    set.yt = setting.typeB; //偏好设置类型
    set.yn = setting.name;//偏好设置名称
    set.yk = setting.type ;//偏好设置key
    if (typeof value === "boolean")
      set.yv = (value) ? "1":"0";//偏好设置value
    else
      set.yv = value;//偏好设置value

    this.ssService.save(set);

    if (set.yk == DataConfig.SYS_DR) {
      // 改变画面显示
      this.bdr = value;
    }
  }

  goBack(){
    this.navCtrl.pop();
  }

}
