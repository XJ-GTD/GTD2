import {Component, ElementRef, Input, Renderer2} from '@angular/core';
import {App, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import * as moment from "moment";
import {fsData, ScdData, ScdlData, TdlService} from "./tdl.service";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template: `<ion-content>
    <ion-grid>
      <ion-row *ngFor="let sdl of scdlDataList">
        <div class="w-75 leftside leftpanding">
          <div class ="w-44  ">
            <div class="ym-size">{{sdl.d | formatedate:"YYYY-MM"}}</div>
            <div class="d-size">{{sdl.d | formatedate :"DD"}}</div>
          </div>
        </div>
        <div class="w-auto rightside  " >
          <div class="rightpanding" *ngFor ="let scd of sdl.scdl">
            <div *ngif="scd.gs == '1'">{{scd.fssshow}}</div>
            <div *ngif="scd.gs == '0'">{{scd.fs.rn==""||scd.fs.rn ==null ?scd.fs.rc:scd.fs.rn}}</div>
            <div>{{scd.st}}</div>
            <<div class="color-dot" ngStyle="{background-color:scd.jc}" ></div>
            <div>{{scd.sn}}</div>
          </div>
        </div>
      </ion-row>
    </ion-grid>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private tdlServ : TdlService) {
  }

  scdlDataList :Array<ScdlData> = new Array<ScdlData>();

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');
  }

  ionViewWillEnter() {
    this.init();
  }

  init() {


    for (let k=1 ; k<5;k++){
      let scdldata = new ScdlData();
      let a  : string = "";
      if (k>9){
        a = k + "";
      }else {
        a = "0" + k;
      }
      scdldata.d='2019/01/'+ a;
      scdldata.scdl = new Array<ScdData>();
      for (let i=0 ;i<k ;i++){
        let scd = new ScdData();
        scd.sd = scdldata.d;
        scd.st = "11:0"+ i
        scd.sn = "开会需要测试" + scd.st;
        scd.p.jc = "#fff";
        scd.gs="0";
        scdldata.scdl.push(scd);
        if (i>20){
          break;
        }
      }
      this.scdlDataList.push(scdldata);
    }


    for (let k=1 ; k<10;k++){
      let scdldata = new ScdlData();
      let a  : string = "";
      if (k>9){
        a = k + "";
      }else {
        a = "0" + k;
      }
      scdldata.d='2019/02/'+ a;
      scdldata.scdl = new Array<ScdData>();
      for (let i=0 ;i<k ;i++){
        let scd = new ScdData();
        scd.sd = scdldata.d;
        scd.st = "11:0"+ i
        scd.sn = "跑步需要测试" + scd.st;
        scd.p.jc = "#000";
        scd.gs="1";
        for (let m=0;m<4;m++){
          let fss = new fsData();
          fss.rn = "参与人"+m;
          scd.fss.push(fss);
        }
        scdldata.scdl.push(scd);
        if (i>20){
          break;
        }
      }
      this.scdlDataList.push(scdldata);
    }

    for (let k=1 ; k<30;k++){
      let scdldata = new ScdlData();
      let a  : string = "";
      if (k>9){
        a = k + "";
      }else {
        a = "0" + k;
      }
      scdldata.d='2019/03/'+ a;
      scdldata.scdl = new Array<ScdData>();
      for (let i=0 ;i<k ;i++){
        let scd = new ScdData();
        scd.sd = scdldata.d;
        scd.st = "11:0"+ i
        scd.sn = "吃饭需要测试" + scd.st;
        scd.p.jc = "red";
        scd.gs="0";
        for (let m=0;m<2;m++){
          let fss = new fsData();
          fss.rn = "参与人"+m;
          scd.fss.push(fss);
        }
        scdldata.scdl.push(scd);
        if (i>20){
          break;
        }
      }
      this.scdlDataList.push(scdldata);
    }





/*    let condi =this.navParams.get("dt");
    condi = "2019/01/01";
    this.tdlServ.get(condi).then(data =>{
      this.scdlData = data;
    })*/
  }


}
