import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
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
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>
        <ion-title>日历</ion-title>
        <ion-buttons right>
          <button ion-button class="button-header-right" (click)="newPlan()">
            添加
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-list-header class="plan-list-item" (click)="change()">
              自定义日历
              <img class="img-content-plan" src="./assets/imgs/{{picture}}">
            </ion-list-header>
            <div *ngFor="let option of zdyJhs" [ngStyle]="{'display': show }">
              <ion-item class="plan-list-item" (click)="toPd(option)">
                <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
                {{option.jn}}({{option.js}})
              </ion-item>
            </div>
            <div [ngStyle]="{'display': zdyDisplay }" class="plan-none"> 暂无计划</div>
            <div style="height: 60px"></div>
            <ion-list-header class="plan-list-item">
              <div style="float: left;">日历</div><small>（长按日历可清除）</small>
            </ion-list-header>
            <div *ngFor="let option of xtJhs">
              <ion-item class="plan-list-item"(press)="delPlan(option)" >
                <div (click)="toPd(option)">{{option.jn}}({{option.js}})</div>
                <button ion-button clear item-end (click)="download(option)">
                  <div *ngIf="option.jtd == '0'" class="content-download">
                    下载
                  </div>
                  <div *ngIf="option.jtd =='1'">
                    <img class="img-content-refresh" src="./assets/imgs/sx.png" />
                  </div>
                </button>
              </ion-item>
            </div>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class PlPage {

  xtJhs:any;
  zdyJhs:any;
  picture:any = 'xl.png' ;
  zdyDisplay:any = 'none';
  show:any = 'block';

  constructor(private navCtrl: NavController,
              private plService:PlService,
              private util: UtilService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlPage');
  }

  ionViewDidEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.util.loadingStart();
    this.plService.getPlan().then(data=>{
      this.xtJhs = data.xtJh;
      this.zdyJhs = data.zdyJh;

      if(this.zdyJhs.length == 0){
        this.zdyDisplay = 'block';
        this.picture = 'xlr.png';
      }else {
        this.zdyDisplay = 'none';
      }
      this.util.loadingEnd();
    }).catch(error=>{
      this.util.toastStart('获取计划失败',1500);
      this.util.loadingEnd();
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  newPlan(){
    this.navCtrl.push(DataConfig.PAGE._PC_PAGE,{});
  }

  toPd(jh:PagePDPro){
    let go:any = true;
    if(jh.jt == "1"){
      if(jh.jtd == "0"){
        go = false;
      }
    }
    if(go){
      this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{'jh':jh});
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
