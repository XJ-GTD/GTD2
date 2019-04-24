import {Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {ActionSheetController, DateTime, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {Keyboard} from "@ionic-native/keyboard";
import {FsData, RcInParam, ScdData, ScdPageParamter, SpecScdData} from "../../data.mapping";
import {PlService} from "../pl/pl.service";
import {FeedbackService} from "../../service/cordova/feedback.service";

/**
 * Generated class for the 日程详情（发布人） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tddj',
  template: `
    <ion-content class="content-set">
      <ion-grid #grid>
        <ion-row class="header-set">
          <ion-toolbar>
            <ion-buttons right padding-right>
              <button ion-button icon-only (click)="presentActionSheet()">
                <img class="imgdel-set" src="../../assets/imgs/del.png">
              </button>
            </ion-buttons>
          </ion-toolbar>
        </ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..."></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="lbl-jh2" (click)="toPlanChoose()" [class.hasjh]="sp.p.jn != ''"
               [ngStyle]="{'background-color':sp.p.jc == '' ? '#fffff' : sp.p.jc}">
            {{sp.p.jn == "" ? "添加计划" : "计划"}}
          </div>
          <div>{{sp.p.jn}}</div>
        </ion-row>
        <ion-row>
          <div>
            <ion-datetime displayFormat="YYYY年M月DD日 DDDD"
                          pickerFormat="YYYY MM DD" color="light"
                          [(ngModel)]="scd.showSpSd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                          min="1999-01-01" max="2039-12-31" (ionCancel)="getDtPickerSel($event)" disabled
            ></ion-datetime>
          </div>
        </ion-row>
        <ion-row>
          <ion-toggle [(ngModel)]="alld" [class.allday]="b" (ionChange)="togChange()"></ion-toggle>
          <div>
            <ion-datetime displayFormat="HH:mm" [(ngModel)]="sp.st"
                          pickerFormat="HH mm" (ionCancel)="getHmPickerSel($event)" [hidden]="alld"></ion-datetime>

          </div>
        </ion-row>
        <ion-row>
          <div class="reptlbl">重复</div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled-close]="rept.close == 1"
                    (click)="clickrept('0')" disabled>关
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.d== 1"
                    (click)="clickrept('1')" disabled>天
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.w== 1"
                    (click)="clickrept('2')" disabled>周
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.m== 1"
                    (click)="clickrept('3')" disabled>月
            </button>
          </div>
          <div class="reptlbl">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="rept.y== 1"
                    (click)="clickrept('4')" disabled>年
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
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="sp.bz" class="memo-set" (focus)="comentfocus()"
                        (blur)="comentblur()"></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="reptlb2 ">朋友</div>
          <div class="selected">
            <ion-chip *ngFor="let fs of scd.fss" (click)="goTofsDetail(fs)">
              <ion-avatar>
                <img [src]="fs.bhiu"/>
              </ion-avatar>
              <ion-label>{{fs.ran}}</ion-label>
            </ion-chip>
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

    <div padding class="div-content" *ngIf="isShowPlan">
      <div class="shade" *ngIf="IsShowCover" (click)="closeDialog()"></div>
      <ion-list no-lines radio-group [(ngModel)]="sp.p" class="plan-list">
        <ion-item *ngFor="let option of jhs">
          <div class="color-dot" [ngStyle]="{'background-color': option.jc }" item-start></div>
          <ion-label>{{option.jn}}</ion-label>
          <ion-radio [value]="option"></ion-radio>
        </ion-item>
      </ion-list>
    </div>
  `
})
export class TddjPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util: UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private  busiServ: PgBusiService,
              private keyboard: Keyboard, private _renderer: Renderer2,
              private plsevice: PlService,private feekback:FeedbackService
  ) {

  }

  @ViewChildren(DateTime) dateTimes: QueryList<DateTime>;
  actionSheet;

  //画面数据
  scd: ScdData = new ScdData();
  b: boolean = true;
  sp:SpecScdData = new SpecScdData();


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
  @ViewChild("grid")
  grid: ElementRef;

  comentfocus() {
    if (this.keyboard) {
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-300px)");
    }
  }

  togChange() {
    if (!this.alld) {
      this.sp.st = this.util.adCtrlShow(this.sp.st);
    }
  }

  comentblur() {
    this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  }


  async ionViewWillEnter() {


    let paramter: ScdPageParamter = this.navParams.data;
    if (paramter.si) {
      this.scd = await this.busiServ.getRcBySiAndSd(paramter.si,paramter.d.format("YYYY/MM/DD"));
      Object.assign(this.sp , this.scd.baseData);

      //TODO 清除消息把已读标志未读
      this.busiServ.updateMsg(this.sp.si);

      this.scd.showSpSd = paramter.d.format("YYYY-MM-DD");

      this.jhs = await this.plsevice.getPlanCus();
      for (let i = 0; i < this.jhs.length; i++) {
        if (this.jhs[i].ji == this.sp.ji) {
          this.sp.p = this.jhs[i];
        }
      }

      if (this.sp.st) {
        this.sp.st = this.sp.st
      } else {
        this.sp.st = moment().format("HH:mm");
      }

      //全天的场合
      if (this.util.isAday(this.sp.st)) {
        this.alld = true;
      } else {
        this.alld = false;
      }

      this.clickrept(this.scd.rt + '');
      this.clickwake(this.sp.tx + '');
    }

  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
    //console.log(this.dateTimes.toArray());
    for (let i = 0; i < this.dateTimes.toArray().length; i++) {
      if (this.dateTimes.toArray()[i]._picker) {
        this.dateTimes.toArray()[i]._picker.dismiss();
      }
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

    this.sp.tx = type;

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
        this.sp.tx = "0";
    }
  }

  cancel() {
    this.navCtrl.pop();

  }

  async save() {

    if (!this.chkinput()) {
      return null;
    }
    this.util.loadingStart();

    //消息设为已读
    this.scd.du = "1";

    //本人新建或修改时，下记画面项目可以修改
    //开始时间格式转换

    //结束时间设置
    //全天的场合
    if (this.alld) {
      this.sp.st = this.util.adToDb("");
      this.sp.et = this.util.adToDb("");
    } else {
      this.sp.et = this.sp.st;
    }


    this.sp.ji = this.sp.p.ji;

    //归属 本人创建
    this.scd.gs = '0';
    let rcin :RcInParam = new RcInParam();
    //日程数据
    Object.assign(rcin,this.scd);
    //日程子数据
    Object.assign(rcin.specScdUpd,this.sp);
    let data = await this.busiServ.saveOrUpdate(rcin);
    this.util.loadingEnd();
    this.feekback.audioSave();
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
    this.save().then(data => {
      if (data == null){
        return;
      }
      this.navCtrl.push(DataConfig.PAGE._FS4C_PAGE, {addType: 'rc', tpara: this.scd.si});
    });

  }

  presentActionSheet() {
    let paramter: ScdPageParamter = this.navParams.data;
    let d = paramter.d.format("YYYY/MM/DD");
    if (this.scd.rt != "0" && this.scd.sd != d) {
      //重复日程删除
      this.actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '删除今后所有日程',
            role: 'destructive',
            cssClass: 'btn-del',
            handler: () => {
              this.util.alterStart("2", () => {
                this.util.loadingStart();
                this.busiServ.delete(this.scd.si, "1", d).then(data => {
                  this.feekback.audioDelete();
                  this.util.loadingEnd();
                  this.cancel();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              });
            }
          }, {
            text: '删除所有日程',
            cssClass: 'btn-delall',
            handler: () => {
              this.util.alterStart("2", () => {
                this.util.loadingStart();
                this.busiServ.delete(this.scd.si, "2", d).then(data => {
                  this.feekback.audioDelete();
                  this.util.loadingEnd();
                  this.cancel();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              });
            }
          }, {
            text: '取消',
            role: 'cancel',
            cssClass: 'btn-cancel',
            handler: () => {

            }
          }
        ]
      });
      this.actionSheet.present();
    } else {
      //非重复日程删除
      this.util.alterStart("2", () => {
        this.util.loadingStart();
        this.busiServ.delete(this.scd.si, "2", d).then(data => {
          this.feekback.audioDelete();
          this.util.loadingEnd();
          this.cancel();
        }).catch(err => {
          this.util.loadingEnd();
        });
      });
    }


  }

  toPlanChoose() {
    if (this.jhs.length > 0) {
      this.isShowPlan = true;
      this.IsShowCover = true;
    } else {
      this.util.toastStart("未创建计划", 3000);
    }
  }

  closeDialog() {
    if (this.isShowPlan) {
      this.isShowPlan = false;
      this.IsShowCover = false;

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
      this.sp.st = el[0].textContent + ":" + el[1].textContent;
    }
  }

  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }

}
