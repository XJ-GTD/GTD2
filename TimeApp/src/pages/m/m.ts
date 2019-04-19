import {Component} from '@angular/core';
import {IonicPage, ModalController} from 'ionic-angular';
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

    <BackComponent></BackComponent>
    
    <ion-menu [content]="ha" side="right" swipeEnabled="true" type="lsPush" class="ls" id="ls">
      <page-tdl></page-tdl>
    </ion-menu>
    <ion-menu [content]="ha" side="left" swipeEnabled="true" type="scalePush" class="menu" >
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
              <ion-item>
                <h1>冥王星</h1>
              </ion-item>
              <ion-item (click)="goGlPage()">
                <h3>群组</h3>
              </ion-item>
              <ion-item (click)="goPlPage()">
                <h3>活动日历</h3>
              </ion-item>
              <ion-item (click)="goBlPage()">
                <h3>黑名单</h3>
              </ion-item>
              <ion-item (click)="goSsPage()">
                <h3>设置</h3>
              </ion-item>
              <ion-item (click)="goBrPage()">
                <h3>备份与恢复</h3>
              </ion-item>
            </ion-list>
          </ion-row>
        </ion-grid>
      </ion-content>
    </ion-menu>

    <ion-nav #ha [root]="hPage"></ion-nav>
  `
})
export class MPage {
  hPage: any = DataConfig.PAGE._H_PAGE;
  name:any;
  phone:any;
  avatar:any = DataConfig.HUIBASE64;

  constructor(public modalController: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MPage');
  }

  ionViewDidEnter(){
    this.getData();
  }

  getData(){
    this.phone = UserConfig.account.phone;
    this.name = UserConfig.user.name;

    if (UserConfig.user.avatar != undefined && UserConfig.user.avatar != '') {
      this.avatar = UserConfig.user.avatar;
    }
  }

  //计划
  goPlPage() {
     this.modalController.create(DataConfig.PAGE._PL_PAGE).present();
  }

  //系统设置
  goSsPage() {
    this.modalController.create(DataConfig.PAGE._SS_PAGE).present();
  }

  //备份
  goBrPage() {
    this.modalController.create(DataConfig.PAGE._BR_PAGE).present();
  }

  // 群组列表
  goGlPage() {
    this.modalController.create(DataConfig.PAGE._GL_PAGE).present();
  }

  // 个人设置
  goPsPage() {
    //this.modalController.create(DataConfig.PAGE._PS_PAGE).present();
    let modal = this.modalController.create(DataConfig.PAGE._PS_PAGE);
    modal.onDidDismiss((data)=>{
      this.getData();
    });
    modal.present();
  }


  // 黑名单
  goBlPage() {
    this.modalController.create(DataConfig.PAGE._BL_PAGE).present();
  }
}
