import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Nav } from 'ionic-angular';
import { PageConfig } from "../../app/page.config";
import { PermissionsService } from "../../service/util-service/permissions.service";
import { UtilService } from "../../service/util-service/util.service";
import { ReadlocalService } from "../../service/readlocal.service";
import { ConfigService } from "../../service/config.service";
import { WebsocketService } from "../../service/util-service/websocket.service";
import { RoundProgressEase } from 'angular-svg-round-progressbar';
import { LsmService } from "../../service/lsm.service";
import { DataConfig } from "../../app/data.config";
import { BsRestful } from "../../service/restful/bs-restful";
import {SyncService} from "../../service/sync.service";
import {ContactsService} from "../../service/util-service/contacts.service";
import {WorkService} from "../../service/work.service";
import {AlService} from "./al.service";

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
              private _ease: RoundProgressEase,) {
    this.text="正在初始化";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlPage');
    this.alService.checkAllPermissiions().then(data=>{
      this.text="权限申请完成,初始化创建数据库开始";
      //初始化创建数据库
      this.increment(10);
       this.alService.a();
    }).then(data=>{
      return this.alService.b();
    }).then(data=>{
      if (!data){
        return
      }
      return data;
    }).then(data=>{

    });
    for (let prop in this._ease) {
      if (prop.toLowerCase().indexOf('ease') > -1) {
        this.animations.push(prop);
      };
    }
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
