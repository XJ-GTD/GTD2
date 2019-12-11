import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

import {FsService} from "../fs/fs.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, PageDcData} from "../../data.mapping";
import {GrouperService} from "../../service/business/grouper.service";
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

     <modal-box title="{{dc.gn}}" [buttons]="buttons" (onCancel)="goBack()" (onCreate) = "toAddGroupMember()">

       <ion-scroll scrollY="true" scrollheightAuto>
         <ion-list>
           <ion-item *ngFor="let g of fsl" >
             <ion-label (click)="toMemberInfo(g)" >
               {{g.ran}}

               <span *ngIf="g.rel ==1" float-right class="reg">注册</span>
               <span *ngIf="g.rel !=1" float-right class="reg">未注册</span>
               <span float-right class="tel">{{g.rc | formatstring: "maskphone":3:5}}</span>
             </ion-label>
             <ion-icon class="fal fa-minus-circle font-large-x" (click)="delete(g)"  item-end></ion-icon>
           </ion-item>
         </ion-list>
       </ion-scroll>
     </modal-box>
   `,
})
export class GcPage {
  buttons: any = {
    create:true,
    cancel: true
  };
  dc:PageDcData = new PageDcData();
  fsl:Array<FsData> = new Array<FsData>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private gcService: GrouperService,
              private fsService:FsService,
              private util:UtilService,
              private modalCtrl: ModalController) {
    this.dc = this.navParams.get("g");
  }

  ionViewDidEnter(){
    this.getData();
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  goBack(){
    this.navCtrl.pop();
  }
  toAddGroupMember() {

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
