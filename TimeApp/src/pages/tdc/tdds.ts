import {Component} from '@angular/core';
import {
  NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {ScdData, ScdPageParamter, SpecScdData} from "../../data.mapping";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";

/**
 * Generated class for the 日程详情（系统） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tdds',
  providers: [],
  template: `
    <ion-content class="content-set">
      <ion-grid>
        <ion-row class="header-set">
        </ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" readonly="true"></ion-textarea>
        </ion-row>
        <ion-row>

          <div class="lbl-jh2 hasjh" [ngStyle]="{'background-color':sp.p.jc == '' ? '#fffff' : sp.p.jc}">
            下载
          </div>
          <div>{{scd.p.jn}}</div>
        </ion-row>
        <ion-row>
          {{scd.showSpSd}}
        </ion-row>
        <ion-row>
          <div>{{alldshow}}</div>
        </ion-row>

        <ion-row *ngIf="sp.bz">
          <textarea type="text" autosize placeholder="备注" [(ngModel)]="sp.bz" class="memo-set"
                        readonly="true"></textarea>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="foot-set">
      <ion-toolbar>
        <button ion-button icon-only (click)="cancel()" full>
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-toolbar>
    </ion-footer>
  `

})
export class TddsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util: UtilService,private  busiServ: PgBusiService,
  ) {

  }

  //画面数据
  scd: ScdData = new ScdData();
  sp:SpecScdData = new SpecScdData();
  //全天
  alldshow: string = "";


  async ionViewWillEnter() {

    let paramter: ScdPageParamter = this.navParams.data;
    this.scd = await this.busiServ.getRcBySiAndSd(paramter.si,paramter.d.format("YYYY/MM/DD"));
    Object.assign(this.sp , this.scd.baseData);

    this.scd.showSpSd = paramter.d.format("YYYY年MM月DD日");

    this.alldshow = this.util.adStrShow(this.sp.st);

  }


  cancel() {
    this.navCtrl.pop();

  }


}
