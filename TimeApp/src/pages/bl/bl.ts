import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {BlService} from "./bl.service";
import {FdService} from "../fd/fd.service";
import {DataConfig} from "../../service/config/data.config";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";
import {Friend} from "../../service/business/grouper.service";

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
    <page-box title="黑名单" [buttons]="buttons"  (onBack)="goBack()"  nobackgroud nobottom>
      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            拒绝接受 <span class="count">{{bls.length}}</span> 个人的日程推送 
          </ion-list-header>
          <ion-item *ngFor="let g of bls" >
            <ion-label (click)="goTofsDetail(g)" >
              {{g.ran}}

              <span *ngIf="g.rel ==1">（注册）</span>
              <span *ngIf="g.rel !=1">（未注册）</span>
            </ion-label>
            <ion-icon class="fal fa-minus-circle font-large-x" (click)="delete(g)"  item-end></ion-icon>
          </ion-item>
        </ion-list>
      </ion-scroll>
    </page-box>
  `
})
export class BlPage {
  bls:Array<Friend> = new Array<Friend>();

  buttons: any = {
    cancel: true
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private blService : BlService,
              private fdService : FdService,
              private util : UtilService,
              private modalCtrl: ModalController) {
  }

  ionViewDidEnter(){
    this.blService.get().then(data=>{
      if(data != null){
        this.bls = data;
      }
    });
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
  //删除黑名单
  delete(g:Friend){
    //this.util.popMsgbox("2",()=>{
      this.fdService.removeBlack(g.ui).then(data=>{
        this.blService.get().then(data=>{
          if(data != null){
            this.bls = data;
          }
        });
        this.util.popoverStart('删除黑名单成功！')
    });

  }

  goTofsDetail(fs:Friend){
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE,{fsData:fs});
    modal.present();
  }
}
