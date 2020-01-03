import {Component, ElementRef, Renderer2} from '@angular/core';
import {IonicPage, Modal, Platform} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {EmitService} from "../../service/util-service/emit.service";
import {JPushService} from "../../service/cordova/jpush.service";
import {PsService} from "../ps/ps.service";
import {RabbitMQService} from "../../service/cordova/rabbitmq.service";
import {ModalTranType, StatusType} from "../../data.enum";
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
          <ion-row>
            <h1>冥王星</h1>
            <h4>{{name}}</h4>
            
            <!--<span>-->
                  <!--<h2>{{name}}</h2>-->
                  <!--<p>{{phone}}</p>-->
            <!--</span>-->
          </ion-row>
          <ion-row>
          </ion-row>
          <ion-row (click)="todoList()">
            <h3>重要事项</h3>
          </ion-row>
          <ion-row  (click)="aTday()">
            <h3>@ 我的</h3>
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
            <!--<ion-row (click)="goBrPage()">-->
              <!--<h3>备份与恢复</h3>-->
            <!--</ion-row>-->
          <!--<ion-row *ngIf="isdebug" (click)="gologPage()">-->
            <!--<h3>日志</h3>-->
          <!--</ion-row>-->
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

  constructor(public plt: Platform,
              public jpush: JPushService,
              private psService: PsService,
              private util: UtilService,
              private emitService: EmitService,
              private rabbitmq: RabbitMQService,
              private settings:SettingsProvider,
              private renderer2:Renderer2,
              private elementRef:ElementRef) {
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
    this.settings.getActiveTheme().subscribe(val => {
      let pix = this.util.randInt(1,5);
      let white = " url('assets/imgs/m-backgroud-white-" + pix + ".jpg')";
      let black = " url('assets/imgs/m-backgroud-black-" + pix + ".jpg')";

      if (val == "white-theme"){
        this.renderer2.setStyle(this.elementRef.nativeElement,"background-image",white);
      }else{
        this.renderer2.setStyle(this.elementRef.nativeElement,"background-image",black);
      }
    });

    settings.setStatusBarColor(StatusType.home);
  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad MPage');
  }

  ionViewDidEnter(){
    this.getData();
  }

  getData(){
    // this.phone = this.util.mask(UserConfig.account.phone, 3, 4);
    this.name = UserConfig.user.nickname;

    // if (UserConfig.user.avatar != undefined && UserConfig.user.avatar != '') {
    //   this.avatar = UserConfig.user.avatar;
    // }
  }

  //计划
  goPlPage() {
    this.util.createModal(DataConfig.PAGE._PL_PAGE,null,ModalTranType.left).present();
  }

  //系统设置
  goSsPage() {
    this.util.createModal(DataConfig.PAGE._SS_PAGE,null,ModalTranType.left).present();
  }

  //备份
  goBrPage() {
    this.util.createModal(DataConfig.PAGE._BR_PAGE,null,ModalTranType.left).present();
  }


  // 群组列表
  goGlPage() {
    this.util.createModal(DataConfig.PAGE._GL_PAGE,null,ModalTranType.left).present();
  }

  // 个人设置
  goPsPage() {
    //this.modalController.create(DataConfig.PAGE._PS_PAGE).present();

    let modal:Modal = this.util.createModal(DataConfig.PAGE._PS_PAGE,null,ModalTranType.left);

    modal.onDidDismiss((data)=>{
      this.getData();
    });
    modal.present();
  }


  // 黑名单
  goBlPage() {
    this.util.createModal(DataConfig.PAGE._BL_PAGE,null,ModalTranType.left).present();
  }


  //日志
  gologPage() {
    this.util.createModal(DataConfig.PAGE._LOG_PAGE,null,ModalTranType.left).present();
  }

  //关于
  goatPage() {
    this.util.createModal(DataConfig.PAGE._AT_PAGE,null,ModalTranType.left).present();
  }

  todoList() {
    this.util.createModal(DataConfig.PAGE._DO_PAGE,null,ModalTranType.left).present();
  }

  aTday() {
    this.util.createModal(DataConfig.PAGE._ATME_PAGE,null,ModalTranType.left).present();
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
