import { Component, ViewChild} from '@angular/core';
import {  ActionSheetController, Content, Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {ScdlData, TdlService} from "./tdl.service";
import {TddjService} from "../tddj/tddj.service";
import {TddiService} from "../tddi/tddi.service";
import {DataConfig} from "../../service/config/data.config";
import {ScdData} from "../../service/pagecom/pgbusi.service";
import * as moment from "moment";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-tdl',
  template:
      `<ion-header no-border *ngIf="headershow" class="header-set">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <div class="dobtn-set h-auto">
              <div class="headerleft">

              </div>
              <div>
                <ion-buttons class="backbtn-set">
                  <button ion-button icon-only (click)="goBack()">
                    <img src="../../assets/imgs/fanhui.png">
                  </button>
                </ion-buttons>
              </div>
              <div class="headerdate">
                <ion-label>{{headerDate}}</ion-label>
              </div>
            </div>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-header>
    <ion-content #contentD class="content-set" [ngClass]="{'contmargin':contmargin == true}">
      <ion-grid>
        <ion-row id="{{sdl.d}}" *ngFor="let sdl of scdlDataList;" class="anch">
          <div class="daynav">
            <div class="dayheader w-auto">
              <div class="ym-fsize text-center ">{{sdl.d | formatedate:"YYYY"}}</div>
              <div class="d-fsize text-center">{{sdl.d | formatedate :"MM-DD"}}</div>
            </div>
          </div>
          <div class="dayagendas w-auto ">
            <div class="dayagenda row " [ngStyle]="{'background-color':scd.cbkcolor}"
                 [ngClass]="{'subheight':sdl.scdl.length == 1}"
                 *ngFor="let scd of sdl.scdl;" (click)="toDetail(scd.si,sdl.d,scd.gs)">
              <div class="dayagendacontent w-auto">
                <div class="agendaline1" *ngIf="scd.gs == '1'">来自：{{scd.fs.rn}}</div>
                <div class="agendaline1" *ngIf="scd.gs == '0'">参与事件：{{scd.fss.length}}人</div>
                <div class="agendaline2 row">
                  <div class="agenda-st">{{scd.st}}</div>
                  <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}"></div>
                  <div class="agenda-sn">{{scd.sn}}</div>
                </div>
              </div>
              <!--<div class = "dayagendaoperation" (click)="presentActionSheet(scd);">
                <ion-icon ios="ios-more" md="md-more" [ngStyle]="{'color':scd.morecolor}" ></ion-icon>
              </div>-->
            </div>
            {{pageLoadOver(sdl.d)}}
          </div>
        </ion-row>
      </ion-grid>
      <ion-fab center bottom class="fab-set">
        <button *ngIf="downorup == 2" ion-fab color="light" (click)="backtoTop();">
          <ion-icon name="arrow-up" color="danger" isActive="true"></ion-icon>
        </button>
        <button *ngIf="downorup == 1" ion-fab color="light" (click)="backtoTop();">
          <ion-icon name="arrow-down" color="danger" isActive="true"></ion-icon>
        </button>
      </ion-fab>
    </ion-content>`

})
export class TdlPage {

  //初期化设置content margin，其他场合margin取消
  contmargin: boolean = false;
  //位移与头部高度一致
  offsetHeader: number = 61;

  headershow: boolean = false;
  //画面数据List
  scdlDataList: Array<ScdlData> = new Array<ScdlData>();


  @ViewChild('contentD') contentD: Content;

  //交替背景色
  cbkcolor1: string = "#96162D";
  cbkcolor2: string = "#8E172B";

  //仅在pageLoadOver方法内使用
  pageLoaded: boolean = false;

  //初始锚点，仅为初始化使用
  dtanchor: string = "";

  //向上或向下按钮显示控制 0：两个都不显示 ，1：显示up，2：显示down
  downorup: number = 0;


  //记住滑动结束的scrolltop
  startScrolltop: number = 0;

  //记住向上每次滑动的预加载的最后日期
  scrollUpLastdt: string = "";
  //记住向下每次滑动的预加载的最早日期
  scrollDownEarlydt: string = "";

  //记住向上每次滑动的预加载的最后的颜色
  scrollUpLastcolor: string = "";
  //记住向下每次滑动的预加载的最早的颜色
  scrollDownEarlycolor: string = "";

  //上滑的取数据进行过程中，再次上滑不再获取数据
  upingdata: boolean = false;
  //下滑的取数据进行过程中，再次下滑不再获取数据
  downingdata: boolean = false;

