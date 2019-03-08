import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {RoundProgressEase} from 'angular-svg-round-progressbar';
import {AlService} from "./al.service";
import {SyncRestful} from "../../service/restful/syncsev";
import {PageConfig} from "../../app/page.config";

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
    this.rootPage = PageConfig._M_PAGE;
    this.alService.checkAllPermissions().then(data=>{
      this.text=data;
      this.increment(10);
      return this.alService.createDB();

    }).then(data=>{
      this.text=data;
      this.increment(10);
      return this.alService.checkSystem();
    }).then(data=>{
      this.text="al :: 判断是否初始化完成";
      if (!data){
        this.text="帮您初始化系统";
        return  this.alService.createSystemData();
      };
    }).then(data=>{
      this.text=data;
      this.increment(10);
      console.log("al :: 初始化本地变量");
      //return this.alService.initComplete();
      this.text="初始化本地变量完成";
      this.increment(10);
      console.log("al :: 开始查询账户信息");
      this.increment(10);
      //游客登陆
      //return this.lsm.visitor()
    }).then(data=>{
      this.text="开始查询账户信息完成";
      this.increment(10);
      console.log("al :: 开始连接webSocket");
    }).then(data => {
      this.text="开始连接webSocket成功";
      this.increment(10);
      console.log("al :: 开始查询联系人");
      /*if(DataConfig.uInfo.uty == '1' && DataConfig.IS_MOBILE){
        return this.ContactsService.getContacts();
      }*/
    }).then(data=>{
      this.text="开始查询联系人成功";
      this.increment(10);
      console.log("al :: 开始更新版本表");
      //return this.configService.ufi(null,0)
    }).then(data => {
      this.text="开始更新版本表成功";
      this.increment(10);
      /*if(DataConfig.uInfo.uty=='1'){
        //定时同步
        console.log("al :: 定时同步");
        this.sync.syncTime();
      }*/
      this.increment(10);
      console.log("al :: 开始定时查询闹铃");
      //this.work.setColckWork();
    }).then(data => {
      console.log("al :: 进入主页");
      this.text="进入主页";
      this.increment(10);
      //this.nav.setRoot(this.rootPage);
    }).catch(res => {
      console.log("al error :: "+JSON.stringify(res));
      //loading.dismiss();
      //this.nav.setRoot(this.rootPage);
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
