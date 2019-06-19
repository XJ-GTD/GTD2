import {Component} from '@angular/core';
import {IonicPage, ModalController, Platform } from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {EmitService} from "../../service/util-service/emit.service";
import { JPushService } from "../../service/cordova/jpush.service";
import {PsService} from "../ps/ps.service";

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

    <ion-menu [content]="ha" side="right" swipeEnabled="true" [maxEdgeStart]="maxEdgeStart" type="lsPush" class="ls" id="ls">
      <page-tdl></page-tdl>
    </ion-menu>
    <ion-menu [content]="ha" side="left" swipeEnabled="true" [maxEdgeStart]="maxEdgeStart" type="scalePush" class="menu" >
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
            </ion-list>
          </ion-row>
          <ion-row class="margin-for-middle">
            <ion-list>
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
              <ion-item *ngIf="isdebug" (click)="gologPage()">
                <h3>日志</h3>
              </ion-item>
              <ion-item (click)="goatPage()">
                <h3>关于</h3>
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
  isdebug:boolean;
  maxEdgeStart:any = 150;

  constructor(public modalController: ModalController,
              public plt: Platform,
              public jpush: JPushService,
              private psService: PsService,
              private util: UtilService,
              private emitService: EmitService) {
    //真机的时候获取JPush注册ID，并保存到服务器注册用户信息
    if (this.util.isMobile()) {
      this.emitService.register("on.jpush.registerid.loaded", () => {
        this.psService.saveUser(UserConfig.user.id, {
          device: {
            uuid: this.util.deviceId(),
            type: this.util.deviceType(),
            platforms: this.plt.platforms(),
            jpush: {
              id: this.jpush.registerid
            }
          }
        });
      });
    }
  }

  ionViewDidLoad() {
    this.isdebug = DataConfig.isdebug;
    this.maxEdgeStart = this.plt.width() / 2;

    console.log('ionViewDidLoad MPage');
  }

  ionViewDidEnter(){
    this.getData();
  }

  getData(){
    this.phone = this.util.mask(UserConfig.account.phone, 3, 4);
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


  //日志
  gologPage() {
    this.modalController.create(DataConfig.PAGE._LOG_PAGE).present();
  }

  //日志
  goatPage() {
    this.modalController.create(DataConfig.PAGE._AT_PAGE).present();
  }
}
