import {Component} from '@angular/core';
import {IonicPage, ModalController, Platform} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {EmitService} from "../../service/util-service/emit.service";
import {JPushService} from "../../service/cordova/jpush.service";
import {PsService} from "../ps/ps.service";
import {RabbitMQService} from "../../service/cordova/rabbitmq.service";
import {StatusType} from "../../data.enum";
import {SettingsProvider} from "../../providers/settings/settings";

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

    <ion-menu [content]="ha" side="left" swipeEnabled="true"  type="scalePush" class="menu" id="scalePush"
              (ionClose) = "ionClose($evnet)" (ionOpen) = "ionOpen($evnet)" (ionDrag) = "ionDrag($evnet)" >
        <ion-grid>
          <ion-row (click)="goPsPage()">

                  <h1>冥王星</h1>
                  <h4>{{phone}}</h4>
            <!--<span>-->
                  <!--<h2>{{name}}</h2>-->
                  <!--<p>{{phone}}</p>-->
            <!--</span>-->
          </ion-row>
          <ion-row >
          </ion-row>
          <ion-row (click)="goPsPage()">
            <h3>个人设置</h3>
          </ion-row>
          <ion-row (click)="goGlPage()">
            <h3>群组</h3>
          </ion-row>
          <ion-row (click)="goPlPage()">
            <h3>活动日历</h3>
          </ion-row>
          <ion-row (click)="goBlPage()">
            <h3>黑名单</h3>
          </ion-row>
          <ion-row (click)="goSsPage()">
            <h3>设置</h3>
          </ion-row>
            <ion-row (click)="goBrPage()">
              <h3>备份与恢复</h3>
            </ion-row>
          <ion-row *ngIf="isdebug" (click)="gologPage()">
            <h3>日志</h3>
          </ion-row>
          <ion-row (click)="goatPage()">
            <h3>关于</h3>
          </ion-row>
        </ion-grid>
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
              private emitService: EmitService,
              private rabbitmq: RabbitMQService,
              private settings:SettingsProvider) {
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

      this.jpush.checkStatus(UserConfig.user.id, false);  //触发注册ID已加载事件

      // 获取到用户信息之后, 启动后台RabbitMQ AMQP协议接收数据
      if (UserConfig.user && UserConfig.account) {
        console.log("Start RabbitMQ plugin initing...");
        this.rabbitmq.init(UserConfig.user.id, UserConfig.account.device, UserConfig.account.mq);
      }
    }

    // if (UserConfig.account.id == "13585820972") {
    //   this.emitService.register("mwxing.weather.received", () => {
    //     this.modalController.create(DataConfig.PAGE._GLORY_PAGE).present();
    //   });
    // }

    settings.setStatusBarColor(StatusType.home);
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
  ionClose($evnet){
    this.settings.popStatusBarColor();
  }

  ionOpen($evnet){
    this.settings.setStatusBarColor(StatusType.meun);

  }
  ionDrag($evnet){

  }
}
