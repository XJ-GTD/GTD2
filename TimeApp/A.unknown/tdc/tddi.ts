import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  ActionSheetController, ModalController, NavController, NavParams,
} from 'ionic-angular';
import {Keyboard} from "@ionic-native/keyboard";
import * as moment from 'moment';
import {UtilService} from "../../src/service/util-service/util.service";
import {PgBusiService} from "../../src/service/pagecom/pgbusi.service";
import {PlService} from "../../src/pages/pl/pl.service";
import {FeedbackService} from "../../src/service/cordova/feedback.service";
import {RcInParam, ScdData, ScdPageParamter, SpecScdData} from "../../src/data.mapping";
import {JhTbl} from "../../src/service/sqlite/tbl/jh.tbl";
import {DataConfig} from "../../src/service/config/data.config";
import {Friend} from "../../src/service/business/grouper.service";

/**
 * Generated class for the 日程详情（受邀） page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tddi',
  providers: [],
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
        <ion-row class="avatar-set">
          <ion-chip>
            <ion-avatar (click)="goTofsDetail(scd.fs)">
              <img class="img-set" [src]="scd.fs.bhiu">
            </ion-avatar>
            <ion-label class="ml4">{{scd.fs.ran}}</ion-label>
          </ion-chip>
        </ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..." readonly="true"></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="lbl-jh2" (click)="toPlanChoose()" [class.hasjh]="sp.p.jn != ''"
               [ngStyle]="{'background-color':sp.p.jc == '' ? '#fffff' : sp.p.jc}">
            {{sp.p.jn == "" ? "添加日历" : "日历"}}
          </div>
          <div>{{sp.p.jn}}</div>
        </ion-row>
        <ion-row>
          <ion-datetime displayFormat="YYYY年MM月DD日 DDDD"
                        pickerFormat="YYYY MM DD" color="light"
                        [(ngModel)]="scd.showSpSd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
                        min="1999-01-01" max="2039-12-31" disabled
          ></ion-datetime>
          <div class="reptlbl">{{alldshow}}</div>
        </ion-row>
        <ion-row>
          <div class="reptlbl">重复</div>

          <div class="reptComm" *ngIf="this.scd.rt == 0">{{reptshow}}</div>

          <div class="reptComm" *ngIf="this.scd.rt != 0">{{reptshow}} {{scd.sd | formatedate:'CYYYY/MM/DD'}}
            -{{scd.ed | formatedate:'CYYYY/MM/DD'}}</div>
        </ion-row>
        <ion-row>
          <div class="reptlb2 ">提醒</div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled-close]="wake.close == 1"
                    (click)="clickwake('0',true)">关
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.tenm == 1"
                    (click)="clickwake('1',true)">10m
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.thirm == 1"
                    (click)="clickwake('2',true)">30m
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [class.sel-btn-seled]="wake.oh == 1"
                    (click)="clickwake('3',true)">1h
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [ngClass]="wake.foh == 1?'sel-btn-seled':'sel-btn-unsel'"
                    (click)="clickwake('4',true)">4h
            </button>
          </div>
          <div class="reptlb2">
            <button ion-button round clear class="sel-btn-set"
                    [ngClass]="wake.od == 1?'sel-btn-seled':'sel-btn-unsel'"
                    (click)="clickwake('5',true)">1d
            </button>
          </div>
        </ion-row>
        <ion-row>
          <ion-textarea type="text" autosize maxHeight="100" placeholder="备注" [(ngModel)]="sp.bz" class="memo-set" (focus)="comentfocus()"
                        (blur)="comentblur()"
          ></ion-textarea>
        </ion-row>
      </ion-grid>
    </ion-content>
    <ion-footer class="foot-set">
      <ion-toolbar>
        <ion-buttons full>
          <button ion-button block icon-only (click)="cancel()" start>
            <ion-icon name="close"></ion-icon>
          </button>

          <button ion-button block> </button>

          <button ion-button block icon-only (click)="save()" end>
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
export class TddiPage {
  statusBarColor: string = "#3c4d55";

  focuscomm:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util: UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private  busiServ: PgBusiService,
              private keyboard: Keyboard, private _renderer: Renderer2,
              private plsevice: PlService,private feekback:FeedbackService
  ) {
    this.keyboard.onKeyboardShow().subscribe(d =>{
    if (this.focuscomm){
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-300px)");
    }
  });
    this.keyboard.onKeyboardHide().subscribe(d =>{
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
    });

  }
  comentblur() {
    this.focuscomm = false;
  }

  comentfocus() {
    this.focuscomm = true;
  }

  actionSheet;

  //画面数据
  scd: ScdData = new ScdData();
  b: boolean = true;
  sp:SpecScdData = new SpecScdData();

  reptshow: string = "";

  wake = {
    close: 1,
    tenm: 0,
    thirm: 0,
    oh: 0,
    foh: 0,
    od: 0
  };

  @ViewChild("grid")
  grid: ElementRef;

  //全天
  alldshow: string = "";

  isShowPlan: boolean = false;
  IsShowCover: boolean = false;
  jhs: Array<JhTbl>;

  getScdData(si: string, d: moment.Moment, gs: string): Promise<ScdData> {
    return new Promise(async (resolve, reject) => {
      let scd: ScdData = null;

      if (si && d) {
        scd = await this.busiServ.getRcBySiAndSd(si,d.format("YYYY/MM/DD"));
      } else if (gs) {
        scd = await this.busiServ.getRcBySr(gs);
      }

      resolve(scd);
    });
  }

  async ionViewWillEnter() {
    this.util.loadingStart();

    this.scd.fs.bhiu = DataConfig.HUIBASE64;
    //受邀人修改的场合初始化
    let paramter: ScdPageParamter = this.navParams.data;

    //适应极光推送消息直接打开共享日程画面，增加根据所属ID取得日程
    let loadscd: ScdData = null;
    while (!loadscd || !loadscd.si) {
      loadscd = await this.getScdData(paramter.si, paramter.d, paramter.gs);
    }

    this.scd = loadscd;

    Object.assign(this.sp , this.scd.baseData);

    this.clickwake(this.sp.tx + '');

    //TODO 清除消息把已读标志未读

    if (this.scd.du != "" && parseInt(this.scd.du) >= 1){
      this.busiServ.updateMsg(this.scd.si);
    }
    this.scd.showSpSd = paramter.d.format("YYYY-MM-DD");

    //TODO 缓存里后获取发送信息

    //this.jhs = await this.plsevice.getPlanCus();
    for (let i = 0; i < this.jhs.length; i++) {
      if (this.jhs[i].ji == this.sp.ji) {
        this.sp.p = this.jhs[i];
      }
    }
      //全天的场合
    this.alldshow = this.util.adStrShow(this.sp.st);

    switch (this.scd.rt) {
      case "0":
        this.reptshow = "关";
        break;
      case "1":
        this.reptshow = "每日";
        break;
      case "2":
        this.reptshow = "每周";
        break;
      case "3":
        this.reptshow = "每月";
        break;
      case "4":
        this.reptshow = "每年";
        break;
      default:
        this.reptshow = "关";
    }

    this.util.loadingEnd();
  }

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

//提醒按钮显示控制
  clickwake(type: string,audio?:boolean) {
    if (audio) this.feekback.audioOption();
    this.sp.tx = type;

    switch (type) {
      case '0':
        this.wake.close = 1;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case '1':
        this.wake.close = 0;
        this.wake.tenm = 1;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case '2':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 1;
        this.wake.oh = 0;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case '3':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 1;
        this.wake.foh = 0;
        this.wake.od = 0;
        break;
      case '4':
        this.wake.close = 0;
        this.wake.tenm = 0;
        this.wake.thirm = 0;
        this.wake.oh = 0;
        this.wake.foh = 1;
        this.wake.od = 0;
        break;
      case '5':
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

    this.util.loadingStart();

    //消息设为已读
    this.scd.du = "1";

    this.sp.ji = this.sp.p.ji;

    //归属 他人创建
    this.scd.gs = '1';
    let rcin :RcInParam = new RcInParam();
    //日程数据
    Object.assign(rcin,this.scd);
    //日程子数据
    Object.assign(rcin.specScdUpd,this.sp);
    let data = await this.busiServ.saveOrUpdate(rcin);

    this.util.loadingEnd();
    this.feekback.audioSave();

    this.cancel();

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
                this.busiServ.delRcBySiAndSd(this.scd.si, d).then(data => {
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
                this.busiServ.delRcBySi(this.scd.si).then(data => {
                  this.feekback.audioDelete();
                  this.util.loadingEnd();
                  this.cancel();
                }).catch(err => {
                  this.util.loadingEnd();
                });
              })

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
        this.busiServ.delRcBySi(this.scd.si).then(data => {
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
      this.util.toastStart("未创建日历", 3000);
    }
  }

  closeDialog() {
    if (this.isShowPlan) {
      this.isShowPlan = false;
      this.IsShowCover = false;

      console.log("check:" + this.scd.ji);
    }
  }

  goTofsDetail(fs: Friend) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }


}
