import { Component } from '@angular/core';
import {
  ActionSheetController,  IonicPage, ModalController, NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import {TdcService} from "../tdc/tdc.service";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";

/**
 * Generated class for the 日程详情（系统） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tdds',
  providers: [],
  template:`<ion-header no-border class="header-set">
    <ion-toolbar>
      <ion-grid>
        <ion-row right>
          <div class="h-auto " >
            
          </div>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content class ="content-set">
    <ion-grid>
      <ion-row >
        <div class = "input-set">
          <ion-label >{{scd.sn}}</ion-label>
        </div>
      </ion-row>
      <ion-row >
        <div >
            <button  (click)="toPlanChoose()" ion-button  round class ="btn-jh">{{scd.p.jn==""?"添加计划":scd.p.jn}}</button>
        </div>
      </ion-row>
      <ion-row >
          <div class="dt-set">
            <ion-item>
                <ion-label >{{scd.sd | formatedate : "CYYYY/M/DD"}}</ion-label>
            </ion-item>
          </div>
          <div class="week-set">
            <ion-label >{{scd.sd | formatedate : "CWEEK" }}</ion-label>
          </div>
          <div class="tm-set">
            <ion-label >{{alldshow}}</ion-label>
          </div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl repttop"><ion-label>重复</ion-label></div>
        <div class ="repttop1"><ion-label>{{reptshow}}</ion-label></div>
      </ion-row>
      <ion-row >
        <div class ="reptlbl txtop"><ion-label>提醒</ion-label></div>
        <div class ="txtop1"><button ion-button  round clear class ="sel-btn-set"
                     [ngClass]="wake.close == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('0')">关</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.tenm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('1')">10分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.thirm == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('2')">30分钟</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.oh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('3')">1小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.foh == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('4')">4小时</button></div>
        <div class ="txtop1"><button ion-button  round clear  class ="sel-btn-set"
                     [ngClass]="wake.od == 1?'sel-btn-seled':'sel-btn-unsel'"
                     (click)="clickwake('5')">1天</button></div>
      </ion-row>
      <ion-row >
        <div class = "memo-set">
          <ion-input type="text" placeholder="备注" [(ngModel)]="scd.bz"></ion-input>
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>

  
  
  `

})
export class TddsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util:UtilService,private  tddiServ : TdcService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController,private  busiServ : PgBusiService
  ) {

  }

  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;

  reptshow:string ="";



  ionViewDidLoad() {

    console.log('ionViewDidLoad NewAgendaPage');
  }

  ionViewWillEnter() {


    this.tddiServ.get(this.navParams.get("si")).then(data=>{
      let bs : BsModel<ScdData> = data;
      Object.assign(this.scd,bs.data);


      switch (this.scd.rt){
        case "0":
          this.reptshow="关";
          break;
        case "1":
          this.reptshow="每日";
          break;
        case "2":
          this.reptshow="每周";
          break;
        case "3":
          this.reptshow="每月";
          break;
        case "4":
          this.reptshow="每年";
          break;
        default:
          this.reptshow="关";
      }

      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      this.scd.st = moment().format("HH:mm");

    })
  }



  cancel(){
    this.navCtrl.pop();

  }






}
