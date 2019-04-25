import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import {GcService} from "./gc.service";
import {FsService} from "../fs/fs.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, PageDcData} from "../../data.mapping";
/**
 * Generated class for the 群组编辑 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gc',
   template: `
     <ion-header no-border>
       <ion-toolbar>
         <ion-buttons left>
           <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back.png">
           </button>
         </ion-buttons>
         <ion-title>{{dc.gn}}({{dc.gc}})</ion-title>
         <ion-buttons right>
           <button ion-button class="button-header-right" (click)="toAddGroupMember()">
             <!--<ion-icon name="add"></ion-icon>--> 添加
           </button>
         </ion-buttons>
       </ion-toolbar>
     </ion-header>
     
     <ion-content padding>
       <ion-grid>
         <ion-row  *ngFor="let g of fsl" >
               <ion-avatar item-start (click)="toMemberInfo(g)">
                 <img [src]="g.bhiu">
                 <!--<ion-icon name="contact"  style="font-size: 3.0em;color: red;"></ion-icon>-->
               </ion-avatar>
                 <!--<ion-item (click)="toGroupMember(g)" style="background-color: black;color:#ffffff;margin-left: -15px;">-->
                   <!--{{g.rn}} <span>{{g.rc}}</span>-->
                 <!--</ion-item>-->
               
               <ion-label (click)="toMemberInfo(g)" >
                 {{g.ran}} 
                 <!--<span>-->
                   <!--{{g.rc}}-->
                 <!--</span>-->

                 <span *ngIf="g.rel ==1">注册</span>
               </ion-label>               
               <button ion-button color="danger" (click)="delete(g)" clear item-end>
                 <img class="img-content-del" src="./assets/imgs/yc.png">
               </button>
         </ion-row>
       </ion-grid>
     </ion-content>
   `,
})
export class GcPage {
  dc:PageDcData = new PageDcData();
  fsl:Array<FsData> = new Array<FsData>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private gcService: GcService,
              private fsService:FsService,
              private util:UtilService,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.dc = this.navParams.get("g");
    console.log('ionViewDidLoad PePage');
  }
  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.getData();
  }
  ionViewWillEnter() {
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  goBack(){
    console.log('GcPage返回GlPage');
    //this.navCtrl.push(DataConfig.PAGE._GL_PAGE);
    this.navCtrl.pop();
  }
  toAddGroupMember() {
    console.log("PePage跳转PgPage");
    // this.navCtrl.push(DataConfig.PAGE._FS4G_PAGE,{tpara:this.dc,addType:'gc'});
    // this.navCtrl.push(DataConfig.PAGE._FS4G_PAGE,{tpara:this.dc});

    let modal = this.modalCtrl.create(DataConfig.PAGE._FS4G_PAGE,{tpara:this.dc});
    modal.onDidDismiss((data)=>{
      this.getData();
    });
    modal.present();

  }

  delete(g:FsData) {
    //删除群成员
    this.util.alterStart("2",()=>{
      this.gcService.deleteBx(this.dc.gi,g.pwi).then(data=>{
        this.getData();
      })
    });

  }

  getData() {
    this.fsl = this.fsService.getfriendgroup(this.dc.gi);
    this.dc.gc = this.fsl.length;
  };

  /**
   * 人员详情
   */
  toMemberInfo(g:FsData){
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE,{fsData:g});
    modal.onDidDismiss((data)=>{
      console.log(JSON.stringify(data));
      this.getData();
    });
    modal.present();
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
