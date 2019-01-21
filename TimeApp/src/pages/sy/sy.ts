import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import {JhModel} from "../../model/jh.model";
import {JhService} from "../../service/jh.service";

/**
 * Generated class for the SyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sy',
  // templateUrl: 'sy.html',
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar>\n' +
  '    <ion-title>计划详情</ion-title>\n' +
  '    <ion-buttons right>\n' +
  '      <button ion-button [hidden]="isEdit" (click)="edit()">编辑</button>\n' +
  '      <button ion-button [hidden]="!isEdit" (click)="save()">保存</button>\n' +
  '    </ion-buttons>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '  <div *ngIf="isEdit" >\n' +
  '    <div *ngIf="jh !== undefined">\n' +
  '      <div style="display: flex; font-size:1.7rem;" class="height56 bortom" padding-left>\n' +
  '        <div col-3>\n' +
  '          <div class="margin181">计划名称</div>\n' +
  '        </div>\n' +
  '        <div col-9>\n' +
  '          <ion-input col-12 placeholder="{{jh.jn}}" [(ngModel)]="jn"></ion-input>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div style="display: flex; font-size:1.7rem;" class="bortom" padding-left>\n' +
  '        <div col-3>\n' +
  '          <div class="margin181">计划描述</div>\n' +
  '        </div>\n' +
  '        <div col-9>\n' +
  '          <ion-textarea style="border:0.5px solid #cccccc;" col-12 placeholder="{{jh.jg}}" [(ngModel)]="jg"></ion-textarea>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '  <div [hidden]="isEdit" *ngIf="jh !== undefined">\n' +
  '    <div *ngIf="jh !== undefined">\n' +
  '      <div style="display: flex; font-size:1.7rem;" class="height56 bortom" padding-left>\n' +
  '        <div col-3>\n' +
  '          <div class="margin181">计划名称</div>\n' +
  '        </div>\n' +
  '        <div col-9>\n' +
  '          <div col-12 class="margin181" no-padding>{{jh.jn}}</div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '      <div style="display: flex; font-size:1.7rem;" class=" bortom" padding-left>\n' +
  '        <div col-3>\n' +
  '          <div class="margin181">计划描述</div>\n' +
  '        </div>\n' +
  '        <div col-9>\n' +
  '          <div class="margin181" no-padding style="white-space: pre-wrap">{{jh.jg}}</div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '  </div>\n' +
  '</ion-content>\n',
})
export class SyPage {

  @ViewChild(Navbar) navBar: Navbar;

  jh: JhModel;
  isEdit:boolean;

  jn:string;
  jg:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private jhService: JhService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SyPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  ionViewWillEnter(){
    this.jh = this.navParams.get("jh");
    this.isEdit = false;
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  edit(){
    this.isEdit = !this.isEdit;
    this.jg = this.jh.jg;
    this.jn = this.jh.jn;
  }

  save(){
    console.log("输入计划名称 :: " + this.jn);
    console.log("输入计划描述 :: " + this.jg);
    if(this.jn !== undefined){
      this.jh.jn = this.jn;
    }
    if(this.jg !== undefined){
      this.jh.jg = this.jg;
    }
    this.jhService.ujh(this.jh.ji,this.jh.jn,this.jh.jg).then(data=>{
      alert("保存修改成功");
      this.jn = undefined;
      this.jg = undefined;
      this.isEdit = !this.isEdit;
    }).catch(reason => {
      alert("保存失败")
    });

  }


  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
