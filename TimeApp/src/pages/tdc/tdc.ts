import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {
  DateTime,
  ModalController, NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {TdcService} from "./tdc.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {Keyboard} from "@ionic-native/keyboard";
import {ScdData, ScdPageParamter} from "../../data.mapping";

/**
 * Generated class for the 新建日程 page.
 * create by wzy
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tdc',
  template: `
    <ion-content class="content-set">
      <ion-grid #grid>
        <ion-row class="header-set"></ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..."></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="lbl-jh2" (click)="toPlanChoose()" [class.hasjh] = "scd.p.jn != ''" [ngStyle] ="{'background-color':scd.p.jc == '' ? '#fffff' : scd.p.jc}">
            {{scd.p.jn == "" ? "添加计划" : "计划"}}
          </div>
          <div>{{scd.p.jn}}</div>
        </ion-row>
        <ion-row>
          <div>
            <ion-datetime displayFormat="YYYY年M月DD日 DDDD"
                          pickerFormat="YYYY MM DD" color="light"
                          [(ngModel)]="scd.showSd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                          min="1999-01-01" max="2039-12-31"  cancelText="取消" doneText = "确认"
            ></ion-datetime>
          </div>
        </ion-row>
        <ion-row>
          <ion-toggle [(ngModel)]="alld" [class.allday]="b" (ionChange)="togChange()"></ion-toggle>
          <div>
            <ion-datetime displayFormat="HH:mm" [(ngModel)]="scd.st"
                          pickerFormat="HH mm"  [hidden]="alld" cancelText="取消" doneText = "确认"></ion-datetime>

          </div>
        </ion-row>
        <ion-row>
          <div class="reptlbl">重复</div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled-close]="rept.close == 1"
                    (click)="clickrept('0')">关
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.d== 1"
                    (click)="clickrept('1')">天
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.w== 1"
                    (click)="clickrept('2')">周
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.m== 1"
                    (click)="clickrept('3')">月
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.y== 1"
                    (click)="clickrept('4')">年
            </button>
          </div>
        </ion-row>
        <ion-row>
          <div class="reptlb2 ">提醒</div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled-close]="wake.close == 1"
                    (click)="clickwake('0')">关
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.tenm == 1"
                    (click)="clickwake('1')">10m
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.thirm == 1"
                    (click)="clickwake('2')">30m
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.oh == 1"
                    (click)="clickwake('3')">1h
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [ngClass]="wake.foh == 1?'sel-btn-seled':'sel-btn-unsel'"
                    (click)="clickwake('4')">4h
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [ngClass]="wake.od == 1?'sel-btn-seled':'sel-btn-unsel'"
                    (click)="clickwake('5')">1d
            </button>
          </div>
        </ion-row>
        <ion-row>
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="scd.bz" class="memo-set" (focus)="comentfocus()"
                        (blur)="comentblur()"></ion-textarea>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="foot-set">
      <ion-toolbar>
        <ion-buttons start padding-left>
          <button ion-button icon-only (click)="cancel()" start>
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
        <ion-buttons>
          <button ion-button full (click)="goShare()">发送</button>
        </ion-buttons>

        <ion-buttons end padding-right>
          <button ion-button icon-only (click)="save()" end>
            <ion-icon name="checkmark"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
    <ion-content padding class="select-plan" *ngIf="isShowPlan">
      <ion-grid>
        <ion-row>

          <ion-list no-lines radio-group [(ngModel)]="scd.p">
            <ion-item class="plan-list-item" *ngFor="let option of jhs">
              <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
              <ion-label>{{option.jn}}</ion-label>
              <ion-radio [value]="option"></ion-radio>
            </ion-item>
          </ion-list>

        </ion-row>
      </ion-grid>
    </ion-content>

    <div class="shade" *ngIf="IsShowCover" (click)="closeDialog()"></div>
  `

})
export class TdcPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private tdcServ: TdcService, private util: UtilService,
              public modalCtrl: ModalController, private busiServ: PgBusiService,
              private keyboard: Keyboard, private _renderer: Renderer2,) {

  }


  comentfocus() {
    if (this.keyboard){
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-300px)");
    }
  }

  togChange(){
    if (!this.alld){
      this.scd.st = this.scd.st == "99:99"?"00:00":this.scd.st;
    }
  }

  comentblur() {
    this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  }

  @ViewChildren(DateTime) dateTimes: QueryList<DateTime>;

  //画面状态：0：新建 ，1：未关闭直接修改
  pagestate: string = "0";
  //画面数据
  scd: ScdData = new ScdData();
  b: boolean = true;
  @ViewChild("grid")
  grid: ElementRef;

  rept = {
    close: 0,
    d: 0,
    w: 0,
    m: 0,
    y: 0
  };

  wake = {
    close: 0,
    tenm: 0,
    thirm: 0,
    oh: 0,
    foh: 0,
    od: 0
  };

  //全天
  alld: boolean = false;

  isShowPlan: boolean = false;
  IsShowCover: boolean = false;
  jhs: any;

  ionViewWillEnter() {

    this.busiServ.getPlans().then(data => {
      this.jhs = data;
      //console.log("111" + JSON.stringify(this.jhs));
    }).catch(res => {
      console.log("获取计划失败" + JSON.stringify(res));
    });

    //新建的场合初始化
    if (this.navParams) {
      let paramter: ScdPageParamter = this.navParams.data;
      this.scd.showSd = paramter.d.format("YYYY-MM-DD");
      this.scd.st = moment().add(1, "h").format("HH:00");
    }
    this.scd.rt = "0";
    this.scd.tx = "0";
    this.pagestate = "0";
    this.rept.close = 1;
    this.wake.close = 1;
  }

  //重复按钮显示控制
  clickrept(type: string) {
    this.scd.rt = type;

    switch (type) {
      case "0":
        this.rept.close = 1;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "1":
        this.rept.close = 0;
        this.rept.d = 1;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "2":
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 1;
        this.rept.m = 0;
        this.rept.y = 0;
        break;
      case "3":
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 1;
        this.rept.y = 0;
        break;
      case "4":
        this.rept.close = 0;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 1;
        break;
      default:
        this.rept.close = 1;
        this.rept.d = 0;
        this.rept.w = 0;
        this.rept.m = 0;
        this.rept.y = 0;
        this.scd.rt = "0";
    }
  }

  ionViewWillLeave() {

    for(let i = 0;i<this.dateTimes.toArray().length;i++){
      if(this.dateTimes.toArray()[i]._picker ){
        this.dateTimes.toArray()[i]._picker.dismiss();
      }
    }
  }

  //提醒按钮显示控制
  clickwake(type: string) {

    this.scd.tx = type;

    switch (type) {
      case "0":
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case "1":
        this.wake.close = 0;
        this.wake.tenm = 1;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case "2":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 1;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case "3":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 1;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case "4":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 1;
        this.wake.od = 0;
        break;
      case "5":
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 1;
        break;
      default:
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        this.scd.tx = "0";
    }
  }

  cancel() {
    this.navCtrl.pop();
  }


  async save() {

    if (!this.chkinput()) {
      return
    }

    this.util.loadingStart();
    //提醒内容设置
    this.scd.ui = UserConfig.account.id;

    //消息设为已读
    this.scd.du = "1";

    //本人新建或修改时，下记画面项目可以修改
    //开始时间格式转换
    this.scd.sd = moment(this.scd.showSd).format("YYYY/MM/DD");


    //结束日期设置

    //结束时间设置
    //全天的场合
    if (this.alld) {
      this.scd.st = "99:99";
      this.scd.et = "99:99";
    } else {
      this.scd.et = this.scd.st;
    }

    //归属 本人创建
    this.scd.gs = '0';

    this.scd.ji = this.scd.p.ji;

    //新建数据
    let data =  await this.tdcServ.save(this.scd);
    this.util.loadingEnd();
    this.cancel();
    return data;
  }

  chkinput(): boolean {
    if (this.scd.sn == "") {
      this.util.popoverStart("请输入主题");
      return false;
    }
    return true;
  }

  goShare() {
    //日程分享打开参与人选择rc日程类型
      this.save().then(data=>{
        let ctbl = data.data;
        this.scd.si = ctbl.si;
        this.navCtrl.push(DataConfig.PAGE._FS4C_PAGE, {addType: 'rc', tpara: this.scd.si});
      });

  }

  presentActionSheet() {
    this.util.alterStart("2",()=>{

      //日程删除
      this.util.loadingStart();
      this.tdcServ.delete(this.scd.si, "2", "").then(data => {
        this.util.loadingEnd();
        this.cancel();
      }).catch(err=>{
        this.util.loadingEnd();
      });

    });

  }

  toPlanChoose() {
    if (this.jhs.length > 0) {
      this.isShowPlan = true;
      this.IsShowCover = true;
    } else {
      this.util.toastStart("未创建计划",3000);
    }
  }

  closeDialog() {
    if (this.isShowPlan) {
      this.isShowPlan = false;
      this.IsShowCover = false;

      console.log("check:" + this.scd.ji);
      console.log("check1:" + this.scd.p.ji);
    }
  }


}

export class PageTddIData {
  tdl: ScdData = new ScdData();  //日程事件表信息


}
