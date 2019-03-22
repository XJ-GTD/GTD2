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
  template:
  `
    <ion-menu [content]="ha" side="right" swipeEnabled = "true" type="scalePush">
      <ion-content>
        <ion-grid>
          <ion-row>
            <!--<div class="w-25 leftside" color="success">
              <ion-grid>
                <ion-row justify-content-end align-items-center>
                  <img src="./assets/imgs/page-next.png">
                </ion-row>
              </ion-grid>
            </div>-->
            <div class="w-auto">
              <p padding></p>
              <!--<div padding>
                <div class="menu-header" text-center>
                  <h3 ion-text>帐户权限</h3>
                  <p ion-text>说明</p>
                </div>
              </div>-->
              <h1 ion-text class="no-padding-tb">
                冥王星
              </h1>
              <ion-list no-lines>
                <button ion-item (click)="goGlPage()">
                  群组
                </button>
                <button ion-item (click)="goPlPage()">
                  计划
                </button>
                <button ion-item (click)="goBlPage()" >
                  黑名单
                </button>
                <button ion-item (click)="goSsPage()" >
                  设置
                </button>
                <button ion-item (click)="goPsPage()">
                  个人信息
                </button>
              </ion-list>
            </div>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-menu>
    <ion-nav #ha [root]="hPage"></ion-nav>`,
})
export class MPage {
  hPage: any = DataConfig.PAGE._H_PAGE;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MPage');
  }

  // 群组列表
  goGlPage() {

      this.navCtrl.push(DataConfig.PAGE._GL_PAGE);
  }

  //计划
  goPlPage() {
    this.navCtrl.push(DataConfig.PAGE._PL_PAGE);
  }

  // 黑名单
  goBlPage() {
    this.navCtrl.push(DataConfig.PAGE._BL_PAGE);
  }

  //系统设置
  goSsPage() {

    this.navCtrl.push(DataConfig.PAGE._SS_PAGE);
  }

  // 个人设置
  goPsPage() {
      this.navCtrl.push(DataConfig.PAGE._PS_PAGE);
  }

}
