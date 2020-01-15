import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FdService} from "./fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";
import {ExchangeSummaryData} from "../../service/business/calendar.service";
import {Friend} from "../../service/business/grouper.service";

/**
 * Generated class for the 参与人详情 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fd',
  template:  `
    <modal-box title="{{fd.ran}}" [buttons]="buttons" (onSave)="save()" (onCancel)="dismiss()">

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>联系人别称</ion-label>
        <ion-label item-end text-end > {{fd.ran}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>姓名</ion-label>
        <ion-label item-end text-end > {{fd.rn}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>联系方式</ion-label>
        <ion-label item-end text-end >{{fd.rc | formatstring: "maskphone":3:5}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>注册状态</ion-label>
        <ion-label item-end text-end *ngIf="fd.rel == 0">未注册</ion-label>
        <ion-label item-end text-end *ngIf="fd.rel == 1">注册</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>活动接收</ion-label>
        <ion-label item-end text-end >{{exchangesummary? exchangesummary.receivedactivities: "-"}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>日历项接收</ion-label>
        <ion-label item-end text-end >{{exchangesummary? exchangesummary.receivedplanitems: "-"}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>活动共享</ion-label>
        <ion-label item-end text-end >{{exchangesummary? exchangesummary.sendactivities: "-"}}</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>日历项共享</ion-label>
        <ion-label item-end text-end >{{exchangesummary? exchangesummary.sendplanitems: "-"}}</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>来源</ion-label>
        <ion-label item-end text-end >{{fd.src}}</ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>黑名单</ion-label>
        <ion-toggle [(ngModel)]="fd.isbla" (ionChange)="black(fd.isbla)"></ion-toggle>
      </div>
    </modal-box>
  `,
})
export class FdPage {


  buttons: any = {
    cancel: true
  };

  exchangesummary: ExchangeSummaryData;
  fd:Friend = {} as Friend;
  pwi:string;
  buttonText:string = '';
  constructor(public navCtrl: NavController,
              public fdService: FdService,
              public viewCtrl: ViewController,
              private util : UtilService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FdPage');
    this.fd = this.navParams.get('fsData');
  }

  ionViewDidEnter(){
   this.getDetail();
  }

  getDetail(){
    this.fdService.get(this.fd).then(data=>{
      if(data){
        this.fd = data;
        if(!this.fd.ran || this.fd.ran == ''){
          this.fd.ran = this.fd.rn;
        }
      }
      return this.fdService.getBlack(this.fd.rc);
    }).then( data=>{
      this.fd.isbla = data;
      return this.fdService.getExchangeSummary(this.fd);
    }).then( data=>{
      this.exchangesummary = data;

    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  black(b:boolean){
    if(!b){
      this.util.alterStart("是否确认移出黑名单？",()=>{
        this.rbl();
      });

    }else{
      this.util.alterStart("是否确认移入黑名单？",()=>{
        this.abl();
      });

    }
  }

  /**
   * 移除黑名单
   */
  rbl(){
    this.fdService.removeBlack(this.fd.rc).then(data=>{
        this.getDetail();
        //alert("移出成功")
    })
  }

  /**
   * 移入黑名单
   */
  abl(){
    this.fdService.putBlack(this.fd).then(data=>{
        this.getDetail();
        //alert("移入成功")
    })
  }
}
