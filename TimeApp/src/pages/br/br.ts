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
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>备份恢复</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        
        <ion-row>
          <div #resRef >
            <ion-img src="./assets/imgs/br-xz.png" class="img"></ion-img>
          </div>
        </ion-row>

        <ion-row>
          <div>日程/联系人/群组/计划/提醒/设置</div>
        </ion-row>
        <ion-row [ngStyle]="{'visibility': isRecover ? 'visible':'hidden' }">
          <div>上次备份时间：<small>{{bts  * 1000 | date:"yyyy年MM月dd日 HH:mm:ss"}}</small></div>
        </ion-row>
        
       
      </ion-grid>
    </ion-content>
    <ion-footer>
        <ion-toolbar>
          <ion-buttons start padding>
            <button (click)="backup(is)" [ngStyle]="{'opacity': is ? 1 : 0.2 }">
              <ion-avatar item-start>
                <img src="./assets/imgs/br-up.png">
              </ion-avatar>
              <p>备份</p>
            </button>
          </ion-buttons>
          <ion-buttons end padding>
            <button (click)="recover(isRecover,is)" [ngStyle]="{'opacity': isRecover && is ? 1 : 0.2 }">
              <ion-avatar item-start>
                <img src="./assets/imgs/br-down.png">
              </ion-avatar>
              <p>恢复</p>
            </button>
          </ion-buttons>
        </ion-toolbar>
    </ion-footer>
  `,
})
export class BrPage {

  @ViewChild("resRef")
  resRef:ElementRef;

  bts:string;// 最后一次备份日期
  isRecover:boolean = false;
  is:any = true;

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
      this.bts = data.bts;
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
    if(this.is) {
      this.is = false;
      this._renderer.addClass(this.resRef.nativeElement, "spinanimation");
      this.brService.backup().then(data => {
        this.util.toastStart('备份完成', 1500);
        this.getLastDate();
        this.is = true;
        this._renderer.removeClass(this.resRef.nativeElement, "spinanimation");
      }).catch(error => {
        this.util.toastStart('备份失败', 1500);
        this.is = true;
        this._renderer.removeClass(this.resRef.nativeElement, "spinanimation");
      })
    }
  }

  recover(){
    if(this.isRecover && this.is){
      this.is = false;
      this._renderer.addClass(this.resRef.nativeElement,"spinanimation");
      this.brService.recover(Number(this.bts)).then(data=>{
        this.util.toastStart('恢复成功',1500);
        this.is = true;
        this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
      }).catch(error=>{
        this.util.toastStart('恢复失败',1500);
        this.is = true;
        this._renderer.removeClass(this.resRef.nativeElement,"spinanimation");
      })
    }
  }

}
