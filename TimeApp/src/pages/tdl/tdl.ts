import {Component, ViewChild, ElementRef, Input, Renderer2} from '@angular/core';
import {App, IonicPage, NavController, NavParams, Scroll, ViewController} from 'ionic-angular';
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
    <ion-scroll id="ddd" #contentScroll scrollY="true">
    <ion-grid>
      <ion-row *ngFor="let sdl of scdlDataList">
        <div class="w-75 leftside leftpanding">
          <div class ="w-44  ">
            <div class="ym-fsize">{{sdl.d | formatedate:"YYYY-MM"}}</div>
            <div class="d-fsize">{{sdl.d | formatedate :"DD"}}</div>
          </div>
        </div>
        <div class="w-auto rightside  " >
          <div id="{{scd.anchorid}}" class="rightpanding" *ngFor ="let scd of sdl.scdl" [ngStyle]="{'background-color':scd.cbkcolor}">
            <div class="floatleft dt-set" [ngStyle]="{'background-color':scd.cbkcolor}">
              <div>
                <div class="floatleft tm-fsize tm-margin">{{scd.st}}</div>
                <div class="color-dot floatleft text-fsize" [ngStyle]="{'background-color':scd.p.jc}" ></div>
                <div >{{scd.sn}}</div>
              </div>
              <div class="p-fsize" *ngIf="scd.gs == '1'">{{scd.fssshow}}</div>
              <div class="p-fsize" *ngIf="scd.gs == '0'">{{scd.fs.rn==""||scd.fs.rn ==null ?scd.fs.rc:scd.fs.rn}}</div>
            </div>
            <div class = "more-set"><ion-icon ios="ios-more" md="md-more"></ion-icon></div>
          </div>
        </div>
      </ion-row>
    </ion-grid>
    </ion-scroll>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private tdlServ : TdlService) {
  }

  scdlDataList :Array<ScdlData> = new Array<ScdlData>();
  //初始锚点
  dtanchor : string ="";
  @ViewChild('contentScroll') contentScroll: Scroll;

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');
    this.contentScroll.addScrollEventListener(this.timepickerChange);

  }

  timepickerChange(e) {
    console.log(e);
  }

  ionViewWillEnter() {
    this.init();
    this.contentScroll._scrollContent.nativeElement.scrollTop = 100;
    //id0,id1...
    //el.scrollIntoView(true);
    console.log("ionViewWillEnter")
  }
  ionViewDidEnter() {
    if (this.dtanchor !="" && this.dtanchor !=null){
      //画面scroll至锚点
      let el = document.getElementById(this.dtanchor);
      el.scrollIntoView(true);
      //设置后初始化锚点
      this.dtanchor = "";
    }

   /* setTimeout(()=>{
    let el = document.getElementById('id'+10);
    el.scrollIntoView(true);
  },200);*/
    console.log("ionViewDidEnter")
  }

  init() {



    /*for (let k=1 ; k<5;k++){
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
    }*/

    let flag = 0;
    let anchorid = 1;

    let sel =this.navParams.get("selectDay");
    let condi = moment(sel.time).format("YYYY/MM/DD");
    console.log("selectDay:"+condi);
    this.tdlServ.get(condi).then(data =>{
      this.scdlDataList = data;

      for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
        let tmpscdl = this.scdlDataList[j];

        // 设定日程的交替背景色
        for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
          let tmpscd =  tmpscdl.scdl[k];
          if (flag == 0){
            tmpscd.cbkcolor = "#96162D";
            flag =1
          }else{
            tmpscd.cbkcolor = "#8E172B";
            flag =0
          }
          //设置日程锚点
          anchorid = anchorid +1;
          tmpscd.anchorid = "anchorid" + anchorid;

          //设置离传入日期最近的一个日期的第一个日程锚点为画面初始锚点
          if ((moment(tmpscdl.d).isAfter(condi)  || moment(tmpscdl.d).isSame(condi)) &&
            k==0 && (this.dtanchor ==null || this.dtanchor =="")){
            this.dtanchor = tmpscd.anchorid;
          }

          //设置参与人画面显示内容
          let str = "";
          for (let f = 0, len = tmpscd.fss.length; f< len; f++) {
            let rn = tmpscd.fss[f].rn ==""||tmpscd.fss[f].rn == null?tmpscd.fss[f].rc:tmpscd.fss[f].rn;
            str = str + ',' + rn ;
            if (j== len -1){
              str = str.substr(1)
            }
          }
          tmpscd.fssshow = str;
        }
      }

      //如果传入日期大于查询结果日期，锚点设为数据list的最后一个日期
      if (this.dtanchor == "" && this.scdlDataList.length >0 ){
        this.dtanchor = this.scdlDataList[this.scdlDataList.length-1].scdl[0].anchorid;
      }
    })

    /*setTimeout(()=>{
      let el = document.getElementById('id'+10);
      el.scrollIntoView(true);
    },200);*/
/*    let condi =this.navParams.get("dt");
    condi = "2019/01/01";
    this.tdlServ.get(condi).then(data =>{
      this.scdlData = data;
    })*/
  }





  loadMoreData(evt){
    this.init();
    evt.complete();
    console.log("****************************************loadmoredata");
  }
}
