import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Navbar, ModalController, ToastController} from 'ionic-angular';

import {GcService, PageDcData} from "./gc.service";
import {FsService} from "../fs/fs.service";
import {DataConfig} from "../../service/config/data.config";
import {FsData} from "../../service/pagecom/pgbusi.service";

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
            <img class="img-header-left" src="./assets/imgs/fh2.png">
           </button>
         </ion-buttons>
         <ion-title>{{dc.gn}}({{dc.gc}})</ion-title>
         <ion-buttons right>
           <button ion-button (click)="toAddGroupMember()" color="danger">
             <!--<ion-icon name="add"></ion-icon>--> 添加
           </button>
         </ion-buttons>
       </ion-toolbar>
     </ion-header>
     
     <ion-content padding>
       <ion-grid>
         <ion-row>
           <ion-list no-lines>
             <ion-item class="plan-list-item"  *ngFor="let g of fsl">
               <ion-avatar item-start >
                 <img [src]="g.hiu">
                 <!--<ion-icon name="contact"  style="font-size: 3.0em;color: red;"></ion-icon>-->
               </ion-avatar>
                 <!--<ion-item (click)="toGroupMember(g)" style="background-color: black;color:#ffffff;margin-left: -15px;">-->
                   <!--{{g.rn}} <span>{{g.rc}}</span>-->
                 <!--</ion-item>-->
               
               <ion-label (click)="toMemberInfo(g)">
                 {{g.rn}} 
                 <span style="font-size:14px;color:rgb(102,102,102);">
                   {{g.rc}}
                 </span>
               </ion-label>               
               <button ion-button color="danger" (click)="delete(g)" clear item-end>
                 <img class="img-content-del" src="./assets/imgs/yc.png">
               </button>
             </ion-item>
           </ion-list>
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
              private toastCtrl: ToastController,
              private gcService: GcService,
              private fsService:FsService,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.dc = this.navParams.get("g");
    console.log('ionViewDidLoad PePage');
    //this.getData();
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
    this.navCtrl.push(DataConfig.PAGE._FS_PAGE,{tpara:this.dc,addType:'gc'});
    // this.navCtrl.push("PgPage",{callback:this.getData,sel:this.qcy});
    //
    // let modal = this.modalCtrl.create(PageConfig.PG_PAGE,{callback:this.getData,sel:this.qcy});
    // modal.onDidDismiss((data)=>{
    //   console.log(data === this.qcy);
    //   console.log(JSON.stringify(data));
    //   this.qcy = data;
    // });
    //modal.present();

  }

  delete(g:FsData) {
   this.gcService.deleteBx(this.dc.gi,g.pwi).then(data=>{
     if(data.code == 0){
       this.getData();
       alert("删除成功")
     }
   })

  }

  getData() {
    this.fsService.getfriendgroup(this.dc.gi).then(data=>{
      if(data && data != null){
        this.fsl = data;
        this.dc.gc = this.fsl.length;
      }
    })
  };

  /**
   * 人员详情
   */
  toMemberInfo(g:FsData){
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE,{pwi:g.pwi});
    modal.onDidDismiss((data)=>{
      console.log(JSON.stringify(data));
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
