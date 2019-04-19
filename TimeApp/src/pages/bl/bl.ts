import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {BlService} from "./bl.service";
import {FdService} from "../fd/fd.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";

/**
 * Generated class for the 黑名单列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bl',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <!--<ion-icon name="arrow-back"></ion-icon>-->
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>黑名单</ion-title>
        <!--<ion-buttons right>-->
          <!--<button ion-button color="danger" (click)="toAdd()">-->
            <!--&lt;!&ndash;<ion-icon name="add"></ion-icon>&ndash;&gt;-->
            <!--添加-->
          <!--</button>-->
        <!--</ion-buttons>-->
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of bls">
              <ion-avatar item-start  (click)="goTofsDetail(g)" >
                <!--<img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">-->
                <img [src]="g.bhiu">
              </ion-avatar>
              <ion-label>
                {{g.ran}}
                <span style="font-size:14px;color:rgb(102,102,102);">
                   {{g.rc}}
                 </span>
              </ion-label>
              <button ion-button color="danger" (click)="delete(g)" clear item-end>
                <img class="img-delete"  src="./assets/imgs/yc.png">
              </button>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class BlPage {
  bls:Array<FsData>;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private blService : BlService,
              private fdService : FdService,
              private util : UtilService,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlPage');
  }
  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.getBl();
  }
  goBack(){
    //this.navCtrl.push(DataConfig.PAGE._M_PAGE);
    // this.navCtrl.setRoot(DataConfig.PAGE._M_PAGE);
    this.navCtrl.pop();
  }

  toAdd(){
    let profileModal = this.modalCtrl.create(DataConfig.PAGE._FS4G_PAGE,{addType:'bl'});
    profileModal.present();
  }

  getBl(){
    this.blService.get().then(data=>{
      if(data != null){
        this.bls = data;
      }
    })
  }
  //删除黑名单
  delete(g:FsData){
    //this.util.popMsgbox("2",()=>{
      this.fdService.removeBlack(g.ui).then(data=>{
          this.getBl();
          this.util.popoverStart('删除黑名单成功！')
     // })
    });

  }

  goTofsDetail(fs:FsData){
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE,{fsData:fs});
    modal.present();
  }
}
