import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 菜单 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m',
  providers: [],
  template:'<!--首页侧边栏-->' +
  '<ion-menu [content]="ha" side="right" swipeEnabled = "true" type="scalePush">' +
  '  <ion-content>' +
  '    <ion-item margin-top margin-bottom (click)="goPsPage()" id="tag1" style="height:185px" no-lines>' +
  '      <ion-avatar item-start>' +
  '        <img [src]="imgurl" class="img_size">' +
  '      </ion-avatar>' +
  '      <h1>冥王星</h1>' +
  '      <span class="fontcol"></span>' +
  '    </ion-item>' +
  '' +
  '    <ion-list>' +
  '      <ion-item style="height:76px" (click)="goGlPage()">' +
  '        <ion-label>群组</ion-label>' +
  '      </ion-item>' +
  '      <ion-item (click)="goPlPage()" style="height:76px">' +
  '        <ion-label>计划</ion-label>' +
  '      </ion-item>' +
  '      <ion-item (click)="goBlPage()" style="height:76px" >' +
  '        <ion-label>黑名单</ion-label>' +
  '      </ion-item>' +
    '      <ion-item (click)="goSsPage()" style="height:76px" >' +
    '        <ion-label>设置</ion-label>' +
    '      </ion-item>' +
  '    </ion-list>' +
  '  </ion-content>' +
  '</ion-menu>' +
  '<ion-nav #ha [root]="hPage"></ion-nav>',

})
export class MPage {
  hPage: any = DataConfig.PAGE._H_PAGE;
  imgurl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MPage');
    this.imgurl = "./assets/imgs/headImg.jpg";
  }

  //计划
  goPlPage() {
    this.navCtrl.push(DataConfig.PAGE._PL_PAGE);
  }

  //系统设置
  goSsPage() {

      this.navCtrl.push(DataConfig.PAGE._SS_PAGE);
  }

  // 群组列表
  goGlPage() {

      this.navCtrl.push(DataConfig.PAGE._GL_PAGE);
  }

  // 个人设置
  goPsPage() {
      this.navCtrl.push(DataConfig.PAGE._PS_PAGE);
  }


  // 黑名单
  goBlPage() {
    this.navCtrl.push(DataConfig.PAGE._BL_PAGE);
  }




}
