import {Component, ViewChild, ElementRef, Input, Renderer2} from '@angular/core';
import {
  ActionSheetController, App, Content, Events, IonicPage, ModalController, NavController, NavParams, Scroll,
  ViewController
} from 'ionic-angular';
import * as moment from "moment";
import {fsData, ScdData, ScdlData, TdlService} from "./tdl.service";
import {TddjService} from "../tddj/tddj.service";
import {TddiService} from "../tddi/tddi.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template: `<ion-header no-border *ngIf="headershow" >
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
  <ion-content #contentD class="content-set">
      <ion-grid>
        <ion-row *ngFor="let sdl of scdlDataList">
          <div class="daynav">
            <div class ="dayheader w-auto">
              <div class="ym-fsize text-center">{{sdl.d | formatedate:"YYYY"}}</div>
              <div class="d-fsize text-center">{{sdl.d | formatedate :"MM-DD"}}</div>
            </div>
          </div>
          <div class="dayagendas w-auto" >
            <div  class="dayagenda row" *ngFor ="let scd of sdl.scdl;let idx = index" 
                 [ngStyle]="{'background-color':idx/2==0?'#96162D':'#8E172B'}" (click)="toDetail(scd.si,sdl.d)">
              <div class="dayagendacontent w-auto" [ngStyle]="{'background-color':idx/2==0?'#96162D':'#8E172B'}">
                <div class ="agendaline1 row">{{this.pageLoadOver(scd.anchorid)}}
                  <div class="agenda-st">{{scd.st}}</div>
                  <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}" ></div>
                  <div class ="agenda-sn">{{scd.sn}}</div>
                </div>
                <div class="agendaline2" *ngIf="scd.gs == '1'">{{scd.fssshow}}</div>
                <div class="agendaline2" *ngIf="scd.gs == '0'">{{scd.fs.rn==""||scd.fs.rn ==null ?scd.fs.rc:scd.fs.rn}}</div>
              </div>
              <!--<div class = "dayagendaoperation" (click)="presentActionSheet(scd);">
                <ion-icon ios="ios-more" md="md-more" [ngStyle]="{'color':scd.morecolor}" ></ion-icon>
              </div>-->
            </div>
          </div>
        </ion-row>
      </ion-grid>
    <ion-fab center  bottom>
      <button *ngIf="downorup == 2" ion-fab  color="light" (click)="backtoTop();"><ion-icon name="arrow-up" color="danger" isActive="true"></ion-icon></button>
      <button *ngIf="downorup == 1" ion-fab  color="light" (click)="backtoTop();"><ion-icon name="arrow-down" color="danger" isActive="true"></ion-icon></button>
    </ion-fab>
  </ion-content>`

})
export class TdlPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,private tdlServ : TdlService,
              public events: Events,public actionSheetCtrl: ActionSheetController,
              private tddjServ : TddjService,private tddiServ : TddiService,
              private modalCtr: ModalController) {

    //初始化锚点位置
    events.subscribe('po', (data) => {

      if (data !="" && data !=null){
        //画面scroll至锚点
        let el = document.getElementById(data.toString());
        el.scrollIntoView(true);
      }

      //设置锚点会触发scrollstart,scrollend事件，在2事件内处理相应初始化内容
      this.initanchor  = true;

    });
  }

  headershow :boolean =false;
  //画面数据List
  scdlDataList :Array<ScdlData> = new Array<ScdlData>();


  //交替背景色
  cbkcolor1 :string ="#96162D";
  cbkcolor2 :string ="#8E172B";

  //仅在pageLoadOver方法内使用
  pageLoaded :boolean = false;

  //初始锚点，仅为初始化使用
  dtanchor : string ="";
  //是否正在初始化锚点
  initanchor : boolean = false;
  //记住初始化scroll位置
  initscrolltop : number =0;

  //向上或向下按钮显示控制 0：两个都不显示 ，1：显示up，2：显示down
  downorup:number = 0;

  //记住滑动结束的scrolltop
  //endScrolltop:number=0;
  //记住滑动结束的scrolltop
  startScrolltop:number=0;

  //记住向上每次滑动的预加载的最后日期
  scrollUpLastdt:string ="";
  //记住向下每次滑动的预加载的最早日期
  scrollDownEarlydt:string ="";

  //记住向上每次滑动的预加载的最后的颜色
  scrollUpLastcolor:string ="";
  //记住向下每次滑动的预加载的最早的颜色
  scrollDownEarlycolor:string ="";

  //上滑的取数据进行过程中，再次上滑不再获取数据
  upingdata :boolean = false;
  //下滑的取数据进行过程中，再次下滑不再获取数据
  downingdata:boolean = false;

  //处于上滑取数据状态，后续自动触发scrollend，scrollstart事件中使用，重新设定初始scrollTop
  upgetdata :boolean = false;
  //处于下滑取数据状态，后续自动触发scrollend，scrollstart事件中使用，重新设定初始scrollTop
  downgetdata:boolean = false;

  //记住上滑加载数据自动触发scroll事件后，与初始srolltop的偏移量
  upoffset :number = 0;
  //记住下滑滑加载数据自动触发scroll事件后，与初始srolltop的偏移量
  downoffset:number = 0;

  @ViewChild('contentD') contentD: Content;
  ionViewDidLoad() {
    console.log('ionViewDidLoad AgendaListPage');

    this.contentD.ionScrollEnd.subscribe(($event: any) => {
      if ($event == null) {
        return;
      }

      //设置初始化结束标志
      if (this.initanchor) {
        this.initanchor = false;
        return;
      }

      /*在异步获取数据，添加到显示list内时，会自动触发scrollstart，scroolend，
      并且此时开始的srcolltop与结束的scrolltop一致
      由于新的数据添加到了显示list，这种场合需要的处理，重新设定initscrolltop的值*/
      console.log("initscrolltop:" + this.initscrolltop);
      if ($event.scrollTop == this.startScrolltop && this.upgetdata) {
        this.initscrolltop = this.initscrolltop - $event.scrollTop + this.upoffset;
        this.upgetdata = false;
      }
      if ($event.scrollTop == this.startScrolltop && this.downgetdata) {
        this.initscrolltop = $event.scrollTop + this.initscrolltop - this.downoffset;
        console.log("do initscrolltop:" + this.initscrolltop);
        this.downgetdata = false;
      }

      console.log("startScrolltop:"+this.startScrolltop);
      console.log("endscrollTop:"+$event.scrollTop);
      if ($event.scrollTop > this.startScrolltop  ){
        console.log("上滑");
        //如果上滑的数据正在获取中，则上滑不在获取新的数据操作
        if (this.upingdata){
          return ;
        }
        this.upingdata = true;
        //获取当前日期之后的60条记录
        let condi = moment(this.scrollUpLastdt).add(1,'d').format("YYYY/MM/DD");
        this.tdlServ.up(condi,30).then(data =>{
          console.log("上滑获取数据量："+data.length);

          this.upoffset = $event.scrollTop;



          if (data.length >0 ) {

            //上滑获取数据
            this.upgetdata = true;

            for (let j = 0, len = data.length; j < len; j++) {
              let tmpscdl = data[j];

              // 设定日程的交替背景色
              for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
                let tmpscd =  tmpscdl.scdl[k];
                if (this.scrollUpLastcolor == this.cbkcolor1){
                  tmpscd.cbkcolor = this.cbkcolor2;
                }else{
                  tmpscd.cbkcolor = this.cbkcolor1;
                }

                //记住向上每次滑动的预加载的最后的颜色
                this.scrollUpLastcolor = tmpscd.cbkcolor;

                //设置参与人画面显示内容
                //tmpscd.fssshow = this.getFssshow(tmpscd);
              }

              //记住向上每次滑动的预加载的最后日期
              this.scrollUpLastdt =tmpscdl.d;

              //加入画面显示用list
              this.scdlDataList.push(tmpscdl);

            }
          }
          //获取数据结束
          this.upingdata = false;
        })

      }else if ($event.scrollTop < this.startScrolltop){
        console.log("下滑");

        //如果下滑的数据正在获取中，则下滑不在获取新的数据
        if (this.downingdata){
          return ;
        }
        this.downingdata = true;

        //获取当前日期之前的30条记录
        let condi = moment(this.scrollDownEarlydt).subtract(1,'d').format("YYYY/MM/DD");
        this.tdlServ.down(condi,30).then(data =>{
          console.log("下滑获取数据量："+data.length);

          this.downoffset = $event.scrollTop;



          if (data.length > 0){

            //下滑获取数据
            this.downgetdata = true;

            for (let  len = data.length, j = len -1; j >= 0; j--) {
              let tmpscdl = data[j];

              // 设定日程的交替背景色
              for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
                let tmpscd =  tmpscdl.scdl[k];
                if (this.scrollDownEarlycolor == this.cbkcolor1){
                  tmpscd.cbkcolor = this.cbkcolor2;
                }else{
                  tmpscd.cbkcolor = this.cbkcolor1;
                }

                //记住向上每次滑动的预加载的最后的颜色
                this.scrollDownEarlycolor = tmpscd.cbkcolor;

                //设置参与人画面显示内容
                //tmpscd.fssshow = this.getFssshow(tmpscd);
              }

              //记住向上每次滑动的预加载的最后日期
              this.scrollDownEarlydt =tmpscdl.d;

              //加入画面显示用list
              this.scdlDataList.unshift(tmpscdl);

            }
          }
          //获取数据结束
          this.downingdata = false;
        })
      }


    })

    this.contentD.ionScrollStart.subscribe(($event: any) => {
      if ($event == null){
        return;
      }
      //记住滑动开始时的scrolltop，以便在滑动结束时判断是上滑还是下滑
      this.startScrolltop  = $event.scrollTop;


      if (this.initanchor){
        //获取初始化锚点的scrolltop
        this.initscrolltop  = $event.scrollTop;
      }else{
        //设置向上或向下按钮显隐控制
        if ($event.scrollTop > this.initscrolltop  ){
          this.downorup = 1;
          console.log("相对初始位置向下滑动");
        }else if($event.scrollTop < this.initscrolltop){
          this.downorup = 2;
          console.log("相对初始位置向上滑动");
        }else{
          this.downorup = 0;
        }
      }

    });
  }

  ionViewWillEnter() {
    this.init();
    console.log("ionViewWillEnter")
  }

  //初始化数据
  init() {
    this.pageLoaded = false;


    let sel =this.navParams.get("selectDay");
    let condi = moment(sel).format("YYYY/MM/DD");

    //获取当前日期之前的30条记录
    this.tdlServ.down(condi,30).then(dwdata =>{

      //获取当前日期之后的30条记录
      let condi2 = moment(condi).add(1,'d').format("YYYY/MM/DD");
      this.tdlServ.up(condi2,30).then(data =>{
        this.headershow = true;

        this.scdlDataList = this.scdlDataList.concat(dwdata,data);
        let flag = 0;
        let anchorid = 1;
        for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
          let tmpscdl = this.scdlDataList[j];

          // 设定日程的交替背景色
          for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
            let tmpscd =  tmpscdl.scdl[k];
            if (flag == 0){
              tmpscd.cbkcolor = this.cbkcolor1;
              flag =1
            }else{
              tmpscd.cbkcolor = this.cbkcolor2;
              flag =0
            }
            //设置日程锚点
            anchorid = anchorid +1;
            tmpscd.anchorid = "anchorid" + anchorid;

            //如果是初始化则进行
            if (condi != ""){
              //设置离传入日期最近的一个日期的第一个日程锚点为画面初始锚点
              if ((moment(tmpscdl.d).isAfter(condi)  || moment(tmpscdl.d).isSame(condi)) &&
                k==0 && (this.dtanchor ==null || this.dtanchor =="")){
                this.dtanchor = tmpscd.anchorid;
              }
            }

            //设置参与人画面显示内容
            //tmpscd.fssshow = this.getFssshow(tmpscd);
          }
        }

        //如果传入日期大于查询结果日期，锚点设为数据list的最后一个日期
        if (this.dtanchor == "" && this.scdlDataList.length >0 ){
          this.dtanchor = this.scdlDataList[this.scdlDataList.length-1].scdl[0].anchorid;
        }

        if (this.scdlDataList.length >0){

          let a = this.scdlDataList[this.scdlDataList.length-1];
          //记住向上每次滑动的预加载的最后日期
          this.scrollUpLastdt =a.d;
          //记住向上每次滑动的预加载的最后的颜色
          let b = a.scdl[a.scdl.length - 1];
          this.scrollUpLastcolor =b.cbkcolor;

          //记住向下每次滑动的预加载的最早日期
          this.scrollDownEarlydt =this.scdlDataList[0].d;
          //记住向下每次滑动的预加载的最早的颜色
          this.scrollDownEarlycolor =this.scdlDataList[0].scdl[0].cbkcolor;
        }

      })

    })

  }

  //设置参与人画面显示内容
  private getFssshow(tmpscd):string{
    let str = "";
    for (let f = 0, len = tmpscd.fss.length; f< len; f++) {
      let rn = tmpscd.fss[f].rn ==""||tmpscd.fss[f].rn == null?tmpscd.fss[f].rc:tmpscd.fss[f].rn;
      str = str + ',' + rn ;
      if (f== len -1){
        str = str.substr(1)
      }
    }
    return str;

  }

  //判断页面数据加载结束后，触发初始化定位至锚点事件
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

  //回主页
  goBack(){
    this.navCtrl.pop();
  }

  //滑动回初始位置
  backtoTop(){
    this.contentD.scrollTo(0,this.initscrolltop).then(data =>{
      this.downorup = 0;
    });
  }

  //从显示list中移除删除的日程
  private removeListEl(scd :ScdData){
    let newList :Array<ScdlData> = new Array<ScdlData>();
    for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
      let tmpscdl = this.scdlDataList[j];
      let newscdl : ScdlData= new ScdlData();

      for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
        let tmpscd = tmpscdl.scdl[k];
        if (tmpscd.si != scd.si){
          newscdl.scdl.push(tmpscd);
        }
      }

      if (newscdl.scdl.length >0){
        newscdl.d = tmpscdl.d;
        newList.push(newscdl);
      }
    }

    this.scdlDataList = newList;

  }

  toDetail(si,d){
    this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {si: si,d:d}).present();
  }

}
