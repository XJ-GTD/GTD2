import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {
  ActionSheetController, ModalController, NavController, NavParams,
} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {PgBusiService} from "../../service/pagecom/pgbusi.service";
import {Keyboard} from "@ionic-native/keyboard";
import {FsData, ScdData, ScdOutata, ScdPageParamter} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {PlService} from "../pl/pl.service";
import {JhTbl} from "../../service/sqlite/tbl/jh.tbl";
import {FeedbackService} from "../../service/cordova/feedback.service";

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
            <ion-label>{{scd.fs.ran}}</ion-label>
          </ion-chip>
        </ion-row>
        <ion-row>
          <ion-textarea type="text" [(ngModel)]="scd.sn" placeholder="我想..." readonly="true"></ion-textarea>
        </ion-row>
        <ion-row>
          <div class="lbl-jh2" (click)="toPlanChoose()" [class.hasjh]="scd.p.jn != ''"
               [ngStyle]="{'background-color':scd.p.jc == '' ? '#fffff' : scd.p.jc}">
            {{scd.p.jn == "" ? "添加计划" : "计划"}}
          </div>
          <div>{{scd.p.jn}}</div>
        </ion-row>
        <ion-row>
          <ion-datetime displayFormat="YYYY年M月DD日 DDDD"
                        pickerFormat="YYYY MM DD" color="light"
                        [(ngModel)]="scd.showSd" dayNames="星期日,星期一,星期二,星期三,星期四,星期五,星期六"
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
                        (blur)="comentblur()"
          ></ion-textarea>
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
export class TddiPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private util: UtilService,
              public actionSheetCtrl: ActionSheetController,
              public modalCtrl: ModalController, private  busiServ: PgBusiService,
              private keyboard: Keyboard, private _renderer: Renderer2,
              private plsevice: PlService,private feekback:FeedbackService
  ) {

  }

  actionSheet;

  //画面数据
  scd: ScdOutata = new ScdOutata();
  b: boolean = true;
  //fsshow: FsData = new FsData();

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


  comentfocus() {
    if (this.keyboard) {
      this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(-300px)");
    }
  }

  comentblur() {
    this._renderer.setStyle(this.grid.nativeElement, "transform", "translateY(0px)");
  }

  async ionViewWillEnter() {

    this.scd.fs.bhiu = DataConfig.HUIBASE64;
    //受邀人修改的场合初始化
    let paramter: ScdPageParamter = this.navParams.data;


      this.scd = await this.busiServ.getOneRc(paramter.si,paramter.d.format("YYYY/MM/DD"),"");

      this.clickwake(this.scd.tx + '');

      //TODO 清除消息把已读标志未读
      this.busiServ.updateMsg(this.scd.si);

      this.scd.showSd = paramter.d.format("YYYY-MM-DD");

      //TODO 缓存里后获取发送信息

      this.jhs = await this.plsevice.getPlanCus();
      for (let i = 0; i < this.jhs.length; i++) {
        if (this.jhs[i].ji == this.scd.ji) {
          this.scd.p = this.jhs[i];
        }
      }
      //全天的场合
    this.alldshow = this.util.adStrShow(this.scd.st);

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

  }


//获取日程发起人信息
//this.tddiServ.getCrMan(this.navParams.get("si")).then(data => {
//   this.fsshow = data
//
//    });

  ionViewWillLeave() {
    if (this.actionSheet) {
      this.actionSheet.dismiss();
    }
  }

//提醒按钮显示控制
  clickwake(type: string) {

    this.scd.tx = type;

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
        this.scd.tx = "0";
    }
  }

  cancel() {
    this.navCtrl.pop();

  }

  async save() {

      this.util.loadingStart();
      //提醒内容设置

      //消息设为已读
      this.scd.du = "1";

      //开始时间格式转换
      //this.scd.sd = moment(this.scd.showSd).format("YYYY/MM/DD");

      this.scd.ji = this.scd.p.ji;

      //归属 他人创建
      this.scd.gs = '1';

      //await this.busiServ.updateDetail(this.scd);

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

      console.log("check:" + this.scd.ji);
    }
  }

  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }


}
