import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  Content, Grid,
  MenuController,
  ModalController, ScrollEvent,
} from 'ionic-angular';
import {ScdlData, TdlService} from "./tdl.service";
import {DataConfig} from "../../service/config/data.config";
import * as moment from "moment";
import {EmitService} from "../../service/util-service/emit.service";
import set = Reflect.set;

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
    <ion-header no-border class="header-set">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <div class="dobtn-set h-auto">
              <div class="headerleft">
              </div>
              <div>
                <ion-buttons class="backbtn-set">
                  <button ion-button icon-only (click)="goBack()">
                    <img src="../../assets/imgs/fh2.png">
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
    <ion-content #contentD>
      <ion-grid #grid4Hight>
        <ion-row *ngFor="let sdl of scdlDataList;let i = index;" class="anch" id="day{{sdl.id}}" (mousedown)="test()">
          <div class="daynav">
            <div class="dayheader w-auto">
              <div class="ym-fsize text-center ">{{sdl.d | formatedate:"YYYY"}}</div>
              <div class="d-fsize text-center">{{sdl.d | formatedate :"MM-DD"}}</div>
            </div>
          </div>
          <div class="dayagendas w-auto">
            <ng-template [ngIf]="sdl.scdl.length > 0" [ngIfElse]="noscd">
              <div class="dayagenda row " [ngStyle]="{'background-color':scd.p.jc}"
                   *ngFor="let scd of sdl.scdl;" (click)="toDetail(scd.si,sdl.d,scd.gs)">
                <div class="dayagendacontent w-auto">
                  <div class="agendaline1" *ngIf="scd.gs == '1'">来自：{{scd.fs.rn}}</div>
                  <div class="agendaline1" *ngIf="scd.gs == '0'">参与事件：{{scd.fss.length}}人</div>
                  <div class="agendaline2 row">
                    <div class="agenda-st">{{scd.st=="99:99"?"全天":scd.st ==null?"":scd.st}}</div>
                    <div class="dot-set " [ngStyle]="{'background-color':scd.p.jc}"></div>
                    <div class="agenda-sn">{{scd.sn}}</div>
                  </div>
                </div>
              </div>
            </ng-template>
            <ng-template #noscd>
              <div class="dayagenda row subheight" (click)="toAdd(sdl.d)">
                <div class="dayagendacontent w-auto">
                  <div class="agendaline1"></div>
                  <div class="agendaline2 row">
                    <div class="agenda-sn">无日程，点击添加</div>
                  </div>
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

  isgetData:boolean = false;


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
      this.scdlDataList = new Array<ScdlData>();
      this.createData(selectDate);
    })


    this.contentD.ionScroll.subscribe(($event: ScrollEvent) => {

      if ($event == null) {
        return;
      }


      //显示当前顶部滑动日期
      for (let scdlData of this.scdlDataList) {
        let el = this.el.nativeElement.querySelector("#day" + scdlData.id);
        if (el && $event.scrollTop - el.offsetTop < 60 + el.clientHeight && $event.scrollTop - el.offsetTop > 0) {
          this.headerDate = moment(scdlData.d).format("YYYY年MM月DD日");
          break;
        }
      }

      if ($event.directionY == 'up') {

        if (!this.isgetData){
          if ($event.scrollTop < 10) {
            let scdd = this.scdlDataList[0].d;
            let scdId = this.scdlDataList[0].id;
            let condi = moment(scdd).subtract(1, "day").format("YYYY/MM/DD");
            this.isgetData = !this.isgetData;
            this.tdlServ.before(condi, 30).then(data => {
              this.scdlDataList.unshift(...data)
              this.gotoEl(scdId);
            })
          }

        }
      }

      if ($event.directionY == 'down') {
        if (!this.isgetData){
          if ($event.scrollTop == this.grid.nativeElement.clientHeight - $event.scrollElement.clientHeight) {

            let scdd = this.scdlDataList[this.scdlDataList.length - 1].d;
            let scdId = this.scdlDataList[this.scdlDataList.length - 1].id;
            let condi = moment(scdd).add(1, "day").format("YYYY/MM/DD");
            this.isgetData = !this.isgetData;
            this.tdlServ.after(condi, 30).then(data => {
              this.scdlDataList.push(...data);
              this.gotoEl(scdId);
            })
          }
        }
      }


    });
    this.createData(moment());
  }

  //初始化数据
  async createData(selectDate: moment.Moment) {
    this.scdlDataList.slice(0,this.scdlDataList.length-1);
    if (!this.isgetData){
      this.isgetData = !this.isgetData;
      let condi = selectDate.format("YYYY/MM/DD");

      //获取当前日期之前的30条记录
      let dwdata = await this.tdlServ.before(condi, 30);
      //获取当前日期之后的30条记录
      let updata = await this.tdlServ.after(moment(condi).add(1, 'd').format("YYYY/MM/DD"), 30);
      this.scdlDataList = this.scdlDataList.concat(dwdata, updata);
      this.gotoEl(dwdata[dwdata.length-1].id);
    }
  }


  gotoEl(id){
    setTimeout(() => {
        let el = this.el.nativeElement.querySelector("#day" + id);
        if (el){
          this.gridHight = this.grid.nativeElement.clientHeight;
          this.contentD.scrollTo(0, el.offsetTop + 2, 0).then(datza => {
            this.gridHight = this.grid.nativeElement.clientHeight;
            this.isgetData = !this.isgetData;
          })
        }else{
          this.gotoEl(id);
        }
    }, 100);
  }

  //回主页
  goBack() {
    this.menuController.close("ls");
  }


  toDetail(si, d, gs) {
    if (gs == "0") {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDDJ_PAGE, {si: si, d: d}).present();
    } else {
      //受邀人画面
      this.modalCtr.create(DataConfig.PAGE._TDDI_PAGE, {si: si, d: d}).present();
    }

  }

  toAdd(d) {
      //本人画面
      this.modalCtr.create(DataConfig.PAGE._TDC_PAGE, {d: d}).present();
  }

}
