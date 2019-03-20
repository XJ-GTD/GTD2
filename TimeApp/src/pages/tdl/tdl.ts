import {Component, ViewChild, ElementRef, Input, Renderer2} from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams, Scroll, ViewController} from 'ionic-angular';
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
  template: `<ion-header no-border>
    <ion-toolbar>
      <ion-grid>
        <ion-row >
          <div class="daynav h-auto">
            <ion-buttons left class ="backbtn-set">
              <button  ion-button icon-only (click)="goBack()" color="danger">
                <ion-icon name="arrow-back"></ion-icon>
              </button>
            </ion-buttons>
          </div>
          <div class="dayagendas w-auto h-auto"></div>
        </ion-row>
      </ion-grid>
    </ion-toolbar>
  </ion-header>
  <ion-content no-bounce>
    <div class = "spacediv-set"> </div>
    <ion-scroll id="ddd" #contentScroll scrollY="true">
      <ion-grid>
        <ion-row *ngFor="let sdl of scdlDataList">
          <div class="daynav">
            <div class ="dayheader w-auto">
              <div class="ym-fsize text-center">{{sdl.d | formatedate:"YYYY-MM"}}</div>
              <div class="d-fsize text-center">{{sdl.d | formatedate :"DD"}}</div>
            </div>
          </div>
          <div class="dayagendas w-auto" >
            <div id="{{scd.anchorid}}" class="dayagenda row" *ngFor ="let scd of sdl.scdl;" [ngStyle]="{'background-color':scd.cbkcolor}">
              <div class="dayagendacontent w-auto" [ngStyle]="{'background-color':scd.cbkcolor}">
                <div class ="agendaline1 row">{{this.pageLoadOver(scd.anchorid)}}
                  <div class="agenda-st">{{scd.st}}</div>
                  <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}" ></div>
                  <div class ="agenda-sn">{{scd.sn}}</div>
                </div>
                <div class="agendaline2" *ngIf="scd.gs == '1'">{{scd.fssshow}}</div>
                <div class="agendaline2" *ngIf="scd.gs == '0'">{{scd.fs.rn==""||scd.fs.rn ==null ?scd.fs.rc:scd.fs.rn}}</div>
              </div>
              <div class = "dayagendaoperation"><ion-icon ios="ios-more" md="md-more"></ion-icon></div>
            </div>
          </div>
        </ion-row>
      </ion-grid>
    </ion-scroll>
    <ion-fab center  bottom>
      <button ion-fab  color="light"><ion-icon name="arrow-down"></ion-icon></button>
    </ion-fab>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private tdlServ : TdlService,
              public events: Events) {
    events.subscribe('po', (data) => {

      if (data !="" && data !=null){
        //画面scroll至锚点
        let el = document.getElementById(data.toString());

        el.scrollIntoView(true);
        //el.scrollTop = 44;
        //设置后初始化锚点
        this.dtanchor = "";
      }
    });
  }

  scdlDataList :Array<ScdlData> = new Array<ScdlData>();
  //初始锚点
  dtanchor : string ="";

  pageLoaded :boolean = false;
  @ViewChild('contentScroll') contentScroll: Scroll;

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');
    //this.contentScroll.addScrollEventListener(this.timepickerChange);

  }

  ionViewWillEnter() {
    this.init();
    console.log("ionViewWillEnter")
  }
  ionViewDidEnter() {

    console.log("ionViewDidEnter")
  }

  init() {
    this.pageLoaded = false;
    let flag = 0;
    let anchorid = 1;

    let sel =this.navParams.get("selectDay");
    let condi = moment(sel).format("YYYY/MM/DD");
    condi ="2018/12/28"
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

  }

  pageLoadOver(anchorid){
    if (this.pageLoaded ){
      return ""
    }
    if (this.scdlDataList.length >0 ){
      let a = this.scdlDataList;
      let b = a[a.length-1].scdl;
      //当画面传入的anchorid与数据中的最后一个锚点一致时，表示加载结束
      if (anchorid == b[b.length-1].anchorid){
        this.pageLoaded = true;
        this.events.publish('po',this.dtanchor);
      }
    }
    return "";
  }

  goBack(){
    this.navCtrl.pop();
  }
}
