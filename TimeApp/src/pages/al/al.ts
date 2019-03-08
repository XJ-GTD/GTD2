import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {RoundProgressEase} from 'angular-svg-round-progressbar';
import {AlService} from "./al.service";
import {SyncRestful} from "../../service/restful/syncsev";

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
              private syncRestful:SyncRestful) {
    this.text="正在初始化";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlPage');

    console.log("al :: 权限申请开始");
    this.syncRestful.initData().then(data=>{
      console.log("********************");
      console.log(data);
      console.log("********************");
    })
    // this.alService.checkAllPermissions().then(data=>{
    //   console.log("al :: 权限申请完成");
    //   this.increment(10);
    //   this.text="权限申请完成,初始化创建数据库开始";
    //   console.log("al :: 初始化创建数据库开始");
    //   return this.alService.initDataBase();
    // }).then(data=>{
    //   this.increment(10);
    //   console.log("al :: 创建数据库完成,初始化开始");
    //   //return this.alService.initComplete();
    // }).then(data=>{
    //   this.increment(10);
    //   console.log("al :: 判断是否初始化完成");
    //   if (!data){
    //     return
    //   }
    //   return data;
    // }).then(data=>{
    //   this.increment(10);
    //   console.log("al :: 开始连接webSocket");
    // });
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
