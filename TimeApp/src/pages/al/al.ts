import {Component} from '@angular/core';
import {IonicPage, Nav} from 'ionic-angular';
import {RoundProgressEase} from 'angular-svg-round-progressbar';
import {AlService} from "./al.service";
import {SyncRestful} from "../../service/restful/syncsev";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the AlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-al',
  template:'<div class="container">' +
  '  <div class="progress-wrapper">' +
  '    <div class="current" [ngStyle]="getOverlayStyle()">{{ current }}/{{ max }}</div>' +
  '    <round-progress' +
  '      [current]="current"' +
  '      [max]="max"' +
  '      [stroke]="stroke"' +
  '      [radius]="radius"' +
  '      [semicircle]="semicircle"' +
  '      [rounded]="rounded"' +
  '      [responsive]="responsive"' +
  '      [clockwise]="clockwise"' +
  '      [color]="gradient ? \'url(#gradient)\' : color"' +
  '      [background]="background"' +
  '      [duration]="duration"' +
  '      [animation]="animation"' +
  '      [animationDelay]="animationDelay"></round-progress>' +
  '  </div>' +
  '  <div class="text">{{ text }}</div>' +
  '</div>' +
  ''
})
export class AlPage {

  rootPage:any;

  current: number = 0;
  max: number = 100;
  stroke: number = 10;
  radius: number = 80;
  semicircle: boolean = false;
  rounded: boolean = false;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#45ccce';
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 50
  animations: string[] = [];
  gradient: boolean = false;
  text:string;
  constructor(private alService: AlService,
              private _ease: RoundProgressEase,
              private syncRestful:SyncRestful,
              private nav: Nav,) {
    this.text="正在初始化";
  }

  ionViewDidLoad() {
    this.rootPage = DataConfig.PAGE._R_PAGE;
    this.alService.checkAllPermissions().then(data=>{
      this.increment(10);
      this.text=data;
      return this.alService.createDB();
    }).then(data=>{
      this.increment(10);
      this.text=data;
      return this.alService.checkSystem();
    }).then(data=>{
      if (!data){
        this.text="帮您初始化系统";
        return  this.alService.createSystemData();
      };
    }).then(data=>{

        this.text="系统设置";
        return  this.alService.setSetting();

    }).then(data => {
      this.increment(10);
      return this.alService.checkUserInfo();
    }).then(data=>{
      this.increment(10);
      console.log("al " +data.length);
      if(data.length == 0){
        this.rootPage = DataConfig.PAGE._LP_PAGE;
        return "进入登录页面";
      }else{
        return "进入主页";
      }
    }).then(data => {
      this.increment(10);
      this.increment(10);
      this.increment(10);
      this.increment(10);
      this.text=data;
      console.log("al :: " +data);
      this.nav.setRoot(this.rootPage);
    }).catch(res => {
      console.log("al error :: "+JSON.stringify(res));
      //loading.dismiss();
      this.nav.setRoot(this.rootPage);
    });
    // for (let prop in this._ease) {
    //   if (prop.toLowerCase().indexOf('ease') > -1) {
    //     this.animations.push(prop);
    //   };
    // }
  }

  increment(amount = 1) {
    this.current += amount;
  }

  getOverlayStyle() {
    let isSemi = this.semicircle;
    let transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

    return {
      'top': isSemi ? 'auto' : '50%',
      'bottom': isSemi ? '5%' : 'auto',
      'left': '50%',
      'transform': transform,
      '-moz-transform': transform,
      '-webkit-transform': transform,
      'font-size': this.radius / 3.5 + 'px'
    };
  }

}
