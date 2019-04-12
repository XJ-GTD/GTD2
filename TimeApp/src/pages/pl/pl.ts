import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {PlService} from "./pl.service";
import {PagePDPro} from "../pd/pd.service";
import {UtilService} from "../../service/util-service/util.service";

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
        <ion-title>计划</ion-title>
        <ion-buttons right>
          <button ion-button color="danger" (click)="newPlan()">
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
              全部计划
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
              <div style="float: left;">系统计划</div><small>（长按系统计划可清除）</small>
            </ion-list-header>
            <div *ngFor="let option of xtJhs">
              <ion-item class="plan-list-item"(press)="delPlan(option)" >
                <div (click)="toPd(option)">{{option.jn}}({{option.js}})</div>
                <button ion-button clear item-end (click)="download(option)">
                  <div *ngIf="option.jtd == '0'" class="content-download">
                    下载
                  </div>
                  <div *ngIf="option.jtd =='1'">
                    <img class="img-content-refresh" src="./assets/imgs/sx.png">
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
  picture:any = "xl.png" ;
  zdyDisplay:any = "none";
  show:any = "block";

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
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
    this.plService.getPlan().then(data=>{
      this.xtJhs = data.xtJh;
      this.zdyJhs = data.zdyJh;

      if(this.zdyJhs.length == 0){
        this.zdyDisplay = "block";
        this.picture = "xlr.png";
      }else {
        this.zdyDisplay = "none";
      }
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
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
        this.util.toast('系统计划：' + jh.jn + "未下载",1500);
      }
    }
    if(go){
      this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});
    }
  }

  change(){
    if(this.show == "block"){
      this.show = "none";
      this.picture = "xlr.png";
    }else{
      this.show = "block";
      this.picture = "xl.png";
    }
  }

  delPlan(jh:PagePDPro){
    if(jh.jtd == '0') { //下载
      this.util.toast('请先下载系统计划：' + jh.jn,1500);
    }else{
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: '确定要删除计划“' + jh.jn +"”?",
        buttons: [{
          text: '取消',
          }, {
            text: '确定',
            handler: () => {
              let count = jh.js;
              this.plService.delete(jh).then(data=>{
                jh.jtd = '0';
                jh.js = '?';
              }).catch(res=>{
                jh.jtd = '1';
                jh.js = count;
                this.util.toast('删除计划：' + jh.jn + " 失败",1500);
              });

            }
          }]
      });
      alert.present();
    }
  }

  download(jh:PagePDPro){
    let message:any;
    if(jh.jtd == '0'){
      message = "下载";
    }else {
      message = "刷新";
    }
    this.plService.downloadPlan(jh.ji).then(data=>{
      jh.js = data.data == null ? "0":data.data;

      this.util.toast(message + "成功",1500);
    }).then(data=>{
      if(jh.jtd == '0'){ //下载
        jh.jtd = '1';
        this.plService.upPlan(jh);//系统计划 jtd 变更
      }
    }).catch(res=>{
      this.util.toast(message + "失败",1500);
    });
  }
}
