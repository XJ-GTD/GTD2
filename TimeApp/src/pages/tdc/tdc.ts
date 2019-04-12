import {Component, ElementRef, Renderer2} from '@angular/core';
import {
  IonicPage, ModalController, NavController, NavParams,
} from 'ionic-angular';
import * as moment from "moment";
import {TdcService} from "./tdc.service";
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";
import {Keyboard} from "@ionic-native/keyboard";

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
      <ion-grid>
        <ion-row ngClass="header-set"></ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..."></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="lbl-jh2" (click)="toPlanChoose()">
            {{scd.p.jn == "" ? "添加计划" : ""}}
          </div>
          <div>{{scd.p.jn}}</div>
        </ion-row>
        <ion-row>
          <div>
            <ion-datetime displayFormat="YYYY年M月DD日 DDDD"
                          pickerFormat="YYYY MM DD" color="light"
                          [(ngModel)]="scd.sd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                          min="1999-01-01" max="2039-12-31" (ionCancel)="getDtPickerSel($event)"
            ></ion-datetime>
          </div>
        </ion-row>
        <ion-row>
          <ion-toggle [(ngModel)]="alld" [class.allday]="b"></ion-toggle>
          <div>
            <ion-datetime displayFormat="HH:mm" [(ngModel)]="scd.st"
                          pickerFormat="HH mm" (ionCancel)="getHmPickerSel($event)" [hidden]="alld"></ion-datetime>

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
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="scd.bz" class="memo-set" (focus)="comentfocus()" (blur)="comentblur()"></ion-textarea>
        </ion-row>
        <ion-row justify-content-left>
          <div *ngFor="let fss of scd.fss;">
            <div>{{fss.ran}}</div>
          </div>
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
            private el: ElementRef,
            private keyboard: Keyboard,private _renderer: Renderer2,) {

  }

  comentfocus(){
    // this.keyboard.onKeyboardShow().subscribe(value=>{
    //   this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(-300px)");
    // })
  }
  comentblur(){
    // this.keyboard.onKeyboardHide().subscribe(value=>{
    //   this._renderer.setStyle(this.el.nativeElement, "transform", "translateY(0px)");
    // })
  }

  //画面状态：0：新建 ，1：未关闭直接修改
  pagestate: string = "0";
  //画面数据
  scd: ScdData = new ScdData();
  b: boolean = true;

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

  ionViewDidLoad() {

    console.log('ionViewDidLoad NewAgendaPage');
  }

  ionViewWillEnter() {

    this.busiServ.getPlans().then(data => {
      this.jhs = data;
      //console.log("111" + JSON.stringify(this.jhs));
    }).catch(res => {
      console.log("获取计划失败" + JSON.stringify(res));
    });

    //新建的场合初始化
    if (this.navParams.get("dateStr")) {
      this.scd.sd = this.navParams.get("dateStr");
      this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
      if (this.scd.st) {
        this.scd.st = moment(this.scd.sd + " " + this.scd.st).format("HH:mm");
      } else {
        this.scd.st = moment().format("HH:mm");
      }
      this.scd.rt = "0";
      this.scd.tx = "0";
      this.pagestate = "0";
      this.rept.close = 1;
      this.wake.close = 1;
      return;
    }

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

  save(share) {

    if (!this.chkinput()) {
      return
    }
    //提醒内容设置
    this.scd.ui = UserConfig.account.id;

    //消息设为已读
    this.scd.du = "1";

    //本人新建或修改时，下记画面项目可以修改
    //开始时间格式转换
    this.scd.sd = moment(this.scd.sd).format("YYYY/MM/DD");


    //结束日期设置
    //重复场合
    if (this.scd.rt != "0") {
      this.scd.ed = "9999/12/31";
    } else {
      this.scd.ed = this.scd.sd;
    }

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
    if (this.pagestate == "0") {
      this.tdcServ.save(this.scd).then(data => {
        let ctbl = data.data;
        this.scd.si = ctbl.si;
        this.pagestate = "1";
        this.util.toast("保存成功", 2000);
        if (typeof (eval(share)) == "function") {
          share();
        }
        return;
      });

    }
    //未关闭直接修改
    if (this.pagestate == "1") {

      this.tdcServ.updateDetail(this.scd).then(data => {

        this.util.toast("保存成功", 2000);
        if (typeof (eval(share)) == "function") {
          share();
        }
        return;
      })

    }


  }

  chkinput(): boolean {
    if (this.scd.sn == "") {
      this.util.toast("请输入主题", 2000);
      return false;
    }
    return true;
  }

  goShare() {
    //日程分享打开参与人选择rc日程类型
    this.save(() => {
      this.navCtrl.push(DataConfig.PAGE._FS4C_PAGE, {addType: 'rc', tpara: this.scd.si});
    })

  }

  presentActionSheet() {
    //日程删除
    this.tdcServ.delete(this.scd.si, "2", "").then(data => {
      this.cancel();
    });


  }

  toPlanChoose() {
    if (this.jhs.length > 0) {
      this.isShowPlan = true;
      this.IsShowCover = true;
    } else {
      this.util.toast("未创建计划", 1500);
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

  getDtPickerSel(evt) {

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length == 3) {
      this.scd.sd = el[0].textContent + "-" + el[1].textContent + "-" + el[2].textContent;
    }
  }

  getHmPickerSel(evt) {

    let el = document.getElementsByClassName("picker-opt-selected")

    if (el && el.length == 2) {
      this.scd.st = el[0].textContent + ":" + el[1].textContent;
    }
  }


}

export class PageTddIData {
  tdl: ScdData = new ScdData();  //日程事件表信息


}
