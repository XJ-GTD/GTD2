import {Component, ElementRef, ViewChild} from '@angular/core';
import {
  Content,
  MenuController,
  ModalController, ScrollEvent,
} from 'ionic-angular';
import {TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {ScdlData, ScdPageParamter} from "../../data.mapping";

/**
 * Generated class for the 日程列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-tdl',
  template:
      `
    <ion-header no-border>
      <ion-toolbar class="header-set">
        <ion-buttons start>
          <button ion-button icon-only (click)="goBack()" class="backbtn-set">
            <img src="../../assets/imgs/backfd.png"/>
          </button>
        </ion-buttons>
        <ion-title class="headerdate">{{headerDate}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content #contentD>
      <ion-grid #grid4Hight>
        <ion-row *ngFor="let sdl of scdlDataList;let i = index;" class="anch" id="day{{sdl.id}}">
          <div class="daynav">
            <div class="dayheader w-auto">
              <div class="d-fsize text-center">{{sdl.d | formatedate :"MM-DD"}}</div>
              <div class="ym-fsize text-center ">{{sdl.d | formatedate:"YYYY"}}</div>
            </div>
          </div>
          <div class="dayagendas w-auto">
            <ng-template [ngIf]="sdl.scdl.length > 0" [ngIfElse]="noscd">
              <div class="dayagenda row " [class.back0]="scd.cbkcolor == 0" [class.back1]="scd.cbkcolor == 1"
                   *ngFor="let scd of sdl.scdl;" (click)="toDetail(scd.si,sdl.d,scd.gs)">
                <div class="dayagendacontent w-auto">
                  <div class="agendaline1" *ngIf="scd.gs == '1'">来自：{{scd.fs.rn}} </div>
                  <!--<div class="agendaline1" *ngIf="scd.gs == '0'">参与事件：{{scd.fss.length}}人</div>-->
                  <div class="agendaline1" *ngIf="scd.gs == '0'">&nbsp;</div>
                  <div class="agendaline1" *ngIf="scd.gs == '2'">下载：{{scd.p.jn}}</div>
                  <div class="agendaline2 row">
                    <div class="agenda-st"
                         [class.newMessage]="scd.du == '1'">{{scd.st == "99:99" ? "全天" : scd.st == null ? "" : scd.st}}</div>
                    <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}"></div>
                    <div class="agenda-sn" [class.newMessage]="scd.du == '1'">{{scd.sn}}</div>
                  </div>
                </div>
              </div>
            </ng-template>
            <ng-template #noscd>
              <div class="dayagenda row subheight" (click)="toAdd(sdl.d)">
                <div class="dayagendacontent w-auto agenda-none" [class.none1] = "sdl.bc == 1" [class.none0] = "sdl.bc == 0">
                    没有活动(点击添加)
                </div>
              </div>
            </ng-template>
          </div>
        </ion-row>
      </ion-grid>
    </ion-content>
  `


})
export class TdlPage {

  @ViewChild('contentD') contentD: Content;
  @ViewChild('grid4Hight') grid: ElementRef;


  //取底部数据
  gridHight: number = 0;
  gridHightsub: number = 0;

  isgetData: boolean = false;


  //画面数据List
  scdlDataList: Array<ScdlData> = new Array<ScdlData>();


  //头部显示日期
  headerDate: string;

  constructor(private tdlServ: TdlService,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private emitService: EmitService,
              private el: ElementRef
  ) {
  }

  ngOnInit() {

    // this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {

      this.createData(selectDate, 0,0).then(data => {
        this.scdlDataList.push(...data);

        this.isgetData = !this.isgetData;

        this.gotoEl(selectDate.format("YYYYMMDD"));
      }).catch(error => {
        this.isgetData = !this.isgetData;
      });
    })


    this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {

      //显示当前顶部滑动日期
      for (let scdlData of this.scdlDataList) {
        let el = this.el.nativeElement.querySelector("#day" + scdlData.id);
        if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
          this.headerDate = moment(scdlData.d).format("YYYY-MM-DD");
          break;
        }
      }

      if ($event.directionY == 'up') {

        if ($event.scrollTop < 10) {

          let d = this.scdlDataList[0];
          let scdd = d.d;
          let scdId = d.id;
          let condi = moment(scdd).subtract(1, "day");;
          let last = 0;
          if (d.scdl.length > 0){
            last = d.scdl[0].cbkcolor;
          }
          this.createData(condi, 1,last).then(data => {
            this.scdlDataList.unshift(...data);
            this.isgetData = false;
            this.gotoEl(scdId);

          }).catch(error => {
            this.isgetData = false;
          });
        }

      }

      if ($event.directionY == 'down') {

        if ($event.scrollTop == this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {
          let d = this.scdlDataList[this.scdlDataList.length - 1];
          let scdd = d.d;
          let scdId = d.id;
          let condi = moment(scdd).add(1, "day");
          let last = 0;
          if (d.scdl.length > 0){
            last = d.scdl[d.scdl.length-1].cbkcolor;
          }
          this.createData(condi, 2,last).then(data => {
            this.scdlDataList.push(...data);
            this.isgetData = false;
            this.gotoEl(scdId);

          }).catch(error => {
            this.isgetData = false;
          });
        }

      }


    });
    let today = moment();
    this.createData(today, 0,0).then(data => {

      this.scdlDataList.push(...data);
      this.isgetData = false;

      this.gotoEl(today.format("YYYYMMDD"));
    }).catch(error => {
      this.isgetData = false;
    });
  }

  //获取数据
  async createData(selectDate: moment.Moment, type: number, lastcolor: number) {
    //全部数据
    let datas: Array<ScdlData> = new Array<ScdlData>();
    if (!this.isgetData) {
      this.isgetData = true;
      if (type == 0) {
        this.scdlDataList = new Array<ScdlData>();
        let condi = selectDate.format("YYYY/MM/DD");
        //获取当前日期之前的30条记录
        let dwdata = await this.tdlServ.before(condi, 30);
        //获取当前日期之后的30条记录
        let updata = await this.tdlServ.after(moment(condi).add(1, 'd').format("YYYY/MM/DD"), 30);
        datas = datas.concat(dwdata, updata);

      } else if (type == 1) {
        datas = await this.tdlServ.before(selectDate.format("YYYY/MM/DD"), 30);

      } else if (type == 2) {
        datas = await this.tdlServ.after(selectDate.format("YYYY/MM/DD"), 30);
      }
      //替换交替颜色
      if (type == 0 || type == 2)
        for (let scdl of datas) {
          for (let scd of scdl.scdl) {
            lastcolor = (lastcolor + 1) % 2
            scd.cbkcolor = lastcolor;
          }
        }
        if (type == 1){
          let len = datas.length;
          let len2 = 0;
          for (let i = len-1; i>-1;i--) {
            let scdl = datas[i].scdl;
            let len2 = scdl.length;
            for (let j = len2-1; j>-1;j--) {
              lastcolor = (lastcolor + 1) % 2
              scdl[j].cbkcolor = lastcolor;
            }
          }
        }
      return datas;
    }
  }


  gotoEl(id) {
    setTimeout(() => {
      let el = this.el.nativeElement.querySelector("#day" + id);
      if (el) {
        this.gridHight = this.grid.nativeElement.clientHeight;
        this.contentD.scrollTo(0, el.offsetTop + 2, 0).then(datza => {
          this.gridHight = this.grid.nativeElement.clientHeight;
        })
      } else {
        this.gotoEl(id);
      }
    }, 100);
  }

  //回主页
  goBack() {
    this.menuController.close("ls");
  }


  toDetail(si, d, gs) {

    let p:ScdPageParamter = new ScdPageParamter();
    p.si = si;
    p.d = moment(d);

    if (gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    }else if(gs =="1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    }else{
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }

  }

  toAdd(d) {
    let p:ScdPageParamter = new ScdPageParamter();
    p.d = moment(d);
    this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, p).present();
  }

}
