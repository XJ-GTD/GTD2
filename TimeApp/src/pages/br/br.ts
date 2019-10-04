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


    <page-box title="备份恢复数据" [buttons]="buttons" (onBack)="goBack()">

      <div #resRef  >
        <div class="img"  >
          <ion-icon class="fal fa-spinner"></ion-icon>
        </div>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>日程/联系人/群组/计划/提醒/设置</ion-label>
      </div>
      <div ion-item no-border no-padding no-lines no-margin class="itemwarp font-normal">
        <ion-label>
          上次备份时间：<small>{{bts  * 1000 | date:"yyyy年MM月dd日 HH:mm:ss"}}</small></ion-label>
      </div>

      <div ion-item no-border no-padding no-lines no-margin class="itemwarp">
          <button item-left padding (click)="backup(is)" [ngStyle]="{'opacity': is ? 1 : 0.2 }">
            <ion-icon class="fal fa-cloud-upload-alt"></ion-icon>
          </button>
          <button item-right padding (click)="recover(isRecover,is)" [ngStyle]="{'opacity': isRecover && is ? 1 : 0.2 }">
            <ion-icon class="fal fa-cloud-download-alt"></ion-icon>
          </button>
      </div>

    </page-box>
    

  `,
})
export class BrPage {


  buttons: any = {
    cancel: true
  };

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
