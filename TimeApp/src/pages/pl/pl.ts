import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {PlService} from "./pl.service";
import {UtilService} from "../../service/util-service/util.service";
import {PagePDPro} from "../../data.mapping";

/**
 * Generated class for the PlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pl',
  template:
    `
    <page-box title="归类日历" [buttons]="buttons" (onBack)="goBack()" (onCreate)="newPlan()"  nobackgroud nobottom>
      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            定义了<span class="count"> {{zdyJhs.length}} </span>个日历
          </ion-list-header>
          <ion-item   *ngFor="let option of zdyJhs" (press)="delPlan(option)" (click)="toPd(option)" >
            <ion-label >
              <ion-icon class="fal fa-circle font-small"   [ngStyle]="{'color': option.jc }"></ion-icon>
              {{option.jn}}(<span class="font-small">{{option.js}}</span>)
            </ion-label>
          </ion-item>
        </ion-list>


        <ion-list>
          <ion-list-header>
            系统日历<span class="count"> {{xtJhs.length}} </span>个 <small>（长按日历名称可清除）</small>
          </ion-list-header>
          <ion-item   *ngFor="let option of xtJhs" (press)="delPlan(option)" >
            <ion-label>
              <ion-icon class="fal fa-circle font-small"   [ngStyle]="{'color': option.jc }"></ion-icon>
              {{option.jn}}(<span class="font-small">{{option.js}}</span>)
            </ion-label>
            <ion-icon class="fal fa-download" *ngIf="option.jtd == '0'" (click)="download(option)" item-end ></ion-icon>
            <ion-icon class="fal fa-sync" *ngIf="option.jtd =='1'"(click)="download(option)" item-end ></ion-icon>
          </ion-item>
        </ion-list>
      </ion-scroll>
    </page-box>
  `,
})
export class PlPage {

  buttons: any = {
    create:true,
    cancel: true
  };
  xtJhs:Array<PagePDPro> = new Array<PagePDPro>();
  zdyJhs:Array<PagePDPro> = new Array<PagePDPro>();
  picture:any = 'xl.png' ;
  zdyDisplay:any = 'none';
  show:any = 'block';

  constructor(private navCtrl: NavController,
              private plService:PlService,
              private util: UtilService,
              public modalController: ModalController,) {
    this.plService.getPlan().then(data=>{
      this.xtJhs = data.xtJh;
      this.zdyJhs = data.zdyJh;

      if(this.zdyJhs.length == 0){
        this.zdyDisplay = 'block';
        this.picture = 'xlr.png';
      }else {
        this.zdyDisplay = 'none';
      }
    }).catch(error=>{
      this.util.toastStart('获取计划失败',1500);
    });
  }




  goBack() {
    this.navCtrl.pop();
  }

  newPlan(){
    this.modalController.create(DataConfig.PAGE._PC_PAGE).present();
  }

  toPd(jh:PagePDPro){
    let go:any = true;

    if(jh.jt == "1" || jh.jt == "0"){
      if(jh.jtd == "0"){
        go = false;
      }
    }

    if(go){
      this.modalController.create(DataConfig.PAGE._PD_PAGE,{'jh':jh}).present();
    }
  }

  change(){
    if(this.show == 'block'){
      this.show = 'none';
      this.picture = 'xlr.png';
    }else{
      this.show = 'block';
      this.picture = 'xl.png';
    }
  }

  delPlan(jh:PagePDPro){
    if(jh.jtd == '0') { //下载
    }else{
      this.util.alterStart('2',()=>{this.delete(jh)});
    }
  }

  delete(jh:PagePDPro){
    this.util.loadingStart();
    let count = jh.js;
    this.plService.delete(jh).then(data=>{
      jh.jtd = '0';//系统计划 jtd 变更
      jh.js = '?';
      this.util.loadingEnd();
    }).catch(error=>{
      jh.jtd = '1';
      jh.js = count;
      this.util.toastStart('删除系统计划：' + jh.jn + ' 失败',1500);
      this.util.loadingEnd();
    });
  }

  download(jh:PagePDPro){
    this.util.loadingStart();
    let message:any;
    if(jh.jtd == '0'){
      message = '下载';
    }else {
      message = '刷新';
    }
    this.plService.downloadPlan(jh).then(data=>{
      jh.js = data == null || data == 0 ? 0:data;
      jh.jtd = '1';
      this.util.loadingEnd();
    }).catch(error=>{
      this.util.toastStart(message + '失败',1500);
      this.util.loadingEnd();
    });
  }
}
