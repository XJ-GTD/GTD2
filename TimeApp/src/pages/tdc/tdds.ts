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
            <ion-buttons start>
              <button ion-button icon-only (click)="cancel()" class="backbtn-set">
                <img src="../../assets/imgs/fh2.png"/>
              </button>
            </ion-buttons>
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
        <div  class ="lbl-jh">
          <ion-label class="lbl-jh2" >{{scd.p.jn=="" || scd.p.jn==null?"添加计划":scd.p.jn}}</ion-label>
        </div>
      </ion-row>
      <ion-row >
          <div class="dtshow-set">
            <ion-item>
                <ion-label >{{scd.sd | formatedate : "CYYYY/M/DD"}}</ion-label>
            </ion-item>
          </div>
          <div class="weekshow-set">
            <ion-label >{{scd.sd | formatedate : "CWEEK" }}</ion-label>
          </div>
          <div class="tmshow-set">
            <ion-label >{{alldshow}}</ion-label>
          </div>
      </ion-row>
    </ion-grid>
  </ion-content>

  
  
  `

})
export class TddsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util:UtilService,private  tddiServ : TdcService,
  ) {

  }

  //画面数据
  scd :ScdData = new ScdData();
  b:boolean = true;




  ionViewDidLoad() {

    console.log('ionViewDidLoad NewAgendaPage');
  }

  ionViewWillEnter() {


    this.tddiServ.get(this.navParams.get("si")).then(data=>{
      let bs : BsModel<ScdData> = data;
      Object.assign(this.scd,bs.data);

      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      this.scd.st = moment().format("HH:mm");

    })
  }



  cancel(){
    this.navCtrl.pop();

  }






}
