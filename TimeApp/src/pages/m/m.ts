import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";

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
  template: `
    <ion-menu [content]="ha" side="right" swipeEnabled="true" type="scalePush">
      <ion-content>
        <ion-grid>
          <ion-row>
            <ion-list>
              <ion-list-header>
                <ion-item  (click)="goPsPage()">
                  <ion-avatar item-start>
                    <img [src]="avatar" class="img_size">
                  </ion-avatar>
                  <h2>{{name}}</h2>
                  <p>{{phone}}</p>
                </ion-item>
              </ion-list-header>
              <ion-item (click)="goGlPage()">
                <h1>冥王星</h1>
              </ion-item>
              <ion-item (click)="goGlPage()">
                <h3>朋友群</h3>
              </ion-item>
              <ion-item (click)="goPlPage()">
                <h3>活动群</h3>
              </ion-item>
              <ion-item (click)="goBlPage()">
                <h3>禁止分享人</h3>
              </ion-item>
              <ion-item (click)="goSsPage()">
                <h3>系统设置</h3>
              </ion-item>
              <ion-item (click)="goBrPage()">
                <h3>备份恢复</h3>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-menu>
    <ion-nav #ha [root]="hPage"></ion-nav>`
})
export class MPage {
  hPage: any = DataConfig.PAGE._H_PAGE;
  name:any;
  phone:any;
  avatar:any = DataConfig.HUIBASE64;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MPage');
  }

  ionViewDidEnter(){
    this.phone = UserConfig.account.phone;
    this.name = UserConfig.user.name;

    if (UserConfig.user.avatar != undefined && UserConfig.user.avatar != null && UserConfig.user.avatar != '') {
      this.avatar = UserConfig.user.avatar;
    }
  }

  //计划
  goPlPage() {
    this.navCtrl.push(DataConfig.PAGE._PL_PAGE);
  }

  //系统设置
  goSsPage() {
    this.navCtrl.push(DataConfig.PAGE._SS_PAGE);
  }

  //备份
  goBrPage() {
    this.navCtrl.push(DataConfig.PAGE._BR_PAGE);
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
