import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  Content,
  MenuController,
  ModalController, ScrollEvent,
} from 'ionic-angular';
import {TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import {ScdData, ScdlData, ScdPageParamter} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {FeedbackService} from "../../service/cordova/feedback.service";

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
    <div class="header-set">
      <div class="daynav">
        <div class="dayheader">

          <div class="d-fsize text-center">{{headerDate | formatedate :"CWEEK"}}</div>
          <div class="ym-fsize text-center ">{{headerDate | formatedate:"DD"}}</div>
          <!--<div class="ys-fsize text-center " *ngFor="let jt of headerData.jtl" (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>-->
        </div>
        <div class="d-title text-center ">
          <div class="first d-title-chr">日记</div>
          <div class=" d-title-chr">10条日程</div>
          <div class=" d-title-chr">10条任务</div>
          <div class=" d-title-chr">10条任务</div>
        </div>
      </div>
    </div>
    <ion-content #contentD>
      <ion-grid #grid4Hight>
        <ng-template ngFor let-sdl [ngForOf]="scdlDataList">
          <ion-row *ngIf="(sdl.d | formatedate:'DD') == '01'" class="dayagenda-month" [class.month7] = "true">
              <p>
                {{sdl.d  | formatedate :"CYYYY/MM"}}
              </p>
              <p>
                感知天气冷暖我们生来便会，感知人情冷暖还要慢慢体会。 
              </p>            
          </ion-row>
          <ion-row  class="dayagenda-week"  *ngIf="(sdl.d | formatedate:'DWEEK') == '7'">
            <p>
              {{sdl.d | formatedate :"CYYYY/MM/DD"}}- {{sdl.d | formatedate :"ADD7CYYYY/MM/DD"}}
            </p>
          </ion-row>
          <ng-template [ngIf]="sdl.scdl.length > 0" [ngIfElse]="noscd">
            <ion-row class="anch" id="day{{sdl.id}}">
            <div class="daynav">
              <div class="dayheader">

                <div class="d-fsize text-center">{{sdl.d | formatedate :"CWEEK"}}</div>
                <div class="ym-fsize text-center ">{{sdl.d | formatedate:"DD"}}</div>
                <div class="ys-fsize text-center " *ngFor="let jt of sdl.jtl" (click)="toDetail(jt.si,jt.sd,'3')">{{jt.spn}}</div>
              </div>
              <div class="d-title text-center ">
                <div class="first d-title-chr">日记</div>
                <div class=" d-title-chr">10条日程</div>
                <div class=" d-title-chr">10条任务</div>
                <div class=" d-title-chr">10条任务</div>
              </div>
            </div>
            <ion-grid>
              <ion-row *ngFor="let scd of sdl.scdl;" (click)="toDetail(scd.si,sdl.d,scd.gs)" >
                <div class="dayagenda-content">
                  <div class="agendaline2">
                    <div class="agenda-icon">
                      <div class="icon icon1" ></div>
                      <div class="icon icon2" ></div>
                    </div>
                    <div class="agenda-sn">{{scd.sn}}</div>
                  </div>
                  <div class="agendaline1">
                    <div class="agenda-st">{{this.util.adStrShow(scd.st)}}</div>
                    <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}"></div>

                    <!--<ion-chip *ngIf="scd.gs == '1'" >-->
                    <!--<ion-avatar>-->
                    <!--<img src="{{scd.fs.bhiu}}"/>-->
                    <!--</ion-avatar>-->
                    <!--<ion-label [class.newMessage]="scd.du != '0'">{{scd.fs.ran}}</ion-label>-->
                    <!--</ion-chip>-->
                  </div>
                </div>
              </ion-row>
            </ion-grid>
            </ion-row>
          </ng-template>
          <ng-template #noscd>
            <ion-row class="anch dayagenda-none-display" id="day{{sdl.id}}">
            <div class="dayagenda-no-content "  (click)="toAdd(sdl.d)">
              <p>{{sdl.d | formatedate :"CYYYY/MM/DD"}}</p>
            </div>
            </ion-row>
          </ng-template>
        </ng-template>
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
  headerMoment: moment.Moment;

  constructor(private tdlServ: TdlService,
              private modalCtr: ModalController,
              private menuController: MenuController,
              private emitService: EmitService,
              private el: ElementRef,
              private util: UtilService,
              private feedback: FeedbackService,
              private renderer2: Renderer2
  ) {
  }

  ngOnInit() {

    //this.contentD.enableJsScroll();

    this.emitService.registerSelectDate((selectDate: moment.Moment) => {

      this.createData(selectDate, 0, 0).then(data => {
        this.scdlDataList.push(...data);

        this.isgetData = !this.isgetData;

        this.gotoEl(selectDate.format("YYYYMMDD"));
      }).catch(error => {
        this.isgetData = !this.isgetData;
      });
    });



    this.emitService.registerRef((data) => {
      this.createData(this.headerMoment, 0, 0).then(data => {
        this.scdlDataList.push(...data);

        this.isgetData = !this.isgetData;

        this.gotoEl(this.headerMoment.format("YYYYMMDD"));
      }).catch(error => {
        this.isgetData = !this.isgetData;
      });
    })


    this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {

      try {
        //显示当前顶部滑动日期
        for (let scdlData of this.scdlDataList) {
          let el = this.el.nativeElement.querySelector("#day" + scdlData.id);
          if (el && $event.scrollTop - el.offsetTop < el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
            this.headerDate = moment(scdlData.d).format("YYYY/MM/DD");
            this.headerMoment = moment(scdlData.d);
            //this.feedback.audioTrans();
            break;
          }
        }

        if ($event.directionY == 'up') {

          if ($event.scrollTop < 10) {

            let d = this.scdlDataList[0];
            let scdd = d.d;
            let scdId = d.id;
            let condi = moment(scdd).subtract(1, "day");
            ;
            let last = 0;
            if (d.scdl.length > 0) {
              last = d.scdl[0].cbkcolor;
            }
            this.createData(condi, 1, last).then(data => {
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
            if (d.scdl.length > 0) {
              last = d.scdl[d.scdl.length - 1].cbkcolor;
            }
            this.createData(condi, 2, last).then(data => {
              this.scdlDataList.push(...data);
              this.isgetData = false;
              this.gotoEl(scdId);

            }).catch(error => {
              this.isgetData = false;
            });
          }

        }
      } catch (e) {

      }


    });
    let today = moment();
    this.createData(today, 0, 0).then(data => {

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
        //  //获取当前日期之前的30条记录
        //  let dwdata = await this.tdlServ.before(condi, 30);
        //  //获取当前日期之后的30条记录
        //  let updata = await this.tdlServ.after(moment(condi).add(1, 'd').format("YYYY/MM/DD"), 30);
        // datas = datas.concat(dwdata, updata);
        datas= await this.tdlServ.getL(moment(condi).add(1, 'd').format("YYYY/MM/DD"),'0', 30);
      } else if (type == 1) {
        // datas = await this.tdlServ.before(selectDate.format("YYYY/MM/DD"), 30);
        datas = await this.tdlServ.getL(selectDate.format("YYYY/MM/DD"),'1', 30);

      } else if (type == 2) {
        // datas = await this.tdlServ.after(selectDate.format("YYYY/MM/DD"), 30);
        datas = await this.tdlServ.getL(selectDate.format("YYYY/MM/DD"),'2', 30);
      }

      return datas;
    }
  }

  currDayel:any;
  gotoEl(id) {
    setTimeout(() => {
      try {
        if (this.currDayel){
          this.renderer2.removeClass(this.currDayel,"dayagenda-display");
          this.renderer2.addClass(this.currDayel,"dayagenda-none-display");
        }
        this.currDayel = this.el.nativeElement.querySelector("#day" + id);
        this.renderer2.removeClass(this.currDayel,"dayagenda-none-display");
        this.renderer2.addClass(this.currDayel,"dayagenda-display");

        this.headerDate = moment(id).format("YYYY/MM/DD");
        this.headerMoment = moment(id);
        if (this.currDayel) {
          this.gridHight = this.grid.nativeElement.clientHeight;
          this.contentD.scrollTo(0, this.currDayel.offsetTop + 2, 0).then(datza => {
            this.gridHight = this.grid.nativeElement.clientHeight;
          })
        } else {
          this.gotoEl(id);
        }
      } catch (e) {
      }

    }, 100);
  }

  toDetail(si, d, gs) {

    let p: ScdPageParamter = new ScdPageParamter();
    p.si = si;
    p.d = moment(d);
    p.gs = gs;

    this.feedback.audioClick();
    if (gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, p).present();
    } else if (gs == "1") {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, p).present();
    } else {
      //系统画面
      this.modalCtr.create(DataConfig.PAGE._TDDS_PAGE, p).present();
    }

  }

  toAdd(d) {
    let p: ScdPageParamter = new ScdPageParamter();
    p.d = moment(d);
    this.feedback.audioClick();
    this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, p).present();
  }

}
