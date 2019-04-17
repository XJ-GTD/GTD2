import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {BrService} from "./br.service";
import {UtilService} from "../../service/util-service/util.service";

/**
 * Generated class for the 备份恢复 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-br',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        
        <ion-row>
          <ion-thumbnail #resRef>
            <img src="./assets/imgs/xz.png">
          </ion-thumbnail>
        </ion-row>

        <ion-row>
          <div>日程/联系人/群组/计划/提醒/设置</div>
        </ion-row>
        <ion-row>
          <div>上次备份时间：<small>{{bts  * 1000 | date:"yyyy年MM月dd日 HH:mm:ss"}}</small></div>
        </ion-row>
        
        <ion-row>
          <ion-col (click)="backup()">
            <ion-avatar item-start>
              <img src="./assets/imgs/up.png">
            </ion-avatar>
            <p>备份</p>
          </ion-col>
          <ion-col (click)="recover(isRecover)" [ngStyle]="{'opacity': isRecover ? 1 : 0.2 }">
            <ion-avatar item-start>
              <img src="./assets/imgs/down.png">
            </ion-avatar>
            <p>恢复</p>
          </ion-col>

          <!--<ion-list no-lines style="height: 200px">
            
            <ion-item class="plan-list-item" (click)="backup()">
              <ion-label>备份</ion-label>
            </ion-item>

            <ion-item class="plan-list-item" (click)="recover()" [ngStyle]="{'display': isRecover }">
              <ion-label>恢复  <small>{{bts  * 1000 | date:"yyyy年MM月dd日 HH:mm:ss"}}</small></ion-label> 
            </ion-item>

          </ion-list>-->
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class BrPage {

  @ViewChild("resRef")
  resRef:ElementRef;

  bts:any = new Date().getTime()/1000 ;// 最后一次备份日期
  isRecover:any = false;

  constructor(public navCtrl: NavController,
              private brService:BrService,
              private util: UtilService,
              private _renderer: Renderer2,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrPage');
  }

  ionViewDidEnter(){
    this.getLastDate();
  }

  getLastDate(){
    this.brService.getLastDt().then(data=>{
      this.bts = data.data.bts;
      if(this.bts && this.bts!=''){
        this.isRecover = true;
      }
      console.log('获取最后更新时间：'+this.bts);
    }).catch(error=>{
      console.log('获取最后更新时间失败' + JSON.stringify(error));
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  backup(){
    //this.util.loadingStart();
    this._renderer.addClass(this.resRef.nativeElement,"spinanimation");
    this.brService.backup().then(data=>{
      this.util.toastStart('备份完成',1500);
      this.getLastDate();
      //this.util.loadingEnd();
      this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
    }).catch(error=>{
      this.util.toastStart('备份失败',1500);
      //this.util.loadingEnd();
      this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
    })
  }

  recover(){
    if(this.isRecover){
      //this.util.loadingStart();
      this._renderer.addClass(this.resRef.nativeElement,"spinanimation");
      this.brService.recover(Number(this.bts)).then(data=>{
        this.util.toastStart('恢复成功',1500);
        //this.util.loadingEnd();
        this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
      }).catch(error=>{
        this.util.toastStart('恢复失败',1500);
        //this.util.loadingEnd();
        this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
      })
    }
  }

}