  //头部显示日期
  headerDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private tdlServ: TdlService,
              public events: Events, public actionSheetCtrl: ActionSheetController,
              private tddjServ: TddjService, private tddiServ: TddiService,
              private modalCtr: ModalController) {
    console.log("****************************************************进入ls")

  }


  //获取当前日期的锚点的scrollheight
  private getAnchorScrollH(): number {
    let totalh = 0;

    let els = document.getElementsByClassName("anch");
    for (let j = 0, len = els.length; j < len; j++) {
      if (els.item(j).id == this.dtanchor) {
        break;
      }
      if (els.item(j) && els.item(j).scrollHeight) {
        totalh = totalh + els.item(j).scrollHeight;
      }
    }
    return totalh;
  }

  //滑动回初始位置
  backtoTop() {
    let totalh = this.getAnchorScrollH();

    this.contentD.scrollTo(0, totalh - this.offsetHeader).then(data => {
      this.headerDate = this.dtanchor;
      this.downorup = 0;

    });

  }

  ngOnInit() {
    console.log('ionViewDidLoad AgendaListPage');

    //初始化锚点位置
    this.events.subscribe('po', (data) => {

      if (data != "" && data != null) {
        //画面scroll至锚点

        let el = document.getElementById(data.toString());
        el.scrollIntoView(true,);

      }
    });

    this.contentD.ionScroll.subscribe(($event: any) => {

      //取消margingtoop
      this.contmargin = false;

      if ($event == null) {
        return;
      }

      let a = this.getAnchorScrollH();
      //设置向上或向下按钮显隐控制
      if ($event.scrollTop > a) {
        this.downorup = 2;
      } else if ($event.scrollTop < a) {
        this.downorup = 1;
      } else {
        this.downorup = 0;
      }

      //显示当前顶部滑动日期
      let totalh = 0;
      for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
        let el = document.getElementById(this.scdlDataList[j].d);
        if ($event.scrollTop < totalh - this.offsetHeader) {
          let k = 0;
          if (j == 0) {
            k = j;
          } else {
            k = j - 1;
          }
          this.headerDate = this.scdlDataList[k].d;
          console.log("this.scdlDataList[j].d*****:" + this.scdlDataList[k].d)
          console.log("totalh*****:" + totalh)
          console.log("ionScroll*****:" + $event.scrollTop)
          break;
        }
        if (el.scrollHeight == null) {
          return;
        }
        totalh = totalh + el.scrollHeight;


      }


    });

    this.contentD.ionScrollEnd.subscribe(($event: any) => {
      if ($event == null) {
        return;
      }

      if ($event.scrollTop > this.startScrolltop) {
        console.log("上滑");
        //如果上滑的数据正在获取中，则上滑不在获取新的数据操作
        if (this.upingdata) {
          return;
        }
        this.upingdata = true;
        //获取当前日期之后的60条记录
        let condi = moment(this.scrollUpLastdt).add(1, 'd').format("YYYY/MM/DD");
        this.tdlServ.up(condi, 30).then(data => {
          console.log("上滑获取数据量：" + data.length);

          if (data.length > 0) {

            for (let j = 0, len = data.length; j < len; j++) {
              let tmpscdl = data[j];

              // 设定日程的交替背景色
              for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
                let tmpscd = tmpscdl.scdl[k];
                if (this.scrollUpLastcolor == this.cbkcolor1) {
                  tmpscd.cbkcolor = this.cbkcolor2;
                } else {
                  tmpscd.cbkcolor = this.cbkcolor1;
                }

                //记住向上每次滑动的预加载的最后的颜色
                this.scrollUpLastcolor = tmpscd.cbkcolor;

                //设置参与人画面显示内容
                //tmpscd.fssshow = this.getFssshow(tmpscd);
              }

              //记住向上每次滑动的预加载的最后日期
              this.scrollUpLastdt = tmpscdl.d;

              //加入画面显示用list
              this.scdlDataList.push(tmpscdl);

            }
          }
          //获取数据结束
          this.upingdata = false;
        })

      } else if ($event.scrollTop < this.startScrolltop) {
        console.log("下滑");

        //如果下滑的数据正在获取中，则下滑不在获取新的数据
        if (this.downingdata) {
          return;
        }
        this.downingdata = true;

        //获取当前日期之前的30条记录
        let condi = moment(this.scrollDownEarlydt).subtract(1, 'd').format("YYYY/MM/DD");
        this.tdlServ.down(condi, 30).then(data => {
          console.log("下滑获取数据量：" + data.length);


          if (data.length > 0) {

            //下滑获取数据

            for (let len = data.length, j = len - 1; j >= 0; j--) {
              let tmpscdl = data[j];

              // 设定日程的交替背景色
              for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
                let tmpscd = tmpscdl.scdl[k];
                if (this.scrollDownEarlycolor == this.cbkcolor1) {
                  tmpscd.cbkcolor = this.cbkcolor2;
                } else {
                  tmpscd.cbkcolor = this.cbkcolor1;
                }

                //记住向上每次滑动的预加载的最后的颜色
                this.scrollDownEarlycolor = tmpscd.cbkcolor;

                //设置参与人画面显示内容
                //tmpscd.fssshow = this.getFssshow(tmpscd);
              }

              //记住向上每次滑动的预加载的最后日期
              this.scrollDownEarlydt = tmpscdl.d;

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

      if ($event == null) {
        return;
      }
      //记住滑动开始时的scrolltop，以便在滑动结束时判断是上滑还是下滑
      this.startScrolltop = $event.scrollTop;

    });
    this.init();
  }
  //初始化数据
  init() {

    this.contmargin = true;
    this.pageLoaded = false;


    let sel = this.navParams.get("selectDay");
    if (!sel) sel = moment();
    let condi = moment(sel).format("YYYY/MM/DD");

    //获取当前日期之前的30条记录
    this.tdlServ.down(condi, 30).then(dwdata => {

      //获取当前日期之后的30条记录
      let condi2 = moment(condi).add(1, 'd').format("YYYY/MM/DD");
      this.tdlServ.up(condi2, 30).then(data => {
        this.headershow = true;

        this.scdlDataList = this.scdlDataList.concat(dwdata, data);
        let flag = 0;

        for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
          let tmpscdl = this.scdlDataList[j];


          //设置离传入日期最近的一个日期锚点为画面初始锚点
          if ((moment(tmpscdl.d).isAfter(condi) || moment(tmpscdl.d).isSame(condi)) &&
            (this.dtanchor == null || this.dtanchor == "")) {
            this.dtanchor = tmpscdl.d;
          }


          // 设定日程的交替背景色
          for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
            let tmpscd = tmpscdl.scdl[k];
            if (flag == 0) {
              tmpscd.cbkcolor = this.cbkcolor1;
              flag = 1
            } else {
              tmpscd.cbkcolor = this.cbkcolor2;
              flag = 0
            }

            //设置参与人画面显示内容
            //tmpscd.fssshow = this.getFssshow(tmpscd);
          }
        }

        //如果传入日期大于查询结果日期，锚点设为数据list的最后一个日期
        if (this.dtanchor == "" && this.scdlDataList.length > 0) {
          this.dtanchor = this.scdlDataList[this.scdlDataList.length - 1].d;
        }
        this.headerDate = this.dtanchor;
        if (this.scdlDataList.length > 0) {

          let a = this.scdlDataList[this.scdlDataList.length - 1];
          //记住向上每次滑动的预加载的最后日期
          this.scrollUpLastdt = a.d;
          //记住向上每次滑动的预加载的最后的颜色
          let b = a.scdl[a.scdl.length - 1];
          this.scrollUpLastcolor = b.cbkcolor;

          //记住向下每次滑动的预加载的最早日期
          this.scrollDownEarlydt = this.scdlDataList[0].d;
          //记住向下每次滑动的预加载的最早的颜色
          this.scrollDownEarlycolor = this.scdlDataList[0].scdl[0].cbkcolor;
        }

      })

    })

  }

  //设置参与人画面显示内容
  private getFssshow(tmpscd): string {
    let str = "";
    for (let f = 0, len = tmpscd.fss.length; f < len; f++) {
      let rn = tmpscd.fss[f].rn == "" || tmpscd.fss[f].rn == null ? tmpscd.fss[f].rc : tmpscd.fss[f].rn;
      str = str + ',' + rn;
      if (f == len - 1) {
        str = str.substr(1)
      }
    }
    return str;

  }

  //判断页面数据加载结束后，触发初始化定位至锚点事件
  pageLoadOver(anchorid) {
    if (this.pageLoaded) {
      return ""
    }
    if (this.scdlDataList.length > 0) {
      let a = this.scdlDataList;
      //当画面传入的anchorid与数据中的最后一个锚点一致时，表示加载结束
      if (anchorid == a[a.length - 1].d) {
        this.pageLoaded = true;
        this.events.publish('po', this.dtanchor);
      }
    }
    return "";
  }

  //回主页
  goBack() {
    this.navCtrl.pop({
      direction: "forward",
      animation: "push",
      animate: true,
      duration: 2
    })
  }


  //从显示list中移除删除的日程
  private removeListEl(scd: ScdData) {
    let newList: Array<ScdlData> = new Array<ScdlData>();
    for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
      let tmpscdl = this.scdlDataList[j];
      let newscdl: ScdlData = new ScdlData();

      for (let k = 0, len = tmpscdl.scdl.length; k < len; k++) {
        let tmpscd = tmpscdl.scdl[k];
        if (tmpscd.si != scd.si) {
          newscdl.scdl.push(tmpscd);
        }
      }

      if (newscdl.scdl.length > 0) {
        newscdl.d = tmpscdl.d;
        newList.push(newscdl);
      }
    }

    this.scdlDataList = newList;

  }

  toDetail(si, d, gs) {
    if (gs == "1") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {si: si, d: d}).present();
    } else {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, {si: si, d: d}).present();
    }

  }

}
