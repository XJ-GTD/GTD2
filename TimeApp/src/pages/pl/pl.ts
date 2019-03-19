import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {PlService} from "./pl.service";
import {PagePDPro} from "../pd/pd.service";

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
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>计划</ion-title>
        <ion-buttons right>
          <button ion-button (click)="newPlan()" color="danger">
            <ion-icon name="add"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-list-header class="plan-list-item">
              全部计划
            </ion-list-header>
            <div *ngFor="let jh of jhs">
              <ion-item class="plan-list-item" (click)="toPd(jh)" *ngIf="jh.jt=='2'">
                <div class="color-dot" [ngStyle]="{'background-color': jh.jc }" item-start></div>
                {{jh.jn}}({{jh.js}})
              </ion-item>
            </div>
            <ion-list-header class="plan-list-item">
              <div>系统计划</div><small>长按系统计划可清除</small>
            </ion-list-header>
            <div *ngFor="let jh of jhs">
              <ion-item class="plan-list-item" *ngIf="jh.jt=='1'" (press)="pressEvent(jh)" >
                <div (click)="toPd(jh)">{{jh.jn}}({{jh.js}})</div>
                <button ion-button color="danger" clear item-end (click)="download(jh)" >
                  <div *ngIf="jh.jtd == '0'">
                    下载
                  </div>
                  <div *ngIf="jh.jtd=='1'">
                    <ion-icon name="sync"></ion-icon>
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

  jhs:any;

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private plService:PlService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlPage');
  }

  ionViewWillEnter(){
    this.getAllJh();
  }

  getAllJh(){
    this.plService.getPlan().then(data=>{
      this.jhs = data.pl;
    }).catch(res=>{
      console.log("获取计划失败" + JSON.stringify(res));
    });
  }

  alert(message){
    let alert = this.alertCtrl.create({
      title:'',
      subTitle: message,
      buttons:['确定']
    });
    alert.present();
  }

  goBack() {
    this.navCtrl.pop();
  }

  newPlan(){
    this.navCtrl.push(DataConfig.PAGE._PC_PAGE,{});
  }

  toPd(jh:PagePDPro){
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});

  }

  pressEvent(jh:PagePDPro){
    if(jh.jtd == '0') { //下载
      this.alert('请先下载系统计划：' + jh.jn);
    }else{
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: '确认删除：' + jh.jn,
        buttons: [{
          text: '确定', role: '取消', handler: () => {
            this.plService.delete(jh);
            jh.jtd = '0';
          }
        }]
      });
      alert.present();
    }
  }

  download(jh:PagePDPro){
    let message = "刷新成功";
    if(jh.jtd == '0'){ //下载
      jh.jtd = '1';
      message = "下载成功";
      this.plService.upPlan(jh);
    }
    this.plService.downloadPlan(jh.ji).then(data=>{
      //console.debug("downloadPlan::" + JSON.stringify(data));
      this.alert(message);
    })
  }

}
