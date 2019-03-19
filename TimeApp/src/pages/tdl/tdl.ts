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
            <div class="ym-fsize">{{sdl.d | formatedate:"YYYY-MM"}}</div>
            <div class="d-fsize">{{sdl.d | formatedate :"DD"}}</div>
          </div>
        </div>
        <div class="w-auto rightside  " >
          <div class="rightpanding" *ngFor ="let scd of sdl.scdl" [ngStyle]="{'background-color':scd.cbkcolor}">
            <div class="floatleft dt-set" [ngStyle]="{'background-color':scd.cbkcolor}">
              <div class="floatleft tm-fsize tm-margin">{{scd.st}}</div>
              <div class="color-dot floatleft text-fsize" [ngStyle]="{'background-color':scd.p.jc}" ></div>
              <div >{{scd.sn}}</div>
              <div class="p-fsize" *ngIf="scd.gs == '1'">{{scd.fssshow}}</div>
              <div class="p-fsize" *ngIf="scd.gs == '0'">{{scd.fs.rn==""||scd.fs.rn ==null ?scd.fs.rc:scd.fs.rn}}</div>
            </div>
            <div class = "more-set"><ion-icon ios="ios-more" md="md-more"></ion-icon></div>
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
        scd.sn = "开会需要测试开会需要测试开会需要测试开会需要测开会需要测开会需要测试" + scd.st;
        scd.p.jc = "#FFFF00";
        scd.gs="0";
        scd.fs.rn = "测试人员"+i;
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
        scd.fssshow="测试人员5，测试人员6，测试人员7";
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
        scd.fs.rn = "测试人员a"+i;
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


    // 设定日期的交替背景色
    let flag = 0;
    for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
      let tmp = this.scdlDataList[j];
      for (let k = 0, len = tmp.scdl.length; k < len; k++) {
        if (flag == 0){
          tmp.scdl[k].cbkcolor = "#96162D";
          flag =1
        }else{
          tmp.scdl[k].cbkcolor = "#8E172B";
          flag =0
        }
      }
    }

    let aa :string ="";

/*    let condi =this.navParams.get("dt");
    condi = "2019/01/01";
    this.tdlServ.get(condi).then(data =>{
      this.scdlData = data;
    })*/
  }


}
