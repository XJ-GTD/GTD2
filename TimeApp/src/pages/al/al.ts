import {Component} from '@angular/core';
import {IonicPage, Nav} from 'ionic-angular';
import {RoundProgressEase} from 'angular-svg-round-progressbar';
import {AlData, AlService} from "./al.service";
import {SyncRestful} from "../../service/restful/syncsev";
import {DataConfig} from "../../service/config/data.config";
import {Location} from '@angular/common';

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-al',
  template: `
   <div class="container">
    <div class="progress-wrapper">
      <!--<div class="current" [ngStyle]="getOverlayStyle()">{{ current }}/{{ max }}</div>-->
      <!--<round-progress-->
        <!--[current]="current"-->
        <!--[max]="max"-->
        <!--[stroke]="stroke"-->
        <!--[radius]="radius"-->
        <!--[semicircle]="semicircle"-->
        <!--[rounded]="rounded"-->
        <!--[responsive]="responsive"-->
        <!--[clockwise]="clockwise"-->
        <!--[color]="gradient ? \'url(#gradient)\' : color"-->
        <!--[background]="background"-->
        <!--[duration]="duration"-->
        <!--[animation]="animation"-->
        <!--[animationDelay]="animationDelay"></round-progress>-->
    </div>
    <div class="text">{{ alData.text }}</div>
  </div>
   <BackComponent></BackComponent>
  `
})
export class AlPage {

  // current: number = 0;
  // max: number = 100;
  // stroke: number = 10;
  // radius: number = 80;
  // semicircle: boolean = false;
  // rounded: boolean = false;
  // responsive: boolean = false;
  // clockwise: boolean = true;
  // color: string = '#45ccce';
  // background: string = '#eaeaea';
  // duration: number = 800;
  // animation: string = 'easeOutCubic';
  // animationDelay: number = 50
  // animations: string[] = [];
  // gradient: boolean = false;
  alData:AlData = new AlData();
  constructor(private alService: AlService,
              private _ease: RoundProgressEase,
              private syncRestful:SyncRestful,
              private nav: Nav,
              private location: Location) {
    this.alData.text="正在初始化";

  }

  ionViewDidEnter() {
    this.alinit();
  }

  async alinit(){

    this.alData = await this.alService.checkAllPermissions();
    //this.increment(20);
    this.alData = await this.alService.createDB();
    //this.increment(10);
    this.alData = await this.alService.checkSystem();
    //this.increment(10);
    if (!this.alData.checkSystem){
      this.alData = await this.alService.createSystemData();
    }

    //this.increment(20);
    this.alData = await this.alService.setSetting();
    //this.increment(20);
    this.alData = await this.alService.checkUserInfo();

    //缓存测试
    //await this.alService.createCachefromserver();
    if (!this.alData.islogin){
      this.nav.setRoot(DataConfig.PAGE._LP_PAGE);
    }else{
      this.alData.text = "正在连接服务器。。。"
      this.alService.connWebSocket();
       this.alData.text = "进入您的日历"
      this.nav.setRoot(DataConfig.PAGE._M_PAGE);
    }
  }

  // increment(amount = 1) {
  //   this.current += amount;
  // }

  // getOverlayStyle() {
  //   let isSemi = this.semicircle;
  //   let transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
  //
  //   return {
  //     'top': isSemi ? 'auto' : '50%',
  //     'bottom': isSemi ? '5%' : 'auto',
  //     'left': '50%',
  //     'transform': transform,
  //     '-moz-transform': transform,
  //     '-webkit-transform': transform,
  //     'font-size': this.radius / 3.5 + 'px'
  //   };
  // }

}
