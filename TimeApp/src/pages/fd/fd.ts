import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { FdService} from "./fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData} from "../../data.mapping";

/**
 * Generated class for the 参与人详情 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fd',
  template:  `<ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="dismiss()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back-white.png">
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-grid>

      <ion-row>
      <ion-avatar item-start>
        <img  class="img-hiu" [src]="fd.bhiu">
      </ion-avatar>
        <ion-label class="fdname">
          {{fd.ran}}
        </ion-label>
      </ion-row>
      <ion-row>
        <span >{{fd.rn}}</span>  <span >{{fd.rc}}</span> 
      </ion-row>
    </ion-grid>
  </ion-content>
  <ion-footer>
    <ion-buttons>
      <button ion-button  icon-only (click)="black()">
        {{buttonText}}
      </button>
    </ion-buttons>
    
  </ion-footer>`,
})
export class FdPage {
  fd:FsData = new FsData();
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
      //console.log(' ========= fdPage=>：'+JSON.stringify(this.fd));
      return this.fdService.getBlack(this.fd.rc);
    }).then( data=>{
      this.fd.isbla = data;
      if(this.fd.isbla){
        this.buttonText = "移出黑名单";
      }else{
        this.buttonText = "移入黑名单";
      }

      //console.log(' ========= fdPage=>：'+JSON.stringify(this.fd));
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  black(){
    if(this.fd.isbla){
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
