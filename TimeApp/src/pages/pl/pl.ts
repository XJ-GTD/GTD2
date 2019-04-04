import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';
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
            <div *ngFor="let option of zdyJhs" [ngClass]="{'div-show-true': show == true , 'div-show-false': show == false}">
              <ion-item class="plan-list-item" (click)="toPd(option)">
                <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
                {{option.jn}}({{option.js}})
              </ion-item>
            </div>
            <div [ngStyle]="{'display': zdyDisplay }"> 无计划</div>
            <ion-list-header class="plan-list-item">
              <div>系统计划</div><small>长按系统计划可清除</small>
            </ion-list-header>
            <div *ngFor="let option of xtJhs">
              <ion-item class="plan-list-item"(press)="delPlan(option)" >
                <div (click)="toPd(option)">{{option.jn}}({{option.js}})</div>
                <button ion-button clear item-end (click)="download(option)" >
                  <div *ngIf="option.jtd == '0'" class="content-download">
                    下载
                  </div>
                  <div *ngIf="option.jtd=='1'">
                    <img class="img-content-refresh" src="./assets/imgs/sx.png">
                  </div>
                </button>
              </ion-item>
            </div>
            <div [ngStyle]="{'display': xtDisplay }"> 系统无计划</div>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class PlPage {

  xtJhs:any;
  zdyJhs:any;
  show:any = true;
  picture:any = "xl.png" ;
  zdyDisplay = "none";
  xtDisplay = "none";

  constructor(private navCtrl: NavController,
              private alertCtrl: AlertController,
              private plService:PlService) {
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
      }

      if(this.xtJhs.length == 0){
        this.xtDisplay = "block";
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
    this.navCtrl.push(DataConfig.PAGE._PD_PAGE,{"jh":jh});
  }

  change(){
    if(this.show){
      this.show = false;
      this.picture = "xlr.png";
    }else{
      this.show = true;
      this.picture = "xl.png";
    }
  }

  delPlan(jh:PagePDPro){
    if(jh.jtd == '0') { //下载
      let alert = this.alertCtrl.create({
        title:'',
        subTitle: '请先下载系统计划：' + jh.jn,
        buttons:['确定']
      });
      alert.present();
    }else{
      let alert = this.alertCtrl.create({
        title: '',
        subTitle: '确定要删除计划“' + jh.jn +"”?",
        buttons: [{
          text: '取消',
          }, {
            text: '确定',
            handler: () => {
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
      this.plService.upPlan(jh);//系统计划 jtd 变更
    }
    this.plService.downloadPlan(jh.ji).then(data=>{
      let alert = this.alertCtrl.create({
        title:'',
        subTitle: message,
        buttons:['确定']
      });
      alert.present();
    })
  }
}
