import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {ActionSheetController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {BsModel} from "../../service/restful/out/bs.model";
import {UserConfig} from "../../service/config/user.config";
import * as moment from "moment";
import {DataConfig} from "../../service/config/data.config";
import {FsData, PgBusiService, ScdData} from "../../service/pagecom/pgbusi.service";
import {ScdPageParamter, TdcService} from "./tdc.service";
import {Keyboard} from "@ionic-native/keyboard";

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
          <ion-textarea type="text" placeholder="备注" [(ngModel)]="scd.bz" class="memo-set" (focus)="comentfocus()"
                        (blur)="comentblur()"></ion-textarea>
        </ion-row>
        <ion-row justify-content-left>
          <div *ngFor="let fs of scd.fss;">
            <div><img class ="img-set" [src]="fs.getFaceImg()"></div>
            <div class ="img-rn">{{fs.ran}}</div>
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
export class TddjPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private tddjServ: TdcService, private util: UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private  busiServ: PgBusiService,
              private keyboard: Keyboard, private _renderer: Renderer2,) {

  }


  //画面数据
  scd: ScdData = new ScdData();
  b: boolean = true;
  fssshow: Array<FsData> = new Array<FsData>();

  //重复日程不可以修改日期
  rept_flg: boolean = false;

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
    if (this.keyboard){
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-300px)");
    }
  }

  comentblur() {
    this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  }


  ionViewWillEnter() {


    let paramter: ScdPageParamter = this.navParams.data;
    if (this.navParams.get("si")) {
      this.tddjServ.get(paramter.si).then(data => {
        let bs: BsModel<ScdData> = data;
        Object.assign(this.scd, bs.data);
        this.scd.showSd = paramter.d.format("YYYY-MM-DD");


        this.busiServ.getPlans().then(data => {
          this.jhs = data;
          for (let i = 0; i < this.jhs.length; i++) {
            if (this.jhs[i].ji == this.scd.ji) {
              this.scd.p = this.jhs[i];
              break;
            }
          }
        }).catch(res => {
        });

        //重复日程不可以修改日期
        if (this.scd.rt != "0") {
          this.rept_flg = true;
        }

        this.scd.sd = moment(this.scd.sd).format("YYYY-MM-DD");
        if (this.scd.st) {
          this.scd.st = this.scd.st
        } else {
          this.scd.st = moment().format("HH:mm");
        }

        //全天的场合
        if (this.scd.st == "99:99") {
          this.alld = true;
        } else {
          this.alld = false;
        }

        this.clickrept(this.scd.rt + '');
        this.clickwake(this.scd.tx + '');

      });

      //获取日程参与人表
     // this.tddjServ.getCalfriend(this.navParams.get("si")).then(data => {
     //   this.fssshow = data;
     // });

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

  toSave(){
    this.util.alterStart("1",()=>{
      this.save("");
    })
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


    this.scd.ji = this.scd.p.ji;

    //归属 本人创建
    this.scd.gs = '0';

    this.util.loadingStart();
    this.tddjServ.updateDetail(this.scd).then(data => {
      this.util.loadingEnd();
      if (typeof (eval(share)) == "function") {
        share();
      }
      return;
    }).catch(err => {
      this.util.loadingEnd();
    });


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
      this.save(() => {
        this.navCtrl.push(DataConfig.PAGE._FS4C_PAGE, {addType: 'rc', tpara: this.scd.si});
      });
  }

  presentActionSheet() {
    let d = this.navParams.get("d");
    if (this.scd.rt != "0" && this.scd.sd != d) {
      //重复日程删除
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '删除今后所有日程',
            role: 'destructive',
            cssClass: 'btn-del',
            handler: () => {

              if (moment(d).format("YYYY/MM/DD") == moment(this.scd.sd).format("YYYY/MM/DD")) {
                //如果开始日与选择的当前日一样，就是删除所有
                this.util.loadingStart();
                this.tddjServ.delete(this.scd.si, "2", d).then(data => {
                  this.util.loadingEnd();
                  this.cancel();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              } else {
                this.util.loadingStart();
                this.tddjServ.delete(this.scd.si, "1", d).then(data => {
                  this.util.loadingEnd();
                  this.cancel();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              }

            }
          }, {
            text: '删除所有日程',
            cssClass: 'btn-delall',
            handler: () => {
              this.util.loadingStart();
              this.tddjServ.delete(this.scd.si, "2", d).then(data => {
                this.util.loadingEnd();
                this.cancel();
              }).catch(err => {
                this.util.loadingEnd();
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
      actionSheet.present();
    } else {
      //非重复日程删除
      this.util.loadingStart();
      this.tddjServ.delete(this.scd.si, "2", d).then(data => {
        this.util.loadingEnd();
        this.cancel();
      }).catch(err => {
        this.util.loadingEnd();
      });
    }


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
