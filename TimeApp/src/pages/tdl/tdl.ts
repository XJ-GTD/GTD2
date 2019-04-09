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
    <ion-header no-border *ngIf="headershow" class="header-set">
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
        <ion-row *ngFor="let sdl of scdlDataList;let i = index;" class="anch" id="day{{sdl.id}}" >
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
                    <div class="agenda-st">{{scd.st}}</div>
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
  gridHight: number = 0;
  gridHightsub: number = 0;


  contmargin: boolean = false;
  //位移与头部高度一致
  offsetHeader: number = 61;

  headershow: boolean = false;
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
      let totalh = 0;
      for (let j = 0, len = this.scdlDataList.length; j < len; j++) {
        let el = this.el.nativeElement.querySelector("#day" + this.scdlDataList[j].id);
        if ($event.scrollTop < totalh - this.offsetHeader) {
          let k = 0;
          if (j == 0) {
            k = j;
          } else {
            k = j - 1;
          }
          this.headerDate = moment(this.scdlDataList[k].d).format("YYYY年MM月DD日");
          break;
        }
        if (el.scrollHeight == null) {
          return;
        }
        totalh = totalh + el.scrollHeight;

      }

      if ($event.directionY == 'up') {

        if ($event.scrollTop == 0) {
          let condi = moment(this.scdlDataList[0].d).subtract(1, "day").format("YYYY/MM/DD");
          this.tdlServ.before(condi, 30).then(data => {
            this.scdlDataList.unshift(...data)
            setTimeout(() => {
              this.gridHightsub = this.grid.nativeElement.clientHeight - this.gridHight;
              this.gridHight = this.grid.nativeElement.clientHeight;
              this.contentD.scrollTo(0, this.gridHightsub, 0).then(datza => {
              })


            }, 50)
          })
        }
      }

      if ($event.directionY == 'down') {
        if ($event.scrollTop == this.gridHight - $event.contentHeight) {
          let condi = moment(this.scdlDataList[this.scdlDataList.length - 1].d).add(1, "day").format("YYYY/MM/DD");
          this.tdlServ.after(condi, 30).then(data => {
            this.scdlDataList.push(...data);
            setTimeout(()=>{
              this.gridHight = this.grid.nativeElement.clientHeight;

            },50)
          })
        }
      }


    });
    this.createData(moment());
  }

  //初始化数据
  async createData(selectDate: moment.Moment) {
    this.scdlDataList.slice(0,this.scdlDataList.length-1);

    let condi = selectDate.format("YYYY/MM/DD");

    //获取当前日期之前的30条记录
    let dwdata = await this.tdlServ.before(condi, 30);
    //获取当前日期之后的30条记录
    let updata = await this.tdlServ.after(moment(condi).add(1, 'd').format("YYYY/MM/DD"), 30);
    this.scdlDataList = this.scdlDataList.concat(dwdata, updata);
    this.headershow = true;
    this.gotoEl(dwdata[dwdata.length-1]);


  }


  gotoEl(d){
    setTimeout(() => {
        let c = this.el.nativeElement.querySelector("#day" + d.id);
        if (c){
          this.gridHight = this.grid.nativeElement.clientHeight;
          c.scrollIntoView({block: "center", inline: "center",});
        }else{
          this.gotoEl(d);
        }
    }, 800);
  }

  //回主页
  goBack() {
    this.menuController.close("ls");
  }


  toDetail(si, d, gs) {
    if (gs == "1") {
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
