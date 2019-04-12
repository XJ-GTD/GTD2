import {Component} from '@angular/core';
import {
  NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {UtilService} from "../../service/util-service/util.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {ScdPageParamter, TdcService} from "../tdc/tdc.service";
import {ScdData} from "../../service/pagecom/pgbusi.service";

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
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..." readonly="true"></ion-textarea>
        </ion-row>
        <ion-row>

          <div class="lbl-jh2 hasjh" [ngStyle]="{'background-color':scd.p.jc == '' ? '#fffff' : scd.p.jc}">
            下载
          </div>
          <div>{{scd.p.jn}}</div>
        </ion-row>
        <ion-row>
          <ion-datetime displayFormat="YYYY年M月DD日 DDDD"
                        pickerFormat="YYYY MM DD" color="light"
                        [(ngModel)]="scd.showSd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                        min="1999-01-01" max="2039-12-31" disabled
          ></ion-datetime>
        </ion-row>
        <ion-row>
          <div>{{alldshow}}</div>
        </ion-row>

        <ion-row>
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="scd.bz" class="memo-set"
                        readonly="true"></ion-textarea>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="foot-set">
      <ion-toolbar>
        <ion-buttons start padding-left>
          <button ion-button icon-only (click)="cancel()" start>
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>

        <ion-buttons end padding-right>
          <button ion-button icon-only (click)="cancel()" end>
            <ion-icon name="checkmark"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `

})
export class TddsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util: UtilService, private  tddiServ: TdcService,
  ) {

  }

  //画面数据
  scd: ScdData = new ScdData();
  //全天
  alldshow: string = "";


  ionViewWillEnter() {


    //受邀人修改的场合初始化
    let paramter: ScdPageParamter = this.navParams.data;
    this.tddiServ.get(paramter.si).then(data => {
      let bs: BsModel<ScdData> = data;
      Object.assign(this.scd, bs.data);

      this.scd.showSd = paramter.d.format("YYYY-MM-DD");
      this.scd.st = moment().format("HH:mm");

      if (this.scd.st == "99:99") {
        this.alldshow = "全天";
      } else {
        this.alldshow = this.scd.st;
      }
    })
  }


  cancel() {
    this.navCtrl.pop();

  }


}
